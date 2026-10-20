// Restore the original product hover interaction; respect reduced motion.
(function () {
  const container = document.querySelector(".product-360-container");
  const inner = document.querySelector(".product-360-inner");
  if (!container || !inner || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  container.addEventListener("mousemove", event => {
    const box = container.getBoundingClientRect();
    const angle = Math.max(-12, Math.min(12, (event.clientX - box.left - box.width / 2) / 24));
    inner.style.transform = "rotateY(" + angle + "deg)";
  });
  container.addEventListener("mouseleave", () => { inner.style.transform = ""; });
})();
