import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArticleView } from "@/components/ArticleView";
import { getPost, getSlugs } from "@/lib/content";
import { type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return getSlugs("notes").map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { locale: Locale; slug: string };
}): Metadata {
  const post = getPost("notes", params.slug, params.locale);
  if (!post) return {};
  return {
    title: post.title,
    description: post.dek || undefined,
    alternates: {
      canonical: `/${params.locale}/notes/${params.slug}/`,
      languages: {
        tr: `/tr/notes/${params.slug}/`,
        en: `/en/notes/${params.slug}/`,
      },
    },
  };
}

export default async function NotePage({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  const post = getPost("notes", params.slug, params.locale);
  if (!post) notFound();
  return <ArticleView post={post} locale={params.locale} />;
}
