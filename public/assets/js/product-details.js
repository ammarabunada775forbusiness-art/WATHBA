// Progressive enhancement: options, description and guidance are already HTML.
(function () {
  const form = document.getElementById("productOrderForm");
  if (!form) return;
  const product = window.WATHBA_PRODUCTS.find(item => item.id === form.dataset.productId);
  if (!product) return;
  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const chosen = form.querySelector('input[name="variant"]:checked');
    const variant = chosen ? product.variants[Number(chosen.value)] : null;
    if (product.variants.length && !variant) return;
    window.WathbaCart.addProduct(product, variant);
  });
  document.querySelectorAll("[data-gallery-src]").forEach(button => button.addEventListener("click", () => {
    const image = document.querySelector(".product-visual .equipment-media img");
    if (!image) return;
    image.src = button.dataset.gallerySrc;
    document.querySelectorAll("[data-gallery-src]").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
  }));
})();
