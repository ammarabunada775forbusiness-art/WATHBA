// Move existing links with query-string IDs to the equivalent static page.
(function () {
  const id = new URLSearchParams(window.location.search).get("id");
  if (id && products.some((product) => product.id === id)) {
    window.location.replace(getProductPageUrl(id, localStorage.getItem("wathbaLang") || "ar"));
  }
})();
