"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  collectionRoute,
  type Collection,
} from "@/lib/content-meta";
import { dict, type Locale } from "@/lib/i18n";
import type {
  Bounds,
  Catalog,
  FinderPlace,
  OsContextValue,
  WindowPayload,
  WindowState,
} from "@/lib/os/types";
import { type SnapRegion, snapBounds, MERGED_BAR } from "@/lib/os/snap";

const OsCtx = createContext<OsContextValue | null>(null);

const MIN_W = 320;
const MIN_H = 240;
const MENU_OFFSET = 56;

function defaultBounds(kind: WindowPayload["kind"], existing: number): Bounds {
  const stagger = (existing % 6) * 22;
  if (kind === "finder") {
    return { x: 72 + stagger, y: MENU_OFFSET + 24 + stagger, w: 620, h: 420 };
  }
  if (kind === "cv") {
    return { x: 100 + stagger, y: MENU_OFFSET + 16 + stagger, w: 720, h: 560 };
  }
  return { x: 90 + stagger, y: MENU_OFFSET + 20 + stagger, w: 760, h: 540 };
}

function fullscreenBounds(): Bounds {
  if (typeof window === "undefined") {
    return { x: 0, y: MERGED_BAR, w: 1200, h: 800 };
  }
  return {
    x: 0,
    y: MERGED_BAR,
    w: Math.max(MIN_W, window.innerWidth),
    h: Math.max(MIN_H, window.innerHeight - MERGED_BAR),
  };
}

function isFullscreenLike(b: Bounds): boolean {
  if (typeof window === "undefined") return b.x <= 1 && b.y <= MERGED_BAR + 1;
  return b.x <= 1 && b.y <= MERGED_BAR + 1 && b.w >= window.innerWidth - 2;
}

function windowedBounds(w: WindowState, existing: number): Bounds {
  if (w.prevBounds && !isFullscreenLike(w.prevBounds)) return w.prevBounds;
  return defaultBounds(w.payload.kind, existing);
}

function clampBounds(b: Bounds): Bounds {
  if (typeof window === "undefined") return b;
  const maxX = Math.max(0, window.innerWidth - 80);
  const maxY = Math.max(0, window.innerHeight - 40);
  return {
    x: Math.min(Math.max(-(Math.max(0, b.w - 80)), b.x), maxX),
    y: Math.min(Math.max(0, b.y), maxY),
    w: Math.max(MIN_W, b.w),
    h: Math.max(MIN_H, b.h),
  };
}

function finderTitle(locale: Locale, place: FinderPlace) {
  const t = dict[locale];
  if (place === "desktop") return t.desktop;
  if (place.startsWith("tag:")) return place.slice(4);
  if (place === "posts") return t.zipWriting;
  if (place === "research") return t.zipResearch;
  return t.zipNotes;
}

function articleTitle(slug: string) {
  return `${slug}.mdx`;
}

