const WATHBA_SHARED_PHONE =
  window.WATHBA_CONFIG?.whatsappNumber || "962791752349";
const WATHBA_SHARED_TRANSLATIONS = {
  en: {
    navHome: "Home",
    navProducts: "Products",
    navAbout: "About",
    navContact: "Contact",
    whatsappLabel: "Chat with us",
    whatsappMessage: "Hello WATHBA, I want to ask about calisthenics equipment",
    footerText:
      "Premium calisthenics equipment for home, outdoor, and professional training setups. Browse, choose, and order directly through WhatsApp.",
    pagesTitle: "Pages",
    equipmentTitle: "Equipment",
    contactTitle: "Contact",
    orderWhatsapp: "Order via WhatsApp",
    footerLocation: "Amman, Jordan",
    footerPhone: "WhatsApp: +962 79 175 2349",
    footerNote: "Orders and custom equipment requests are handled directly through WhatsApp.",
    copyright: "© 2026 WATHBA. ALL RIGHTS RESERVED.",
    pullUp: "Pull-up Bar",
    parallettes: "Parallettes",
    dipBars: "Dip Bars",
    rings: "Rings"
  },

  ar: {
    navHome: "الرئيسية",
    navProducts: "المنتجات",
    navAbout: "من نحن",
    navContact: "تواصل معنا",
    whatsappLabel: "راسلنا",
    whatsappMessage: "مرحبا WATHBA، أريد الاستفسار عن معدات الكاليستنكس",
    footerText:
      "معدات كاليسثنكس ممتازة للبيت، الخارج، والمساحات التدريبية الاحترافية. تصفح المنتجات واطلب مباشرة عبر واتساب.",
    pagesTitle: "الصفحات",
    equipmentTitle: "المعدات",
    contactTitle: "التواصل",
    orderWhatsapp: "اطلب عبر واتساب",
    footerLocation: "عمّان، الأردن",
    footerPhone: "واتساب: +962 79 175 2349",
    footerNote: "الطلبات والتجهيزات المخصصة تتم مباشرة عبر واتساب.",
    copyright: "© 2026 WATHBA. جميع الحقوق محفوظة.",
    pullUp: "عقلة",
    parallettes: "باراليتس",
    dipBars: "متوازي",
    rings: "حلقات جمباز"
  }
};

const WATHBA_WA_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true">
    <path d="M19.11 17.27c-.27-.13-1.58-.78-1.82-.87-.24-.09-.41-.13-.59.14-.18.27-.68.87-.84 1.04-.15.18-.31.2-.58.07-.27-.13-1.12-.41-2.13-1.3-.79-.7-1.32-1.57-1.47-1.84-.15-.27-.02-.42.11-.55.11-.11.27-.29.41-.43.14-.15.18-.25.27-.43.09-.18.05-.34-.02-.48-.07-.13-.59-1.43-.81-1.96-.21-.5-.43-.43-.59-.44h-.5c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29s.98 2.65 1.11 2.83c.14.18 1.92 2.93 4.65 4.11.65.28 1.16.45 1.56.58.66.21 1.26.18 1.73.11.53-.08 1.58-.65 1.8-1.27.22-.63.22-1.16.15-1.27-.06-.12-.24-.18-.5-.31z"></path>
    <path d="M16.02 3.2c-7.07 0-12.8 5.72-12.8 12.77 0 2.25.59 4.45 1.71 6.39L3.1 28.8l6.63-1.73a12.8 12.8 0 0 0 6.29 1.69h.01c7.06 0 12.79-5.72 12.79-12.77 0-3.42-1.34-6.63-3.79-9.04A12.76 12.76 0 0 0 16.02 3.2zm0 23.39h-.01a10.62 10.62 0 0 1-5.41-1.49l-.39-.23-3.94 1.03 1.05-3.84-.25-.4a10.55 10.55 0 0 1-1.63-5.61c0-5.84 4.76-10.59 10.6-10.59 2.82 0 5.47 1.09 7.47 3.08a10.5 10.5 0 0 1 3.11 7.51c0 5.84-4.76 10.59-10.6 10.59z"></path>
  </svg>
