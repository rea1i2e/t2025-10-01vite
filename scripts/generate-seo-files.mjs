// scripts/generate-seo-files.mjs
// site.config.js の pages / baseUrl（または domain）から sitemap.xml と robots.txt を dist/ に出力する。

import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { siteConfig } from "../config/site.config.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, "../dist");

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

function buildUrlEntry(loc, pageData, lastmod) {
  const lines = [
    "  <url>",
    `    <loc>${escapeXml(loc)}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
  ];

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
  const lastmod = new Date().toISOString().slice(0, 10);

  const urlEntries = Object.entries(siteConfig.pages)
    .filter(([pageKey, pageData]) => !isExcludedFromSitemap(pageKey, pageData))
    .map(([, pageData]) => {
      const loc = pageUrl(siteUrl, pageData.path);
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
