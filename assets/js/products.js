let currentLang = localStorage.getItem("wathbaLang") || "ar";
let currentFilter = "all";

const filtersContainer = document.getElementById("categoryFilters");
const productsContainer = document.getElementById("allProducts");

const productGroups = [
  {
    key: "all",
    ar: "كل المعدات",
    en: "All Equipment",
    ids: []
  },
  {
    key: "bars",
    ar: "البارات",
    en: "Bars",
    ids: ["pull-up-bar", "dip-bars", "steel-bars", "monkey-bars"]
  },
  {
    key: "handles",
    ar: "المقابض",
    en: "Handles",
    ids: [
      "wooden-parallettes-small",
      "wooden-parallettes-medium",
      "wooden-parallettes-large"
    ]
  },
  {
    key: "rings",
    ar: "الحلقات",
    en: "Rings",
    ids: ["gymnastic-rings"]
  },
  {
    key: "accessories",
    ar: "إكسسوارات",
    en: "Accessories",
    ids: ["hand-gripper", "resistance-bands"]
  },
  {
    key: "rigs",
    ar: "الأجهزة",
    en: "Rigs",
    ids: ["multi-rig"]
  }
];

function getCurrentLang() {
  return localStorage.getItem("wathbaLang") || "ar";
}

function syncCurrentLang(langFromEvent = null) {
  currentLang = langFromEvent || getCurrentLang();
}

function getFilteredProducts() {
  if (currentFilter === "all") {
    return products;
  }

  const group = productGroups.find((item) => item.key === currentFilter);

  if (!group) {
    return products;
  }

  return products.filter((product) => group.ids.includes(product.id));
}

function getProductGroupLabel(product) {
  const group = productGroups.find((item) => item.ids.includes(product.id));

  if (!group) {
    return currentLang === "ar" ? "معدات" : "Equipment";
  }

  return group[currentLang];
}

function getProductDetailsUrl(product) {
  return `product.html?id=${encodeURIComponent(product.id)}`;
}

function getVariantsOverlay(product) {
  const variants = product.variants || [];

  if (variants.length === 0) {
    return `
      <span class="font-label-caps text-label-caps text-primary mb-2">
        ${currentLang === "ar" ? "حسب الطلب" : "Available on request"}
      </span>

      <div class="flex gap-2 flex-wrap justify-center">
        <span class="bg-surface/80 border border-outline-variant px-4 py-1 rounded-full text-[10px] font-bold uppercase">
          ${currentLang === "ar" ? "تواصل معنا" : "Contact us"}
        </span>
      </div>
    `;
  }

  const title = currentLang === "ar" ? "القياسات / الأنواع" : "Sizes / Types";

  return `
    <span class="font-label-caps text-label-caps text-primary mb-2">${title}</span>

    <div class="flex gap-2 flex-wrap justify-center">
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

function renderFilters() {
  if (!filtersContainer) return;

  syncCurrentLang();

  filtersContainer.innerHTML = productGroups
    .map((group) => {
      const isActive = group.key === currentFilter;

      return `
        <button
          class="${isActive
          ? "bg-primary text-background"
          : "border border-outline-variant/30 text-on-surface-variant hover:border-primary hover:text-primary"
        } px-8 py-3 rounded-full font-label-caps text-label-caps uppercase transition-all active:scale-95"
          type="button"
          data-filter="${group.key}"
        >
          ${group[currentLang]}
        </button>
      `;
    })
    .join("");

  filtersContainer.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      currentFilter = button.dataset.filter;
      renderFilters();
      renderProducts();
    });
  });
}

function renderProducts() {
  if (!productsContainer) return;

  syncCurrentLang();

  const visibleProducts = getFilteredProducts();

  productsContainer.innerHTML = visibleProducts
    .map((product) => {
      const productName = product.name[currentLang];
      const productDescription = product.description[currentLang];
      const priceText = getProductPriceText(product, currentLang);
      const groupLabel = getProductGroupLabel(product);
      const detailsUrl = getProductDetailsUrl(product);

      return `
        <article class="product-card group relative flex flex-col bg-surface-container-low border border-outline-variant/10 rounded-lg overflow-hidden transition-all duration-500 hover:border-primary/30">
          
          <a href="${detailsUrl}" class="relative h-[400px] overflow-hidden bg-surface-container block" aria-label="${productName}">
            
            <div
              class="hidden absolute inset-0 place-items-center font-headline-md text-headline-md text-primary/40 tracking-widest"
              style="display:none;"
            >
              WATHBA
            </div>

            <img
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src="${product.image}"
              alt="${productName}"
              onerror="this.style.display='none'; this.previousElementSibling.style.display='grid';"
            />

           <div class="product-overlay absolute inset-0 bg-background/20 backdrop-blur-[2px] opacity-0 transition-opacity duration-300 flex flex-col justify-center items-center gap-4 px-5 text-center">
              ${getVariantsOverlay(product)}
            </div>
          </a>

          <div class="p-8 flex flex-col flex-grow ${currentLang === "ar" ? "text-right" : ""}">
            <div class="flex justify-between items-start gap-4 mb-2">
              <h3 class="font-headline-md text-headline-md uppercase leading-tight">
                <a href="${detailsUrl}" class="hover:text-primary transition-colors">
                  ${productName}
                </a>
              </h3>

              <span class="font-label-caps text-label-caps text-on-surface-variant text-end">
                ${groupLabel}
              </span>
            </div>

            <p class="font-body-md text-body-md text-on-surface-variant mb-6 flex-grow">
              ${productDescription}
            </p>

            <div class="flex items-center justify-between gap-4 mt-auto product-card-bottom">
              <span class="font-label-caps text-label-caps text-on-surface/60 italic">
                ${priceText}
              </span>

              <div class="flex items-center gap-2 product-card-actions">
                <a
                  href="${detailsUrl}"
                  class="inline-flex items-center justify-center px-5 py-3 rounded-full border border-outline-variant/40 text-primary font-label-caps text-label-caps hover:border-primary transition-all"
                >
                  ${currentLang === "ar" ? "التفاصيل" : "Details"}
                </a>

                <button
  class="wathba-add-cart-btn"
  type="button"
  data-product-id="${product.id}"
>
  <span class="material-symbols-outlined" aria-hidden="true">add_shopping_cart</span>
  <span>${currentLang === "ar" ? "أضف للسلة" : "Add to Cart"}</span>
</button>
              </div>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  productsContainer.querySelectorAll("[data-product-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const product = products.find((item) => item.id === button.dataset.productId);

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

function refreshProductsPage(langFromEvent = null) {
  syncCurrentLang(langFromEvent);
  renderFilters();
  renderProducts();
}

document.addEventListener("wathba:langchange", function (event) {
  const newLang = event.detail && event.detail.lang ? event.detail.lang : null;

  setTimeout(function () {
    refreshProductsPage(newLang);
  }, 50);
});

document.addEventListener("click", function (event) {
  if (event.target.closest(".wathba-lang-btn")) {
    setTimeout(function () {
      refreshProductsPage();
    }, 120);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  refreshProductsPage();
});

refreshProductsPage();