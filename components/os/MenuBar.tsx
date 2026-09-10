"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { dict, localeNames, locales, type Locale } from "@/lib/i18n";
import { useOs } from "./WindowManager";
import { BeMark } from "./icons";
import { mergesMenuBar } from "@/lib/os/snap";

function formatClock(locale: Locale, date: Date) {
  return date.toLocaleString(locale === "tr" ? "tr-TR" : "en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MenuBar() {
  const { locale, windows, focusedId, close, minimize } = useOs();
  const t = dict[locale];
  const [open, setOpen] = useState<string | null>(null);
  const [now, setNow] = useState<Date | null>(null);
  const barRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const focused = windows.find((w) => w.id === focusedId);
  const merged = mergesMenuBar(focused);
  const appName =
    focused?.appId === "finder"
      ? t.finder
      : focused?.appId === "textedit"
        ? t.textEdit
        : focused?.appId === "cv"
          ? t.about
          : t.desktop;

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!barRef.current?.contains(e.target as Node)) setOpen(null);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function switchLocale(next: Locale) {
    const segs = (pathname || "/").split("/");
    const idx = segs.findIndex((s) => s === "tr" || s === "en");
    if (idx >= 0) segs[idx] = next;
    router.push(segs.join("/") || `/${next}/`);
  }

  return (
    <header className={`os-menubar${merged ? " is-merged" : ""}`} ref={barRef}>
      <div className="os-menubar__left">
        <button
          type="button"
          className="os-menu__btn os-menu__btn--be"
          aria-label={t.appleMenu}
          onClick={() => router.push(`/${locale}/`)}
        >
          <BeMark className="os-menubar__logo" />
        </button>
        <span className="os-menubar__app">{appName}</span>
        <div className="os-menu">
          <button
            type="button"
            className={`os-menu__btn${open === "file" ? " is-open" : ""}`}
            onClick={() => setOpen(open === "file" ? null : "file")}
          >
            {t.file}
          </button>
          {open === "file" ? (
            <ul className="os-menu__drop">
              <li>
                <button
                  type="button"
                  disabled={!focusedId}
                  onClick={() => {
                    if (focusedId) close(focusedId);
                    setOpen(null);
                  }}
                >
                  {t.closeWindow}
                </button>
              </li>
            </ul>
          ) : null}
        </div>
        <div className="os-menu">
          <button
            type="button"
            className={`os-menu__btn${open === "view" ? " is-open" : ""}`}
            onClick={() => setOpen(open === "view" ? null : "view")}
          >
            {t.view}
          </button>
          {open === "view" ? (
            <ul className="os-menu__drop">
              <li>
                <button
                  type="button"
                  disabled={!focusedId}
                  onClick={() => {
                    if (focusedId) minimize(focusedId);
                    setOpen(null);
                  }}
                >
                  {t.minimize}
                </button>
              </li>
            </ul>
          ) : null}
        </div>
        <div className="os-menu">
          <button
            type="button"
            className={`os-menu__btn${open === "lang" ? " is-open" : ""}`}
            onClick={() => setOpen(open === "lang" ? null : "lang")}
          >
            {t.lang}
          </button>
          {open === "lang" ? (
            <ul className="os-menu__drop">
              {locales.map((l) => (
                <li key={l}>
                  <button
                    type="button"
                    className={l === locale ? "is-active" : undefined}
                    onClick={() => {
                      setOpen(null);
                      switchLocale(l);
                    }}
                  >
                    {localeNames[l]}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
      <time className="os-menubar__clock" dateTime={now ? now.toISOString() : undefined}>
        {now ? formatClock(locale, now) : ""}
      </time>
    </header>
  );
}
