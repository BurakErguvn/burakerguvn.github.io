import type { ReactNode } from "react";

interface CalloutProps {
  label?: string;
  children: ReactNode;
}

function CalloutBase({
  variant,
  label,
  children,
}: {
  variant: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className={`callout callout--${variant}`}>
      <div className="callout__label">{label}</div>
      <div className="callout__body">{children}</div>
    </div>
  );
}

export function Theorem({ label, children }: CalloutProps) {
  return (
    <CalloutBase variant="theorem" label={label ?? "Theorem"}>
      {children}
    </CalloutBase>
  );
}

export function Definition({ label, children }: CalloutProps) {
  return (
    <CalloutBase variant="definition" label={label ?? "Definition"}>
      {children}
    </CalloutBase>
  );
}

export function Lemma({ label, children }: CalloutProps) {
  return (
    <CalloutBase variant="lemma" label={label ?? "Lemma"}>
      {children}
    </CalloutBase>
  );
}

export function Callout({ label, children }: CalloutProps) {
  return (
    <CalloutBase variant="note" label={label ?? "Note"}>
      {children}
    </CalloutBase>
  );
}
