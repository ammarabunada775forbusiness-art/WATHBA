const featuredContainer = document.getElementById("featuredProducts");

if (featuredContainer) {
    const featuredProducts = products.slice(0, 6);

    featuredContainer.innerHTML = featuredProducts.map(product => `
    <div class="product-card">
      <div class="product-image-box">
        <img 
          src="${product.image}" 
          alt="${product.name}"
          onerror="this.style.display='none'; this.parentElement.classList.add('no-image');"
        >
        <span>${product.badge}</span>
      </div>

      <div class="product-info">
        <p class="category">${product.category}</p>
        <h3>${product.name}</h3>
        <p class="desc">${product.description}</p>

        <div class="product-bottom">
          <strong>${product.price} JOD</strong>
          <button onclick='openWhatsApp(${JSON.stringify(product)})'>
            اطلب عبر واتساب
          </button>
        </div>
      </div>
    </div>
  `).join("");
}