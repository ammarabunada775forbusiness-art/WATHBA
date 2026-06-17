let currentLang = localStorage.getItem("wathbaLang") || "ar";
let currentTheme = localStorage.getItem("wathbaTheme") || "light";
let currentFilter = "all";

const html = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const langToggle = document.getElementById("langToggle");
const filtersContainer = document.getElementById("categoryFilters");
const productsContainer = document.getElementById("allProducts");

function applyLanguage() {
    const t = translations[currentLang];

    html.lang = currentLang;
    html.dir = currentLang === "ar" ? "rtl" : "ltr";

    document.querySelectorAll("[data-i18n]").forEach((element) => {
        const key = element.dataset.i18n;

        if (t[key]) {
            element.textContent = t[key];
        }
    });

    if (langToggle) {
        langToggle.textContent = currentLang === "ar" ? "EN" : "AR";
    }

    renderFilters();
    renderProducts();
}

function applyTheme() {
    document.body.dataset.theme = currentTheme;

    if (themeToggle) {
        themeToggle.textContent = currentTheme === "dark" ? "☀️" : "🌙";
    }
}

function getCategories() {
    const categories = [];

    products.forEach((product) => {
        const exists = categories.find(
            (category) => category.key === product.category.en
        );

        if (!exists) {
            categories.push({
                key: product.category.en,
                ar: product.category.ar,
                en: product.category.en
            });
        }
    });

    return categories;
}

function renderFilters() {
    if (!filtersContainer) return;

    const categories = getCategories();

    const allText = currentLang === "ar" ? "الكل" : "All";

    filtersContainer.innerHTML = `
    <button 
      class="filter-btn ${currentFilter === "all" ? "active" : ""}" 
      onclick="setFilter('all')"
    >
      ${allText}
    </button>

    ${categories
            .map(
                (category) => `
          <button 
            class="filter-btn ${currentFilter === category.key ? "active" : ""}" 
            onclick="setFilter('${category.key}')"
          >
            ${category[currentLang]}
          </button>
        `
            )
            .join("")}
  `;
}

function setFilter(categoryKey) {
    currentFilter = categoryKey;
    renderFilters();
    renderProducts();
}

function getVariantsPreview(product) {
    if (!product.variants || product.variants.length === 0) {
        return "";
    }

    const title = currentLang === "ar" ? "القياسات / الأنواع" : "Sizes / Types";

    return `
    <div class="variants-preview">
      <small>${title}</small>
      <div class="variant-chips">
        ${product.variants
            .map((variant) => `<span>${variant[currentLang]}</span>`)
            .join("")}
      </div>
    </div>
  `;
}

function renderProducts() {
    if (!productsContainer) return;

    const filteredProducts =
        currentFilter === "all"
            ? products
            : products.filter((product) => product.category.en === currentFilter);

    productsContainer.innerHTML = filteredProducts
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
<strong>${getProductPriceText(product, currentLang)}</strong>              <button onclick='openWhatsApp(${JSON.stringify(product)})'>
                ${currentLang === "ar" ? "اطلب عبر واتساب" : "Order on WhatsApp"}
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
        currentTheme = currentTheme === "light" ? "dark" : "light";
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

applyTheme();
applyLanguage();