import { Mdx } from "@/components/mdx/Mdx";
import {
  type Post,
  formatDate,
} from "@/lib/content";
import { dict, type Locale } from "@/lib/i18n";

export function TextEditDocument({
  post,
  locale,
}: {
  post: Post;
  locale: Locale;
}) {
  const t = dict[locale];
  return (
    <article className="prose os-textedit">
      <header className="article-header">
        <h1>{post.title}</h1>
        {post.dek ? <p className="article-header__dek">{post.dek}</p> : null}
        <div className="article-meta">
          <span>{formatDate(post.date, locale)}</span>
          <span>·</span>
          <span>{t.readingTime(post.readingMinutes)}</span>
          {post.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </header>
      <Mdx source={post.raw} />
    </article>
  );
}
