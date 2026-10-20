// Shared by the static builder and the browser. No framework or font icons needed.
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.WathbaUI = api;
})(typeof window === "undefined" ? globalThis : window, function () {
  const paths = {
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    bag: '<path d="M5 7h14l1 14H4L5 7Z"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    book: '<path d="M12 5C8 2 4 3 2 4v15c4-2 7-1 10 1 3-2 6-3 10-1V4c-2-1-6-2-10 1Zm0 0v15"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    chat: '<path d="M21 11.5a9 9 0 0 1-13 8L3 21l1.5-5a9 9 0 1 1 16.5-4.5Z"/><path d="M8 9h8M8 13h5"/>',
    whatsapp: '<path d="M20 11.7a8.2 8.2 0 0 1-12.1 7.2L3 20l1.2-4.7A8.2 8.2 0 1 1 20 11.7Z"/><path d="M8.1 7.5c-.7.2-1 1.1-.8 2 .7 2.8 2.7 4.8 5.5 5.5.9.2 1.8-.1 2-.8l.4-1.1-2-1-1 .8a7 7 0 0 1-2.9-2.9l.8-1-1-2-1 .5Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>'
  };
  function icon(name) {
    return `<svg class="wathba-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.arrow}</svg>`;
  }
  function escape(value) {
    return String(value ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  }
  function pageUrl(base, lang) {
    return `${base}${lang === "en" ? "-en" : ""}.html`;
  }
  function productArt(id) {
    let shape;
    if (/rings/.test(id)) shape = '<path d="M103 16v95m95-95v95"/><ellipse cx="103" cy="143" rx="32" ry="38"/><ellipse cx="198" cy="143" rx="32" ry="38"/>';
    else if (/parallettes/.test(id)) shape = '<path d="m55 146 46-36 62 15-46 36-62-15Zm10-1v-40m44 53v-42M65 105l44 11m25 13 46-36 62 15-46 36-62-15Zm11-1V88m44 53v-41m-44-12 44 12"/>';
    else if (/ladder/.test(id)) shape = '<path d="M95 28v156m110-156v156M95 47h110M95 72h110M95 98h110M95 124h110M95 151h110M95 176h110"/>';
    else if (/monkey|multi|custom/.test(id)) shape = '<path d="M54 177V64l75-35 116 30v118M54 64l115 30 76-35M169 94v83M80 52l115 30M104 41l115 30M129 29v94M54 129l115 29M169 135l76-35"/>';
    else if (/parallel|dip/.test(id)) shape = '<path d="m58 170 69 18m-52-14V75l50-25v98m50 40 67-28m-53 22V83l43-28v106M75 75l50-25m64 33 43-28"/>';
    else if (/bands/.test(id)) shape = '<ellipse cx="150" cy="107" rx="62" ry="83" transform="rotate(30 150 107)"/><ellipse cx="150" cy="107" rx="51" ry="72" transform="rotate(30 150 107)"/>';
    else if (/gripper/.test(id)) shape = '<circle cx="149" cy="76" r="27"/><path d="m127 92-33 90m70-90 34 90m-94-3 28-78m57 78-29-78"/>';
    else if (/tape/.test(id)) shape = '<ellipse cx="150" cy="96" rx="63" ry="40"/><ellipse cx="150" cy="96" rx="27" ry="17"/><path d="M87 96v36c0 53 126 53 126 0V96M199 149l39 27"/>';
    else shape = '<path d="M70 57v106m0-78 53 39m-53 16 53-16m0 0h110M70 57l53 41h110M123 98v26M232 98v26"/><path d="M58 64h24m-24 92h24"/>';
    return `<svg class="equipment-art" viewBox="0 0 300 220" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="152" cy="193" rx="114" ry="10" fill="currentColor" stroke="none" opacity=".06"/>${shape}</svg>`;
  }
  return { icon, escape, pageUrl, productArt };
});
