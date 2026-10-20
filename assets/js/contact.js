// Prepare a WhatsApp message; the visitor reviews and sends it in WhatsApp.
(function () {
  const form = document.getElementById("contactForm");
  if (!form) return;
  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const ar = document.documentElement.lang === "ar";
    const name = document.getElementById("contactName").value.trim();
    const phone = document.getElementById("contactPhone").value.trim();
    const message = document.getElementById("contactMessage").value.trim();
    const lines = [ar ? "مرحبًا وثبة، لدي استفسار:" : "Hi WATHBA, I have an enquiry:"];
    if (name) lines.push(`${ar ? "الاسم" : "Name"}: ${name}`);
    if (phone) lines.push(`${ar ? "رقم التواصل" : "Phone"}: ${phone}`);
    lines.push("",message);
    const destination = `https://wa.me/${window.WATHBA_CONFIG.whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(destination,"_blank","noopener,noreferrer");
  });
})();
