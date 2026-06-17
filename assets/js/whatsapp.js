const WHATSAPP_NUMBER = "962791752349";

function openWhatsApp(product) {
    const lang = localStorage.getItem("wathbaLang") || "ar";

    const message =
        lang === "ar"
            ? `مرحبا، أريد طلب المنتج التالي:

اسم المنتج: ${product.name.ar}
السعر: ${product.price} دينار
التصنيف: ${product.category.ar}

هل المنتج متوفر؟`
            : `Hello, I want to order this product:

Product: ${product.name.en}
Price: ${product.price} JOD
Category: ${product.category.en}

Is it available?`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
}