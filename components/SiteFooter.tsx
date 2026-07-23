import { type Locale, dict } from "@/lib/i18n";

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = dict[locale];
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <span>© {year} Burak Ergüven</span>
      <span>
        {t.writing} · {t.research} · {t.notes}
      </span>
    </footer>
  );
}
