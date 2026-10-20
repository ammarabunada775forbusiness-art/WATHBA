/* Shared navigation, accessible dialogs and WhatsApp cart. Static HTML stays visible. */
(function () {
  "use strict";
  const { escape: esc, icon, pageUrl } = window.WathbaUI;
  const locale = document.documentElement.lang === "en" ? "en" : "ar";
  const t = (ar, en) => locale === "ar" ? ar : en;
  const phone = window.WATHBA_CONFIG?.whatsappNumber || "962791752349";
  const catalog = window.WATHBA_PRODUCTS || [];
  const CART_KEY = "wathbaCartItems";
  const NOTES_KEY = "wathbaCartNotes";
  const drawer = document.getElementById("wathbaCartDrawer");
  const menu = document.getElementById("wathbaMobileMenu");
  let lastCartFocus = null;
  let notesDraft = "";
  let toastTimer;
  try {
    if (!window.location.pathname.endsWith("/product.html")) localStorage.setItem("wathbaLang", locale);
    notesDraft = sessionStorage.getItem(NOTES_KEY) || "";
  } catch {}

  const text = (value) => typeof value === "string" ? value : value?.[locale] || value?.en || value?.ar || "";
  function readCart() {
    try {
      const parsed = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(item => item && typeof item.key === "string" && catalog.some(p => p.id === item.id))
        .map(item => ({ ...item, qty: Math.min(999, Math.max(1, parseInt(item.qty, 10) || 1)) }));
    } catch { return []; }
  }
  function count() { return readCart().reduce((total, item) => total + item.qty, 0); }
  function updateCount() {
    document.querySelectorAll(".wathba-cart-count").forEach(badge => { badge.textContent = count(); });
    document.querySelectorAll(".wathba-cart-toggle").forEach(button => {
      button.setAttribute("aria-label", `${t("سلة الطلبات", "Order cart")} (${count()})`);
    });
  }
  function saveCart(items) {
    try { localStorage.setItem(CART_KEY, JSON.stringify(items)); }
    catch { showToast(t("تعذر حفظ السلة في هذا المتصفح؛ يمكنك الطلب مباشرة عبر واتساب.", "The cart could not be saved. Please use the direct WhatsApp link.")); return false; }
    updateCount();
    if (drawer && !drawer.hidden) renderCart();
    return true;
  }
  function showToast(message) {
    const toast = document.getElementById("wathbaToast");
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.hidden = false;
    toastTimer = setTimeout(() => { toast.hidden = true; }, 2300);
  }
  function addProduct(product, variant = null, quantity = 1) {
    if (!product || !catalog.some(p => p.id === product.id)) return false;
    const variants = product.variants || [];
    if (variants.length > 1 && !variant) {
      window.location.assign(getProductPageUrl(product.id, locale));
      return false;
    }
    variant = variant || variants[0] || null;
    const key = `${product.id}__${variant?.en || variant?.ar || "default"}`;
    const items = readCart();
    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    const existing = items.find(item => item.key === key);
    if (existing) existing.qty = Math.min(999, existing.qty + qty);
    else items.push({ key, id: product.id, name: product.name, category: product.category,
      price: { ar: getProductPriceText(product, "ar"), en: getProductPriceText(product, "en") },
      variant: variant ? { ar: variant.ar, en: variant.en } : null, qty: Math.min(999, qty) });
    if (!saveCart(items)) return false;
    showToast(t("تمت الإضافة إلى سلة الطلبات", "Added to your order cart"));
    return true;
  }
  function getOrderUrl() {
    const lines = readCart().map((item, i) => `${i + 1}. ${text(item.name)}${item.variant ? ` — ${text(item.variant)}` : ""}\n${t("الكمية", "Quantity")}: ${item.qty}\n${t("السعر", "Price")}: ${text(item.price)}`);
    const message = `${t("مرحبًا وثبة، أريد الاستفسار عن المنتجات التالية:", "Hello WATHBA, I would like to ask about these products:")}\n\n${lines.join("\n\n")}\n\n${notesDraft.trim() ? `${t("ملاحظات", "Notes")}: ${notesDraft.trim()}\n\n` : ""}${t("يرجى تأكيد التوفر والسعر النهائي وطريقة الاستلام.", "Please confirm availability, final price and delivery or collection details.")}`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }
  function renderCart() {
    if (!drawer) return;
    const items = readCart();
    const body = items.length ? items.map(item => `
      <article class="wathba-cart-item" data-cart-key="${esc(item.key)}">
        <div class="wathba-cart-item-top"><div><h3><a href="${getProductPageUrl(item.id, locale)}">${esc(text(item.name))}</a></h3><p>${esc(item.variant ? text(item.variant) : text(item.category))}</p></div>
        <button class="icon-button wathba-cart-remove" type="button" data-cart-remove aria-label="${esc(t("حذف", "Remove") + " " + text(item.name))}">${icon("close")}</button></div>
        <div class="wathba-cart-item-bottom"><strong>${esc(text(item.price))}</strong><div class="wathba-cart-stepper">
        <button class="icon-button" type="button" data-cart-minus aria-label="${t("تقليل الكمية", "Decrease quantity")}" ${item.qty <= 1 ? "disabled" : ""}>${icon("minus")}</button><b>${item.qty}</b><button class="icon-button" type="button" data-cart-plus aria-label="${t("زيادة الكمية", "Increase quantity")}" ${item.qty >= 999 ? "disabled" : ""}>${icon("plus")}</button></div></div>
      </article>`).join("") : `<div class="wathba-cart-empty">${icon("bag")}<h3>${t("ابدأ باختيار معدّتك", "Start with your equipment")}</h3><p>${t("اجمع القطع التي تحتاجها، ثم أرسل استفسارك برسالة واتساب واحدة.", "Choose your equipment and send one WhatsApp enquiry for the full order.")}</p><a class="site-button" href="${pageUrl("products", locale)}">${t("تصفح المعدات", "Browse equipment")}</a></div>`;
    drawer.innerHTML = `<div class="wathba-cart-backdrop" data-cart-close></div><aside class="wathba-cart-panel" role="dialog" aria-modal="true" aria-labelledby="cart-title" tabindex="-1">
      <div class="wathba-cart-header"><div><span class="site-eyebrow">WATHBA / ${t("الطلب", "Your order")}</span><h2 id="cart-title">${t("سلة الطلبات", "Your order cart")}</h2><p>${count()} ${t("قطعة · تأكيد التفاصيل عبر واتساب", "items · confirmed on WhatsApp")}</p></div><button type="button" class="icon-button" data-cart-close aria-label="${t("إغلاق السلة", "Close cart")}">${icon("close")}</button></div>
      <div class="wathba-cart-body">${body}</div>${items.length ? `<div class="wathba-cart-footer"><label for="wathbaCartNotes">${t("ملاحظات أو قياسات إضافية", "Notes or extra measurements")}</label><textarea id="wathbaCartNotes" rows="2" placeholder="${t("المساحة، القياس أو تفاصيل الاستلام…", "Space, size or collection details…")}">${esc(notesDraft)}</textarea><div class="wathba-cart-summary"><span>${t("التوفر والسعر النهائي", "Availability and final price")}</span><strong>${t("بالتواصل المباشر", "Confirmed directly")}</strong></div><a class="site-button primary wathba-cart-order" href="${esc(getOrderUrl())}" target="_blank" rel="noopener noreferrer" data-cart-order>${icon("whatsapp")}${t("أرسل الطلب عبر واتساب", "Send order on WhatsApp")}</a><button class="wathba-cart-clear" type="button" data-cart-clear>${t("تفريغ السلة", "Clear cart")}</button></div>` : ""}
      </aside>`;
    const notes = drawer.querySelector("#wathbaCartNotes");
    if (notes) notes.maxLength = 2000;
  }
  function setBackgroundInert(isOpen) {
    document.querySelectorAll("body > header, body > main, body > footer, #sharedWhatsApp").forEach(element => { element.inert = isOpen; });
  }
  function openCart() {
    if (!drawer) return;
    closeMenu();
    lastCartFocus = document.activeElement;
    renderCart(); drawer.hidden = false;
    document.body.classList.add("overlay-open");
    document.querySelector(".wathba-cart-toggle")?.setAttribute("aria-expanded", "true");
    setBackgroundInert(true);
    drawer.querySelector("[data-cart-close].icon-button")?.focus();
  }
  function closeCart() {
    if (!drawer || drawer.hidden) return;
    drawer.hidden = true; document.body.classList.remove("overlay-open");
    setBackgroundInert(false);
    document.querySelector(".wathba-cart-toggle")?.setAttribute("aria-expanded", "false");
    lastCartFocus?.focus();
  }
  function closeMenu(returnFocus = false) {
    if (!menu || menu.hidden) return;
    menu.hidden = true;
    const toggle = document.querySelector(".wathba-menu-toggle");
    toggle?.setAttribute("aria-expanded", "false");
    if (toggle) { toggle.setAttribute("aria-label", t("افتح القائمة", "Open menu")); toggle.innerHTML = icon("menu"); }
    if (returnFocus) toggle?.focus();
  }
  function openMenu() {
    if (!menu) return;
    if (drawer && !drawer.hidden) closeCart();
    menu.hidden = false;
    const toggle = document.querySelector(".wathba-menu-toggle");
    toggle?.setAttribute("aria-expanded", "true");
    if (toggle) { toggle.setAttribute("aria-label", t("أغلق القائمة", "Close menu")); toggle.innerHTML = icon("close"); }
    menu.querySelector("a")?.focus();
  }
  function clearCart() {
    notesDraft = "";
    try { sessionStorage.removeItem(NOTES_KEY); } catch {}
    saveCart([]);
    if (drawer && !drawer.hidden) drawer.querySelector("[data-cart-close].icon-button")?.focus();
  }

  document.addEventListener("click", event => {
    const languageLink = event.target.closest(".wathba-lang-btn");
    if (languageLink) {
      const destination = new URL(languageLink.href, window.location.href);
      destination.search = window.location.search;
      destination.hash = window.location.hash;
      languageLink.href = destination.href;
    }
    if (event.target.closest(".wathba-cart-toggle")) openCart();
    if (event.target.closest("[data-cart-close]")) closeCart();
    if (event.target.closest(".wathba-menu-toggle")) menu?.hidden ? openMenu() : closeMenu(true);
    else if (menu && !menu.hidden && !event.target.closest("#wathbaMobileMenu")) closeMenu();
    if (event.target.closest("[data-cart-clear]")) clearCart();
    const row = event.target.closest("[data-cart-key]");
    if (row) {
      const items = readCart(), key = row.dataset.cartKey;
      const action = event.target.closest("[data-cart-plus],[data-cart-minus],[data-cart-remove]");
      if (!action) return;
      const item = items.find(entry => entry.key === key);
      if (!item) return;
      const attr = action.hasAttribute("data-cart-plus") ? "data-cart-plus" : action.hasAttribute("data-cart-minus") ? "data-cart-minus" : "data-cart-remove";
      if (attr === "data-cart-remove") saveCart(items.filter(entry => entry.key !== key));
      else { item.qty = Math.min(999,Math.max(1,item.qty + (attr === "data-cart-plus" ? 1 : -1))); saveCart(items); }
      const currentRow = Array.from(drawer.querySelectorAll("[data-cart-key]")).find(entry => entry.dataset.cartKey === key);
      (currentRow?.querySelector(`[${attr}]:not(:disabled)`) || drawer.querySelector("[data-cart-close].icon-button"))?.focus();
    }
    const add = event.target.closest("[data-add-product]");
    if (add) {
      const product = catalog.find(p => p.id === add.dataset.addProduct);
      if (product) addProduct(product);
    }
  });
  document.addEventListener("input", event => {
    if (event.target.id === "wathbaCartNotes") {
      notesDraft = event.target.value;
      try { sessionStorage.setItem(NOTES_KEY, notesDraft); } catch {}
      const order = drawer?.querySelector("[data-cart-order]");
      if (order) order.href = getOrderUrl();
    }
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") { closeCart(); closeMenu(true); }
    if (event.key !== "Tab") return;
    const scope = drawer && !drawer.hidden ? drawer : menu && !menu.hidden ? menu : null;
    if (!scope) return;
    const focusable = Array.from(scope.querySelectorAll('a[href],button:not(:disabled),textarea,input')).filter(el => !el.hidden && el.offsetParent !== null);
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  });
  window.addEventListener("storage", event => {
    if (event.key === CART_KEY) { updateCount(); if (drawer && !drawer.hidden) renderCart(); }
  });
  window.addEventListener("pageshow", () => { closeMenu(); closeCart(); updateCount(); });
  updateCount();
  window.WathbaCart = { addProduct, open: openCart, clear: clearCart, getItems: readCart, getOrderUrl };
})();
