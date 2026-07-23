import { PostList } from "@/components/PostList";
import { getPostsByLocale, collectionRoute } from "@/lib/content";
import { dict, type Locale } from "@/lib/i18n";

export default function WritingPage({ params }: { params: { locale: Locale } }) {
  const locale = params.locale;
  const posts = getPostsByLocale("posts", locale);
  return (
    <div className="main-col">
      <h1>{dict[locale].writing}</h1>
      <PostList posts={posts} locale={locale} route={collectionRoute.posts} />
    </div>
  );
}
