const training = require('./product-training.js');
const baseCopy = require('./product-education.js');
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));

module.exports = function renderTraining(product, lang, catalog, academyUrl) {
  if (!training.entries[product.id]) throw Error('Missing training: ' + product.id);
  const copy = training.localize(training.entries[product.id], lang);
  const intro = baseCopy[product.id][lang];
  const ar = lang === 'ar';
  const text = (a, b) => ar ? a : b;
  const url = id => `equipment-${id}${ar ? '' : '-en'}.html`;
  for (const field of ['exercises', 'session', 'mistakes', 'checks', 'faqs']) {
    if (!Array.isArray(copy[field]) || copy[field].length < 3) throw Error(`Incomplete ${field}: ${product.id}/${lang}`);
  }
  if (copy.compare.length < 2 || copy.related.length < 2) throw Error('Missing choices/links: ' + product.id);
  const practical = copy.mode === 'planning' || copy.mode === 'accessory';
  const titles = {
    audience: text('لمن تناسب؟ وما الذي تستهدفه؟', 'Who is it for, and what does it train?'),
    exercises: practical ? text('الاستخدام حسب احتياجك', 'Use for your needs') : text('تمارين حسب قدرتك الحالية', 'Exercises for your current ability'),
    session: copy.sessionTitle || text('حصة بداية نموذجية', 'Example starting session'),
    mistakes: text('أخطاء شائعة وكيف تتجنبها', 'Common mistakes to avoid'),
    setup: text('قبل الاستخدام: الثبات والتركيب والعناية', 'Before use: setup, stability and care'),
    choose: text('قارن الخيارات قبل الطلب', 'Compare options before ordering'),
    faq: text('أسئلة شائعة', 'Frequently asked questions'),
    related: text('أكمل تعلّمك وقارن المعدات', 'Continue learning and compare equipment')
  };
  const section = (id, body, full = '') => `<section id="equipment-${id}" class="wathba-product-box ${full}" aria-labelledby="equipment-${id}-title"><h3 id="equipment-${id}-title">${escape(titles[id])}</h3>${body}</section>`;
  const list = items => `<ul>${items.map(item => `<li>${escape(item)}</li>`).join('')}</ul>`;
  const levels = [text('مبتدئ', 'Beginner'), text('متوسط', 'Intermediate'), text('متقدم', 'Advanced')];
  const exerciseCards = copy.exercises.map((exercise, i) => `<div class="wathba-training-step"><span class="wathba-product-eyebrow">${levels[i]}</span><h4>${escape(exercise.name)}</h4><p class="wathba-training-dose">${escape(exercise.dose)}</p><p>${escape(exercise.cue)}</p></div>`).join('');
  const rows = copy.compare.map(row => `<tr><th scope="row">${escape(row.name)}</th><td>${escape(row.fit)}</td><td>${escape(row.check)}</td></tr>`).join('');
  const faqs = [{q: intro.question, a: intro.answer}, ...copy.faqs];
  const questions = faqs.map((item, i) => `<details class="wathba-equipment-question"${i === 0 ? ' open' : ''}><summary><h4>${escape(item.q)}</h4></summary><p>${escape(item.a)}</p></details>`).join('');
  const related = copy.related.map(id => {
    const item = catalog.find(item => item.id === id);
    if (!item || item.id === product.id) throw Error('Invalid related product: ' + id);
    return `<a href="${url(id)}">${escape(item.name[lang])} ↗</a>`;
  }).join('');
  const sources = copy.sources.map(id => {
    const source = training.sources[id];
    if (!source) throw Error('Unknown training source: ' + id);
    return `<li><a href="${escape(source.url)}" target="_blank" rel="noopener noreferrer">${escape(source.label[lang])} ↗</a></li>`;
  }).join('');
  return `<section class="wathba-product-education" aria-labelledby="equipment-guide-title"><div class="wathba-product-wrap">
    <span class="wathba-product-eyebrow">WATHBA / ${text('دليل المعدّة والاستخدام', 'Equipment and use guide')}</span>
    <h2 id="equipment-guide-title">${escape(practical ? text(`كيف تختار وتستخدم ${product.name[lang]}؟`, `How to choose and use ${product.name[lang]}`) : text(`كيف تختار ${product.name[lang]} وتتدرّب عليها؟`, `How to choose and train with ${product.name[lang]}`))}</h2>
    <p class="wathba-product-intro">${escape(intro.intent)} ${escape(intro.use)}</p>
    <nav class="wathba-equipment-toc" aria-label="${text('محتويات دليل المعدّة', 'Equipment guide contents')}">${Object.entries(titles).map(([id, title]) => `<a href="#equipment-${id}">${escape(title)}</a>`).join('')}</nav>
    <div class="wathba-product-columns">
      ${section('audience', `<p>${escape(copy.audience)}</p><h4>${text('العضلات والحركات', 'Muscles and movements')}</h4><p>${escape(copy.muscles)}</p><h4>${text('المهارات التي تبنيها', 'Skills to build')}</h4><p>${escape(copy.skills)}</p>`, 'full')}
      ${section('exercises', `${!practical ? `<p class="wathba-training-context">${text('اختر صفًا يناسب قدرتك؛ لا تنفّذ المستويات الثلاثة كحصة واحدة. الأعداد نقاط بداية قابلة للتقليل، وليست اختبار مستوى أو ضمان نتيجة.', 'Choose a level that suits your ability; do not combine all three into one session. Counts are adjustable starting examples, not level tests or promised results.')}</p>` : ''}<div class="wathba-training-levels">${exerciseCards}</div>`, 'full')}
      ${section('session', `<ol class="wathba-training-session">${copy.session.map(step => `<li>${escape(step)}</li>`).join('')}</ol><p class="wathba-training-progress">${escape(copy.progress)}</p>${!practical ? `<p>${text('للراشد السليم: خفّف الحركة عند فقدان التحكم، وتوقف إذا ظهر ألم. اترك عدة أو عدتين ممكنتين بدل إجبار كل مجموعة إلى الفشل؛ واسترح أطول إذا احتجت لاستعادة التقنية.', 'For healthy adults: regress if control fades and stop for pain. Leave a rep or two available rather than forcing every set to failure, and rest longer when needed to restore technique.')}</p>` : ''}`, 'full')}
      ${section('mistakes', list(copy.mistakes))}
      ${section('setup', list(copy.checks))}
      ${section('choose', `<p>${escape(intro.choose)}</p><div class="wathba-equipment-table" role="region" aria-label="${text('مقارنة خيارات المعدّة', 'Equipment option comparison')}" tabindex="0"><table><caption>${text('اختلاف الاستخدام أهم من اسم المستوى', 'Choose by use rather than an experience label')}</caption><thead><tr><th scope="col">${text('الخيار', 'Option')}</th><th scope="col">${text('متى تفكر به؟', 'When to consider it')}</th><th scope="col">${text('ما الذي تتحقق منه؟', 'What to verify')}</th></tr></thead><tbody>${rows}</tbody></table></div><p>${text('السعر والتوفر والتوصيل والتركيب في الأردن تؤكد مع وثبة حسب المنتج والموقع. لا توجد هنا حمولة أو مادة أو مدة ضمان مفترضة.', 'Confirm price, availability, delivery and installation in Jordan with WATHBA for the actual item and site. No load rating, material specification or warranty period is assumed here.')}</p>`, 'full')}
      ${section('faq', questions, 'full')}
      ${section('related', `<div class="wathba-product-footlinks"><a href="${escape(academyUrl)}">${text('اقرأ دليل الأكاديمية المرتبط', 'Read the related Academy guide')} ↗</a>${related}<a href="${ar ? 'products.html' : 'products-en.html'}">${text('جميع المعدات', 'All equipment')} ↗</a></div>`, 'full')}
    </div>
    <footer class="wathba-equipment-sources"><p>${text('تحرير وثبة — مراجعة المحتوى:', 'WATHBA editorial — content reviewed:')} <time datetime="${training.reviewedAt}">${training.reviewedAt}</time>. ${text('أمثلة الاستخدام والحصص من إعداد وثبة؛ المراجع التالية للشرح العام وليست اعتمادًا لمنتجاتنا أو نسخة من برامجها.', 'Use and session examples are WATHBA editorial work; references provide general background, not product approval or copied programs.')}</p>${sources ? `<ul>${sources}</ul>` : ''}</footer>
  </div></section>`;
};
