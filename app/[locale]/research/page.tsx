import { PostList } from "@/components/PostList";
import { getPostsByLocale, collectionRoute } from "@/lib/content";
import { dict, type Locale } from "@/lib/i18n";

export default function ResearchPage({ params }: { params: { locale: Locale } }) {
  const locale = params.locale;
  const t = dict[locale];
  const posts = getPostsByLocale("research", locale);
  return (
    <div className="main-col">
      <h1>{t.research}</h1>
      <PostList
        posts={posts}
        locale={locale}
        route={collectionRoute.research}
        emptyLabel={t.noResearch}
      />
    </div>
  );
}