`;

const WATHBA_MENU_PRODUCTS = [
  {
    id: "pull-up-bar",
    ar: "عقلة",
    en: "Pull-up Bar",
    image: "assets/images/products/pull-up-bar/cover.webp"
  },
  {
    id: "wooden-parallettes-small",
    ar: "باراليتس",
    en: "Parallettes",
    image: "assets/images/products/wooden-parallettes/cover.webp"
  },
  {
    id: "dip-bars",
    ar: "متوازي",
    en: "Dip Bars",
    image: "assets/images/products/dip-bars/cover.webp"
  },
  {
    id: "steel-bars",
    ar: "ستيل بارز",
    en: "Steel Bars",
    image: "assets/images/products/steel-bars/cover.webp"
  },
  {
    id: "monkey-bars",
    ar: "مونكي بارز",
    en: "Monkey Bars",
    image: "assets/images/products/monkey-bars/cover.webp"
  },
  {
    id: "resistance-bands",
    ar: "حبال مقاومة",
    en: "Resistance Bands",
    image: "assets/images/products/resistance-bands/cover.webp"
  },
  {
    id: "gymnastic-rings",
    ar: "حلقات جمباز",
    en: "Gymnastic Rings",
    image: "assets/images/products/gymnastic-rings/cover.webp"
  },
  {
    id: "multi-rig",
    ar: "جهاز متعدد",
    en: "Multi Rig",
    image: "assets/images/products/multi-rig/cover.webp"
  },
  {
    id: "hand-gripper",
    ar: "هاند جريبر",
    en: "Hand Gripper",
    image: "assets/images/products/hand-gripper/cover.webp"
  }
];

function wathbaMenuProductName(item) {
  return wathbaGetLang() === "ar" ? item.ar : item.en;
}

function wathbaProductUrl(id) {
  return `product.html?id=${id}`;
}

function wathbaGetLang() {
  return localStorage.getItem("wathbaLang") || "ar";
}

function wathbaT(key) {
  const lang = wathbaGetLang();
  return WATHBA_SHARED_TRANSLATIONS[lang][key] || WATHBA_SHARED_TRANSLATIONS.en[key] || key;
}

function wathbaWhatsappUrl(message) {
  return `https://wa.me/${WATHBA_SHARED_PHONE}?text=${encodeURIComponent(message)}`;
}

function wathbaEnsureSharedShell() {
  if (!document.querySelector(".wathba-top-tools")) {
    document.body.insertAdjacentHTML(
      "afterbegin",
      `
        <div class="wathba-top-tools">
          <button class="wathba-lang-btn" type="button">AR</button>
          <button class="wathba-menu-toggle" type="button" aria-label="Open menu">
            <span class="material-symbols-outlined">menu</span>
          </button>
        </div>
      `
    );
  }

  if (!document.getElementById("wathbaMobileMenu")) {
    document.body.insertAdjacentHTML(
      "afterbegin",
      `<div class="wathba-mobile-menu" id="wathbaMobileMenu"></div>`
    );
  }

  if (!document.getElementById("sharedWhatsApp")) {
    document.body.insertAdjacentHTML("beforeend", `<div id="sharedWhatsApp"></div>`);
  }
}

function wathbaApplyLanguage(lang) {
  localStorage.setItem("wathbaLang", lang);

  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

  if (document.body) {
    document.body.dir = lang === "ar" ? "rtl" : "ltr";
  }
  document.documentElement.dataset.wathbaLang = lang;

  const langButton = document.querySelector(".wathba-lang-btn");
  if (langButton) {
    langButton.textContent = lang === "ar" ? "EN" : "AR";
  }

  wathbaRenderMobileMenu();
  wathbaRenderWhatsappWidget();
  wathbaRenderFooter();
  wathbaRenderDesktopMegaMenu();
  wathbaTranslateDesktopNav();
  wathbaNormalizeLinks();
  wathbaSetActiveLinks();
  wathbaNormalizeLogo();
  document.documentElement.classList.remove("wathba-ui-loading");
  document.documentElement.classList.add("wathba-ui-ready");

  document.dispatchEvent(
    new CustomEvent("wathba:langchange", {
      detail: { lang }
    })
  );
}

