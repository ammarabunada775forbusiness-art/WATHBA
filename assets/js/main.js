let currentLang = localStorage.getItem("wathbaLang") || "en";

const homeFeaturedProducts = document.getElementById("homeFeaturedProducts");

const homeTranslations = {
  ar: {
    featuredMini: "مجموعة مختارة",
    featuredTitle: "معدات احترافية",
    featuredText: "معدات مختارة للبيت، الخارج، والتجهيزات الاحترافية.",
    viewAllProducts: "عرض كل المنتجات",
    explore: "استكشف",
    order: "أضف للسلة",
    sizes: "القياسات / الأنواع",
    contactUs: "تواصل معنا"
  },
  en: {
    featuredMini: "Curated Collection",
    featuredTitle: "Professional Gear",
    featuredText: "Tested gear for home, outdoor, and professional calisthenics setups.",
    viewAllProducts: "View All Products",
    explore: "Explore",
    order: "Add to Cart",
    sizes: "Sizes / Types",
    contactUs: "Contact us"
  }
};

const featuredProductIds = [
  "pull-up-bar",
  "wooden-parallettes-medium",
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

            <div class="home-product-overlay absolute inset-0 bg-background/20 backdrop-blur-[2px] flex flex-col justify-center items-center gap-4 px-5 text-center">
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
  class="wathba-add-cart-btn"
  type="button"
  data-home-product-id="${product.id}"
>
  <span class="material-symbols-outlined" aria-hidden="true">add_shopping_cart</span>
  <span>${homeTranslations[currentLang].order}</span>
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
        if (window.WathbaCart) {
          window.WathbaCart.addProduct(product);
        } else {
          openWhatsApp(product);
        }
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