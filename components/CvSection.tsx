import type { ReactNode } from "react";

export function CvSection({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <section className="cv-section">
      <h2 className="cv-section__label">{label}</h2>
      <div className="cv-section__body">{children}</div>
    </section>
  );
}
