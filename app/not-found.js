import Link from 'next/link'

export const metadata = {
  title: { absolute: 'Page not found | Surpass' },
  description: 'Find the Surpass workout tracker, training tools, or support you were looking for.',
  robots: {
    index: false,
    follow: true,
  },
}

const APP_STORE_URL = 'https://apps.apple.com/app/apple-store/id6757132605?pt=128406689&ct=surpass_404&mt=8'

export default function NotFound() {
  return (
    <section
      style={{
        width: 'min(920px, calc(100% - 32px))',
        minHeight: '62vh',
        margin: '0 auto',
        padding: 'clamp(72px, 13vw, 150px) 0 90px',
        color: '#f5f1e8',
      }}
    >
      <p style={{ margin: 0, color: '#e2c95f', fontSize: '0.75rem', fontWeight: 850, letterSpacing: '0.16em' }}>
        SURPASS / 404
      </p>
      <h1 style={{ maxWidth: '700px', margin: '18px 0 18px', fontSize: 'clamp(3rem, 8vw, 6.8rem)', lineHeight: 0.92, letterSpacing: '-0.055em' }}>
        That page missed the set.
      </h1>
      <p style={{ maxWidth: '600px', margin: 0, color: '#bcb6a8', fontSize: '1.16rem', lineHeight: 1.7 }}>
        The link may be old or incomplete. Start at the workout tracker, use a training tool, or open Surpass on iPhone.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 30 }}>
        <Link
          href="/"
          style={{ display: 'inline-flex', alignItems: 'center', minHeight: 50, padding: '0 18px', borderRadius: 10, background: '#e2c95f', color: '#17150f', fontWeight: 850, textDecoration: 'none' }}
        >
          Back to Surpass
        </Link>
        <Link
          href="/tools"
          style={{ display: 'inline-flex', alignItems: 'center', minHeight: 50, padding: '0 18px', border: '1px solid rgba(245,241,232,0.2)', borderRadius: 10, color: '#f5f1e8', fontWeight: 750, textDecoration: 'none' }}
        >
          Browse training tools
        </Link>
        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-global-cta="404_store"
          data-app-store-placement="not_found"
          style={{ display: 'inline-flex', alignItems: 'center', minHeight: 50, padding: '0 18px', border: '1px solid rgba(226,201,95,0.48)', borderRadius: 10, color: '#e2c95f', fontWeight: 800, textDecoration: 'none' }}
        >
          Get the iPhone app
        </a>
      </div>
    </section>
  )
}
