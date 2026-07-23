"use client";

export function PrintButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="cv-print"
      onClick={() => window.print()}
      aria-label={label}
    >
      {label}
    </button>
  );
}
