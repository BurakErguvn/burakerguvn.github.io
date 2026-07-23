import Link from "next/link";
import { type PostMeta, formatDate } from "@/lib/content";
import { type Locale, dict } from "@/lib/i18n";

export function PostList({
  posts,
  locale,
  route,
}: {
  posts: PostMeta[];
  locale: Locale;
  route: string;
}) {
  const t = dict[locale];
  if (posts.length === 0) {
    return <p className="eyebrow">{t.noPosts}</p>;
  }
  return (
    <ul className="post-list">
      {posts.map((p) => (
        <li key={`${p.collection}-${p.slug}`}>
          <Link href={`/${locale}/${route}/${p.slug}/`}>
            <h3>{p.title}</h3>
          </Link>
          <div className="post-list__meta">
            {formatDate(p.date, locale)} · {t.readingTime(p.readingMinutes)}
          </div>
          {p.dek ? <p className="post-list__dek">{p.dek}</p> : null}
        </li>
      ))}
    </ul>
  );
}
