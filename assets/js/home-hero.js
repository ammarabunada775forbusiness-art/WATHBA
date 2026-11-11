// Dheeb and Sakhr are two separate animated characters. Each approved drawing stays pixel-identical
// and is skinned to a small 2D skeleton on its own WebGL canvas: breathing, weight shift, arm sway,
// glances toward the pointer and a short reaction on tap. The feet never move.
(() => {
  const visual = document.querySelector('.wathba-hero-visual');
  if (!visual) return;
  const nodes = Array.from(visual.querySelectorAll('.wathba-hero-character'));
  const toggle = visual.querySelector('button');
  if (nodes.length !== 2 || !toggle) return;
  const characters = nodes.map(node => ({node, image: node.querySelector('img'), canvas: node.querySelector('canvas')}));
  if (characters.some(character => !character.image || !character.canvas)) return;

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const labels = document.documentElement.lang === 'ar'
    ? ['إيقاف حركة الشخصيات', 'تشغيل حركة الشخصيات']
    : ['Pause character animation', 'Play character animation'];
  const TAU = Math.PI * 2, WIDTH = 1024, HEIGHT = 1536;
  // Joints measured on the approved 1024×1536 originals; L and R are the viewer's left and right.
  const rigs = [
    {
      ground: [470, 1330], waist: [520, 565], neck: [540, 335], top: [550, 150],
      shoulderL: [375, 380], elbowL: [330, 590], handL: [372, 805],
      shoulderR: [605, 385], elbowR: [642, 572], handR: [676, 825],
      hipL: [455, 650], hipR: [598, 650], ankleL: [362, 1290], ankleR: [565, 1225],
      breath: 3.7, sway: 7.3, phase: 0, rest: 0, reaction: 1.3
    },
    {
      ground: [450, 1320], waist: [510, 575], neck: [495, 345], top: [450, 155],
      shoulderL: [372, 372], elbowL: [590, 390], handL: [945, 372],
      shoulderR: [640, 425], elbowR: [618, 522], handR: [588, 298],
      hipL: [405, 650], hipR: [615, 650], ankleL: [325, 1275], ankleR: [563, 1230],
      breath: 4.3, sway: 8.1, phase: 1.1, rest: -0.35, reaction: 1.8
    }
  ];
  // Bones: 0 feet (fixed), 1 pelvis, 2 chest, 3 head, 4–5 left arm, 6–7 right arm.
  const parents = [-1, 0, 1, 2, 2, 4, 2, 6];
  // The stage gap between the two bodies, used to decide which character a tap belongs to.
  const split = 0.467;
  let elapsed = 0, previousTime = null, previousPaint = -Infinity, frame = 0;
  let inView = !('IntersectionObserver' in window), paused = false, failed = false, ready = false;
  let pageActive = true, pointer = null;

  characters.forEach((character, index) => Object.assign(character, {
    rig: rigs[index], look: rigs[index].rest, reactAt: -Infinity
  }));

  function stop() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    previousTime = null;
    previousPaint = -Infinity;
  }

  function fallback() {
    stop();
    failed = true;
    visual.classList.remove('is-ready');
    visual.dataset.heroMotion = 'static';
    toggle.hidden = true;
  }

  function distance(point, start, end) {
    const dx = end[0] - start[0], dy = end[1] - start[1];
    const t = Math.max(0, Math.min(1, ((point[0] - start[0]) * dx + (point[1] - start[1]) * dy) / (dx * dx + dy * dy || 1)));
    return Math.hypot(point[0] - start[0] - t * dx, point[1] - start[1] - t * dy);
  }

  function influence(rig, point) {
    const near = (start, end, spread) => Math.exp(-(distance(point, start, end) ** 2) / (2 * spread * spread));
    const hipY = (rig.hipL[1] + rig.hipR[1]) / 2, footY = Math.max(rig.ankleL[1], rig.ankleR[1]);
    const t = Math.max(0, Math.min(1, (footY - point[1]) / (footY - hipY)));
    const lift = t * t * (3 - 2 * t);
    const legs = Math.max(near(rig.hipL, rig.ankleL, 55), near(rig.hipR, rig.ankleR, 55));
    const weights = [
      (legs + 0.02) * (1 - lift),
      near(rig.hipL, rig.hipR, 60) + (legs + 0.02) * lift,
      Math.max(near(rig.waist, rig.neck, 75), near(rig.shoulderL, rig.shoulderR, 55)),
      near(rig.neck, rig.top, 60),
      near(rig.shoulderL, rig.elbowL, 34), near(rig.elbowL, rig.handL, 32),
      near(rig.shoulderR, rig.elbowR, 34), near(rig.elbowR, rig.handR, 32)
    ];
    const strongest = weights.map((weight, bone) => [weight, bone]).sort((a, b) => b[0] - a[0]).slice(0, 4);
    const total = strongest.reduce((sum, [weight]) => sum + weight, 0) || 1;
    return {bones: strongest.map(([, bone]) => bone), weights: strongest.map(([weight]) => weight / total)};
  }

  function mesh(rig) {
    const columns = 32, rows = 48, corners = [], data = [];
    for (let row = 0; row <= rows; row++) {
      for (let column = 0; column <= columns; column++) {
        const u = column / columns, v = row / rows;
        const skin = influence(rig, [u * WIDTH, v * HEIGHT]);
        corners.push([u, v, ...skin.bones, ...skin.weights]);
      }
    }
    const at = (column, row) => corners[row * (columns + 1) + column];
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        [at(column, row), at(column + 1, row), at(column, row + 1),
          at(column, row + 1), at(column + 1, row), at(column + 1, row + 1)].forEach(corner => data.push(...corner));
      }
    }
    return new Float32Array(data);
  }

  // 2D affine [a, b, c, d, e, f]: x' = ax + by + c, y' = dx + ey + f.
  function local(pivot, angle = 0, scaleX = 1, scaleY = 1, moveX = 0, moveY = 0) {
    const cos = Math.cos(angle), sin = Math.sin(angle);
    const a = cos * scaleX, b = -sin * scaleY, d = sin * scaleX, e = cos * scaleY;
    return [a, b, pivot[0] + moveX - a * pivot[0] - b * pivot[1], d, e, pivot[1] + moveY - d * pivot[0] - e * pivot[1]];
  }

  function multiply(m, n) {
    return [
      m[0] * n[0] + m[1] * n[3], m[0] * n[1] + m[1] * n[4], m[0] * n[2] + m[1] * n[5] + m[2],
      m[3] * n[0] + m[4] * n[3], m[3] * n[1] + m[4] * n[4], m[3] * n[2] + m[4] * n[5] + m[5]
    ];
  }

  function pose(character, index) {
    const rig = character.rig, time = elapsed;
    const breath = 0.5 - 0.5 * Math.cos(TAU * time / rig.breath + rig.phase);
    const follow = Math.sin(TAU * time / rig.breath + rig.phase - 0.9);
    const sway = Math.sin(TAU * time / rig.sway + rig.phase);
    const since = time - character.reactAt;
    const react = since >= 0 && since < rig.reaction ? Math.sin(Math.PI * since / rig.reaction) ** 2 : 0;
    const look = character.look;
    const bones = [[1, 0, 0, 0, 1, 0], local(rig.ground, 0.0035 * sway)];
    if (index === 0) {
      // Dheeb: relaxed after training; a tap makes him roll his shoulders and nod.
      bones.push(
        local(rig.waist, -0.0025 * sway, 1 + 0.01 * breath + 0.004 * react, 1 + 0.006 * breath + 0.016 * react),
        local(rig.neck, 0.045 * look + 0.01 * Math.sin(TAU * time / 9.7), 1, 1 - 0.03 * react, 4 * look, 7 * react),
        local(rig.shoulderL, 0.012 * follow + 0.05 * react), local(rig.elbowL, 0.01 * follow + 0.04 * react),
        local(rig.shoulderR, -0.012 * follow - 0.05 * react), local(rig.elbowR, -0.01 * follow - 0.04 * react)
      );
    } else {
      // Sakhr: keeps the shoulder stretch, pulling the arm in and releasing; a tap deepens the pull.
      const pull = (0.5 - 0.5 * Math.cos(TAU * time / 5.6)) ** 2 + react;
      bones.push(
        local(rig.waist, -0.0025 * sway - 0.006 * pull, 1 + 0.01 * breath, 1 + 0.006 * breath),
        local(rig.neck, 0.045 * look - 0.012 * pull, 1, 1, 4 * look, 0),
        local(rig.shoulderL, -0.015 * pull), local(rig.elbowL, -0.01 * pull),
        local(rig.shoulderR, 0.012 * pull), local(rig.elbowR, -0.02 * pull)
      );
    }
    const world = [];
    bones.forEach((bone, i) => { world[i] = parents[i] < 0 ? bone : multiply(world[parents[i]], bone); });
    const rows = new Float32Array(48);
    world.forEach((m, i) => {
      rows.set([m[0], m[1], m[2]], i * 3);
      rows.set([m[3], m[4], m[5]], 24 + i * 3);
    });
    return rows;
  }

  function compile(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      throw new Error('Hero shader unavailable');
    }
    return shader;
  }

  function upload(character) {
    const gl = character.gl;
    gl.bindTexture(gl.TEXTURE_2D, character.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, character.image);
  }

  function prepare(character) {
    const gl = character.canvas.getContext('webgl', {
      alpha: true, antialias: false, premultipliedAlpha: true,
      depth: false, stencil: false, powerPreference: 'low-power'
    });
    if (!gl) return false;
    character.gl = gl;
    const vertex = compile(gl, gl.VERTEX_SHADER, `
      attribute vec2 a_uv;
      attribute vec4 a_bone;
      attribute vec4 a_weight;
      uniform vec3 u_x[8];
      uniform vec3 u_y[8];
      varying vec2 v_uv;
      vec2 skin(vec2 p, float bone) {
        int i = int(bone + 0.5);
        vec3 h = vec3(p, 1.0);
        return vec2(dot(u_x[i], h), dot(u_y[i], h));
      }
      void main() {
        vec2 p = a_uv * vec2(${WIDTH}.0, ${HEIGHT}.0);
        vec2 q = skin(p, a_bone.x) * a_weight.x + skin(p, a_bone.y) * a_weight.y
          + skin(p, a_bone.z) * a_weight.z + skin(p, a_bone.w) * a_weight.w;
        gl_Position = vec4(q.x / ${WIDTH / 2}.0 - 1.0, 1.0 - q.y / ${HEIGHT / 2}.0, 0.0, 1.0);
        v_uv = a_uv;
      }
    `);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, `
      precision mediump float;
      varying vec2 v_uv;
      uniform sampler2D u_image;
      void main() { gl_FragColor = texture2D(u_image, v_uv); }
    `);
    const program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false;
    gl.useProgram(program);
    const data = mesh(character.rig);
    character.count = data.length / 10;
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    [['a_uv', 2, 0], ['a_bone', 4, 2], ['a_weight', 4, 6]].forEach(([name, size, offset]) => {
      const location = gl.getAttribLocation(program, name);
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, size, gl.FLOAT, false, 40, offset * 4);
    });
    character.rows = [gl.getUniformLocation(program, 'u_x'), gl.getUniformLocation(program, 'u_y')];
    character.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, character.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    upload(character);
    return true;
  }

  function initialize() {
    try {
      return characters.every(prepare);
    } catch (_) {
      return false;
    }
  }

  function aim(step) {
    const ease = 1 - Math.exp(-step * 4);
    characters.forEach(character => {
      let target = character.rig.rest;
      if (pointer && character.node.getBoundingClientRect) {
        const box = character.node.getBoundingClientRect();
        const headX = box.left + box.width * character.rig.neck[0] / WIDTH;
        target = Math.max(-1, Math.min(1, (pointer.x - headX) / (box.width * 0.8)));
      }
      character.look += (target - character.look) * ease;
    });
  }

  function draw() {
    if (!ready || failed) return;
    characters.forEach((character, index) => {
      const gl = character.gl, rows = pose(character, index);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform3fv(character.rows[0], rows.subarray(0, 24));
      gl.uniform3fv(character.rows[1], rows.subarray(24));
      gl.drawArrays(gl.TRIANGLES, 0, character.count);
    });
  }

  function resize() {
    if (!ready || failed) return;
    const scale = Math.min(devicePixelRatio || 1, 1.75);
    characters.forEach(character => {
      const width = Math.max(1, Math.min(WIDTH, Math.round(character.node.clientWidth * scale)));
      const height = Math.round(width * HEIGHT / WIDTH);
      if (character.canvas.width !== width || character.canvas.height !== height) {
        character.canvas.width = width;
        character.canvas.height = height;
        character.gl.viewport(0, 0, width, height);
      }
    });
    draw();
  }

  function tick(timestamp) {
    const step = previousTime === null ? 0 : Math.min(timestamp - previousTime, 100) / 1000;
    elapsed += step;
    previousTime = timestamp;
    if (timestamp - previousPaint >= 1000 / 30) {
      aim(previousPaint === -Infinity ? 0 : Math.min(timestamp - previousPaint, 100) / 1000);
      draw();
      previousPaint = timestamp;
    }
    frame = requestAnimationFrame(tick);
  }

  function update() {
    stop();
    if (failed || characters.some(({image}) => !image.complete || !image.naturalWidth)) return;
    if (reducedMotion.matches || navigator.connection?.saveData) {
      visual.classList.remove('is-ready');
      visual.dataset.heroMotion = 'static';
      toggle.hidden = true;
      return;
    }
    if (!ready && !inView) return;
    if (!ready) {
      if (!initialize()) return fallback();
      ready = true;
    }
    resize();
    visual.classList.add('is-ready');
    toggle.hidden = false;
    toggle.setAttribute('aria-label', labels[paused ? 1 : 0]);
    toggle.title = labels[paused ? 1 : 0];
    visual.dataset.heroMotion = paused ? 'paused' : 'running';
    if (!paused && inView && !document.hidden && pageActive) frame = requestAnimationFrame(tick);
  }

  toggle.addEventListener('click', () => { paused = !paused; update(); });
  visual.addEventListener('pointerdown', event => {
    if (!frame || event.target.closest?.('button') || !visual.getBoundingClientRect) return;
    const box = visual.getBoundingClientRect();
    const character = characters[(event.clientX - box.left) / box.width < split ? 0 : 1];
    if (elapsed - character.reactAt > character.rig.reaction + 0.3) character.reactAt = elapsed;
  });
  window.addEventListener('pointermove', event => {
    pointer = event.pointerType === 'mouse' ? {x: event.clientX} : null;
  }, {passive: true});
  document.addEventListener('pointerleave', () => { pointer = null; });
  characters.forEach(character => {
    character.image.addEventListener('load', () => {
      if (ready && !failed) {
        try { upload(character); } catch (_) { return fallback(); }
      }
      update();
    });
    character.image.addEventListener('error', fallback);
    character.canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); fallback(); });
  });
  reducedMotion.addEventListener('change', update);
  document.addEventListener('visibilitychange', update);
  window.addEventListener('pagehide', () => { pageActive = false; stop(); });
  window.addEventListener('pageshow', () => { pageActive = true; update(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      update();
    }, {threshold: 0}).observe(visual);
  }
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(visual);
  else window.addEventListener('resize', resize, {passive: true});
  update();
})();
