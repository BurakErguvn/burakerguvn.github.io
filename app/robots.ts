import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Placeholder MDX stubs for empty collections — not real content pages.
      disallow: ["/*/notes/__none__/", "/*/research/__none__/"],
    },
    sitemap: [
      "https://erguvenburak.zip/sitemap.xml",
      "https://erguvenburak.zip/sitemap/sitemap.xml",
    ],
    host: "https://erguvenburak.zip",
  };
}