export function OsProvider({
  locale,
  catalog,
  children,
}: {
  locale: Locale;
  catalog: Catalog;
  children: ReactNode;
}) {
  const router = useRouter();
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const bodies = useRef(new Map<string, ReactNode>());
  const zRef = useRef(10);
  const [, bump] = useState(0);

  useEffect(() => {
    function onResize() {
      setWindows((prev) => {
        if (!prev.some((w) => w.maximized || w.snapped)) return prev;
        const full = fullscreenBounds();
        return prev.map((w) => {
          if (w.maximized) return { ...w, bounds: full };
          if (w.snapped && w.snapRegion) return { ...w, bounds: snapBounds(w.snapRegion) };
          return w;
        });
      });
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const nextZ = () => {
    zRef.current += 1;
    return zRef.current;
  };

  const syncUrl = useCallback(
    (list: WindowState[], focus: string | null) => {
      const focused = list.find((w) => w.id === focus) ?? list.filter((w) => !w.minimized).sort((a, b) => b.z - a.z)[0];
      let path = `/${locale}/`;
      if (focused?.payload.kind === "textedit") {
        const route = collectionRoute[focused.payload.collection];
        path = `/${locale}/${route}/${focused.payload.slug}/`;
      } else if (focused?.payload.kind === "finder") {
        const place = focused.payload.place;
        if (place === "desktop" || place.startsWith("tag:")) path = `/${locale}/`;
        else path = `/${locale}/${collectionRoute[place as Collection]}/`;
      } else if (focused?.payload.kind === "cv") {
        path = `/${locale}/about/`;
      }
      if (typeof window !== "undefined" && window.location.pathname !== path) {
        router.replace(path, { scroll: false });
      }
    },
    [locale, router]
  );

  const upsert: OsContextValue["upsert"] = useCallback((win) => {
    setWindows((prev) => {
      const existing = prev.find((w) => w.id === win.id);
      if (existing) {
        const next = prev.map((w) =>
          w.id === win.id
            ? {
                ...w,
                title: win.title,
                payload: win.payload,
                appId: win.appId,
                minimized: false,
                z: nextZ(),
              }
            : w
        );
        setFocusedId(win.id);
        return next;
      }
      const maximized = Boolean(win.maximized);
      const restored = win.bounds ?? defaultBounds(win.payload.kind, prev.length);
      const created: WindowState = {
        id: win.id,
        appId: win.appId,
        title: win.title,
        payload: win.payload,
        bounds: maximized ? fullscreenBounds() : restored,
        z: nextZ(),
        minimized: false,
        maximized,
        snapped: false,
        snapRegion: undefined,
        prevBounds: maximized ? restored : undefined,
      };
      setFocusedId(win.id);
      return [...prev, created];
    });
  }, []);

  const openFinder = useCallback(
    (place: FinderPlace) => {
      upsert({
        id: `finder-${place}`,
        appId: "finder",
        title: finderTitle(locale, place),
        payload: { kind: "finder", place },
      });
      const path =
        place === "desktop" || place.startsWith("tag:")
          ? `/${locale}/`
          : `/${locale}/${collectionRoute[place as Collection]}/`;
      if (typeof window !== "undefined" && window.location.pathname !== path) {
        router.push(path);
      }
    },
    [locale, router, upsert]
  );

  const openArticle = useCallback(
    (collection: Collection, slug: string, title?: string) => {
      const route = collectionRoute[collection];
      router.push(`/${locale}/${route}/${slug}/`);
      upsert({
        id: `textedit-${collection}-${slug}`,
        appId: "textedit",
        title: title ?? articleTitle(slug),
        payload: { kind: "textedit", collection, slug },
      });
    },
    [locale, router, upsert]
  );

  const openCv = useCallback(() => {
    upsert({
      id: "cv",
      appId: "cv",
      title: dict[locale].about,
      payload: { kind: "cv" },
    });
    router.push(`/${locale}/about/`);
  }, [locale, router, upsert]);

  const close = useCallback(
    (id: string) => {
      bodies.current.delete(id);
      setWindows((prev) => {
        const next = prev.filter((w) => w.id !== id);
        const focus =
          next.filter((w) => !w.minimized).sort((a, b) => b.z - a.z)[0]?.id ??
          null;
        setFocusedId(focus);
        queueMicrotask(() => syncUrl(next, focus));
        return next;
      });
    },
    [syncUrl]
  );

  const focus = useCallback((id: string) => {
    setWindows((prev) => {
      const next = prev.map((w) =>
        w.id === id ? { ...w, z: nextZ(), minimized: false } : w
      );
      setFocusedId(id);
      return next;
    });
  }, []);

  const minimize = useCallback((id: string) => {
    setWindows((prev) => {
      const next = prev.map((w) =>
        w.id === id ? { ...w, minimized: true } : w
      );
      const focus =
        next.filter((w) => !w.minimized).sort((a, b) => b.z - a.z)[0]?.id ??
        null;
      setFocusedId(focus);
      return next;
    });
  }, []);

  const restore = useCallback((id: string) => {
    focus(id);
  }, [focus]);

  const toggleMaximize = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;
        if (w.maximized) {
          return {
            ...w,
            maximized: false,
            snapped: false,
            snapRegion: undefined,
            bounds: windowedBounds(w, prev.length),
            z: nextZ(),
            minimized: false,
          };
        }
        return {
          ...w,
          maximized: true,
          snapped: false,
          snapRegion: undefined,
          prevBounds:
            w.snapped || isFullscreenLike(w.bounds)
              ? windowedBounds(w, prev.length)
              : w.bounds,
          bounds: fullscreenBounds(),
          z: nextZ(),
          minimized: false,
        };
      })
    );
    setFocusedId(id);
  }, []);

  const move = useCallback((id: string, partial: Partial<Bounds>) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;
        const base =
          w.maximized || w.snapped ? windowedBounds(w, prev.length) : w.bounds;
        return {
          ...w,
          maximized: false,
          snapped: false,
          snapRegion: undefined,
          bounds: clampBounds({ ...base, ...partial }),
        };
      })
    );
  }, []);

  const applySnap = useCallback((id: string, region: SnapRegion) => {
    if (region === "max") {
      setWindows((prev) =>
        prev.map((w) => {
          if (w.id !== id) return w;
          if (w.maximized) return { ...w, z: nextZ(), minimized: false };
          return {
            ...w,
            maximized: true,
            snapped: false,
            snapRegion: undefined,
            prevBounds:
              w.snapped || isFullscreenLike(w.bounds)
                ? windowedBounds(w, prev.length)
                : w.bounds,
            bounds: fullscreenBounds(),
            z: nextZ(),
            minimized: false,
          };
        })
      );
      setFocusedId(id);
      return;
    }
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;
        return {
          ...w,
          maximized: false,
          snapped: true,
          snapRegion: region,
          prevBounds:
            w.maximized || w.snapped
              ? windowedBounds(w, prev.length)
              : w.bounds,
          bounds: snapBounds(region),
          z: nextZ(),
          minimized: false,
        };
      })
    );
    setFocusedId(id);
  }, []);

  const setBody = useCallback((id: string, body: ReactNode) => {
    bodies.current.set(id, body);
    bump((n) => n + 1);
  }, []);

  const getBody = useCallback((id: string) => bodies.current.get(id) ?? null, []);

  const value = useMemo<OsContextValue>(
    () => ({
      locale,
      catalog,
      windows,
      focusedId,
      openFinder,
      openArticle,
      openCv,
      close,
      focus,
      minimize,
      restore,
      toggleMaximize,
      applySnap,
      move,
      upsert,
      setBody,
      getBody,
    }),
    [
      locale,
      catalog,
      windows,
      focusedId,
      openFinder,
      openArticle,
      openCv,
      close,
      focus,
      minimize,
      restore,
      toggleMaximize,
      applySnap,
      move,
      upsert,
      setBody,
      getBody,
    ]
  );

  return <OsCtx.Provider value={value}>{children}</OsCtx.Provider>;
}

export function useOs() {
  const ctx = useContext(OsCtx);
  if (!ctx) throw new Error("useOs must be used within OsProvider");
  return ctx;
}
