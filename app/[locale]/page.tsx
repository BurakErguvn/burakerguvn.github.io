import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { siteDocumentTitle } from "@/lib/site";
import { OG_IMAGE, SITE_URL } from "@/lib/jsonld";

export function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Metadata {
  const locale = params.locale;
  const descriptions: Record<Locale, string> = {
    tr: "erguvenburak.zip — yazılar, araştırmalar ve notlar birer arşiv. Masaüstünden aç.",
    en: "erguvenburak.zip — writing, research and notes as archives. Open them from the desktop.",
  };
  const title = siteDocumentTitle(locale);
  return {
    title: { absolute: title },
    description: descriptions[locale],
    alternates: {
      canonical: `/${locale}/`,
      languages: { tr: `/tr/`, en: `/en/` },
    },
    openGraph: {
      type: "website",
      title,
      description: descriptions[locale],
      url: `${SITE_URL}/${locale}/`,
      images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: descriptions[locale],
      images: [OG_IMAGE],
    },
  };
}

export default function HomePage() {
  return null;
}
