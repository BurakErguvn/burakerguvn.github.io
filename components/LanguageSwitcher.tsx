import Link from "next/link";
import { locales, localeShort, type Locale } from "@/lib/i18n";

export function LanguageSwitcher({
  current,
  available,
  hrefs,
}: {
  current: Locale;
  available: Locale[];
  hrefs: Partial<Record<Locale, string>>;
}) {
  return (
    <div className="lang-switch" role="group" aria-label="Dil seçimi">
      {locales.map((l) => {
        const href = hrefs[l];
        const isAvailable = available.includes(l) && href;
        if (l === current || !isAvailable) {
          return (
            <span
              key={l}
              className={l === current ? "active" : "disabled"}
              aria-current={l === current}
            >
              {localeShort[l]}
            </span>
          );
        }
        return (
          <Link key={l} href={href} className={l === current ? "active" : undefined}>
            {localeShort[l]}
          </Link>
        );
      })}
    </div>
  );
}
