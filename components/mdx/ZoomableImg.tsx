"use client";

import { useEffect, useState, type ImgHTMLAttributes } from "react";
import { createPortal } from "react-dom";

export function ZoomableImg(props: ImgHTMLAttributes<HTMLImageElement>) {
  const { alt = "", src, ...rest } = props;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <img
        {...rest}
        alt={alt}
        src={src}
        loading="lazy"
        onClick={() => src && setOpen(true)}
        style={{ cursor: "zoom-in" }}
      />
      {open && src
        ? createPortal(
            <div
              className="lightbox"
              role="dialog"
              aria-modal="true"
              aria-label={alt || "Büyütülmüş görsel"}
              onClick={() => setOpen(false)}
            >
              <img className="lightbox__img" src={src} alt={alt} />
              {alt ? <div className="lightbox__caption">{alt}</div> : null}
              <div className="lightbox__hint">ESC · kapat</div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
