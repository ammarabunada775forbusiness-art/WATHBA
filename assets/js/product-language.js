// A dedicated product URL has its own localized, crawlable HTML.
document.addEventListener("wathba:langchange", (event) => {
  const lang = event.detail?.lang;
  const productId = document.body.dataset.wathbaProductId;
  if (!productId || !lang || lang === document.body.dataset.productPageLang) return;
  window.location.assign(`${getProductPageUrl(productId, lang)}${window.location.hash}`);
});
