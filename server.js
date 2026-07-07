const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT || 3000);

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".png": "image/png",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, headers);
  res.end(body);
}

function safeJoin(base, target) {
  const resolved = path.resolve(base, target);
  const relative = path.relative(path.resolve(base), resolved);
  return relative && !relative.startsWith("..") && !path.isAbsolute(relative) ? resolved : null;
}

function isPublicRootPath(pathname) {
  return [
    "/index.html",
    "/sw.js",
    "/version.json",
    "/manifest.webmanifest",
    "/jspdf.umd.min.js",
    "/icon-180.png",
    "/icon-192.png",
    "/icon-512.png",
    "/v2.html",
  ].includes(pathname);
}

function cacheHeader(filePath) {
  const normalized = filePath.replace(/\\/g, "/");
  if (
    normalized.endsWith("/index.html") ||
    normalized.endsWith("/v2.html") ||
    normalized.endsWith("/sw.js") ||
    normalized.endsWith("/version.json") ||
    normalized.includes("/v2/")
  ) {
    return "no-store, must-revalidate";
  }
  return "public, max-age=3600";
}

function serveFile(req, res, filePath) {
  fs.readFile(filePath, (err, body) => {
    if (err) {
      send(res, err.code === "ENOENT" ? 404 : 500, err.code === "ENOENT" ? "Not found" : "Server error", {
        "Content-Type": "text/plain; charset=utf-8",
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    send(res, 200, body, {
      "Content-Type": types[ext] || "application/octet-stream",
      "Cache-Control": cacheHeader(filePath),
    });
  });
}

function route(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  let pathname = decodeURIComponent(url.pathname);

  if (pathname === "/") {
    serveFile(req, res, path.join(root, "index.html"));
    return;
  }

  if (pathname === "/v2" || pathname === "/v2/") {
    serveFile(req, res, path.join(root, "v2", "index.html"));
    return;
  }

  if (pathname === "/v2.html") {
    serveFile(req, res, path.join(root, "v2.html"));
    return;
  }

  if (pathname.startsWith("/v2/")) {
    const filePath = safeJoin(path.join(root, "v2"), pathname.slice("/v2/".length));
    if (!filePath) {
      send(res, 403, "Forbidden", { "Content-Type": "text/plain; charset=utf-8" });
      return;
    }
    serveFile(req, res, filePath);
    return;
  }

  if (!isPublicRootPath(pathname)) {
    send(res, 404, "Not found", { "Content-Type": "text/plain; charset=utf-8" });
    return;
  }

  const filePath = safeJoin(root, pathname.slice(1));
  if (!filePath) {
    send(res, 403, "Forbidden", { "Content-Type": "text/plain; charset=utf-8" });
    return;
  }
  serveFile(req, res, filePath);
}

http.createServer(route).listen(port, "0.0.0.0", () => {
  console.log(`KIM'S PHOTO APP listening on ${port}`);
});
