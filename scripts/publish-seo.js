#!/usr/bin/env node
// Once the actual HTTPS domain is live, generate absolute URLs for discovery.
// Usage: node scripts/publish-seo.js https://your-real-domain.tld
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const provided = process.argv[2];
let origin;

try {
  const parsed = new URL(provided);
  if (parsed.protocol !== "https:" || parsed.pathname !== "/" || parsed.search || parsed.hash ||
      parsed.username || parsed.password || /^((www\.)?example\.(com|org|net)|localhost)$/i.test(parsed.hostname)) {
    throw new Error("Provide the live HTTPS origin only, without a path, query, or placeholder hostname.");
  }
  origin = parsed.origin;
} catch (error) {
  console.error(`Usage: node scripts/publish-seo.js https://your-real-domain.tld\n${error.message}`);
  process.exit(1);
}

const filenames = fs.readdirSync(root)
  .filter((name) => name.endsWith(".html") && name !== "product.html")
  .sort();
const names = new Set(filenames);
const url = (name) => `${origin}${name === "index.html" ? "/" : `/${name}`}`;
const escapeXml = (value) => value.replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;"
})[char]);
const startMarker = "<!-- WATHBA_ABSOLUTE_SEO_START -->";
const endMarker = "<!-- WATHBA_ABSOLUTE_SEO_END -->";

function pairFor(filename) {
  if (!/^(academy|equipment-)/.test(filename)) return null;
  const base = filename.replace(/-en\.html$/, ".html").replace(/\.html$/, "");
  const ar = `${base}.html`;
  const en = `${base}-en.html`;
  return names.has(ar) && names.has(en) ? { ar, en } : null;
}

function alternates(pair, inSitemap = false) {
  if (!pair) return "";
  if (inSitemap) return ["ar", "en"].map((lang) =>
    `    <xhtml:link rel="alternate" hreflang="${lang}" href="${escapeXml(url(pair[lang]))}"/>`
  ).join("\n") + "\n";
  return ["ar", "en"].map((lang) =>
    `    <link rel="alternate" hreflang="${lang}" href="${escapeXml(url(pair[lang]))}" />`
  ).join("\n") + "\n";
}

function breadcrumbMarkup(filename, page) {
  if (!/^(equipment-|academy)/.test(filename)) return "";
  const isEnglish = filename.endsWith("-en.html");
  const isEquipment = filename.startsWith("equipment-");
  const titleMatch = page.match(/<title>([^<]+)<\/title>/i);
  if (!titleMatch) throw new Error(`Missing breadcrumb title: ${filename}`);
  const pageName = titleMatch[1].split("|")[0].trim().replace(/&amp;/g, "&");
  const entries = [{ name: isEnglish ? "Home" : "الرئيسية", item: `${origin}/` }];
  if (isEquipment) entries.push({ name: isEnglish ? "Equipment" : "المنتجات", item: `${origin}/products.html` });
  if (filename.startsWith("academy-") && !/^academy-(?:en)\.html$/.test(filename)) {
    entries.push({ name: isEnglish ? "Academy" : "الأكاديمية", item: url(isEnglish ? "academy-en.html" : "academy.html") });
  }
  entries.push({ name: pageName, item: url(filename) });
  const data = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: entries.map((entry, i) => ({ "@type": "ListItem", position: i + 1, ...entry }))
  };
  return `    <script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>\n`;
}

for (const filename of filenames) {
  const filepath = path.join(root, filename);
  let page = fs.readFileSync(filepath, "utf8");
  if (page.includes(startMarker)) {
    const start = page.indexOf(startMarker);
    const end = page.indexOf(endMarker, start);
    if (end < 0) throw new Error(`Unclosed SEO block: ${filename}`);
    page = page.slice(0, start) + page.slice(end + endMarker.length);
  }
  const insert = `${startMarker}\n    <link rel="canonical" href="${escapeXml(url(filename))}" />\n${alternates(pairFor(filename))}${breadcrumbMarkup(filename, page)}${endMarker}`;
  if (!/<\/head>/i.test(page)) throw new Error(`Missing head element: ${filename}`);
  page = page.replace(/<\/head>/i, `${insert}\n</head>`);
  fs.writeFileSync(filepath, page);
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${filenames.map((name) => `  <url>\n    <loc>${escapeXml(url(name))}</loc>\n${alternates(pairFor(name), true)}  </url>`).join("\n")}\n</urlset>\n`;
fs.writeFileSync(path.join(root, "sitemap.xml"), xml);
fs.writeFileSync(path.join(root, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);
console.log(`Prepared ${filenames.length} canonical pages and sitemap URLs for ${origin}.`);
