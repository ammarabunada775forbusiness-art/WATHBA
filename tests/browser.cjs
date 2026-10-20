// Run: npm run test:browser (after installing Playwright's Chromium).
// WATHBA_BROWSER_PATH can select an existing Chromium executable.
const fs = require("node:fs"), path = require("node:path"), http = require("node:http");
const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const root = path.resolve(__dirname,"..","public");
const contentTypes = { ".html":"text/html; charset=utf-8", ".css":"text/css", ".js":"text/javascript", ".woff2":"font/woff2", ".webp":"image/webp", ".svg":"image/svg+xml" };
const server = http.createServer((req,res) => {
  const pathname = decodeURIComponent(new URL(req.url,"http://local").pathname);
  const file = path.resolve(root,`.`+(pathname === "/" ? "/index.html" : pathname));
  if (!file.startsWith(root+path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); res.end(); return; }
  res.setHeader("Content-Type",contentTypes[path.extname(file)] || "application/octet-stream");
  fs.createReadStream(file).pipe(res);
});
let browser;

(async () => {
  await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const launchOptions = { headless:true };
  if(process.env.WATHBA_BROWSER_PATH) { launchOptions.executablePath=process.env.WATHBA_BROWSER_PATH; launchOptions.args=["--disable-dev-shm-usage","--disable-gpu","--no-zygote"]; }
  browser=await chromium.launch(launchOptions);
  const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:"reduce"});
  const page=await context.newPage(),errors=[],badResources=[],remoteResources=[];
  page.on("pageerror",error=>errors.push(error.message));
  page.on("response",response=>{if(response.status()>=400) badResources.push(response.url());});
  page.on("request",request=>{if(!request.url().startsWith(base))remoteResources.push(request.url());});
  const pages=fs.readdirSync(root).filter(name=>name.endsWith(".html"));
  for(const width of [390,1440]) {
    await page.setViewportSize({width,height:width===390?844:1000});
    for(const filename of pages) {
      await page.goto(`${base}/${filename}`,{waitUntil:"load"});
      await page.evaluate(()=>document.fonts.ready);
      const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,h1:document.querySelectorAll("h1").length,body:getComputedStyle(document.body).backgroundColor,menu:document.querySelector(".wathba-menu-toggle").getBoundingClientRect().width,main:getComputedStyle(document.querySelector("main")).display}));
      assert.equal(state.overflow,false,`${filename} horizontal overflow at ${width}`);
      assert.equal(state.h1,1,`${filename} H1`);
      assert.equal(state.body,"rgb(19, 19, 19)",`${filename} Academy background`);
      assert.ok(state.menu>=38,`${filename} menu button visible`);
      assert.notEqual(state.main,"none");
    }
  }
  for(const width of [320,768]) {
    await page.setViewportSize({width,height:900});
    for(const filename of ["index.html","products-en.html","contact.html","equipment-wall-pull-up-bar-en.html","academy-parallettes.html"]) {
      await page.goto(`${base}/${filename}`);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`${filename} overflow at ${width}`);
    }
  }
  console.log(`Responsive rendering: ${pages.length} pages at phone/desktop widths plus 320/768 edge cases.`);

  await page.setViewportSize({width:390,height:844});
  await page.goto(`${base}/products.html`);
  await page.click('[data-filter="rings"]');
  assert.equal(await page.locator("#allProducts [data-product-card]:visible").count(),1);
  assert.ok(page.url().includes("filter=rings"));
  await page.click(".wathba-lang-btn");
  await page.waitForURL("**/products-en.html?filter=rings");
  assert.equal(await page.locator("#allProducts [data-product-card]:visible").count(),1);
  await page.fill("#productSearch","nothing-matches-this");
  assert.equal(await page.locator("#catalogEmpty").isVisible(),true);
  await page.click("[data-clear-filters]");
  assert.equal(await page.locator("#allProducts [data-product-card]:visible").count(),14);
  await page.fill("#productSearch","حلقات");
  const plainArabicCount=await page.locator("#allProducts [data-product-card]:visible").count();
  await page.fill("#productSearch","حَلَقَات");
  assert.equal(await page.locator("#allProducts [data-product-card]:visible").count(),plainArabicCount,"Arabic diacritics in search");
  assert.equal(await page.locator('[data-product-id="gymnastic-rings"]').isVisible(),true);
  await page.fill("#productSearch","");
  await page.click('[data-add-product="gymnastic-rings"]');
  assert.equal(await page.locator(".wathba-cart-count").textContent(),"1");
  await page.click(".wathba-cart-toggle");
  assert.equal(await page.locator("[role=dialog]").isVisible(),true);
  assert.equal(await page.locator("main").evaluate(el=>el.inert),true);
  await page.click("[data-cart-plus]");
  assert.equal(await page.locator(".wathba-cart-count").textContent(),"2");
  await page.click("[data-cart-minus]");
  await page.fill("#wathbaCartNotes",'Window width 140 cm. </textarea><img id="unsafe-note" src=x>');
  await page.keyboard.press("Escape");
  assert.equal(await page.locator(".wathba-cart-toggle").evaluate(el=>el===document.activeElement),true,"Cart restores focus");

  await page.goto(`${base}/equipment-wall-pull-up-bar.html`);
  await page.click(".product-submit");
  assert.equal(await page.evaluate(()=>window.WathbaCart.getItems().length),1,"Size is required before adding");
  await page.check('input[name="variant"][value="1"]');
  await page.click(".product-submit");
  assert.equal(await page.evaluate(()=>window.WathbaCart.getItems().length),2);
  await page.click(".wathba-cart-toggle");
  assert.ok((await page.locator("#wathbaCartNotes").inputValue()).includes("Window width 140"),"Notes survive page navigation");
  assert.equal(await page.locator("#unsafe-note").count(),0,"Notes stay text, never HTML");
  const order=new URL(await page.locator("[data-cart-order]").getAttribute("href"));
  assert.equal(order.hostname,"wa.me");assert.equal(order.pathname,"/962791752349");
  assert.ok(order.searchParams.get("text").includes("90 سم"));
  assert.ok(order.searchParams.get("text").includes("Window width 140"));
  await page.keyboard.press("Escape");
  await page.click(".wathba-menu-toggle");
  assert.equal(await page.locator("#wathbaMobileMenu").isVisible(),true);
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("#wathbaMobileMenu").isHidden(),true);
  assert.equal(await page.locator(".wathba-menu-toggle").evaluate(el=>el===document.activeElement),true);
  await page.click(".wathba-cart-toggle");
  await page.click("[data-cart-remove]");
  assert.equal(await page.evaluate(()=>window.WathbaCart.getItems().length),1);
  await page.click("[data-cart-clear]");
  assert.equal(await page.evaluate(()=>window.WathbaCart.getItems().length),0);
  await page.keyboard.press("Escape");

  await page.goto(`${base}/product.html?id=wall-pull-up-bar`);
  await page.waitForURL("**/equipment-wall-pull-up-bar.html");
  await page.goto(`${base}/academy-first-pull-up-en.html#assisted`);
  await page.click(".wathba-lang-btn");
  await page.waitForURL("**/academy-first-pull-up.html#assisted");
  console.log("Catalog filters/search, language/query/hash links, required variants, cart quantities, notes, escaping, keyboard focus and legacy redirect passed.");

  await page.goto(`${base}/contact.html`);
  await page.evaluate(()=>{window.__waTest=null;window.open=url=>{window.__waTest=url;return null;};});
  await page.fill("#contactName","Test Visitor");
  await page.fill("#contactPhone","0790000000");
  await page.fill("#contactMessage","I need a training setup for a 2 by 3 metre space.");
  await page.click('button[type="submit"]');
  const enquiry=new URL(await page.evaluate(()=>window.__waTest));
  assert.equal(enquiry.pathname,"/962791752349");assert.ok(enquiry.searchParams.get("text").includes("Test Visitor"));
  const offline=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const staticPage=await offline.newPage();
  for(const filename of ["index.html","products.html","equipment-wall-pull-up-bar.html","academy.html"]) {
    await staticPage.goto(`${base}/${filename}`);
    assert.ok(await staticPage.locator("main h1").isVisible(),`${filename} without JS`);
    assert.ok(await staticPage.locator('main a[href]').count()>0);
  }
  assert.deepEqual(errors,[],"No uncaught browser errors");
  assert.deepEqual(badResources,[],"No missing resources");
  assert.deepEqual(remoteResources,[],"No external rendering dependencies");
  console.log("Contact message preparation and content without JavaScript passed. No JS errors, missing assets or remote rendering requests.");
  await browser.close();
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();server.close();});
