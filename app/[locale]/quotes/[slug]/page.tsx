import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { QuoteView } from "@/components/QuoteView";
import { QuoteList } from "@/components/QuoteList";
import { getPost, getSlugs } from "@/lib/content";
import { dict, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  const slugs = getSlugs("quotes");
  if (slugs.length === 0) return [{ slug: "__none__" }];
  return slugs.map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { locale: Locale; slug: string };
}): Metadata {
  if (params.slug === "__none__") return {};
  const post = getPost("quotes", params.slug, params.locale);
  if (!post) return {};
  const url = `/${params.locale}/quotes/${params.slug}/`;
  return {
    title: post.title,
    description: post.dek || post.raw.trim().slice(0, 160) || undefined,
    alternates: {
      canonical: url,
      languages: {
        tr: `/tr/quotes/${params.slug}/`,
        en: `/en/quotes/${params.slug}/`,
      },
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.dek || undefined,
      url,
      publishedTime: post.date || undefined,
      images: [{ url: "/og.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.dek || undefined,
      images: ["/og.png"],
    },
  };
}

export default async function QuotePage({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  const t = dict[params.locale];
  if (params.slug === "__none__") {
    return (
      <div className="main-col">
        <h1>{t.quotes}</h1>
        <QuoteList quotes={[]} locale={params.locale} />
      </div>
    );
  }
  const post = getPost("quotes", params.slug, params.locale);
  if (!post) notFound();
  return <QuoteView post={post} locale={params.locale} />;
}
