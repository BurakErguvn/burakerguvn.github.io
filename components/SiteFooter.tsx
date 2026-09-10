import { type Locale, dict } from "@/lib/i18n";

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = dict[locale];
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <span>© {year} Burak Ergüven</span>
      <span className="site-footer__mark" aria-hidden="true">
        ❦
      </span>
      <span>
        {t.writing} · {t.research} · {t.notes} · {t.quotes}
      </span>
    </footer>
  );
}
