import Link from "next/link";

export default function NotFound() {
  return (
    <div className="main-col" style={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
      <div>
        <p className="eyebrow">404</p>
        <h1>Sayfa bulunamadı</h1>
        <p className="article-header__dek">
          Aradığınız sayfa taşınmış veya hiç var olmamış olabilir.
        </p>
        <p>
          <Link href="/tr/" className="eyebrow">
            ← Ana sayfaya dön
          </Link>
        </p>
      </div>
    </div>
  );
}
