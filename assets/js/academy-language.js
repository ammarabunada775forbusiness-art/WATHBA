// Each Academy page has a standalone Arabic and English HTML version.
// Switching the site language follows the equivalent article URL.
document.addEventListener("wathba:langchange", (event) => {
  const lang = event.detail?.lang;
  if (!lang || lang === document.body.dataset.academyLang) return;

  const current = window.location.pathname.split("/").pop();
  if (!/^academy(?:-[a-z-]+)?\.html$/.test(current)) return;

  const base = current.replace(/-en\.html$/, ".html").replace(/\.html$/, "");
  const destination = `${base}${lang === "en" ? "-en" : ""}.html${window.location.hash}`;
  window.location.assign(destination);
});