function wathbaRenderMobileMenu() {
  const menu = document.getElementById("wathbaMobileMenu");
  if (!menu) return;

  const lang = wathbaGetLang();

  menu.innerHTML = `
    <div class="wathba-mobile-menu-head">
      <a href="index.html" data-page="index">${wathbaT("navHome")}</a>
      <a href="products.html" data-page="products">${wathbaT("navProducts")}</a>
      <a href="about.html" data-page="about">${wathbaT("navAbout")}</a>
      <a href="contact.html" data-page="contact">${wathbaT("navContact")}</a>
    </div>

    <div class="wathba-mobile-products-block">
      <div class="wathba-mobile-products-title">
        ${lang === "ar" ? "المنتجات" : "Products"}
      </div>

      <div class="wathba-mobile-products-grid">
        <a href="products.html" class="wathba-mobile-product-item">
          <span class="wathba-mobile-product-img wathba-mobile-all-products">
            <span class="material-symbols-outlined">apps</span>
          </span>
          <span>${lang === "ar" ? "كل المنتجات" : "All Products"}</span>
        </a>

        ${WATHBA_MENU_PRODUCTS.map((item) => `
          <a href="${wathbaProductUrl(item.id)}" class="wathba-mobile-product-item">
            <span class="wathba-mobile-product-img">
              <img src="${item.image}" alt="${wathbaMenuProductName(item)}" loading="lazy" />
            </span>
            <span>${wathbaMenuProductName(item)}</span>
          </a>
        `).join("")}
      </div>
    </div>

    <div class="wathba-mobile-menu-bottom">
      <a href="${wathbaWhatsappUrl(wathbaT("whatsappMessage"))}" target="_blank" rel="noopener noreferrer">
        ${lang === "ar" ? "اطلب عبر واتساب" : "Order via WhatsApp"}
      </a>
    </div>
  `;
}

function wathbaRenderWhatsappWidget() {
  const host = document.getElementById("sharedWhatsApp");
  if (!host) return;

  host.innerHTML = `
    <div class="whatsapp-widget">
      <div class="whatsapp-label">${wathbaT("whatsappLabel")}</div>
      <a href="${wathbaWhatsappUrl(wathbaT("whatsappMessage"))}"
         class="whatsapp-float"
         target="_blank"
         rel="noopener noreferrer"
         aria-label="WhatsApp">
        <span class="whatsapp-pulse"></span>
        ${WATHBA_WA_SVG}
      </a>
    </div>
  `;
}

