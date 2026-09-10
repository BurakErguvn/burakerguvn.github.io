import type { Metadata } from "next";
import { FinderBoot } from "@/components/os/OsBoots";
import { dict, type Locale } from "@/lib/i18n";

export function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Metadata {
  const locale = params.locale;
  const t = dict[locale];
  const descriptions: Record<Locale, string> = {
    tr: "Araştırma notları: kuantum hata düzeltme, makine öğrenmesi ve matematiksel derinlikte çalışmalar.",
    en: "Research notes on quantum error correction, machine learning and mathematical depth.",
  };
  return {
    title: t.research,
    description: descriptions[locale],
    alternates: {
      canonical: `/${locale}/research/`,
      languages: { tr: `/tr/research/`, en: `/en/research/` },
    },
  };
}

export default function ResearchPage({ params }: { params: { locale: Locale } }) {
  return <FinderBoot locale={params.locale} collection="research" />;
}
