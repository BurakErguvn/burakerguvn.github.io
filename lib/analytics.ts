/**
 * Analytics & Search Console placeholders.
 *
 * Cloudflare Web Analytics:
 *   1. https://analytics.cloudflare.com → Add site → copy token
 *   2. Paste into CF_WEB_ANALYTICS_TOKEN below
 *   Empty string → beacon is not rendered (safe for local/build).
 *
 * Google Search Console:
 *   1. https://search.google.com/search-console → Add property
 *   2. HTML tag verification → copy content value
 *   3. Paste into GOOGLE_SITE_VERIFICATION below
 *   4. Submit sitemap: https://burakerguvn.github.io/sitemap/sitemap.xml
 *      (fallback: https://burakerguvn.github.io/sitemap.xml)
 */

/** Cloudflare Web Analytics token. Leave empty until you have one. */
export const CF_WEB_ANALYTICS_TOKEN = "67135069ad184877a16bf4983fbd4818";

/** Google Search Console HTML-tag verification content. Leave empty until verified. */
export const GOOGLE_SITE_VERIFICATION = "";
