// A small GPU mesh expands the chest and lifts the shoulders; the legs stay fixed.
// The normal <img> remains the complete, accessible no-JS/WebGL fallback.
(() => {
  const visual = document.querySelector('.wathba-hero-visual');
  if (!visual) return;
  const image = visual.querySelector('img');
  const canvas = visual.querySelector('canvas');
  const toggle = visual.querySelector('button');
  if (!image || !canvas || !toggle) return;

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const isArabic = document.documentElement.lang === 'ar';
  const labels = isArabic
    ? ['إيقاف حركة التنفّس', 'تشغيل حركة التنفّس']
    : ['Pause breathing animation', 'Play breathing animation'];
  let gl, program, texture, timeLocation, count;
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
        void main() {
          vec2 p = a_position;
          bool left = p.x < 0.5;
          float center = left ? 0.30 : 0.71;
          float phase = left ? 1.68 * u_time : 1.46 * u_time + 1.1;
          float breath = 0.5 - 0.5 * cos(phase);
          float upper = 1.0 - smoothstep(0.29, 0.61, p.y);
          float chest = exp(-pow((p.y - 0.28) / 0.14, 2.0));
          p.y -= 0.0055 * upper * breath;
          p.x += (p.x - center) * 0.016 * chest * upper * breath;
          gl_Position = vec4(p.x * 2.0 - 1.0, 1.0 - p.y * 2.0, 0.0, 1.0);
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

      const vertices = [];
      const columns = 32, rows = 40;
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
      timeLocation = gl.getUniformLocation(program, 'u_time');
      texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      upload();
      return true;
    } catch (_) {
      return false;
    }
  }

  function upload() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  }

  function draw() {
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(timeLocation, elapsed);
    gl.drawArrays(gl.TRIANGLES, 0, count);
  }

  function resize() {
    if (!gl || failed) return;
    const scale = Math.min(devicePixelRatio || 1, 1.75);
    const width = Math.max(1, Math.min(1254, Math.round(visual.clientWidth * scale)));
    if (canvas.width !== width || canvas.height !== width) {
      canvas.width = canvas.height = width;
      gl.viewport(0, 0, width, width);
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
    if (failed || !image.complete || !image.naturalWidth) return;
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
  image.addEventListener('load', () => {
    if (gl && !failed) {
      try { upload(); } catch (_) { return fallback(); }
    }
    update();
  });
  image.addEventListener('error', fallback);
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