function wathbaRenderDesktopMegaMenu() {
  if (window.innerWidth < 1024) return;
  if (document.getElementById("wathbaDesktopMegaMenu")) return;

  const lang = wathbaGetLang();
  const productsLabel = wathbaT("navProducts");

  document.body.insertAdjacentHTML(
    "beforeend",
    `
      <div class="wathba-desktop-mega-menu" id="wathbaDesktopMegaMenu">
        <div class="wathba-mega-inner">
          <div class="wathba-mega-column">
            <span class="wathba-mega-title">${productsLabel}</span>
            <a href="products.html">${lang === "ar" ? "كل المنتجات" : "All Products"}</a>
            ${WATHBA_MENU_PRODUCTS.slice(0, 6).map((item) => `
              <a href="${wathbaProductUrl(item.id)}">${wathbaMenuProductName(item)}</a>
            `).join("")}
          </div>

          <div class="wathba-mega-column">
            <span class="wathba-mega-title">${lang === "ar" ? "الأكثر طلبًا" : "Featured"}</span>
            ${WATHBA_MENU_PRODUCTS.slice(6).map((item) => `
              <a href="${wathbaProductUrl(item.id)}">${wathbaMenuProductName(item)}</a>
            `).join("")}
            <a href="products.html">${lang === "ar" ? "المزيد من المنتجات" : "More Equipment"}</a>
          </div>

          <div class="wathba-mega-feature-grid">
            ${WATHBA_MENU_PRODUCTS.slice(0, 3).map((item) => `
              <a href="${wathbaProductUrl(item.id)}" class="wathba-mega-feature-card">
                <img src="${item.image}" alt="${wathbaMenuProductName(item)}" loading="lazy" />
                <span>${wathbaMenuProductName(item)}</span>
                <p>${lang === "ar" ? "تصفّح المنتج والتفاصيل" : "View product details"}</p>
              </a>
            `).join("")}
          </div>
        </div>
      </div>
    `
  );

  const megaMenu = document.getElementById("wathbaDesktopMegaMenu");

  document.querySelectorAll('nav a[href="products.html"], header a[href="products.html"]').forEach((link) => {
    if (link.dataset.wathbaLogo === "true") return;

    link.classList.add("wathba-products-trigger");

    link.addEventListener("mouseenter", () => {
      megaMenu.classList.add("open");
    });

    link.addEventListener("focus", () => {
      megaMenu.classList.add("open");
    });
  });

  megaMenu.addEventListener("mouseenter", () => {
    megaMenu.classList.add("open");
  });

  megaMenu.addEventListener("mouseleave", () => {
    megaMenu.classList.remove("open");
  });

  document.addEventListener("mousemove", (event) => {
    const isOnProductsLink = event.target.closest(".wathba-products-trigger");
    const isOnMega = event.target.closest("#wathbaDesktopMegaMenu");

    if (!isOnProductsLink && !isOnMega) {
      megaMenu.classList.remove("open");
    }
  });
}

function wathbaRenderFooter() {
  const footerHost = document.getElementById("wathbaFooter");
  if (!footerHost) return;

  footerHost.innerHTML = `
    <footer class="wathba-site-footer">
      <div class="wathba-site-footer-grid">
        <div class="wathba-footer-brand">
          <h3 class="wathba-footer-logo">WATHBA</h3>
          <p class="wathba-footer-text">${wathbaT("footerText")}</p>

          <a
            href="${wathbaWhatsappUrl(wathbaT("whatsappMessage"))}"
            target="_blank"
            rel="noopener noreferrer"
            class="wathba-footer-whatsapp"
          >
            <span class="wathba-footer-wa-svg">${WATHBA_WA_SVG}</span>
            ${wathbaT("orderWhatsapp")}
          </a>
        </div>

        <div class="wathba-footer-col">
          <h5 class="wathba-footer-title">${wathbaT("pagesTitle")}</h5>
          <ul class="wathba-footer-list">
            <li><a href="index.html">${wathbaT("navHome")}</a></li>
            <li><a href="products.html">${wathbaT("navProducts")}</a></li>
            <li><a href="about.html">${wathbaT("navAbout")}</a></li>
            <li><a href="contact.html">${wathbaT("navContact")}</a></li>
          </ul>
        </div>

        <div class="wathba-footer-col">
          <h5 class="wathba-footer-title">${wathbaT("equipmentTitle")}</h5>
          <ul class="wathba-footer-list">
            <li><a href="product.html?id=pull-up-bar">${wathbaT("pullUp")}</a></li>
            <li><a href="product.html?id=wooden-parallettes-medium">${wathbaT("parallettes")}</a></li>
            <li><a href="product.html?id=dip-bars">${wathbaT("dipBars")}</a></li>
            <li><a href="product.html?id=gymnastic-rings">${wathbaT("rings")}</a></li>
          </ul>
        </div>

        <div class="wathba-footer-contact">
          <h5 class="wathba-footer-title">${wathbaT("contactTitle")}</h5>
          <p>${wathbaT("footerLocation")}</p>
          <p>${wathbaT("footerPhone")}</p>
          <p>${wathbaT("footerNote")}</p>
        </div>

        <div class="wathba-footer-bottom">
          <p>${wathbaT("copyright")}</p>
        </div>
      </div>
    </footer>
  `;
}
function wathbaTranslateDesktopNav() {
  const navMap = {
    "index.html": wathbaT("navHome"),
    "products.html": wathbaT("navProducts"),
    "about.html": wathbaT("navAbout"),
    "contact.html": wathbaT("navContact")
  };

  document.querySelectorAll("nav a, header a").forEach((link) => {
    if (link.dataset.wathbaLogo === "true") return;
    if (link.classList.contains("wathba-logo")) return;
    if (link.classList.contains("wathba-nav-logo")) return;

    const href = link.getAttribute("href") || "";
    const page = href.split("?")[0];

    if (navMap[page]) {
      link.textContent = navMap[page];
    }
  });

  wathbaNormalizeLogo();
}
function wathbaSetActiveLinks() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  let normalizedPath = path === "" ? "index.html" : path;

  /*
    صفحة تفاصيل المنتج product.html تعتبر من قسم المنتجات
    عشان يظل رابط المنتجات هو النشط.
  */
  if (normalizedPath === "product.html") {
    normalizedPath = "products.html";
  }

  document.querySelectorAll("nav a, header a, .wathba-mobile-menu a").forEach((link) => {
    if (link.classList.contains("wathba-logo")) return;

    const href = link.getAttribute("href") || "";
    let linkPage = href.split("?")[0];

    link.classList.toggle("active", linkPage === normalizedPath);
  });
}

