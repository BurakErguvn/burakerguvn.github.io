import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArticleView } from "@/components/ArticleView";
import { getPost, getSlugs } from "@/lib/content";
import { type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return getSlugs("research").map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { locale: Locale; slug: string };
}): Metadata {
  const post = getPost("research", params.slug, params.locale);
  if (!post) return {};
  return {
    title: post.title,
    description: post.dek || undefined,
    alternates: {
      canonical: `/${params.locale}/research/${params.slug}/`,
      languages: {
        tr: `/tr/research/${params.slug}/`,
        en: `/en/research/${params.slug}/`,
      },
    },
  };
}

export default async function ResearchPostPage({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  const post = getPost("research", params.slug, params.locale);
  if (!post) notFound();
  return <ArticleView post={post} locale={params.locale} />;
}
