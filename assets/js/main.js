let currentLang = localStorage.getItem("wathbaLang") || "en";

const homeFeaturedProducts = document.getElementById("homeFeaturedProducts");

const homeTranslations = {
  ar: {
    featuredMini: "مجموعة مختارة",
    featuredTitle: "معدات احترافية",
    featuredText: "معدات مختارة للبيت، الخارج، والتجهيزات الاحترافية.",
    viewAllProducts: "عرض كل المنتجات",
    explore: "استكشف",
    order: "اطلب",
    sizes: "القياسات / الأنواع",
    contactUs: "تواصل معنا"
  },
  en: {
    featuredMini: "Curated Collection",
    featuredTitle: "Professional Gear",
    featuredText: "Tested gear for home, outdoor, and professional calisthenics setups.",
    viewAllProducts: "View All Products",
    explore: "Explore",
    order: "Order",
    sizes: "Sizes / Types",
    contactUs: "Contact us"
  }
};

const featuredProductIds = [
  "pull-up-bar",
  "wooden-parallettes",
  "gymnastic-rings",
  "multi-rig",
  "dip-bars",
  "resistance-bands"
];

function getCurrentLang() {
  return localStorage.getItem("wathbaLang") || "en";
}

function applyHomeTranslations() {
  currentLang = getCurrentLang();

  document.querySelectorAll("[data-home-i18n]").forEach((element) => {
    const key = element.dataset.homeI18n;

    if (homeTranslations[currentLang] && homeTranslations[currentLang][key]) {
      element.textContent = homeTranslations[currentLang][key];
    }
  });
}

function getFeaturedProducts() {
  return featuredProductIds
    .map((id) => products.find((product) => product.id === id))
    .filter(Boolean);
}

function getVariantPreview(product) {
  const variants = product.variants || [];

  if (variants.length === 0) {
    return `
      <span class="font-label-caps text-label-caps text-primary mb-2">
        ${homeTranslations[currentLang].contactUs}
      </span>
    `;
  }

  return `
    <span class="font-label-caps text-label-caps text-primary mb-2">
      ${homeTranslations[currentLang].sizes}
    </span>

    <div class="flex flex-wrap gap-2 justify-center">
      ${variants
      .map(
        (variant) => `
            <span class="bg-surface/80 border border-outline-variant px-4 py-1 rounded-full text-[10px] font-bold uppercase">
              ${variant[currentLang]}
            </span>
          `
      )
      .join("")}
    </div>
  `;
}

function renderHomeProducts() {
  if (!homeFeaturedProducts) return;

  currentLang = getCurrentLang();

  const selectedProducts = getFeaturedProducts();

  homeFeaturedProducts.innerHTML = selectedProducts
    .map((product, index) => {
      const name = product.name[currentLang];
      const category = product.category[currentLang];
      const description = product.description[currentLang];
      const priceText = getProductPriceText(product, currentLang);

      const isLargeCard = index < 3;

      return `
        <article class="home-product-card group relative flex flex-col bg-surface-container-low border border-outline-variant/10 rounded-lg overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-primary/30">
          
          <a
            href="product.html?id=${product.id}"
            class="home-product-media relative ${isLargeCard ? "h-[420px]" : "h-[280px]"} overflow-hidden bg-surface-container block"
          >
            <div
              class="hidden absolute inset-0 home-product-fallback"
              style="display:none;"
            ></div>

            <img
              class="home-product-image w-full h-full object-cover"
              src="${product.image}"
              alt="${name}"
              onerror="this.style.display='none'; this.previousElementSibling.style.display='block';"
            />

            <div class="home-product-overlay absolute inset-0 bg-background/45 backdrop-blur-sm flex flex-col justify-center items-center gap-4 px-5 text-center">
              ${getVariantPreview(product)}
            </div>
          </a>

          <div class="p-7 flex flex-col flex-grow">
            <span class="font-label-caps text-label-caps text-on-surface-variant uppercase mb-3">
              ${category}
            </span>

            <h3 class="font-headline-md text-headline-md uppercase tracking-tight leading-none mb-4">
              ${name}
            </h3>

            <p class="font-body-md text-body-md text-on-surface-variant mb-6 flex-grow">
              ${description}
            </p>

            <div class="home-product-actions flex items-center justify-between gap-4 mt-auto">
              <span class="font-label-caps text-label-caps text-on-surface/60 italic">
                ${priceText}
              </span>

              <div class="flex items-center gap-2">
                <a
                  href="product.html?id=${product.id}"
                  class="inline-flex items-center justify-center px-4 py-3 rounded-full border border-outline-variant/40 text-primary font-label-caps text-label-caps hover:border-primary transition-all"
                >
                  ${homeTranslations[currentLang].explore}
                </a>

                <button
                  class="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-full font-label-caps text-label-caps hover:opacity-90 transition-opacity"
                  type="button"
                  data-home-product-id="${product.id}"
                >
                  <svg class="home-wa-svg" viewBox="0 0 32 32" aria-hidden="true">
                    <path d="M19.11 17.27c-.27-.13-1.58-.78-1.82-.87-.24-.09-.41-.13-.59.14-.18.27-.68.87-.84 1.04-.15.18-.31.2-.58.07-.27-.13-1.12-.41-2.13-1.3-.79-.7-1.32-1.57-1.47-1.84-.15-.27-.02-.42.11-.55.11-.11.27-.29.41-.43.14-.15.18-.25.27-.43.09-.18.05-.34-.02-.48-.07-.13-.59-1.43-.81-1.96-.21-.5-.43-.43-.59-.44h-.5c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29s.98 2.65 1.11 2.83c.14.18 1.92 2.93 4.65 4.11.65.28 1.16.45 1.56.58.66.21 1.26.18 1.73.11.53-.08 1.58-.65 1.8-1.27.22-.63.22-1.16.15-1.27-.06-.12-.24-.18-.5-.31z"></path>
                    <path d="M16.02 3.2c-7.07 0-12.8 5.72-12.8 12.77 0 2.25.59 4.45 1.71 6.39L3.1 28.8l6.63-1.73a12.8 12.8 0 0 0 6.29 1.69h.01c7.06 0 12.79-5.72 12.79-12.77 0-3.42-1.34-6.63-3.79-9.04A12.76 12.76 0 0 0 16.02 3.2zm0 23.39h-.01a10.62 10.62 0 0 1-5.41-1.49l-.39-.23-3.94 1.03 1.05-3.84-.25-.4a10.55 10.55 0 0 1-1.63-5.61c0-5.84 4.76-10.59 10.6-10.59 2.82 0 5.47 1.09 7.47 3.08a10.5 10.5 0 0 1 3.11 7.51c0 5.84-4.76 10.59-10.6 10.59z"></path>
                  </svg>
                  ${homeTranslations[currentLang].order}
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  homeFeaturedProducts.querySelectorAll("[data-home-product-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const product = products.find((item) => item.id === button.dataset.homeProductId);

      if (product) {
        openWhatsApp(product);
      }
    });
  });
}

document.addEventListener("click", (event) => {
  if (event.target.closest(".wathba-lang-btn")) {
    setTimeout(() => {
      currentLang = getCurrentLang();
      applyHomeTranslations();
      renderHomeProducts();
    }, 80);
  }
});

applyHomeTranslations();
renderHomeProducts();