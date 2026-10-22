# المرحلة ٨: الربط الداخلي وهيكلة الموقع

أضيفت سبع صفحات فئات مستقلة بالعربية والإنجليزية، مع إبقاء فلاتر المتجر وروابطها القديمة للاستخدام الحالي. صفحات الفئات تضم روابط HTML مباشرة إلى كل منتجاتها، وإرشادات اختيار خاصة بالفئة، وروابط للأكاديمية.

| الفئة | الصفحة العربية | الصفحة الإنجليزية |
| --- | --- | --- |
| بارات السحب | `category-bars.html` | `category-bars-en.html` |
| باراليتس | `category-parallettes.html` | `category-parallettes-en.html` |
| متوازي وديب بار | `category-parallel-bars.html` | `category-parallel-bars-en.html` |
| حلقات جمباز | `category-rings.html` | `category-rings-en.html` |
| إكسسوارات | `category-accessories.html` | `category-accessories-en.html` |
| جهاز متعدد | `category-multi-rig.html` | `category-multi-rig-en.html` |
| طلبات مخصصة | `category-custom.html` | `category-custom-en.html` |

## مسار الزائر

الرئيسية ← صفحة فئة المعدات ← المنتج ← قسم مقارنة الاختيارات ← شرح التمارين في الأكاديمية ← مستويات الممارسة داخل دليل المنتج.

مثال فعلي: `index.html` ← `category-parallettes.html` ← `equipment-steel-wood-parallettes.html#equipment-choose` ← `academy-parallettes.html#exercises` ← `equipment-steel-wood-parallettes.html#equipment-exercises` ← `#equipment-level-beginner`.

أضيفت روابط الفئات للرئيسية وصفحة كل المعدات، والقائمة على الهاتف والكمبيوتر. صفحة المنتج تعود لفئتها وتربط مباشرة بالاختيار والتعلّم. أدلة الأكاديمية تعود للمنتجات والفئات المرتبطة بها. المنتجات المقترحة في المعرض التفاعلي أصبحت من الفئة نفسها، وتبقى الروابط التحريرية المختارة يدويًا في دليل المنتج.

المقارنة والتمارين والمستويات تعتمد على محتوى منشور بالفعل؛ لكل قسم عنوان ورابط ثابت. التخطيط للتصنيع والجريب تيب يستخدمان خطوات استخدام وتجهيز، دون اختراع مستويات تدريب. لا توجد صفحات قصيرة مكررة لكل مستوى، ولا يلزم تنفيذ JavaScript لاكتشاف الروابط الأساسية.

## ثبات البيانات واللغة

- التصنيف الموحد في `assets/js/site-structure.js` يغذي الفلاتر والقوائم والفئات ومسارات BreadcrumbList.
- نصوص الاختيار الخاصة بكل فئة في `scripts/category-content.js`؛ مولد الصفحات والروابط في `scripts/build-site-links.js`.
- ترتيب الإكسسوارات محفوظ: هاند جريبر، حبل قفز، جريب تيب، حبال مقاومة.
- السلم السويسري يبقى تعليميًا في الأكاديمية ولا يعود إلى المتجر أو القوائم التجارية.
- الفئات الجديدة تدعم تبديل اللغة لصفحة الفئة المقابلة، وتحافظ الروابط على لغة الزائر.
- BreadcrumbList للمنتج أصبح: الرئيسية ← المعدات ← الفئة ← المنتج. وللفئة: الرئيسية ← المعدات ← الفئة.
- يستمر توليد روابط الدومين وhreflang وخريطة المواقع مع أمر الإطلاق السابق؛ صفحات الفئات تدخل فيه تلقائيًا.

## الفحص

```sh
node scripts/build-product-pages.js
node scripts/check-site-links.js
node scripts/check-structured-data.js
node scripts/test-structured-data.js
git diff --check
```

فحص الروابط يزحف إلى HTML الناتج من كل رئيسية، ويفحص وجهات الروابط وأقسامها، وانتماء كل منتج لفئة واحدة، وترتيب المنتجات، وتبادل اللغات، وغياب الصفحات المعزولة. المنتجات الـ14 تصل إليها خلال نقرتين من الرئيسية لكل لغة.

لا يضيف هذا التعديل أسعارًا أو Product/Offer غير معتمدين، ولا يغير مواضيع التوصيل والضمان المؤجلة.

مرجع التنفيذ: https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure
