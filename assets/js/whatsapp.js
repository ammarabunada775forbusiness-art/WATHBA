const WHATSAPP_NUMBER = "962791752349";

function openWhatsApp(product, selectedVariant = null) {
    const lang = localStorage.getItem("wathbaLang") || "ar";

    const productName = product.name[lang];
    const categoryName = product.category[lang];
    const priceText = getProductPriceText(product, lang);

    const variantText = selectedVariant
        ? lang === "ar"
            ? `\nالقياس / النوع: ${selectedVariant.ar}`
            : `\nSize / Type: ${selectedVariant.en}`
        : "";

    const message =
        lang === "ar"
            ? `مرحبا، أريد طلب المنتج التالي:

اسم المنتج: ${productName}${variantText}
السعر: ${priceText}
التصنيف: ${categoryName}

هل المنتج متوفر؟`
            : `Hello, I want to order this product:

Product: ${productName}${variantText}
Price: ${priceText}
Category: ${categoryName}

Is it available?`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
}