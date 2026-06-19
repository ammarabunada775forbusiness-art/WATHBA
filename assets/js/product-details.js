let currentLang = localStorage.getItem("wathbaLang") || "en";
let selectedVariant = null;
let activeImageIndex = 0;

const productDetailsRoot = document.getElementById("productDetailsRoot");
const relatedProductsRoot = document.getElementById("relatedProductsRoot");

function getCurrentLang() {
  return localStorage.getItem("wathbaLang") || "en";
}

function getProductIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  if (productId) {
    return productId;
  }

  /*
    إذا دخل شخص على product.html بدون id
    نرجعه لصفحة المنتجات بدل ما نظهر باراليتس خشب دائمًا.
  */
  window.location.href = "products.html";
  return null;
}

function getCurrentProduct() {
  const productId = getProductIdFromUrl();

  if (!productId) {
    return null;
  }

  const product = products.find((product) => product.id === productId);

  if (!product) {
    window.location.href = "products.html";
    return null;
  }

  return product;
}
function getProductFolder(product) {
  return product.image.replace("cover.webp", "");
}

function getProductGallery(product) {
  const folder = getProductFolder(product);

  return [
    product.image,
    `${folder}1.webp`,
    `${folder}2.webp`,
    `${folder}3.webp`
  ];
}

function getProductFeatures(product, lang) {
  const common = {
    ar: [
      {
        icon: "fitness_center",
        title: "تصميم عملي",
        text: "مصمم لتدريبات الكاليستنكس الأساسية والمتقدمة."
      },
      {
        icon: "grid_view",
        title: "ثبات وجودة",
        text: "مناسب للاستخدام المنزلي أو الخارجي حسب نوع المنتج."
      },
      {
        icon: "verified",
        title: "طلب مباشر",
        text: "اطلب المنتج مباشرة عبر واتساب واسأل عن التفاصيل."
      }
    ],
    en: [
      {
        icon: "fitness_center",
        title: "Functional Design",
        text: "Built for essential and advanced calisthenics training."
      },
      {
        icon: "grid_view",
        title: "Stable Build",
        text: "Suitable for home or outdoor use depending on the product type."
      },
      {
        icon: "verified",
        title: "Direct Order",
        text: "Order directly through WhatsApp and ask for details."
      }
    ]
  };

  const custom = {
    "wooden-parallettes": {
      ar: [
        {
          icon: "forest",
          title: "خشب ممتاز",
          text: "قبضة مريحة ومناسبة للهاندستاند والبلانش والـ L-sit."
        },
        {
          icon: "grid_view",
          title: "قاعدة ثابتة",
          text: "تصميم يساعد على الثبات أثناء تمارين التحكم."
        },
        {
          icon: "fitness_center",
          title: "٣ قياسات",
          text: "متوفر بثلاث قياسات حسب مستوى وهدف اللاعب."
        }
      ],
      en: [
        {
          icon: "forest",
          title: "Premium Wood",
          text: "Comfortable grip for handstands, planche work, and L-sits."
        },
        {
          icon: "grid_view",
          title: "Stable Base",
          text: "Designed to support control and balance movements."
        },
        {
          icon: "fitness_center",
          title: "3 Sizes",
          text: "Available in three sizes based on training level and goal."
        }
      ]
    },

    "pull-up-bar": {
      ar: [
        {
          icon: "fitness_center",
          title: "تدريب السحب",
          text: "مناسب للعقلة، التعلق، وتمارين الظهر والكور."
        },
        {
          icon: "architecture",
          title: "تركيب ثابت",
          text: "اسأل عن النوع المناسب للمساحة المتوفرة عندك."
        },
        {
          icon: "verified",
          title: "حسب النوع",
          text: "السعر والتفاصيل حسب نوع العقلة المطلوبة."
        }
      ],
      en: [
        {
          icon: "fitness_center",
          title: "Pull Training",
          text: "Great for pull-ups, hanging, back, and core work."
        },
        {
          icon: "architecture",
          title: "Stable Setup",
          text: "Ask about the best type for your available space."
        },
        {
          icon: "verified",
          title: "Type Based",
          text: "Price and details depend on the requested bar type."
        }
      ]
    },

    "multi-rig": {
      ar: [
        {
          icon: "account_tree",
          title: "تصميم احترافي",
          text: "مناسب للنوادي، الحدائق، والمساحات التدريبية."
        },
        {
          icon: "architecture",
          title: "حسب المساحة",
          text: "يتم تحديد التصميم حسب المكان والاحتياج."
        },
        {
          icon: "verified",
          title: "طلب مخصص",
          text: "تواصل معنا للحصول على عرض مناسب."
        }
      ],
      en: [
        {
          icon: "account_tree",
          title: "Professional Setup",
          text: "Suitable for gyms, parks, and training spaces."
        },
        {
          icon: "architecture",
          title: "Space Based",
          text: "The design depends on your location and needs."
        },
        {
          icon: "verified",
          title: "Custom Quote",
          text: "Contact us to get a suitable offer."
        }
      ]
    }
  };

  if (product.id && product.id.startsWith("wooden-parallettes")) {
    return custom["wooden-parallettes"][lang];
  }

  return custom[product.id]?.[lang] || common[lang];
}

