import { PostList } from "@/components/PostList";
import { getPostsByLocale, collectionRoute } from "@/lib/content";
import { dict, type Locale } from "@/lib/i18n";

export default function NotesPage({ params }: { params: { locale: Locale } }) {
  const locale = params.locale;
  const t = dict[locale];
  const posts = getPostsByLocale("notes", locale);

  const text = {
    tr: {
      lead: "Düşünceler ve yarım kalmış fikirler için bir karalama defteri.",
      body: "Burada henüz tam bir yazıya dönüşmemiş notlar, okuma özetleri ve araştırma günlüğü tutacağım. Düzenli yazılar Yazılar bölümünde; daha derli toplu araştırma notları Araştırma bölümünde yer alacak.",
      empty: "Henüz not yok.",
    },
    en: {
      lead: "A scratchpad for thoughts and half-formed ideas.",
      body: "Here I keep notes that haven't yet grown into full posts, reading summaries, and a research log. Finished writing lives in Writing; tighter research notes live in Research.",
      empty: "No notes yet.",
    },
  }[locale];

  return (
    <div className="main-col">
      <h1>{t.notes}</h1>
      <p className="article-header__dek">{text.lead}</p>
      <p>{text.body}</p>
      <PostList
        posts={posts}
        locale={locale}
        route={collectionRoute.notes}
        emptyLabel={text.empty}
      />
    </div>
  );
}
