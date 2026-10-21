# صور منتجات وثبة

كل منتج له مجلد باسم معرّفه داخل `assets/images/products/`.
الأسماء فقط: `1.webp`, `2.webp`, `3.webp`… بالترتيب وبدون أرقام ناقصة.
`1.webp` هو الغلاف في الرئيسية والمتجر والقائمة، وأول صورة داخل صفحة المنتج. بقية الصور تظهر تلقائيًا في معرض المنتج.

مثال: `assets/images/products/wall-pull-up-bar/1.webp`.
لتغيير الغلاف، استبدل ملف `1.webp`. لا تحتاج إلى تعديل عدد الصور في JavaScript.
احفظ الصورة بصيغة WebP فعلية؛ تغيير امتداد JPG إلى WebP وحده لا يحولها.

## المجلدات

| المنتج | المجلد داخل assets/images/products |
|---|---|
| عقلة حائط | wall-pull-up-bar |
| مونكي بارز | monkey-bars |
| باراليتس حديد بمقبض خشب | steel-wood-parallettes |
| باراليتس خشب كامل | full-wooden-parallettes |
| متوازي حديد صغير | freestanding-parallel-bars-small |
| متوازي حديد كبير | freestanding-parallel-bars-large |
| ديب بار حائط | wall-mounted-dip-bars |
| حلقات جمباز | gymnastic-rings |
| حبال مقاومة | resistance-bands |
| هاند جريبر | hand-gripper |
| حبل قفز | jump-rope |
| جريب تيب | grip-tape |
| جهاز متعدد | multi-rig |
| تصنيع مخصص | custom-orders |

## أوامر PowerShell أو التيرمنال

افتح التيرمنال داخل مجلد WATHBA. تتطلب السكربتات Node.js 18 أو أحدث، دون تثبيت حزم إضافية.

قبل إضافة صورك، اجلب آخر نسخة:

```powershell
git pull --ff-only origin main
```

بعد وضع الصور، افحص أعدادها وأسماءها وصحة WebP:

```powershell
node scripts/product-images.js
```

سيعرض جدولًا باسم كل منتج وعدد الصور والغلاف وعدد الصور المؤقتة، ثم قائمة الأخطاء إن وجدت.
`Errors: 0` يعني نجاح الفحص. الأسماء مثل `01.webp` و`cover.webp` و`1.jpg`، والأرقام الناقصة، والملفات التالفة تُرفض.

لفحص منتج محدد:

```powershell
node scripts/product-images.js --product wall-pull-up-bar
```

لفحص تعارضات Git ومشكلات التعديلات:

```powershell
git status --short
git ls-files -u
git diff --check
```

عدم ظهور شيء في الأمر الثاني يعني عدم وجود ملفات Git غير مدمجة. الأمر الثالث يكشف علامات التعارض ومشكلات المسافات في التعديلات.

بعد نجاح الفحص، حدّث المعرض وصفحات المنتجات وارفع:

```powershell
node scripts/build-product-pages.js
git diff --check
git status --short
git add assets/images/products assets/js/products-data.js "*.html"
git commit -m "Update WATHBA product photos"
git push origin main
```

البناء يفحص الصور أولًا؛ إذا فشل، أصلح الأخطاء قبل تنفيذ أوامر الرفع التالية.
الصورة الجديدة تحصل على إصدار من محتواها، كي يظهر استبدال `1.webp` مباشرة بعد النشر.
للتحديث دون إعادة بناء HTML يمكن استخدام `node scripts/product-images.js --write`، لكن أمر البناء الكامل أعلاه هو الموصى به.

## الصور المؤقتة الحالية

يوجد ملفان مؤقتان لكل منتج (28 ملفًا للمنتجات الحالية) من أربع صور تدريب ورياضة على Unsplash، مع إعادة استخدامها بين المنتجات للمعاينة فقط. لا تمثل هذه الصور منتجات وثبة الفعلية. لحبل القفز مجلد مستقل `assets/images/products/jump-rope/`؛ استبدل `1.webp` و`2.webp` بصوره عند توفرها. صور السلم المحتفظ بها للأكاديمية موجودة في `assets/images/academy/swiss-ladder/`؛ السلم ليس ضمن كتالوج المنتجات.
تفاصيل المصورين والروابط وترخيص الصور محفوظة في `scripts/temporary-image-sources.json`.
تظهر عبارة «صورة توضيحية مؤقتة» عند عرض هذه الملفات. تختفي عن الصورة التي تستبدلها بعد تشغيل البناء.
يمكن حذف باقي الملفات المؤقتة عند إضافة صورك، مع الإبقاء على ترقيم متصل يبدأ من 1.
