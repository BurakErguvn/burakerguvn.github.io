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
      "https://burakerguvn.github.io/sitemap.xml",
      "https://burakerguvn.github.io/sitemap/sitemap.xml",
    ],
    host: "https://burakerguvn.github.io",
  };
}
