// Preserve each approved image; a shared GPU mesh adds only local upper-body breathing.
// CSS and the canvas use the same screen composition to merge the black backgrounds.
(() => {
  const visual = document.querySelector('.wathba-hero-visual');
  if (!visual) return;
  const images = Array.from(visual.querySelectorAll('img'));
  const canvas = visual.querySelector('canvas');
  const toggle = visual.querySelector('button');
  if (images.length !== 2 || !canvas || !toggle) return;

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const labels = document.documentElement.lang === 'ar'
    ? ['إيقاف حركة التنفّس', 'تشغيل حركة التنفّس']
    : ['Pause breathing animation', 'Play breathing animation'];
  // Original 1024×1536 images, positioned without mirroring or stretching pixels.
  const figures = [
    {rect: [-180 / 1260, -110 / 1320, 1024 / 1260, 1536 / 1320], rate: 1.68, phase: 0},
    {rect: [240 / 1260, -110 / 1320, 1024 / 1260, 1536 / 1320], rate: 1.46, phase: 1.1}
  ];
  let gl, program, count, locations;
  let frame = 0, elapsed = 0, previousTime = null, previousPaint = -Infinity;
  let inView = !('IntersectionObserver' in window), paused = false, failed = false;
  let pageActive = true;

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

  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      throw new Error('Hero shader unavailable');
    }
    return shader;
  }

  function upload(index) {
    gl.bindTexture(gl.TEXTURE_2D, figures[index].texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[index]);
  }

  function initialize() {
    try {
      gl = canvas.getContext('webgl', {
        alpha: true, antialias: false, premultipliedAlpha: true,
        depth: false, stencil: false, powerPreference: 'low-power'
      });
      if (!gl) return false;
      const vertex = compile(gl.VERTEX_SHADER, `
        attribute vec2 a_position;
        varying vec2 v_uv;
        uniform float u_time;
        uniform vec4 u_rect;
        uniform vec2 u_breath;
        void main() {
          vec2 p = a_position;
          float breath = 0.5 - 0.5 * cos(u_breath.x * u_time + u_breath.y);
          float upper = 1.0 - smoothstep(0.28, 0.49, p.y);
          float chest = exp(-pow((p.y - 0.28) / 0.13, 2.0));
          p.y -= 0.0035 * upper * breath;
          p.x += (p.x - 0.50) * 0.012 * chest * upper * breath;
          vec2 stage = u_rect.xy + p * u_rect.zw;
          gl_Position = vec4(stage.x * 2.0 - 1.0, 1.0 - stage.y * 2.0, 0.0, 1.0);
          v_uv = a_position;
        }
      `);
      const fragment = compile(gl.FRAGMENT_SHADER, `
        precision mediump float;
        varying vec2 v_uv;
        uniform sampler2D u_image;
        void main() { gl_FragColor = texture2D(u_image, v_uv); }
      `);
      program = gl.createProgram();
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false;
      gl.useProgram(program);
      const vertices = [], columns = 32, rows = 48;
      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          const x = column / columns, y = row / rows;
          const nextX = (column + 1) / columns, nextY = (row + 1) / rows;
          vertices.push(x, y, nextX, y, x, nextY, x, nextY, nextX, y, nextX, nextY);
        }
      }
      count = vertices.length / 2;
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
      const position = gl.getAttribLocation(program, 'a_position');
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      locations = Object.fromEntries(['time', 'rect', 'breath'].map(name => [name, gl.getUniformLocation(program, 'u_' + name)]));
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_COLOR);
      images.forEach((_, index) => {
        figures[index].texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, figures[index].texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        upload(index);
      });
      return true;
    } catch (_) {
      return false;
    }
  }

  function draw() {
    if (!gl || failed) return;
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(locations.time, elapsed);
    figures.forEach(figure => {
      gl.bindTexture(gl.TEXTURE_2D, figure.texture);
      gl.uniform4fv(locations.rect, figure.rect);
      gl.uniform2f(locations.breath, figure.rate, figure.phase);
      gl.drawArrays(gl.TRIANGLES, 0, count);
    });
  }

  function resize() {
    if (!gl || failed) return;
    const scale = Math.min(devicePixelRatio || 1, 1.75);
    const width = Math.max(1, Math.min(1260, Math.round(visual.clientWidth * scale)));
    const height = Math.round(width * 1320 / 1260);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
    draw();
  }

  function tick(timestamp) {
    if (previousTime !== null) elapsed += Math.min(timestamp - previousTime, 100) / 1000;
    previousTime = timestamp;
    if (timestamp - previousPaint >= 1000 / 30) {
      draw();
      previousPaint = timestamp;
    }
    frame = requestAnimationFrame(tick);
  }

  function update() {
    stop();
    if (failed || images.some(image => !image.complete || !image.naturalWidth)) return;
    if (reducedMotion.matches || navigator.connection?.saveData) {
      visual.classList.remove('is-ready');
      visual.dataset.heroMotion = 'static';
      toggle.hidden = true;
      return;
    }
    if (!gl && !inView) return;
    if (!gl && !initialize()) return fallback();
    resize();
    visual.classList.add('is-ready');
    toggle.hidden = false;
    toggle.setAttribute('aria-label', labels[paused ? 1 : 0]);
    toggle.title = labels[paused ? 1 : 0];
    visual.dataset.heroMotion = paused ? 'paused' : 'running';
    if (!paused && inView && !document.hidden && pageActive) frame = requestAnimationFrame(tick);
  }

  toggle.addEventListener('click', () => { paused = !paused; update(); });
  images.forEach((image, index) => {
    image.addEventListener('load', () => {
      if (gl && !failed) {
        try { upload(index); } catch (_) { return fallback(); }
      }
      update();
    });
    image.addEventListener('error', fallback);
  });
  canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); fallback(); });
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
