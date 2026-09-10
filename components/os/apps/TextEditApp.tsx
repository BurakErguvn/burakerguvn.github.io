"use client";

import { dict } from "@/lib/i18n";
import { collectionRoute, formatDate, type Collection } from "@/lib/content-meta";
import { useOs } from "../WindowManager";

export function TextEditApp({
  collection,
  slug,
}: {
  collection: Collection;
  slug: string;
}) {
  const id = `textedit-${collection}-${slug}`;
  const { locale, catalog, getBody } = useOs();
  const body = getBody(id);
  if (body) return <>{body}</>;

  const post = catalog[collection]?.find((p) => p.slug === slug);
  const t = dict[locale];
  const href = `/${locale}/${collectionRoute[collection]}/${slug}/`;

  return (
    <div className="os-textedit os-textedit--fallback">
      <h1>{post?.title ?? `${slug}.mdx`}</h1>
      {post?.dek ? <p className="os-textedit__dek">{post.dek}</p> : null}
      {post?.date ? <p>{formatDate(post.date, locale)}</p> : null}
      <p>
        <a href={href}>{t.readingTime(post?.readingMinutes ?? 1)}</a>
      </p>
    </div>
  );
}
