"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { defaultLocale, isLocale } from "@/lib/i18n";

/** Keep <html lang> in sync with the active locale (root layout can't see params). */
export function LangSync() {
  const pathname = usePathname();
  useEffect(() => {
    const seg = pathname?.split("/").filter(Boolean)[0] ?? defaultLocale;
    document.documentElement.lang = isLocale(seg) ? seg : defaultLocale;
  }, [pathname]);
  return null;
}
