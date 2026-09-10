function PngIcon({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  return (
    <img
      className={className}
      src={src}
      alt=""
      width={128}
      height={128}
      draggable={false}
    />
  );
}

export function ZipIcon({ className }: { className?: string }) {
  return <PngIcon className={className} src="/icons/winrar-zip.png" />;
}

export function MdxIcon({ className }: { className?: string }) {
  return <PngIcon className={className} src="/icons/mdx.png" />;
}

export function FinderIcon({ className }: { className?: string }) {
  return <PngIcon className={className} src="/icons/finder.png" />;
}

export function FolderIcon({ className }: { className?: string }) {
  return <PngIcon className={className} src="/icons/finder.png" />;
}

export function TagDot({
  className,
  color,
}: {
  className?: string;
  color: string;
}) {
  return (
    <svg className={className} viewBox="0 0 12 12" aria-hidden="true">
      <circle cx="6" cy="6" r="5" fill={color} stroke="rgba(0,0,0,0.18)" />
    </svg>
  );
}

export function TextEditIcon({ className }: { className?: string }) {
  return <PngIcon className={className} src="/icons/textedit.png" />;
}

export function CvIcon({ className }: { className?: string }) {
  return <PngIcon className={className} src="/icons/cv.png" />;
}

export function BeMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#2a2a2e" />
      <text
        x="16"
        y="22"
        textAnchor="middle"
        fontFamily="IBM Plex Mono, ui-monospace, monospace"
        fontSize="16"
        fontWeight="600"
        fill="#f4f4f5"
      >
        be.
      </text>
      <circle cx="26.5" cy="7" r="2.4" fill="#5aa6ff" />
    </svg>
  );
}
