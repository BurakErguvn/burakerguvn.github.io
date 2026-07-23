import Link from "next/link";

export default function RootPage() {
  return (
    <>
      <meta httpEquiv="refresh" content="0; url=/tr/" />
      <p style={{ fontFamily: "monospace", padding: "2rem" }}>
        Yönlendiriliyor… <Link href="/tr">/tr</Link>
      </p>
    </>
  );
}
