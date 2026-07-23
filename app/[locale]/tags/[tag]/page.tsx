import { PostList } from "@/components/PostList";
import {
  getAllTagSlugs,
  getPostsByTagSlug,
  collectionRoute,
} from "@/lib/content";
import { locales, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  const slugs = new Set<string>();
  for (const l of locales) {
    for (const s of getAllTagSlugs(l)) slugs.add(s);
  }
  return [...slugs].map((tag) => ({ tag }));
}

export default function TagPage({
  params,
}: {
  params: { locale: Locale; tag: string };
}) {
  const posts = getPostsByTagSlug(params.locale, params.tag);
  return (
    <div className="main-col">
      <h1>#{params.tag}</h1>
      <PostList
        posts={posts}
        locale={params.locale}
        route={collectionRoute.posts}
      />
    </div>
  );
}
