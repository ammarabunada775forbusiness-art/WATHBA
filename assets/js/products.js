let currentLang = localStorage.getItem("wathbaLang") || "en";
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
        ids: ["wooden-parallettes"]
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
    return localStorage.getItem("wathbaLang") || "en";
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

    const visibleProducts = getFilteredProducts();

    productsContainer.innerHTML = visibleProducts
        .map((product) => {
            const productName = product.name[currentLang];
            const productDescription = product.description[currentLang];
            const priceText = getProductPriceText(product, currentLang);
            const groupLabel = getProductGroupLabel(product);

            return `
        <article class="product-card group relative flex flex-col bg-surface-container-low border border-outline-variant/10 rounded-lg overflow-hidden transition-all duration-500 hover:border-primary/30">
          
          <a href="product.html?id=${product.id}" class="relative h-[400px] overflow-hidden bg-surface-container block">
            
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

            <div class="product-overlay absolute inset-0 bg-background/40 backdrop-blur-sm opacity-0 transition-opacity duration-300 flex flex-col justify-center items-center gap-4 px-5 text-center">
              ${getVariantsOverlay(product)}
            </div>
          </a>

          <div class="p-8 flex flex-col flex-grow">
            <div class="flex justify-between items-start gap-4 mb-2">
              <h3 class="font-headline-md text-headline-md uppercase leading-tight">${productName}</h3>
              <span class="font-label-caps text-label-caps text-on-surface-variant text-end">${groupLabel}</span>
            </div>

            <p class="font-body-md text-body-md text-on-surface-variant mb-6 flex-grow">
              ${productDescription}
            </p>

            <div class="flex items-center justify-between gap-4 mt-auto product-card-bottom">
              <span class="font-label-caps text-label-caps text-on-surface/60 italic">
                ${priceText}
              </span>

              <button
                class="bg-[#25D366] text-white px-6 py-3 rounded-full font-label-caps text-label-caps flex items-center gap-2 hover:opacity-90 transition-opacity"
                type="button"
                data-product-id="${product.id}"
              >
                <svg class="wathba-wa-svg" viewBox="0 0 32 32" aria-hidden="true">
                  <path d="M19.11 17.27c-.27-.13-1.58-.78-1.82-.87-.24-.09-.41-.13-.59.14-.18.27-.68.87-.84 1.04-.15.18-.31.2-.58.07-.27-.13-1.12-.41-2.13-1.3-.79-.7-1.32-1.57-1.47-1.84-.15-.27-.02-.42.11-.55.11-.11.27-.29.41-.43.14-.15.18-.25.27-.43.09-.18.05-.34-.02-.48-.07-.13-.59-1.43-.81-1.96-.21-.5-.43-.43-.59-.44h-.5c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29s.98 2.65 1.11 2.83c.14.18 1.92 2.93 4.65 4.11.65.28 1.16.45 1.56.58.66.21 1.26.18 1.73.11.53-.08 1.58-.65 1.8-1.27.22-.63.22-1.16.15-1.27-.06-.12-.24-.18-.5-.31z"></path>
                  <path d="M16.02 3.2c-7.07 0-12.8 5.72-12.8 12.77 0 2.25.59 4.45 1.71 6.39L3.1 28.8l6.63-1.73a12.8 12.8 0 0 0 6.29 1.69h.01c7.06 0 12.79-5.72 12.79-12.77 0-3.42-1.34-6.63-3.79-9.04A12.76 12.76 0 0 0 16.02 3.2zm0 23.39h-.01a10.62 10.62 0 0 1-5.41-1.49l-.39-.23-3.94 1.03 1.05-3.84-.25-.4a10.55 10.55 0 0 1-1.63-5.61c0-5.84 4.76-10.59 10.6-10.59 2.82 0 5.47 1.09 7.47 3.08a10.5 10.5 0 0 1 3.11 7.51c0 5.84-4.76 10.59-10.6 10.59z"></path>
                </svg>
                ${currentLang === "ar" ? "اطلب" : "Order"}
              </button>
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
                openWhatsApp(product);
            }
        });
    });
}

document.addEventListener("click", (event) => {
    if (event.target.closest(".wathba-lang-btn")) {
        setTimeout(() => {
            currentLang = getCurrentLang();
            renderFilters();
            renderProducts();
        }, 50);
    }
});

currentLang = getCurrentLang();
renderFilters();
renderProducts();