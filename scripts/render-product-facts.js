const facts = require('./product-facts.json');
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function render(product, lang) {
  const entry = facts.products[product.id];
  if (!entry) throw new Error(`Missing product facts: ${product.id}`);
  const ar = lang === 'ar';
  const heading = ar ? 'المواصفات وتفاصيل الطلب' : 'Specifications and ordering';
  const intro = entry.rows.length
    ? (ar ? 'القياسات التالية مرجعية للتصميم؛ نؤكد قياسات القطعة النهائية وتجهيزها قبل تثبيت الطلب.' : 'These are design reference dimensions; final item dimensions and configuration are confirmed before an order is agreed.')
    : (ar ? 'تحدد القياسات والخامات والخيارات حسب الموديل أو التصميم المطلوب. تواصل معنا لتأكيد تفاصيل القطعة قبل الطلب.' : 'Dimensions, materials and options depend on the requested model or design. Contact us to confirm the actual item before ordering.');
  const rows = entry.rows.map(r => `<div class="wathba-spec-row"><dt>${escape(r.label[lang])}</dt><dd><bdi>${escape(r.value[lang])}</bdi></dd></div>`).join('\n');
  const state = entry.commerce.availability;
  const states = {
    InStock:['متوفر','In stock'],OutOfStock:['غير متوفر','Out of stock'],PreOrder:['طلب مسبق','Pre-order'],BackOrder:['طلب مع انتظار التوريد','Back order'],
    LimitedAvailability:['توفر محدود','Limited availability'],Discontinued:['متوقف','Discontinued'],OnlineOnly:['طلب إلكتروني فقط','Online only'],InStoreOnly:['في المتجر فقط','In store only'],SoldOut:['نفدت الكمية','Sold out']
  };
  const availability = states[state] ? `<p data-wathba-availability>${ar ? 'التوفر: ' : 'Availability: '}${states[state][ar ? 0 : 1]}</p>` : '';
  const note = ar ? 'اسألنا قبل الطلب عن السعر النهائي، والتوفر، والألوان والتخصيص، ومدة التجهيز، وشمول التركيب.' : 'Before ordering, confirm the final price, availability, colours and customisation, lead time, and installation scope.';
  const load = entry.rows.length ? (ar ? 'وزن القطعة وحدّ التحمل غير معلنين حاليًا؛ لا نعتمد رقم تحمل دون اختبار موثّق للمنتج الفعلي وطريقة تثبيته.' : 'Item weight and load rating are not currently published; a load rating requires documented testing of the actual item and its mounting.') : '';
  return `<section class="wathba-product-facts" id="equipment-specifications" aria-labelledby="equipment-specifications-title"><div class="wathba-product-wrap"><h2 id="equipment-specifications-title">${heading}</h2><p>${intro}</p>${rows ? `<dl class="wathba-spec-list">${rows}</dl>` : ''}${availability}<div class="wathba-order-details">${load ? `<p>${load}</p>` : ''}<p>${note}</p></div></div></section>`;
}
module.exports = render;
