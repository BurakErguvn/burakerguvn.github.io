import type { Bounds, SnapRegion, WindowState } from "@/lib/os/types";

export type { SnapRegion };

export const MERGED_BAR = 36;
const EDGE = 24;
const CORNER = 52;
const MIN_W = 320;
const MIN_H = 240;

export function mergesMenuBar(win?: Pick<WindowState, "maximized" | "snapRegion"> | null) {
  if (!win) return false;
  if (win.maximized) return true;
  const region = win.snapRegion;
  return region === "w" || region === "e" || region === "nw" || region === "ne";
}

export function detectSnap(x: number, y: number): SnapRegion | null {
  if (typeof window === "undefined") return null;
  const W = window.innerWidth;
  const H = window.innerHeight;
  const nearLeft = x <= CORNER;
  const nearRight = x >= W - CORNER;
  const nearTop = y <= CORNER;
  const nearBottom = y >= H - CORNER;
  const left = x <= EDGE;
  const right = x >= W - EDGE;
  const top = y <= EDGE;
  const bottom = y >= H - EDGE;

  if (nearTop && nearLeft) return "nw";
  if (nearTop && nearRight) return "ne";
  if (nearBottom && nearLeft) return "sw";
  if (nearBottom && nearRight) return "se";
  if (left) return "w";
  if (right) return "e";
  if (top) return "max";
  if (bottom) return null;
  return null;
}

export function snapBounds(region: SnapRegion): Bounds {
  if (typeof window === "undefined") {
    return { x: 0, y: MERGED_BAR, w: 1200, h: 800 };
  }
  const W = window.innerWidth;
  const H = window.innerHeight;
  const top = MERGED_BAR;
  const workH = Math.max(MIN_H, H - top);
  const hw = Math.floor(W / 2);
  const hh = Math.floor(workH / 2);
  switch (region) {
    case "max":
      return { x: 0, y: top, w: Math.max(MIN_W, W), h: workH };
    case "w":
      return { x: 0, y: top, w: hw, h: workH };
    case "e":
      return { x: hw, y: top, w: W - hw, h: workH };
    case "nw":
      return { x: 0, y: top, w: hw, h: hh };
    case "ne":
      return { x: hw, y: top, w: W - hw, h: hh };
    case "sw":
      return { x: 0, y: top + hh, w: hw, h: workH - hh };
    case "se":
      return { x: hw, y: top + hh, w: W - hw, h: workH - hh };
  }
}

export function unstickBounds(win: WindowState, clientX: number, clientY: number): Bounds {
  const rest = win.prevBounds ?? { x: 90, y: 80, w: 760, h: 540 };
  const ratio = win.bounds.w > 0 ? (clientX - win.bounds.x) / win.bounds.w : 0.5;
  const grabbed = Math.min(0.88, Math.max(0.12, ratio));
  return {
    ...rest,
    x: clientX - rest.w * grabbed,
    y: Math.max(0, clientY - 14),
  };
}