function splitTitle(name) {
  if (currentLang === "ar") {
    return name;
  }

  const words = name.split(" ");

  if (words.length <= 1) {
    return name;
  }

  const middle = Math.ceil(words.length / 2);
  return `${words.slice(0, middle).join(" ")}<br>${words.slice(middle).join(" ")}`;
}

function renderVariantButtons(product) {
  const variants = product.variants || [];

  if (variants.length === 0) {
    selectedVariant = null;

    return `
      <div class="mb-8">
        <label class="font-label-caps text-label-caps block mb-4">
          ${currentLang === "ar" ? "النوع / التفاصيل" : "TYPE / DETAILS"}
        </label>

        <div class="flex flex-wrap gap-3 wathba-size-row">
          <button
            class="wathba-size-chip active px-8 py-3 rounded-full border border-primary bg-primary text-background font-label-caps text-label-caps transition-all"
            type="button"
          >
            ${currentLang === "ar" ? "حسب الطلب" : "On Request"}
          </button>
        </div>
      </div>
    `;
  }

  if (!selectedVariant) {
    selectedVariant = variants[0];
  }

  return `
    <div class="mb-8">
      <label class="font-label-caps text-label-caps block mb-4">
        ${currentLang === "ar" ? "اختر القياس / النوع" : "SELECT SIZE / TYPE"}
      </label>

      <div class="flex flex-wrap gap-3 wathba-size-row">
        ${variants
      .map((variant, index) => {
        const active = selectedVariant === variant || (!selectedVariant && index === 0);

        return `
              <button
                class="wathba-size-chip px-8 py-3 rounded-full border ${active
            ? "active border-primary bg-primary text-background"
            : "border-outline-variant/30 hover:border-primary"
          } font-label-caps text-label-caps transition-all"
                type="button"
                data-variant-index="${index}"
              >
                ${variant[currentLang]}
              </button>
            `;
      })
      .join("")}
      </div>
    </div>
  `;
}

function renderProductDetails() {
  if (!productDetailsRoot) return;

  currentLang = getCurrentLang();

  const product = getCurrentProduct();
  if (!product) return;
  const gallery = getProductGallery(product);
  const mainImage = gallery[activeImageIndex] || product.image;
  const features = getProductFeatures(product, currentLang);
  const title = splitTitle(product.name[currentLang]);
  const category = product.category[currentLang];
  const priceText = getProductPriceText(product, currentLang);

  document.title = `WATHBA | ${product.name.en}`;

  productDetailsRoot.innerHTML = `
    <section class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-12 gap-gutter lg:gap-16">
      
      <div class="lg:col-span-7 flex flex-col gap-6">
        <div class="wathba-detail-main-image relative aspect-square md:aspect-[4/3] overflow-hidden bg-surface-container-lowest border border-outline-variant/20 rounded-lg">
          <img
            id="mainProductImage"
            alt="${product.name[currentLang]}"
            class="w-full h-full object-cover"
            src="${mainImage}"
            onerror="this.style.display='none'; this.parentElement.classList.add('wathba-image-fallback');"
          />
        </div>

        <div class="grid grid-cols-4 gap-4 wathba-detail-thumbs">
          ${gallery
      .map(
        (image, index) => `
                <button
                  class="wathba-thumb ${index === activeImageIndex ? "active border-primary" : "border-outline-variant/20"
          } relative aspect-square bg-surface-container-low rounded border hover:border-primary transition-all overflow-hidden"
                  type="button"
                  data-gallery-index="${index}"
                >
                  <img
                    class="w-full h-full object-cover ${index === activeImageIndex ? "opacity-100" : "opacity-60"}"
                    src="${image}"
                    alt="${product.name[currentLang]} ${index + 1}"
                    onerror="this.style.display='none'; this.parentElement.classList.add('wathba-image-fallback');"
                  />
                </button>
              `
      )
      .join("")}
        </div>
      </div>

      <div class="lg:col-span-5 flex flex-col ${currentLang === "ar" ? "text-right" : ""}">
        <span class="font-label-caps text-label-caps text-tertiary-fixed-dim mb-4 uppercase">
          ${category} / WATHBA
        </span>

        <h1 class="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase mb-6 tracking-tighter leading-none">
          ${title}
        </h1>

        <p class="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-lg">
          ${product.description[currentLang]}
        </p>

        ${renderVariantButtons(product)}

        <div class="mb-10 p-6 bg-surface-container-low border border-outline-variant/10 rounded-lg">
          <span class="font-label-caps text-label-caps text-on-surface-variant block mb-1">
            ${currentLang === "ar" ? "السعر" : "PRICING"}
          </span>

          <div class="flex items-baseline gap-2 ${currentLang === "ar" ? "justify-end" : ""}">
            <span class="font-headline-md text-headline-md text-primary">${priceText}</span>
          </div>
        </div>

              <button
  class="wathba-add-cart-btn wathba-add-cart-btn-large"
  type="button"
  id="orderProductBtn"
>
  <span class="material-symbols-outlined" aria-hidden="true">add_shopping_cart</span>
  <span>${currentLang === "ar" ? "إضافة للسلة" : "ADD TO CART"}</span>
</button>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-16 border-t border-outline-variant/10">
          ${features
      .map(
        (feature) => `
                <div class="flex flex-col gap-3">
                  <span class="material-symbols-outlined text-primary text-3xl">${feature.icon}</span>
                  <h3 class="font-label-caps text-label-caps">${feature.title}</h3>
                  <p class="text-xs text-on-surface-variant">${feature.text}</p>
                </div>
              `
      )
      .join("")}
        </div>
      </div>
    </section>
  `;

  bindProductDetailsEvents();
  renderRelatedProducts(product);
}

