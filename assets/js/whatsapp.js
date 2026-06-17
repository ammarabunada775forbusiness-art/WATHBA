const WHATSAPP_NUMBER = "9627XXXXXXXX";

function openWhatsApp(product) {
    const message = `
مرحبا، أريد طلب هذا المنتج:

اسم المنتج: ${product.name}
السعر: ${product.price} دينار
التصنيف: ${product.category}

هل المنتج متوفر؟
`;

    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    window.open(url, "_blank");
}