// scripts/generate-seo-files.mjs
// site.config.js の pages / baseUrl（または domain）から sitemap.xml と robots.txt を dist/ に出力する。

import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { globSync } from "glob";
import { siteConfig } from "../config/site.config.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const DIST = resolve(REPO_ROOT, "dist");

function getSiteUrl() {
  const url = siteConfig.baseUrl ?? siteConfig.domain;
  if (!url) {
    throw new Error(
      "site.config.js に baseUrl または domain を設定してください",
    );
  }
  return url;
}

function normalizeDomain(domain) {
  return domain.endsWith("/") ? domain : `${domain}/`;
}

function pageUrl(siteUrl, path) {
  const base = normalizeDomain(siteUrl);
  if (!path) return base;
  return `${base}${path}`;
}

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function matchesPathPrefix(path, prefixes) {
  return prefixes.some((prefix) => path.startsWith(prefix));
}

function isExcludedFromSitemap(pageKey, pageData) {
  if (pageData.sitemap?.exclude === true) return true;
  if ((siteConfig.sitemapExcludePages ?? []).includes(pageKey)) return true;
  const path = pageData.path ?? "";
  return matchesPathPrefix(path, siteConfig.sitemapExcludePathPrefixes ?? []);
}

function isDisallowedInRobots(pageKey, pageData) {
  if (pageData.robots?.disallow === true) return true;
  const disallowPages =
    siteConfig.robotsDisallowPages ?? siteConfig.sitemapExcludePages ?? [];
  if (disallowPages.includes(pageKey)) return true;
  const path = pageData.path ?? "";
  return matchesPathPrefix(path, siteConfig.robotsDisallowPathPrefixes ?? []);
}

function pathToRobotsDisallow(path) {
  if (!path) return "/";
  return `/${path.replace(/^\//, "")}`;
}

function resolveSitemapValue(pageData, key) {
  const defaults = siteConfig.sitemapDefaults ?? {};
  const value = pageData.sitemap?.[key] ?? defaults[key];
  return value === undefined || value === null || value === "" ? null : value;
}

function pagePathToHtmlRel(pagePath) {
  if (!pagePath) return "src/index.html";
  if (/\.html$/i.test(pagePath)) return `src/${pagePath}`;
  return `src/${pagePath}index.html`;
}

function parseEjsIncludes(htmlRelPath) {
  const abs = resolve(REPO_ROOT, htmlRelPath);
  if (!existsSync(abs)) return [];

  const content = readFileSync(abs, "utf8");
  const includes = [];
  const re = /include\(\s*ejsPath\s*\+\s*['"]([^'"]+)['"]/g;
  let match = re.exec(content);

  while (match) {
    includes.push(`src/ejs/${match[1]}`);
    match = re.exec(content);
  }

  return includes;
}

function relatedScssForEjs(ejsRelPath) {
  const slug = basename(ejsRelPath, ".ejs").replace(/^_/, "");
  return globSync(`src/assets/sass/**/_*${slug}*.scss`, { cwd: REPO_ROOT });
}

function relatedJsForPage(pageKey) {
  const pattern =
    pageKey === "top"
      ? "src/assets/js/**/_top*.js"
      : `src/assets/js/**/_${pageKey}*.js`;
  return globSync(pattern, { cwd: REPO_ROOT });
}

function pageImageFiles(pagePath) {
  const segment = pagePath ? pagePath.split("/")[0] : "top";
  const imageDir = resolve(REPO_ROOT, "src/assets/images", segment);

  if (!existsSync(imageDir)) return [];

  return globSync(`src/assets/images/${segment}/**/*`, {
    cwd: REPO_ROOT,
    nodir: true,
  });
}

function collectPageSourceFiles(pageKey, pageData) {
  const files = new Set();
  const htmlRel = pagePathToHtmlRel(pageData.path);
  const includeCommon = siteConfig.sitemapLastmodIncludeCommon === true;

  files.add(htmlRel);

  for (const includePath of parseEjsIncludes(htmlRel)) {
    if (!includeCommon && includePath.includes("/common/")) continue;
    files.add(includePath);
    for (const scssPath of relatedScssForEjs(includePath)) {
      files.add(scssPath);
    }
  }

  for (const jsPath of relatedJsForPage(pageKey)) {
    files.add(jsPath);
  }

  for (const imagePath of pageImageFiles(pageData.path)) {
    files.add(imagePath);
  }

  for (const extraPath of pageData.sitemap?.sourceFiles ?? []) {
    files.add(extraPath);
  }

  return [...files];
}

function getGitLastmod(relPaths) {
  const existing = relPaths.filter((relPath) =>
    existsSync(resolve(REPO_ROOT, relPath)),
  );
  if (existing.length === 0) return null;

  try {
    const args = existing.map((relPath) => `"${relPath.replace(/"/g, "")}"`).join(" ");
    const result = execSync(`git log -1 --format=%cs -- ${args}`, {
      cwd: REPO_ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();

    return result || null;
  } catch {
    return null;
  }
}

function resolveLastmod(pageKey, pageData) {
  const manual = resolveSitemapValue(pageData, "lastmod");
  if (manual) return manual;

  const source = siteConfig.sitemapLastmodSource ?? "git";

  if (source === "build") {
    return new Date().toISOString().slice(0, 10);
  }

  if (source === "omit") {
    return null;
  }

  return getGitLastmod(collectPageSourceFiles(pageKey, pageData));
}

function buildUrlEntry(loc, pageData, lastmod) {
  const lines = ["  <url>", `    <loc>${escapeXml(loc)}</loc>`];

  if (lastmod) {
    lines.push(`    <lastmod>${lastmod}</lastmod>`);
  }

  const changefreq = resolveSitemapValue(pageData, "changefreq");
  if (changefreq) {
    lines.push(`    <changefreq>${changefreq}</changefreq>`);
  }

  const priority = resolveSitemapValue(pageData, "priority");
  if (priority) {
    lines.push(`    <priority>${priority}</priority>`);
  }

  lines.push("  </url>");
  return lines.join("\n");
}

function buildSitemapXml() {
  const siteUrl = getSiteUrl();

  const urlEntries = Object.entries(siteConfig.pages)
    .filter(([pageKey, pageData]) => !isExcludedFromSitemap(pageKey, pageData))
    .map(([pageKey, pageData]) => {
      const loc = pageUrl(siteUrl, pageData.path);
      const lastmod = resolveLastmod(pageKey, pageData);
      return buildUrlEntry(loc, pageData, lastmod);
    });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.join("\n")}
</urlset>
`;
}

function buildRobotsTxt() {
  const siteUrl = getSiteUrl();
  const sitemapUrl = `${normalizeDomain(siteUrl)}sitemap.xml`;
  const disallowPaths = [
    ...new Set(
      Object.entries(siteConfig.pages)
        .filter(([pageKey, pageData]) =>
          isDisallowedInRobots(pageKey, pageData),
        )
        .map(([, pageData]) => pathToRobotsDisallow(pageData.path)),
    ),
  ];

  const lines = ["User-agent: *", "Allow: /"];

  for (const path of disallowPaths) {
    lines.push(`Disallow: ${path}`);
  }

  lines.push("", `Sitemap: ${sitemapUrl}`);

  return `${lines.join("\n")}\n`;
}

writeFileSync(resolve(DIST, "sitemap.xml"), buildSitemapXml(), "utf8");
writeFileSync(resolve(DIST, "robots.txt"), buildRobotsTxt(), "utf8");

console.log("[generate-seo-files] wrote dist/sitemap.xml and dist/robots.txt");
