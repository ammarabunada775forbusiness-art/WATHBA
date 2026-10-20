#!/usr/bin/env node
// Cache the six original reference images locally; generated HTML uses local files.
const fs = require("node:fs"), path = require("node:path");
const root = path.resolve(__dirname, "..", "public");
const items = require("../content/media/classic.json");
const directory = path.join(root, "assets/images/classic");
const manifestPath = path.join(directory, "manifest.json");
const previous = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, "utf8")) : {};
const manifest = {};
fs.mkdirSync(directory, { recursive: true });
(async () => {
  await Promise.all(items.map(async item => {
    const cached = previous[item.key];
    if (cached?.source === item.url && fs.existsSync(path.join(root, cached.file))) { manifest[item.key] = cached; return; }
    const url = new URL(item.url);
    if (url.protocol !== "https:" || url.hostname !== "lh3.googleusercontent.com") throw new Error("Unexpected reference image origin");
    const response = await fetch(url, { signal: AbortSignal.timeout(25000) });
    if (!response.ok) throw new Error("Image download failed: " + item.key + " (" + response.status + ")");
    const bytes = Buffer.from(await response.arrayBuffer());
    if (!bytes.length || bytes.length > 8 * 1024 * 1024) throw new Error("Unexpected image size: " + item.key);
    let extension;
    if (bytes.subarray(0,4).equals(Buffer.from([0x89,0x50,0x4e,0x47]))) extension = "png";
    else if (bytes[0] === 0xff && bytes[1] === 0xd8) extension = "jpg";
    else if (bytes.toString("ascii",0,4) === "RIFF" && bytes.toString("ascii",8,12) === "WEBP") extension = "webp";
    else throw new Error("Unsupported reference image type: " + item.key);
    const file = "assets/images/classic/" + item.key + "." + extension;
    fs.writeFileSync(path.join(root, file), bytes);
    manifest[item.key] = { file, source: item.url };
  }));
  // A stable key order keeps rebuilds deterministic.
  fs.writeFileSync(manifestPath, JSON.stringify(Object.fromEntries(items.map(item => [item.key, manifest[item.key]])), null, 2) + "\n");
  console.log("Prepared " + items.length + " original reference images as local assets.");
})().catch(error => { console.error(error.message); process.exitCode = 1; });
