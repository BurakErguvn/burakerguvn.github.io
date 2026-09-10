import type { Metadata } from "next";
import { cv } from "@/lib/cv";
import { dict, type Locale } from "@/lib/i18n";
import { CvBoot } from "@/components/os/OsBoots";

export function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Metadata {
  return {
    title: dict[params.locale].about,
    description: params.locale === "tr" ? cv.summary.tr : cv.summary.en,
    alternates: {
      canonical: `/${params.locale}/about/`,
      languages: {
        tr: `/tr/about/`,
        en: `/en/about/`,
      },
    },
  };
}

export default function AboutPage({ params }: { params: { locale: Locale } }) {
  return <CvBoot locale={params.locale} />;
}
