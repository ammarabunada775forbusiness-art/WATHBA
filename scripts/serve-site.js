#!/usr/bin/env node
// Local preview with the same public document root used by Vercel.
const fs = require("node:fs"), path = require("node:path"), http = require("node:http");
const root = path.resolve(__dirname, "..", "public");
const port = Number(process.env.PORT || 3000);
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".xml": "application/xml", ".txt": "text/plain; charset=utf-8", ".svg": "image/svg+xml", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".woff2": "font/woff2" };
const server = http.createServer((req, res) => {
  if (!["GET", "HEAD"].includes(req.method)) { res.writeHead(405, { Allow: "GET, HEAD" }); res.end(); return; }
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname); }
  catch { res.writeHead(400); res.end("Bad request"); return; }
  const file = path.resolve(root, "." + (pathname === "/" ? "/index.html" : pathname));
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    const notFound = path.join(root, "404.html");
    res.writeHead(404, { "Content-Type": types[".html"] });
    res.end(req.method === "HEAD" ? undefined : fs.readFileSync(notFound));
    return;
  }
  res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
  if (req.method === "HEAD") res.end();
  else fs.createReadStream(file).on("error", () => res.destroy()).pipe(res);
});
server.listen(port, "127.0.0.1", () => console.log("WATHBA preview: http://127.0.0.1:" + server.address().port));
