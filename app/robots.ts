import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Placeholder MDX stubs for empty collections — not real content pages.
      disallow: ["/*/notes/__none__/", "/*/research/__none__/", "/*/quotes/__none__/"],
    },
    sitemap: [`${SITE_URL}/sitemap.xml`, `${SITE_URL}/sitemap/sitemap.xml`],
    host: SITE_URL,
  };
}
