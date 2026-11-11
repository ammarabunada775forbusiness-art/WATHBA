// Dheeb and Sakhr are two separate animated characters who have just finished training. Each
// approved drawing stays pixel-identical and is skinned to a small 2D skeleton on its own WebGL
// canvas. Under a light breathing heave, each one cycles through moves in a shuffled order:
// looking at each other, shrugging, rolling shoulders, shifting weight, deep sighs, Dheeb shaking
// out his arms and nodding, Sakhr pulling his stretch, dropping his head and re-gripping.
// Heads glance toward the pointer, and a tap starts a move. The feet never move.
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
  // breath = seconds per breath; tap = moves a tap or click starts, in turn.
  const rigs = [
    {
      ground: [470, 1330], waist: [520, 565], neck: [540, 335], top: [550, 150],
      shoulderL: [375, 380], elbowL: [330, 590], handL: [372, 805],
      shoulderR: [605, 385], elbowR: [642, 572], handR: [676, 825],
      hipL: [455, 650], hipR: [598, 650], ankleL: [362, 1290], ankleR: [565, 1225],
      breath: 1.7, phase: 0, rest: 0, cooldown: 2.5, tap: ['shake', 'nod']
    },
    {
      ground: [450, 1320], waist: [510, 575], neck: [495, 345], top: [450, 155],
      shoulderL: [372, 372], elbowL: [590, 390], handL: [945, 372],
      shoulderR: [640, 425], elbowR: [618, 522], handR: [588, 298],
      hipL: [405, 650], hipR: [615, 650], ankleL: [325, 1275], ankleR: [563, 1230],
      breath: 1.55, phase: 1.1, rest: -0.35, cooldown: 2.5, tap: ['stretch', 'regrip']
    }
  ];
  // The stage gap between the two bodies, used to decide which character a tap belongs to.
  const split = 0.467;
  let elapsed = 0, previousTime = null, previousPaint = -Infinity, frame = 0;
  let inView = !('IntersectionObserver' in window), paused = false, failed = false, ready = false;
  let pageActive = true, pointer = null;

  characters.forEach((character, index) => Object.assign(character, {
    index, rig: rigs[index], look: rigs[index].rest, bag: [], move: null, nextAt: 0.6 + index * 0.9, taps: 0, tapAt: -Infinity
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

  // Bones: 0 feet (fixed), 1 pelvis, 2 chest, 3 head, 4–5 left arm, 6–7 right arm.
  function influence(rig, point) {
    const near = (start, end, spread) => Math.exp(-(distance(point, start, end) ** 2) / (2 * spread * spread));
    const hipY = (rig.hipL[1] + rig.hipR[1]) / 2, footY = Math.max(rig.ankleL[1], rig.ankleR[1]);
    const t = Math.max(0, Math.min(1, (footY - point[1]) / (footY - hipY)));
    const lift = t * t * (3 - 2 * t);
    const legs = Math.max(near(rig.hipL, rig.ankleL, 45), near(rig.hipR, rig.ankleR, 45));
    const weights = [
      (legs + 0.02) * (1 - lift),
      near(rig.hipL, rig.hipR, 60) + (legs + 0.02) * lift,
      Math.max(near(rig.waist, rig.neck, 75), near(rig.shoulderL, rig.shoulderR, 55)),
      near(rig.neck, rig.top, 60),
      near(rig.shoulderL, rig.elbowL, 36), near(rig.elbowL, rig.handL, 36),
      near(rig.shoulderR, rig.elbowR, 36), near(rig.elbowR, rig.handR, 36)
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

  // Follow where the parent moves `joint` and how it turns, without inheriting the chest's
  // breathing scale, so heads and arms ride on the breath without stretching.
  function attach(parent, joint, angle = 0, scaleX = 1, scaleY = 1, moveX = 0, moveY = 0) {
    const x = parent[0] * joint[0] + parent[1] * joint[1] + parent[2];
    const y = parent[3] * joint[0] + parent[4] * joint[1] + parent[5];
    return local(joint, Math.atan2(parent[3], parent[0]) + angle, scaleX, scaleY, x - joint[0] + moveX, y - joint[1] + moveY);
  }

  const ease = x => x < 0.5 ? 2 * x * x : 1 - 2 * (1 - x) * (1 - x);
  // 0 → 1 → 0 over an action: ease in for `rise` of the time, hold, ease out over `fall`.
  const hold = (p, rise = 0.25, fall = 0.3) => p < rise ? ease(p / rise) : p > 1 - fall ? ease((1 - p) / fall) : 1;
  const bump = p => Math.sin(Math.PI * Math.max(0, Math.min(1, p)));

  // Heavy breathing after training: a quick inhale and a longer exhale (0 → 1 → 0). It lifts the
  // shoulders a few pixels; the body itself barely changes size.
  function breath(time, period) {
    const phase = (time / period) % 1;
    return phase < 0.4 ? 1 - (1 - phase / 0.4) ** 2 : 1 - ease((phase - 0.4) / 0.6);
  }

  // Moves each character cycles through in a shuffled order. Every move returns offsets for the
  // skeleton: angles in radians, moves in source pixels.
  const shared = {
    shrug: {duration: 1.5, move: p => { const e = bump(p); return {chestY: -5 * e, armY: -12 * e, headY: 3 * e}; }},
    shift: {duration: 3.2, move: (p, t, side) => { const e = hold(p, 0.3, 0.3); return {pelvisA: 0.018 * side * e, headA: -0.014 * side * e, upLA: 0.012 * side * e, upRA: 0.012 * side * e}; }},
    sigh: {duration: 2.8, calm: true, move: p => {
      const inhale = p < 0.35 ? ease(p / 0.35) : 1 - ease((p - 0.35) / 0.65);
      const slump = p < 0.35 ? 0 : bump((p - 0.35) / 0.65);
      return {chestY: -9 * inhale + 4 * slump, chestSY: 0.008 * inhale, armY: -3 * inhale + 3 * slump, headY: -4 * inhale + 12 * slump, headSY: -0.04 * slump, headA: 0.025 * slump};
    }}
  };
  const moves = [
    {
      // Dheeb: relaxed after training, arms hanging.
      lookAtPartner: {duration: 2.6, partner: true, move: p => { const e = hold(p, 0.2, 0.3); return {headX: 12 * e, headA: 0.08 * e}; }},
      shrug: shared.shrug,
      shake: {duration: 1.3, move: (p, t) => { const s = bump(p) * Math.sin(Math.PI * 2 * t * 9); return {foLA: 0.055 * s, foRA: 0.055 * s, upLA: 0.018 * s, upRA: 0.018 * s}; }},
      roll: {duration: 2.2, move: p => { const e = bump(p), a = Math.PI * 2 * p; return {armY: -9 * (1 - Math.cos(a)) / 2 * e, armSpread: 5 * Math.sin(a) * e, chestSY: 0.004 * e}; }},
      shift: {...shared.shift, side: 1},
      sigh: shared.sigh,
      nod: {duration: 1.6, move: p => { const n = Math.max(0, Math.sin(Math.PI * 4 * p)) * bump(p); return {headY: 10 * n, headSY: -0.04 * n}; }}
    },
    {
      // Sakhr: keeps the shoulder stretch, tired.
      stretch: {duration: 3.6, move: (p, t) => {
        const pull = p < 0.35 ? ease(p / 0.35) : p < 0.65 ? 1 : p < 0.85 ? 1 - ease((p - 0.65) / 0.2) : 0;
        const release = p > 0.65 && p < 0.95 ? bump((p - 0.65) / 0.3) : 0;
        const tremor = p > 0.33 && p < 0.67 ? 0.006 * bump((p - 0.33) / 0.34) * Math.sin(Math.PI * 2 * t * 8.5) : 0;
        return {chestA: -0.01 * pull, headA: -0.02 * pull, headY: 9 * release, chestY: 3 * release,
          upLA: -0.04 * pull + tremor + 0.03 * release, foLA: -0.015 * pull + 0.7 * tremor,
          upRA: 0.025 * pull - 0.6 * tremor, foRA: -0.045 * pull + tremor};
      }},
      lookAtPartner: {duration: 2.4, partner: true, move: p => { const e = hold(p, 0.2, 0.3); return {headX: -10 * e, headA: -0.07 * e}; }},
      drop: {duration: 2.6, move: p => { const e = hold(p, 0.3, 0.35); return {headY: 14 * e, headSY: -0.05 * e, headA: 0.02 * e, chestY: 4 * e, armY: 3 * e}; }},
      shrug: shared.shrug,
      shift: {...shared.shift, side: -1},
      regrip: {duration: 1.4, move: p => { const e = bump(p); return {foRA: 0.09 * e, upRA: 0.025 * e, upLA: 0.02 * e}; }},
      sigh: shared.sigh
    }
  ];

  function shuffle(list) {
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }

  function start(character, name, time) {
    const move = moves[character.index][name];
    character.move = {name, move, at: time};
    character.nextAt = time + move.duration + 0.4 + Math.random() * 0.8;
  }

  // Pick the next move when the current one (plus a short rest) is over. Looking at the partner
  // makes the partner look back if it is resting at that moment.
  function schedule(character, time) {
    if (time < character.nextAt) return;
    if (!character.bag.length) character.bag = shuffle(Object.keys(moves[character.index]));
    const name = character.bag.pop();
    start(character, name, time);
    const partner = characters[1 - character.index];
    if (moves[character.index][name].partner && (!partner.move || time - partner.move.at > partner.move.move.duration)) {
      start(partner, 'lookAtPartner', time + 0.3);
    }
  }

  function pose(character) {
    const rig = character.rig, time = elapsed;
    schedule(character, time);
    const o = {pelvisA: 0, chestA: 0, chestY: 0, chestSY: 0, headA: 0, headX: 0, headY: 0, headSY: 0,
      upLA: 0, foLA: 0, upRA: 0, foRA: 0, armY: 0, armSpread: 0};
    let calm = 0;
    const current = character.move;
    if (current && time >= current.at) {
      const p = (time - current.at) / current.move.duration;
      if (p < 1) {
        const offsets = current.move.move(p, time - current.at, current.move.side || 1);
        for (const key in offsets) o[key] += offsets[key];
        if (current.move.calm) calm = bump(p);
      }
    }
    const intensity = 0.85 + 0.15 * Math.sin(Math.PI * 2 * time / 9.5 + rig.phase);
    const b = breath(time, rig.breath) * intensity * (1 - calm);
    const look = character.look;
    const pelvis = local(rig.ground, o.pelvisA + 0.002 * Math.sin(Math.PI * 2 * time / 7 + rig.phase));
    const chest = multiply(pelvis, local(rig.waist, o.chestA, 1 + 0.004 * b, 1 + 0.005 * b + o.chestSY, 0, -4 * b + o.chestY));
    const head = attach(chest, rig.neck, 0.03 * look + o.headA, 1, 1 + o.headSY, 3 * look + o.headX, -1 * b + o.headY);
    const upperL = attach(chest, rig.shoulderL, o.upLA, 1, 1, -o.armSpread, o.armY);
    const foreL = multiply(upperL, local(rig.elbowL, o.foLA));
    const upperR = attach(chest, rig.shoulderR, o.upRA, 1, 1, o.armSpread, o.armY);
    const foreR = multiply(upperR, local(rig.elbowR, o.foRA));
    const world = [[1, 0, 0, 0, 1, 0], pelvis, chest, head, upperL, foreL, upperR, foreR];
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
    const blend = 1 - Math.exp(-step * 4);
    characters.forEach(character => {
      let target = character.rig.rest;
      if (pointer && character.node.getBoundingClientRect) {
        const box = character.node.getBoundingClientRect();
        const headX = box.left + box.width * character.rig.neck[0] / WIDTH;
        target = Math.max(-1, Math.min(1, (pointer.x - headX) / (box.width * 0.8)));
      }
      character.look += (target - character.look) * blend;
    });
  }

  function draw() {
    if (!ready || failed) return;
    characters.forEach(character => {
      const gl = character.gl, rows = pose(character);
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
    if (elapsed - character.tapAt < character.rig.cooldown) return;
    character.tapAt = elapsed;
    start(character, character.rig.tap[character.taps++ % character.rig.tap.length], elapsed);
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
