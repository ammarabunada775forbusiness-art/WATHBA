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
  const base = filename.replace(/-en\.html$/, ".html").replace(/\.html$/, "");
  const ar = `${base}.html`;
  const en = `${base}-en.html`;
  return names.has(ar) && names.has(en) ? { ar, en } : null;
}

function alternates(pair, inSitemap = false) {
  if (!pair) return "";
  const languages = ["ar", "en", "x-default"];
  if (inSitemap) return languages.map((lang) =>
    `    <xhtml:link rel="alternate" hreflang="${lang}" href="${escapeXml(url(pair[lang === 'x-default' ? 'ar' : lang]))}"/>`
  ).join("\n") + "\n";
  return languages.map((lang) =>
    `    <link rel="alternate" hreflang="${lang}" href="${escapeXml(url(pair[lang === 'x-default' ? 'ar' : lang]))}" />`
  ).join("\n") + "\n";
}

for (const filename of filenames) {
  const filepath = path.join(root, filename);
  let page = fs.readFileSync(filepath, "utf8");
  page = page.replace(/<!-- WATHBA_LANGUAGE_ALTERNATES_START -->[\s\S]*?<!-- WATHBA_LANGUAGE_ALTERNATES_END -->\n?/g, '');
  if (page.includes(startMarker)) {
    const start = page.indexOf(startMarker);
    const end = page.indexOf(endMarker, start);
    if (end < 0) throw new Error(`Unclosed SEO block: ${filename}`);
    page = page.slice(0, start).replace(/\s*$/, '\n') + page.slice(end + endMarker.length).replace(/^\s*/, '');
  }
  const insert = `${startMarker}\n    <link rel="canonical" href="${escapeXml(url(filename))}" />\n${alternates(pairFor(filename))}${endMarker}`;
  if (!/<\/head>/i.test(page)) throw new Error(`Missing head element: ${filename}`);
  page = page.replace(/\s*<\/head>/i, `\n${insert}\n</head>`);
  fs.writeFileSync(filepath, page);
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${filenames.map((name) => `  <url>\n    <loc>${escapeXml(url(name))}</loc>\n${alternates(pairFor(name), true)}  </url>`).join("\n")}\n</urlset>\n`;
fs.writeFileSync(path.join(root, "sitemap.xml"), xml);
fs.writeFileSync(path.join(root, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);
require('./structured-data.js').buildStructuredData({origin});
console.log(`Prepared ${filenames.length} canonical pages and sitemap URLs for ${origin}.`);