function wathbaNormalizeLogo() {
  document.querySelectorAll("[data-wathba-logo='true'], .wathba-nav-logo, .wathba-logo").forEach((logo) => {
    const insideNav = logo.closest("nav, header");

    if (!insideNav) return;

    logo.textContent = "WATHBA";
    logo.classList.add("wathba-logo", "wathba-nav-logo");
    logo.dataset.wathbaLogo = "true";

    if (logo.tagName.toLowerCase() === "a") {
      logo.setAttribute("href", "index.html");
    }
  });
}

function wathbaNormalizeLinks() {
  document.querySelectorAll('a[href="#"]').forEach((link) => {
    const text = link.textContent.toLowerCase();

    if (
      text.includes("whatsapp") ||
      text.includes("order") ||
      text.includes("chat") ||
      text.includes("واتساب") ||
      text.includes("اطلب")
    ) {
      link.href = wathbaWhatsappUrl(wathbaT("whatsappMessage"));
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }

    if (
      text.includes("browse products") ||
      text.includes("explore products") ||
      text.includes("products") ||
      text.includes("المنتجات")
    ) {
      link.href = "products.html";
    }
  });

  document.querySelectorAll('a[href*="wa.me"]').forEach((link) => {
    if (link.dataset.wathbaLogo === "true") return;
    if (link.classList.contains("wathba-logo")) return;
    if (link.classList.contains("wathba-nav-logo")) return;
    const hasQuery = link.href.includes("?text=");
    if (!hasQuery) {
      link.href = wathbaWhatsappUrl(wathbaT("whatsappMessage"));
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
  });
}

function wathbaBindEvents() {
  document.addEventListener("click", (event) => {
    const langButton = event.target.closest(".wathba-lang-btn");
    const menuButton = event.target.closest(".wathba-menu-toggle");
    const mobileMenuLink = event.target.closest(".wathba-mobile-menu a");

    if (langButton) {
      const nextLang = wathbaGetLang() === "en" ? "ar" : "en";
      wathbaApplyLanguage(nextLang);
    }

    if (menuButton) {
      const menu = document.getElementById("wathbaMobileMenu");
      if (menu) {
        menu.classList.toggle("open");
      }
    }

    if (mobileMenuLink) {
      const menu = document.getElementById("wathbaMobileMenu");
      if (menu) {
        menu.classList.remove("open");
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  wathbaEnsureSharedShell();
  wathbaNormalizeLogo();
  wathbaBindEvents();
  wathbaApplyLanguage(wathbaGetLang());
});

/* WATHBA CART PATCH */
(function () {
  const CART_KEY = "wathbaCartItems";
  const PHONE = WATHBA_SHARED_PHONE;
  let cartNotesDraft = "";

  function lang() {
    return localStorage.getItem("wathbaLang") || "ar";
  }

  function txt(ar, en) {
    return lang() === "ar" ? ar : en;
  }

  function readCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    } catch {
      return [];
    }
  }

  function saveCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    updateCount();
    renderCart();
  }

  function itemName(value) {
    if (!value) return "";
    if (typeof value === "string") return value;
    return value[lang()] || value.en || value.ar || "";
  }

  function priceText(product) {
    if (typeof getProductPriceText === "function") {
      return getProductPriceText(product, lang());
    }

    if (product.price) return `${product.price} JOD`;

    return product.priceLabel?.[lang()] || txt("اسأل عن السعر", "Ask for price");
  }

  function cartCount() {
    return readCart().reduce((sum, item) => sum + Number(item.qty || 1), 0);
  }

  function updateCount() {
    document.querySelectorAll(".wathba-cart-count").forEach((badge) => {
      badge.textContent = cartCount();
    });
  }
  function showCartAddFeedback(quantity = 1) {
    const toggle = document.querySelector(".wathba-cart-toggle");
    const badge = document.querySelector(".wathba-cart-count");

    if (toggle) {
      toggle.classList.remove("wathba-cart-bump");
      void toggle.offsetWidth;
      toggle.classList.add("wathba-cart-bump");

      setTimeout(() => {
        toggle.classList.remove("wathba-cart-bump");
      }, 700);
    }

    if (badge) {
      badge.classList.remove("wathba-cart-count-pop");
      void badge.offsetWidth;
      badge.classList.add("wathba-cart-count-pop");

      setTimeout(() => {
        badge.classList.remove("wathba-cart-count-pop");
      }, 700);
    }

    const bubble = document.createElement("div");
    bubble.className = "wathba-cart-added-bubble";
    bubble.textContent = txt(`+${quantity} تمت الإضافة`, `+${quantity} Added`);

    if (toggle) {
      const rect = toggle.getBoundingClientRect();
      bubble.style.top = `${rect.bottom + 10}px`;
      bubble.style.left = `${rect.left + rect.width / 2}px`;
    } else {
      bubble.style.top = "82px";
      bubble.style.right = "24px";
    }

    document.body.appendChild(bubble);

    setTimeout(() => {
      bubble.remove();
    }, 1100);
  }
  function ensureCartShell() {
    const tools = document.querySelector(".wathba-top-tools");

    if (tools && !tools.querySelector(".wathba-cart-toggle")) {
      const menuButton = tools.querySelector(".wathba-menu-toggle");

      const button = document.createElement("button");
      button.className = "wathba-cart-toggle";
      button.type = "button";
      button.innerHTML = `
        <span class="material-symbols-outlined">shopping_bag</span>
        <span class="wathba-cart-count">0</span>
      `;

      if (menuButton) {
        tools.insertBefore(button, menuButton);
      } else {
        tools.appendChild(button);
      }
    }

    if (!document.getElementById("wathbaCartDrawer")) {
      document.body.insertAdjacentHTML(
        "beforeend",
        `<div class="wathba-cart-drawer" id="wathbaCartDrawer"></div>`
      );
    }

    updateCount();
  }

  function addProduct(product, selectedVariant = null, quantity = 1, options = {}) {
    if (!product || !product.id) return;

    const variantKey = selectedVariant ? selectedVariant.en || selectedVariant.ar : "default";
    const key = `${product.id}__${variantKey}`;
    const items = readCart();
    const existing = items.find((item) => item.key === key);

    if (existing) {
      existing.qty += quantity;
    } else {
      items.push({
        key,
        id: product.id,
        name: product.name,
        category: product.category,
        price: {
          ar: typeof getProductPriceText === "function" ? getProductPriceText(product, "ar") : priceText(product),
          en: typeof getProductPriceText === "function" ? getProductPriceText(product, "en") : priceText(product)
        },
        variant: selectedVariant
          ? {
            ar: selectedVariant.ar || selectedVariant.en,
            en: selectedVariant.en || selectedVariant.ar
          }
          : null,
        qty: quantity
      });
    }

    saveCart(items);
    showCartAddFeedback(quantity);
  }

  function removeItem(key) {
    saveCart(readCart().filter((item) => item.key !== key));
  }

  function changeQty(key, amount) {
    const items = readCart();
    const item = items.find((x) => x.key === key);

    if (!item) return;

    item.qty = Math.max(1, Number(item.qty || 1) + amount);
    saveCart(items);
  }

  function clearCart() {
    cartNotesDraft = "";
    saveCart([]);
  }

  function orderCart() {
    const items = readCart();
    if (!items.length) return;

    const notesElement = document.getElementById("wathbaCartNotes");

    if (notesElement) {
      cartNotesDraft = notesElement.value;
    }

    const notes = cartNotesDraft.trim();

    const lines = items.map((item, index) => {
      const variant = item.variant ? itemName(item.variant) : "";

      if (lang() === "ar") {
        return `${index + 1}. المنتج: ${itemName(item.name)}
${variant ? `النوع / القياس: ${variant}\n` : ""}التصنيف: ${itemName(item.category)}
السعر: ${itemName(item.price)}
الكمية: ${item.qty}`;
      }

      return `${index + 1}. Product: ${itemName(item.name)}
${variant ? `Size / Type: ${variant}\n` : ""}Category: ${itemName(item.category)}
Price: ${itemName(item.price)}
Quantity: ${item.qty}`;
    });

    const message =
      lang() === "ar"
        ? `مرحبا WATHBA، أريد طلب المنتجات التالية:\n\n${lines.join("\n\n")}\n\n${notes ? `ملاحظات: ${notes}\n\n` : ""}هل المنتجات متوفرة؟`
        : `Hello WATHBA, I want to order these products:\n\n${lines.join("\n\n")}\n\n${notes ? `Notes: ${notes}\n\n` : ""}Are these products available?`;

    window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`, "_blank");
  }

  function renderCart() {
    const drawer = document.getElementById("wathbaCartDrawer");
    if (!drawer) return;

    const items = readCart();
    const totalQty = cartCount();
    const uniqueCount = items.length;

    const body = items.length
      ? items
        .map((item, index) => {
          const variantText = item.variant ? itemName(item.variant) : "";
          const itemCategory = itemName(item.category);
          const itemPrice = itemName(item.price);

          return `
            <article class="wathba-cart-item" data-cart-key="${item.key}">
              <div class="wathba-cart-item-top">
                <div class="wathba-cart-item-index">${index + 1}</div>

                <div class="wathba-cart-item-info">
                  <h4>${itemName(item.name)}</h4>

                  <p>
                    ${itemCategory}
                    ${variantText ? `<span>•</span> ${variantText}` : ""}
                  </p>
                </div>

                <button
                  class="wathba-cart-remove"
                  type="button"
                  data-cart-remove
                  aria-label="${txt("حذف المنتج", "Remove item")}"
                >
                  <span class="material-symbols-outlined">close</span>
                </button>
              </div>

              <div class="wathba-cart-item-bottom">
                <strong>${itemPrice}</strong>

                <div class="wathba-cart-stepper" aria-label="${txt("تغيير الكمية", "Change quantity")}">
                  <button type="button" data-cart-minus aria-label="${txt("تقليل", "Decrease")}">
                    <span class="material-symbols-outlined">remove</span>
                  </button>

                  <b>${item.qty}</b>

                  <button type="button" data-cart-plus aria-label="${txt("زيادة", "Increase")}">
                    <span class="material-symbols-outlined">add</span>
                  </button>
                </div>
              </div>
            </article>
          `;
        })
        .join("")
      : `
      <div class="wathba-cart-empty">
        <span class="material-symbols-outlined">shopping_bag</span>
        <h4>${txt("السلة فارغة", "Your cart is empty")}</h4>
        <p>${txt("أضف المنتجات التي تريدها، ثم اطلبها كلها برسالة واتساب واحدة.", "Add products, then order everything in one WhatsApp message.")}</p>
      </div>
    `;

    drawer.innerHTML = `
    <div class="wathba-cart-backdrop" data-cart-close></div>

    <aside class="wathba-cart-panel" aria-label="${txt("سلة الطلبات", "Shopping cart")}">
      <div class="wathba-cart-header">
        <div>
          <strong>WATHBA</strong>
          <h3>${txt("سلة الطلبات", "Your Cart")}</h3>

          <p>
            ${totalQty} ${txt("قطعة", "items")}
            ${uniqueCount ? ` • ${uniqueCount} ${txt("منتج", "products")}` : ""}
          </p>
        </div>

        <button class="wathba-cart-close" type="button" data-cart-close aria-label="${txt("إغلاق السلة", "Close cart")}">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <div class="wathba-cart-body">
        ${body}
      </div>

      <div class="wathba-cart-footer">
        <button class="wathba-cart-notes-toggle" type="button" data-cart-notes-toggle>
          <span class="material-symbols-outlined">edit_note</span>
          ${txt("إضافة ملاحظات / قياسات", "Add notes / sizes")}
        </button>

        <div class="wathba-cart-notes ${cartNotesDraft ? "open" : ""}">
          <textarea
            id="wathbaCartNotes"
            rows="3"
            placeholder="${txt("مثال: اللون، القياس، عنوان التوصيل، أو أي ملاحظة...", "Example: color, size, delivery address, or any note...")}"
          >${cartNotesDraft}</textarea>
        </div>

        <div class="wathba-cart-summary">
          <span>${txt("الإجمالي", "Summary")}</span>
          <strong>${totalQty} ${txt("قطعة", "items")}</strong>
        </div>

        <button class="wathba-cart-order" type="button" data-cart-order ${items.length ? "" : "disabled"}>
          <span class="material-symbols-outlined">send</span>
          ${txt("اطلب الآن عبر واتساب", "Order now on WhatsApp")}
        </button>

        <button class="wathba-cart-clear" type="button" data-cart-clear ${items.length ? "" : "disabled"}>
          ${txt("تفريغ السلة", "Clear cart")}
        </button>
      </div>
    </aside>
  `;
  }

  function openCart() {
    ensureCartShell();
    renderCart();
    document.getElementById("wathbaCartDrawer")?.classList.add("open");
  }

  function closeCart() {
    document.getElementById("wathbaCartDrawer")?.classList.remove("open");
  }

  document.addEventListener("click", function (event) {
    if (event.target.closest(".wathba-cart-toggle")) {
      openCart();
    }

    if (event.target.closest("[data-cart-close]")) {
      closeCart();
    }

    if (event.target.closest("[data-cart-order]")) {
      orderCart();
    }

    if (event.target.closest("[data-cart-clear]")) {
      clearCart();
    }
    const notesToggle = event.target.closest("[data-cart-notes-toggle]");

    if (notesToggle) {
      document.querySelector(".wathba-cart-notes")?.classList.toggle("open");
    }
    const cartItem = event.target.closest(".wathba-cart-item");

    if (cartItem && event.target.closest("[data-cart-plus]")) {
      changeQty(cartItem.dataset.cartKey, 1);
    }

    if (cartItem && event.target.closest("[data-cart-minus]")) {
      changeQty(cartItem.dataset.cartKey, -1);
    }

    if (cartItem && event.target.closest("[data-cart-remove]")) {
      removeItem(cartItem.dataset.cartKey);
    }
  });

  document.addEventListener("input", function (event) {
    const notes = event.target.closest("#wathbaCartNotes");

    if (notes) {
      cartNotesDraft = notes.value;
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    setTimeout(ensureCartShell, 100);
    setTimeout(renderCart, 120);
  });

  document.addEventListener("wathba:langchange", function () {
    setTimeout(function () {
      ensureCartShell();
      renderCart();
    }, 100);
  });

  window.WathbaCart = {
    addProduct,
    open: openCart,
    clear: clearCart,
    getItems: readCart
  };
})();