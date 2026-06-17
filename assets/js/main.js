let currentLang = localStorage.getItem("wathbaLang") || "ar";
let currentTheme = localStorage.getItem("wathbaTheme") || "dark";

const html = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const langToggle = document.getElementById("langToggle");
const featuredContainer = document.getElementById("featuredProducts");
const heroProduct = document.getElementById("heroProduct");

function applyLanguage() {
  const t = translations[currentLang];

  html.lang = currentLang;
  html.dir = currentLang === "ar" ? "rtl" : "ltr";

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (t && t[key]) {
      element.textContent = t[key];
    }
  });

  if (langToggle) {
    langToggle.textContent = currentLang === "ar" ? "EN" : "AR";
  }

  renderFeaturedProducts();
}

function applyTheme() {
  document.body.dataset.theme = currentTheme;

  if (themeToggle) {
    themeToggle.innerHTML =
      currentTheme === "dark"
        ? '<span class="material-symbols-outlined">light_mode</span>'
        : '<span class="material-symbols-outlined">dark_mode</span>';
  }
}

function getVariantsPreview(product) {
  if (!product.variants || product.variants.length === 0) {
    return "";
  }

  const title = currentLang === "ar" ? "القياسات / الأنواع" : "Sizes / Types";

  return `
    <div class="variants-preview">
      <div>
        <small>${title}</small>
        <div class="variant-chips">
          ${product.variants
      .map((variant) => `<span>${variant[currentLang]}</span>`)
      .join("")}
        </div>
      </div>
    </div>
  `;
}

function renderFeaturedProducts() {
  if (!featuredContainer) return;

  const selectedProducts = products.slice(0, 6);

  featuredContainer.innerHTML = selectedProducts
    .map((product) => {
      return `
        <article class="product-card">
          <a href="product.html?id=${product.id}" class="product-image-box">
            <img
              src="${product.image}"
              alt="${product.name[currentLang]}"
              onerror="this.style.display='none'; this.parentElement.classList.add('no-image');"
            >
            ${getVariantsPreview(product)}
          </a>

          <div class="product-info">
            <p class="category">${product.category[currentLang]}</p>
            <h3>${product.name[currentLang]}</h3>
            <p class="desc">${product.description[currentLang]}</p>

            <div class="product-bottom">
              <strong>${getProductPriceText(product, currentLang)}</strong>
              <button onclick='openWhatsApp(${JSON.stringify(product)})'>
                ${currentLang === "ar" ? "اطلب" : "Order"}
              </button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    localStorage.setItem("wathbaTheme", currentTheme);
    applyTheme();
  });
}

if (langToggle) {
  langToggle.addEventListener("click", () => {
    currentLang = currentLang === "ar" ? "en" : "ar";
    localStorage.setItem("wathbaLang", currentLang);
    applyLanguage();
  });
}

if (heroProduct) {
  window.addEventListener("mousemove", (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 18;
    heroProduct.style.transform = `rotateY(${x}deg)`;
  });
}

applyTheme();
applyLanguage();