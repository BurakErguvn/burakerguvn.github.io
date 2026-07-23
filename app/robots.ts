import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/*/__none__/", "/*/*/__none__/"],
    },
    sitemap: "https://burakerguvn.github.io/sitemap.xml",
  };
}
