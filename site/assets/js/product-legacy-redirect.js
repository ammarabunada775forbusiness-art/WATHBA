// Move existing links with query-string IDs to the equivalent static page.
(function () {
  const id = new URLSearchParams(window.location.search).get("id");
  if (id === 'swiss-ladder') {
    window.location.replace(`academy-swiss-ladder${localStorage.getItem('wathbaLang') === 'en' ? '-en' : ''}.html`);
    return;
  }
  if (id && products.some((product) => product.id === id)) {
    window.location.replace(getProductPageUrl(id, localStorage.getItem("wathbaLang") || "ar"));
  }
})();
