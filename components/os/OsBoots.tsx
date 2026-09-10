import { RegisterWindow } from "@/components/os/RegisterWindow";
import { TextEditDocument } from "@/components/os/apps/TextEditDocument";
import { CvDocument } from "@/components/os/apps/CvDocument";
import type { Collection, Post } from "@/lib/content";
import { dict, type Locale } from "@/lib/i18n";
import {
  blogPostingJsonLd,
  articleBreadcrumbs,
  jsonLdScript,
} from "@/lib/jsonld";

export function FinderBoot({
  locale,
  collection,
}: {
  locale: Locale;
  collection: Collection;
}) {
  const t = dict[locale];
  const title =
    collection === "posts"
      ? t.zipWriting
      : collection === "research"
        ? t.zipResearch
        : t.zipNotes;
  return (
    <RegisterWindow
      id={`finder-${collection}`}
      appId="finder"
      title={title}
      payload={{ kind: "finder", place: collection }}
    />
  );
}

export function ArticleBoot({
  post,
  locale,
}: {
  post: Post;
  locale: Locale;
}) {
  const jsonLd = [blogPostingJsonLd(post, locale), articleBreadcrumbs(post, locale)];
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />
      <RegisterWindow
        id={`textedit-${post.collection}-${post.slug}`}
        appId="textedit"
        title={`${post.slug}.mdx`}
        maximized
        payload={{
          kind: "textedit",
          collection: post.collection,
          slug: post.slug,
        }}
      >
        <TextEditDocument post={post} locale={locale} />
      </RegisterWindow>
    </>
  );
}

export function CvBoot({ locale }: { locale: Locale }) {
  const t = dict[locale];
  return (
    <RegisterWindow
      id="cv"
      appId="cv"
      title={t.about}
      payload={{ kind: "cv" }}
    >
      <CvDocument locale={locale} />
    </RegisterWindow>
  );
}
