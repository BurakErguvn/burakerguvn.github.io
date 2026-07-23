"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dict, defaultLocale, isLocale, type Locale } from "@/lib/i18n";

function useLocale(): Locale {
  const pathname = usePathname();
  const seg = pathname?.split("/").filter(Boolean)[0] ?? defaultLocale;
  return isLocale(seg) ? seg : defaultLocale;
}

export function LeftRail() {
  const locale = useLocale();
  const pathname = usePathname() ?? "";
  const t = dict[locale];
  const base = `/${locale}`;

  const nav: { href: string; label: string }[] = [
    { href: `${base}/writing`, label: t.writing },
    { href: `${base}/research`, label: t.research },
    { href: `${base}/notes`, label: t.notes },
    { href: `${base}/tags`, label: t.tags },
    { href: `${base}/about`, label: t.about },
  ];

  function isActive(href: string) {
    const p = pathname.replace(/\/$/, "");
    return p === href || p.startsWith(href + "/");
  }

  return (
    <aside className="left-rail">
      <Link href={base} className="left-rail__monogram" aria-label="Ana sayfa">
        be.
      </Link>
      <nav className="left-rail__nav" aria-label="Birincil">
        {nav.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={isActive(n.href) ? "active" : undefined}
          >
            {n.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
