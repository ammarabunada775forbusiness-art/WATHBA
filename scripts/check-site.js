#!/usr/bin/env node
// Validate static pages and prove rebuilding preserves domain-specific SEO.
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const project = path.resolve(__dirname, "..");
const root = path.join(project, "public");

function attributes(source) {
  const result = {};
  const pattern = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  for (const match of source.matchAll(pattern)) result[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? "";
  return result;
}
function parse(source) {
  const page = { tags: [], ids: [], links: [], resources: [], title: source.match(/<title>([^<]+)<\/title>/i)?.[1] };
  for (const match of source.matchAll(/<([a-z][\w:-]*)\b([^<>]*?)>/gi)) {
    const tag = match[1].toLowerCase(), attr = attributes(match[2]);
    page.tags.push(tag);
    if ("id" in attr) page.ids.push(attr.id);
    if (tag === "html") { page.lang = attr.lang; page.direction = attr.dir; }
    if (tag === "meta" && attr.name === "description") page.description = attr.content;
    if (tag === "meta" && attr.name === "robots") page.noindex = /noindex/i.test(attr.content);
    if (tag === "a") {
      page.links.push(attr.href || "");
      if ((attr.class || "").split(/\s+/).includes("wathba-lang-btn")) page.languageLink = attr.href;
    }
    if (tag === "img" || tag === "script") {
      if (attr.src) page.resources.push(attr.src);
    }
    if (tag === "link" && /^(stylesheet|icon|preload)$/.test(attr.rel) && attr.href) page.resources.push(attr.href);
    if (tag === "img") assert("alt" in attr && attr.width && attr.height, "Image needs alt and dimensions");
    if (tag === "script" && attr.src) assert("defer" in attr, "JavaScript must not block parsing");
  }
  return page;
}
const filenames = fs.readdirSync(root).filter(name => name.endsWith(".html")).sort();
assert(filenames.length > 0, "Build the site before checking it");
const pages = new Map(filenames.map(name => [name, parse(fs.readFileSync(path.join(root, name), "utf8"))]));
const titles = new Set(), descriptions = new Set();
for (const [filename, page] of pages) {
  assert.equal(page.tags.filter(tag => tag === "h1").length, 1, filename + " needs one H1");
  assert.equal(page.tags.filter(tag => tag === "main").length, 1, filename + " needs one main");
  assert.equal(new Set(page.ids).size, page.ids.length, filename + " has duplicate IDs");
  assert(["ar", "en"].includes(page.lang) && page.direction === (page.lang === "ar" ? "rtl" : "ltr"), filename + " language mismatch");
  assert(page.title && page.description, filename + " metadata missing");
  if (!page.noindex) {
    assert(!titles.has(page.title), filename + " duplicate title");
    assert(!descriptions.has(page.description), filename + " duplicate description");
    titles.add(page.title); descriptions.add(page.description);
    const other = pages.get(page.languageLink);
    assert(other && other.languageLink === filename && other.lang !== page.lang, filename + " language link mismatch");
  }
  for (const href of [...page.links, ...page.resources]) {
    const parsed = new URL(href.replace(/&amp;/g, "&"), "https://local.test/" + filename);
    if (parsed.origin !== "https://local.test") {
      assert(!page.resources.includes(href), filename + " uses a remote rendering dependency");
      continue;
    }
    const target = path.resolve(root, "." + decodeURIComponent(parsed.pathname));
    assert(target.startsWith(root + path.sep) && fs.existsSync(target) && fs.statSync(target).isFile(), filename + " missing " + href);
    const other = pages.get(path.relative(root, target));
    if (parsed.hash && other) assert(other.ids.includes(decodeURIComponent(parsed.hash.slice(1))), filename + " broken anchor " + href);
  }
  assert(!fs.readFileSync(path.join(root, filename), "utf8").includes("wathba-ui-loading"), filename + " hides content until JavaScript");
}
for (const css of fs.readdirSync(path.join(root, "assets/css")).filter(name => name.endsWith(".css"))) {
  const file = path.join(root, "assets/css", css);
  for (const match of fs.readFileSync(file, "utf8").matchAll(/url\(["']?([^)\"']+)/g)) {
    const resource = match[1].trim();
    if (resource.startsWith("data:")) continue;
    assert(!/^(https?:)?\/\//.test(resource), "Remote CSS dependency " + resource);
    assert(fs.existsSync(path.resolve(path.dirname(file), resource)), "Missing CSS resource " + resource);
  }
}
function run(directory, script, args = []) {
  const result = spawnSync(process.execPath, [path.join(directory, script), ...args], { cwd: directory, encoding: "utf8" });
  assert.equal(result.status, 0, [script, result.error?.message, result.stdout, result.stderr].filter(Boolean).join("\n"));
}
const snapshot = () => JSON.stringify(fs.readdirSync(root).filter(name => name.endsWith(".html")).sort().map(name => [name, fs.readFileSync(path.join(root, name), "utf8")]));
const before = snapshot();
run(project, "scripts/build-site.js");
assert.equal(snapshot(), before, "Static build is not reproducible");

const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "wathba-seo-test-"));
try {
  const clone = path.join(temporary, "site");
  const excluded = new Set([".git", ".vercel", "node_modules", "test-results", "playwright-report", "__pycache__"]);
  fs.cpSync(project, clone, { recursive: true, filter: file => !excluded.has(path.basename(file)) });
  // A fresh build must work without any previously generated Academy pages.
  for (const name of filenames) fs.unlinkSync(path.join(clone, "public", name));
  run(clone, "scripts/build-site.js");
  for (const name of filenames) assert.equal(fs.readFileSync(path.join(clone, "public", name), "utf8"), fs.readFileSync(path.join(root, name), "utf8"), "Fresh build differs: " + name);
  run(clone, "scripts/publish-seo.js", ["https://wathba.test"]);
  run(clone, "scripts/build-site.js");
  const sitemap = fs.readFileSync(path.join(clone, "public/sitemap.xml"), "utf8");
  const entries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)];
  assert.equal(entries.length, titles.size, "Sitemap must include every indexable page");
  const locations = new Set();
  for (const [, entry] of entries) {
    assert.equal((entry.match(/<xhtml:link /g) || []).length, 2, "Sitemap needs both language alternatives");
    const location = entry.match(/<loc>([^<]+)<\/loc>/)?.[1];
    assert(location && !locations.has(location), "Duplicate or missing sitemap URL"); locations.add(location);
    assert(!/\/(?:404(?:-en)?|product)\.html$/.test(location), "Noindex URL in sitemap");
  }
  for (const [filename, page] of pages) {
    if (page.noindex) continue;
    const source = fs.readFileSync(path.join(clone, "public", filename), "utf8");
    assert.equal((source.match(/rel="canonical"/g) || []).length, 1, filename + " canonical lost after rebuild");
    assert.equal((source.match(/rel="alternate"/g) || []).length, 2, filename + " language alternatives lost");
    assert(source.includes("https://wathba.test"), filename + " origin missing");
    for (const match of source.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(match[1]);
  }
} finally {
  fs.rmSync(temporary, { recursive: true, force: true });
}
console.log("Passed: " + pages.size + " HTML pages, " + titles.size + " indexable pages, links/assets, language pairs, clean rebuild and domain SEO.");
