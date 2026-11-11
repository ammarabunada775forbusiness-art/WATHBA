# وثبة WATHBA

موقع معدات وأكاديمية وثبة للكاليستنكس، بالعربية والإنجليزية. لكل صفحة رابط مستقل، والعربية هي النسخة الافتراضية. الموقع منشور على Vercel، وكل دفع إلى `main` ينشر الموقع الحقيقي.

## خريطة المشروع

```text
WATHBA/
├── site/            الموقع كما يُنشر: كل صفحات HTML وملف robots.txt
│   └── assets/      css و js و images و fonts الخاصة بالموقع
├── content/         النصوص والبيانات التي تُبنى منها الصفحات، وهنا يكون أغلب التعديل
├── scripts/
│   ├── build/       خطوات البناء: توليد الصفحات واللغات والروابط والأداء والبيانات المنظمة
│   ├── checks/      فحوصات الجودة، وتُشغَّل قبل كل دفع
│   ├── data/        سجلات تقنية مولّدة: الصور المحلية والصور المتجاوبة والأيقونات
│   └── tools/       أدوات اختيارية تُشغَّل يدويًا: تجهيز الصور والخطوط، وإزالة توهج الشخصيات
├── docs/            التوثيق التفصيلي، ويبدأ من docs/README.md
├── legacy/          ملفات قديمة غير مستخدمة، محفوظة للرجوع فقط
├── CLAUDE.md        ذاكرة المشروع وقواعد العمل لجلسات Claude Code
└── package.json و tailwind.config.cjs و vercel.json    إعدادات البناء والنشر
```

روابط الصفحات لم تتغير: يبني الأمر `npm run build` مجلد `dist/` من محتوى `site/`، وتُنشر الصفحات في جذر الموقع كما كانت، مثل `/about.html`.

## أين أعدّل؟

| أريد أن أغيّر | أعدّل هنا |
|---|---|
| نصوص الصفحات الأساسية بالعربي والإنجليزي | `content/page-translations.json`، والقوالب العربية `site/index.html` و`products.html` و`about.html` و`contact.html` |
| المنتجات: الأسماء والفئات والصور والأسعار | `site/assets/js/products-data.js` |
| أدلة المعدات: الجمهور والتمارين والأخطاء والتركيب | `content/product-training.js`، والتعريف المختصر في `content/product-education.js` |
| مواصفات المنتجات | `content/product-facts.json` |
| أدلة الأكاديمية الستة المولّدة | `content/academy-guides.js` |
| صفحات الفئات | `content/category-content.js` |
| حبل القفز (منتج ودليل) | `content/jump-rope-content.js` |
| هوية وثبة في البيانات المنظمة | `content/site-identity.json` |
| تصميم الموقع | `site/assets/css/*.css`، ما عدا ملفات `*.min.css` و`production.css` المولّدة |
| ذيب وصخر في الصفحة الرئيسية | `site/assets/js/home-hero.js` و`site/assets/css/home-hero.css`، والتفاصيل في `docs/HERO-CHARACTERS.md` |

### ملفات مولّدة، لا تعدّلها يدويًا

البناء يعيد كتابة هذه الملفات، فأي تعديل يدوي عليها يضيع. عدّل المصدر بدلها، ثم شغّل البناء:

- النسخ الإنجليزية من الصفحات الأساسية (`index-en.html` و`products-en.html` و`about-en.html` و`contact-en.html`)، ومصدرها القالب العربي مع `content/page-translations.json`.
- صفحات المعدات `equipment-*.html`، ومصدرها `site/product.html` مع ملفات `content/`.
- صفحات الفئات `category-*.html`، وأدلة الأكاديمية الستة: dips و rings و monkey-bars و swiss-ladder و jump-rope و grip.
- كل ملفات `*.min.css` و`*.min.js` و`production.css` و`web-vitals.js`.

لا تحذف تعليقات `WATHBA_COPY` و`WATHBA_SLOT` من القوالب العربية؛ البناء يستخدمها ليحدّث النصوص والمنتجات مع الحفاظ على التخطيط. أدلة البداية والعقلة والباراليتس محفوظة في ملفاتها داخل `site/`. السلم السويسري تعليمي فقط، وروابط منتجه السابقة تتحول إلى دليله عبر `vercel.json`.

## البناء والفحص

يحتاج Node.js 22 أو أحدث. من مجلد المشروع:

```sh
npm ci
npm run build
npm run check
```

الأمر `npm run build` يولّد الصفحات واللغات والروابط والبيانات المنظمة وملفات CSS و JS النهائية، ثم يجهّز `dist/` للنشر. أما `npm run check` فيفحص الروابط والبيانات المنظمة والأداء والوصولية وحركة الهيرو. شغّل الاثنين قبل أي دفع إلى `main`.

## التوثيق

ابدأ من [docs/README.md](docs/README.md).
