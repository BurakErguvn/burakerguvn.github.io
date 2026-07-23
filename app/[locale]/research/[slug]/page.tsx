import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArticleView } from "@/components/ArticleView";
import { PostList } from "@/components/PostList";
import { getPost, getSlugs, collectionRoute } from "@/lib/content";
import { dict, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  const slugs = getSlugs("research");
  if (slugs.length === 0) return [{ slug: "__none__" }];
  return slugs.map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { locale: Locale; slug: string };
}): Metadata {
  if (params.slug === "__none__") return {};
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
  const t = dict[params.locale];
  if (params.slug === "__none__") {
    return (
      <div className="main-col">
        <h1>{t.research}</h1>
        <PostList
          posts={[]}
          locale={params.locale}
          route={collectionRoute.research}
          emptyLabel={t.noResearch}
        />
      </div>
    );
  }
  const post = getPost("research", params.slug, params.locale);
  if (!post) notFound();
  return <ArticleView post={post} locale={params.locale} />;
}
