import { mkdir, copyFile, access } from "node:fs/promises";
import path from "node:path";

/**
 * Mirror root sitemap to /sitemap/sitemap.xml.
 * Google Search Console often caches a failed first fetch of /sitemap.xml;
 * a fresh path lets you resubmit without waiting on that cache.
 */
const rootSitemap = path.join(process.cwd(), "out", "sitemap.xml");
const nestedDir = path.join(process.cwd(), "out", "sitemap");
const nestedSitemap = path.join(nestedDir, "sitemap.xml");

try {
  await access(rootSitemap);
} catch {
  console.error("copy-sitemap: out/sitemap.xml missing — skip");
  process.exit(0);
}

await mkdir(nestedDir, { recursive: true });
await copyFile(rootSitemap, nestedSitemap);
console.log("copy-sitemap: wrote out/sitemap/sitemap.xml");
