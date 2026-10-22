/* Shared by browser navigation and the static page builders. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.WathbaLanguage = api;
})(typeof window !== 'undefined' ? window : this, function () {
  function baseFile(file) {
    return (file || 'index.html').replace(/-en\.html$/, '.html');
  }
  function isPage(file) {
    return /^(?:index|products|about|contact|academy(?:-[a-z-]+)?|equipment-[a-z0-9-]+|category-[a-z0-9-]+)\.html$/.test(baseFile(file));
  }
  function pageFile(file, lang) {
    const base = baseFile(file);
    if (!isPage(base)) return file;
    return lang === 'en' ? base.replace(/\.html$/, '-en.html') : base;
  }
  function href(raw, lang) {
    const match = /^(\.\/)?([^/?#]+\.html)([?#].*)?$/.exec(raw);
    if (!match || !isPage(match[2])) return raw;
    return (match[1] || '') + pageFile(match[2], lang) + (match[3] || '');
  }
  function opposite(location, lang) {
    const filename = location.pathname.split('/').pop() || 'index.html';
    return pageFile(filename, lang) + (location.search || '') + (location.hash || '');
  }
  return {baseFile, isPage, pageFile, href, opposite};
});
