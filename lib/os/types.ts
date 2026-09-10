import type { ReactNode } from "react";
import type { Collection, PostMeta } from "@/lib/content-meta";
import type { Locale } from "@/lib/i18n";

export type AppId = "finder" | "textedit" | "cv";

export interface Bounds {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type FinderPlace = "desktop" | Collection | `tag:${string}`;

export type WindowPayload =
  | { kind: "finder"; place: FinderPlace }
  | { kind: "textedit"; collection: Collection; slug: string }
  | { kind: "cv" };

export type SnapRegion = "max" | "w" | "e" | "nw" | "ne" | "sw" | "se";

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  payload: WindowPayload;
  bounds: Bounds;
  z: number;
  minimized: boolean;
  maximized: boolean;
  snapped: boolean;
  snapRegion?: SnapRegion;
  prevBounds?: Bounds;
}

export type Catalog = Record<Collection, PostMeta[]>;

export interface OsContextValue {
  locale: Locale;
  catalog: Catalog;
  windows: WindowState[];
  focusedId: string | null;
  openFinder: (place: FinderPlace) => void;
  openArticle: (collection: Collection, slug: string, title?: string) => void;
  openCv: () => void;
  close: (id: string) => void;
  focus: (id: string) => void;
  minimize: (id: string) => void;
  restore: (id: string) => void;
  toggleMaximize: (id: string) => void;
  applySnap: (id: string, region: SnapRegion) => void;
  move: (id: string, bounds: Partial<Bounds>) => void;
  upsert: (win: Omit<WindowState, "z" | "minimized" | "maximized" | "snapped" | "bounds"> & {
    bounds?: Bounds;
    maximized?: boolean;
  }) => void;
  setBody: (id: string, body: ReactNode) => void;
  getBody: (id: string) => ReactNode;
}
