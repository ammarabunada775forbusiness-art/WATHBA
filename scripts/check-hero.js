#!/usr/bin/env node
// Exercise the actual animation lifecycle without a GPU or animation timers.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(require('node:path').join(__dirname, '../assets/js/home-hero.js'), 'utf8');

function harness({reduced = false, graphics = true, saveData = false, loaded = true, lang = 'ar'} = {}) {
  const eventTarget = values => Object.assign({events: {}, addEventListener(name, fn) { this.events[name] = fn; }}, values);
  let serial = 0, draws = 0, contexts = 0;
  const frames = new Map(), classes = new Set(), observers = [];
  const gl = new Proxy({
    drawArrays() { draws++; }, getShaderParameter() { return true; }, getProgramParameter() { return true; }
  }, {get(object, key) { return key in object ? object[key] : (/^[A-Z_]+$/.test(key) ? 1 : () => ({})); }});
  const image = eventTarget({complete: loaded, naturalWidth: loaded ? 1254 : 0});
  const canvas = eventTarget({width: 1254, height: 1254, getContext() { contexts++; return graphics ? gl : null; }});
  const toggle = eventTarget({hidden: true, attributes: {}, setAttribute(name, value) { this.attributes[name] = value; }});
  const visual = {
    dataset: {heroMotion: 'static'}, clientWidth: 390,
    classList: {add: value => classes.add(value), remove: value => classes.delete(value)},
    querySelector: selector => ({img: image, canvas, button: toggle})[selector]
  };
  const media = eventTarget({matches: reduced});
  const document = eventTarget({hidden: false, documentElement: {lang}, querySelector: () => visual});
  const window = eventTarget({IntersectionObserver: true, ResizeObserver: true});
  const context = vm.createContext({
    document, window, navigator: {connection: {saveData}}, devicePixelRatio: 2,
    matchMedia: () => media,
    requestAnimationFrame(callback) { const id = ++serial; frames.set(id, callback); return id; },
    cancelAnimationFrame: id => frames.delete(id),
    IntersectionObserver: class { constructor(callback) { observers.push(callback); } observe() {} },
    ResizeObserver: class { observe() {} }
  });
  vm.runInContext(source, context);
  return {
    visual, image, canvas, toggle, media, document, window, frames, classes,
    get draws() { return draws; }, get contexts() { return contexts; },
    visible(value) { observers[0]([{isIntersecting: value}]); },
    tick(timestamp) { const [id, callback] = frames.entries().next().value; frames.delete(id); callback(timestamp); },
    reduce(value) { media.matches = value; media.events.change(); }
  };
}

const active = harness();
assert.equal(active.contexts, 0, 'defer GPU initialization while the figure is outside the viewport');
active.visible(true);
assert(active.classes.has('is-ready'));
assert.equal(active.frames.size, 1);
assert.equal(active.toggle.hidden, false);
assert.equal(active.toggle.attributes['aria-label'], 'إيقاف حركة التنفّس');
const before = active.draws;
active.tick(0); active.tick(16); active.tick(34);
assert.equal(active.draws - before, 2, 'limit rendering to 30fps');
active.toggle.events.click();
assert.equal(active.frames.size, 0);
assert.equal(active.visual.dataset.heroMotion, 'paused');
active.toggle.events.click();
assert.equal(active.frames.size, 1);
active.visible(false);
assert.equal(active.frames.size, 0);
active.visible(true);
assert.equal(active.frames.size, 1);
active.document.hidden = true; active.document.events.visibilitychange();
assert.equal(active.frames.size, 0);
active.document.hidden = false; active.document.events.visibilitychange();
assert.equal(active.frames.size, 1);
active.window.events.pagehide();
assert.equal(active.frames.size, 0);
active.window.events.pageshow();
assert.equal(active.frames.size, 1);
active.reduce(true);
assert.equal(active.frames.size, 0);
assert(!active.classes.has('is-ready'));
assert.equal(active.toggle.hidden, true);
active.reduce(false);
assert(active.classes.has('is-ready'));
assert.equal(active.frames.size, 1);
active.canvas.events.webglcontextlost({preventDefault() {}});
assert.equal(active.frames.size, 0);
assert(!active.classes.has('is-ready'));
assert.equal(active.toggle.hidden, true);

for (const options of [{reduced: true}, {saveData: true}, {graphics: false}, {loaded: false}]) {
  const fallback = harness(options); fallback.visible(true);
  assert(!fallback.classes.has('is-ready'), JSON.stringify(options) + ': retain static image');
  assert.equal(fallback.frames.size, 0);
  assert.equal(fallback.toggle.hidden, true);
}
const english = harness({lang: 'en'}); english.visible(true);
assert.equal(english.toggle.attributes['aria-label'], 'Pause breathing animation');
english.toggle.events.click();
assert.equal(english.toggle.attributes['aria-label'], 'Play breathing animation');
console.log('Hero lifecycle passed: render limit, pause/resume, viewport, visibility, page suspension, motion preferences, data saving, static fallback, context loss and both languages.');
