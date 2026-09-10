"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { useOs } from "./WindowManager";
import type { WindowState } from "@/lib/os/types";
import { detectSnap, snapBounds, unstickBounds, type SnapRegion } from "@/lib/os/snap";

const HANDLES = [
  "n",
  "s",
  "e",
  "w",
  "ne",
  "nw",
  "se",
  "sw",
] as const;

export function WindowFrame({
  win,
  children,
}: {
  win: WindowState;
  children: ReactNode;
}) {
  const { focusedId, focus, close, minimize, toggleMaximize, move, applySnap } = useOs();
  const active = focusedId === win.id;
  const [preview, setPreview] = useState<SnapRegion | null>(null);
  const winRef = useRef(win);
  const moveRef = useRef(move);
  const snapRef = useRef(applySnap);
  winRef.current = win;
  moveRef.current = move;
  snapRef.current = applySnap;

  const drag = useRef<{
    kind: "move" | (typeof HANDLES)[number];
    ox: number;
    oy: number;
    start: typeof win.bounds;
    pinned: boolean;
    region: SnapRegion | null;
  } | null>(null);

  const startRef = useRef<{ startListening: () => void }>({
    startListening: () => {},
  });

  useEffect(() => {
    function onPointerMove(e: PointerEvent) {
      const d = drag.current;
      if (!d) return;
      const current = winRef.current;
      const dx = e.clientX - d.ox;
      const dy = e.clientY - d.oy;
      if (d.kind === "move") {
        if (d.pinned) {
          if (Math.hypot(dx, dy) < 8) return;
          const next = unstickBounds(current, e.clientX, e.clientY);
          d.pinned = false;
          d.start = next;
          d.ox = e.clientX;
          d.oy = e.clientY;
          moveRef.current(current.id, next);
          return;
        }
        moveRef.current(current.id, { x: d.start.x + dx, y: d.start.y + dy });
        d.region = detectSnap(e.clientX, e.clientY);
        setPreview(d.region);
        return;
      }
      let { x, y, w, h } = d.start;
      if (d.kind.includes("e")) w = d.start.w + dx;
      if (d.kind.includes("s")) h = d.start.h + dy;
      if (d.kind.includes("w")) {
        x = d.start.x + dx;
        w = d.start.w - dx;
      }
      if (d.kind.includes("n")) {
        y = d.start.y + dy;
        h = d.start.h - dy;
      }
      moveRef.current(current.id, { x, y, w, h });
    }

    function onPointerUp() {
      const d = drag.current;
      const region = d?.region ?? null;
      const id = winRef.current.id;
      drag.current = null;
      setPreview(null);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      if (d?.kind === "move" && !d.pinned && region) {
        snapRef.current(id, region);
      }
    }

    function startListening() {
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
    }

    startRef.current = { startListening };
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  function startDrag(kind: "move" | (typeof HANDLES)[number], e: ReactPointerEvent) {
    e.preventDefault();
    e.stopPropagation();
    focus(win.id);
    drag.current = {
      kind,
      ox: e.clientX,
      oy: e.clientY,
      start: { ...win.bounds },
      pinned: kind === "move" && (win.maximized || win.snapped),
      region: null,
    };
    startRef.current.startListening();
  }

  if (win.minimized) return null;

  const style = {
    left: win.bounds.x,
    top: win.bounds.y,
    width: win.bounds.w,
    height: win.bounds.h,
    zIndex: win.z,
  };

  const previewBox = preview ? snapBounds(preview) : null;

  return (
    <>
      {previewBox ? (
        <div
          className={`os-snap-preview${preview === "max" ? " is-max" : ""}`}
          style={{
            left: previewBox.x,
            top: previewBox.y,
            width: previewBox.w,
            height: previewBox.h,
          }}
        />
      ) : null}
      <div
        className={`os-window${active ? " is-active" : ""}${win.maximized ? " is-maximized" : ""}${win.snapped ? " is-snapped" : ""}`}
        style={style}
        onPointerDown={() => focus(win.id)}
        role="dialog"
        aria-label={win.title}
      >
        <div
          className="os-titlebar"
          onPointerDown={(e) => startDrag("move", e)}
          onDoubleClick={() => toggleMaximize(win.id)}
        >
          <div className="os-traffic" onPointerDown={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="os-traffic__btn os-traffic__btn--close"
              aria-label="Close"
              onClick={() => close(win.id)}
            />
            <button
              type="button"
              className="os-traffic__btn os-traffic__btn--min"
              aria-label="Minimize"
              onClick={() => minimize(win.id)}
            />
            <button
              type="button"
              className="os-traffic__btn os-traffic__btn--zoom"
              aria-label="Zoom"
              onClick={() => toggleMaximize(win.id)}
            />
          </div>
          <div className="os-titlebar__title">{win.title}</div>
        </div>
        <div className="os-window__body">{children}</div>
        {win.maximized
          ? null
          : HANDLES.map((h) => (
              <div
                key={h}
                className={`os-resize os-resize--${h}`}
                onPointerDown={(e) => startDrag(h, e)}
              />
            ))}
      </div>
    </>
  );
}
