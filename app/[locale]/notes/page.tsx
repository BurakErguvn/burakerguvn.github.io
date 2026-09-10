import type { Metadata } from "next";
import { PostList } from "@/components/PostList";
import { getPostsByLocale, collectionRoute } from "@/lib/content";
import { dict, type Locale } from "@/lib/i18n";

export function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Metadata {
  const locale = params.locale;
  const t = dict[locale];
  const descriptions: Record<Locale, string> = {
    tr: "Düşünceler ve yarım kalmış fikirler için bir karalama defteri.",
    en: "A scratchpad for thoughts and half-formed ideas.",
  };
  return {
    title: t.notes,
    description: descriptions[locale],
    alternates: {
      canonical: `/${locale}/notes/`,
      languages: {
        tr: `/tr/notes/`,
        en: `/en/notes/`,
      },
    },
  };
}

export default function NotesPage({ params }: { params: { locale: Locale } }) {
  const locale = params.locale;
  const t = dict[locale];
  const posts = getPostsByLocale("notes", locale);

  const emptyLabel = locale === "tr" ? "Henüz not yok." : "No notes yet.";

  return (
    <div className="main-col">
      <h1>{t.notes}</h1>
      <PostList
        posts={posts}
        locale={locale}
        route={collectionRoute.notes}
        emptyLabel={emptyLabel}
      />
    </div>
  );
}
