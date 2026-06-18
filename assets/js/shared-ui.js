const WATHBA_SHARED_PHONE = "962791752349";

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
    noCheckout: "No cart. No checkout. WhatsApp ordering only.",
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
    noCheckout: "لا يوجد سلة أو دفع إلكتروني. الطلب فقط عبر واتساب.",
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

function wathbaGetLang() {
  return localStorage.getItem("wathbaLang") || "en";
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
  document.documentElement.dir = "ltr";
  document.documentElement.dataset.wathbaLang = lang;

  const langButton = document.querySelector(".wathba-lang-btn");
  if (langButton) {
    langButton.textContent = lang === "ar" ? "EN" : "AR";
  }

  wathbaRenderMobileMenu();
  wathbaTranslateDesktopNav();
  wathbaRenderWhatsappWidget();
  wathbaRenderFooter();
  wathbaNormalizeLinks();
  wathbaNormalizeLogo();
  wathbaSetActiveLinks();

  document.dispatchEvent(
    new CustomEvent("wathba:langchange", {
      detail: { lang }
    })
  );
}

function wathbaRenderMobileMenu() {
  const menu = document.getElementById("wathbaMobileMenu");
  if (!menu) return;

  menu.innerHTML = `
    <a href="index.html" data-page="index">${wathbaT("navHome")}</a>
    <a href="products.html" data-page="products">${wathbaT("navProducts")}</a>
    <a href="about.html" data-page="about">${wathbaT("navAbout")}</a>
    <a href="contact.html" data-page="contact">${wathbaT("navContact")}</a>
  `;
}

function wathbaTranslateDesktopNav() {
  const map = {
    "index.html": "navHome",
    "products.html": "navProducts",
    "about.html": "navAbout",
    "contact.html": "navContact"
  };

  document.querySelectorAll("nav a, header a").forEach((link) => {
    const href = (link.getAttribute("href") || "").split("?")[0];
    if (map[href]) {
      link.textContent = wathbaT(map[href]);
    }
  });
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
            <li><a href="product.html?id=wooden-parallettes">${wathbaT("parallettes")}</a></li>
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
          <p>${wathbaT("noCheckout")}</p>
        </div>
      </div>
    </footer>
  `;
}

function wathbaSetActiveLinks() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  const normalizedPath = path === "" ? "index.html" : path;

  document.querySelectorAll("nav a, header a, .wathba-mobile-menu a").forEach((link) => {
    const href = link.getAttribute("href") || "";
    const linkPage = href.split("?")[0];

    link.classList.toggle("active", linkPage === normalizedPath);
  });
}

function wathbaNormalizeLogo() {
  const logoCandidates = document.querySelectorAll(
    "nav .font-headline-md, header .font-headline-md, nav a[href='#'], header a[href='#']"
  );

  logoCandidates.forEach((logo) => {
    const text = logo.textContent.trim().toLowerCase();

    if (text === "wathba" || text === "وثبة") {
      logo.textContent = "WATHBA";
      logo.classList.add("wathba-logo");

      if (logo.tagName.toLowerCase() === "a") {
        logo.href = "index.html";
      }
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
