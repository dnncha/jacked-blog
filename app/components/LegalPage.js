import Link from 'next/link'

export default function LegalPage({ title, intro, updated, children, links = true }) {
  return (
    <div style={{ background: '#050505', color: '#f5f1e8', minHeight: '100vh' }}>
      <style>{`
        .static-page a {
          color: #e2c95f;
          text-decoration: none;
          font-weight: 700;
        }

        .static-page a:hover {
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .static-page h2 {
          margin: 2.35rem 0 0.65rem;
          color: #fffaf0;
          font-size: 1.25rem;
          line-height: 1.25;
        }

        .static-page h3 {
          margin: 0 0 0.45rem;
          color: #fffaf0;
          font-size: 1.02rem;
        }

        .static-page p,
        .static-page li {
          color: #bcb6a8;
          line-height: 1.75;
        }

        .static-page ul {
          margin: 0.75rem 0 1.25rem;
          padding-left: 1.2rem;
        }

        .static-card {
          border: 1px solid rgba(245,241,232,0.12);
          border-radius: 8px;
          background: linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.022));
          padding: 22px;
        }

        .static-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-top: 22px;
        }

        .static-note {
          margin: 30px 0 0;
          padding: 24px;
          border: 1px solid rgba(226,201,95,0.38);
          border-radius: 8px;
          background: #10100f;
        }

        @media (max-width: 720px) {
          .static-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <section className="static-page" style={{ width: 'min(860px, calc(100% - 32px))', margin: '0 auto', padding: '68px 0 82px' }}>
        <Link href="/" style={{ display: 'inline-flex', marginBottom: '28px', color: '#bcb6a8', fontSize: '0.92rem' }}>
          Back to Jacked
        </Link>
        <h1 style={{ margin: 0, color: '#fffaf0', fontSize: 'clamp(2.65rem, 7vw, 5rem)', lineHeight: 0.95, fontWeight: 950, letterSpacing: 0 }}>
          {title}
        </h1>
        {updated && <p style={{ margin: '14px 0 0', color: '#8f897c', fontSize: '0.92rem', fontWeight: 650 }}>{updated}</p>}
        {intro && (
          <p style={{ maxWidth: '720px', margin: '24px 0 0', color: '#bcb6a8', fontSize: '1.12rem', lineHeight: 1.75 }}>
            {intro}
          </p>
        )}
        <div style={{ marginTop: '34px' }}>{children}</div>
        {links && (
          <div className="static-note">
            <h2 style={{ marginTop: 0 }}>Need something else?</h2>
            <p style={{ marginBottom: 0 }}>
              Go to <Link href="/support">Support</Link>, read the <Link href="/privacy">Privacy Policy</Link>, or review the <Link href="/terms">Terms of Service</Link>.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