function bindProductDetailsEvents() {
  const product = getCurrentProduct();

  document.querySelectorAll("[data-gallery-index]").forEach((button) => {
    button.addEventListener("click", () => {
      activeImageIndex = Number(button.dataset.galleryIndex);
      renderProductDetails();
    });
  });

  document.querySelectorAll("[data-variant-index]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.variantIndex);
      selectedVariant = product.variants[index];
      renderProductDetails();
    });
  });

  const orderButton = document.getElementById("orderProductBtn");

  if (orderButton) {
    orderButton.addEventListener("click", () => {
      if (window.WathbaCart) {
        window.WathbaCart.addProduct(product, selectedVariant);
      } else {
        openWhatsApp(product, selectedVariant);
      }
    });
  }
}

function renderRelatedProducts(currentProduct) {
  if (!relatedProductsRoot) return;

  const relatedProducts = products
    .filter((product) => product.id !== currentProduct.id)
    .slice(0, 4);

  relatedProductsRoot.innerHTML = `
    <section class="mt-32 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
      <div class="flex justify-between items-end mb-12 border-b border-outline-variant/20 pb-8">
        <h2 class="font-headline-lg-mobile md:font-headline-md text-headline-lg-mobile md:text-headline-md uppercase tracking-tighter">
          ${currentLang === "ar" ? "منتجات أخرى" : "EQUIP YOURSELF"}
        </h2>

        <a class="font-label-caps text-label-caps text-primary border-b border-primary" href="products.html">
          ${currentLang === "ar" ? "عرض الكل" : "VIEW ALL TOOLS"}
        </a>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
        ${relatedProducts
      .map(
        (product) => `
              <a
                href="product.html?id=${product.id}"
                class="group relative bg-surface-container-low border border-outline-variant/10 rounded-lg overflow-hidden transition-all hover:-translate-y-2"
              >
                <div class="wathba-related-image aspect-[3/4] relative overflow-hidden">
                  <img
                    class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    src="${product.image}"
                    alt="${product.name[currentLang]}"
                    onerror="this.style.display='none'; this.parentElement.classList.add('wathba-image-fallback');"
                  />
                </div>

                <div class="p-6 flex justify-between items-center">
                  <div>
                    <h4 class="font-headline-md text-[20px] uppercase tracking-tight">
                      ${product.name[currentLang]}
                    </h4>

                    <p class="font-label-caps text-[10px] text-on-surface-variant">
                      ${product.category[currentLang]}
                    </p>
                  </div>

                  <span class="material-symbols-outlined text-primary">arrow_forward</span>
                </div>
              </a>
            `
      )
      .join("")}
      </div>
    </section>
  `;
}

document.addEventListener("click", (event) => {
  if (event.target.closest(".wathba-lang-btn")) {
    setTimeout(() => {
      currentLang = getCurrentLang();
      selectedVariant = null;
      renderProductDetails();
    }, 80);
  }
});

renderProductDetails();

/* =========================
   WATHBA PRODUCT DETAILS LANGUAGE HOTFIX
========================= */

document.addEventListener("wathba:langchange", function (event) {
  const newLang = event.detail && event.detail.lang ? event.detail.lang : null;

  setTimeout(function () {
    currentLang = newLang || localStorage.getItem("wathbaLang") || "en";
    selectedVariant = null;
    renderProductDetails();
  }, 80);
});