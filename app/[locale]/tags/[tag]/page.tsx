import { PostList } from "@/components/PostList";
import {
  getAllTagSlugs,
  getPostsByTagSlug,
  collectionRoute,
} from "@/lib/content";
import { locales, dict, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  const slugs = new Set<string>();
  for (const l of locales) {
    for (const s of getAllTagSlugs(l)) slugs.add(s);
  }
  const tags = [...slugs];
  // Next.js output:export, boş generateStaticParams'i kabul etmez;
  // içerik boşken placeholder döndür.
  if (tags.length === 0) return [{ tag: "__none__" }];
  return tags.map((tag) => ({ tag }));
}

export default function TagPage({
  params,
}: {
  params: { locale: Locale; tag: string };
}) {
  const t = dict[params.locale];
  if (params.tag === "__none__") {
    return (
      <div className="main-col">
        <h1>{t.tags}</h1>
        <p className="eyebrow">{t.noTags}</p>
      </div>
    );
  }
  const posts = getPostsByTagSlug(params.locale, params.tag);
  return (
    <div className="main-col">
      <h1>#{params.tag}</h1>
      <PostList
        posts={posts}
        locale={params.locale}
        route={collectionRoute.posts}
        emptyLabel={t.noPostsForTag}
      />
    </div>
  );
}
