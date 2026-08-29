export const metadata = {
  title: 'About',
  description: 'Surpass is an iPhone strength-training app built around visible priorities, focused sessions, fast set logging, and useful progress review.',
  alternates: {
    canonical: 'https://jacked.coach/about',
  },
  openGraph: {
    title: 'About Surpass',
    description: 'Surpass is an iPhone strength-training app built around visible priorities, focused sessions, fast set logging, and useful progress review.',
    url: 'https://jacked.coach/about',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Surpass - iPhone hypertrophy workout tracker',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Surpass',
    description: 'Surpass is an iPhone strength-training app built around visible priorities, focused sessions, fast set logging, and useful progress review.',
    images: ['/og-image.png'],
  },
}

const appStoreUrl = 'https://apps.apple.com/app/apple-store/id6757132605?pt=128406689&ct=surpass_coach_about&mt=8'

export default function About() {
  return (
    <div style={{ background: '#050505', color: '#f5f1e8', minHeight: '100vh' }}>
      <section style={{ width: 'min(920px, calc(100% - 32px))', margin: '0 auto', padding: '72px 0' }}>
        <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5.6rem)', lineHeight: 0.92, fontWeight: 950, margin: '0 0 22px', letterSpacing: 0 }}>
          Surpass is built for the actual workout.
        </h1>

        <p style={{ fontSize: '1.18rem', lineHeight: 1.75, color: '#bcb6a8', margin: '0 0 34px', maxWidth: '760px' }}>
          The app is for lifters who want a visible priority and a session that earns its place: what to train today, what load to try next, how long to rest, what came across from old history, and what the work changed.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', margin: '30px 0 44px' }}>
          {[
            ['Choose the change', 'Start with the muscle or outcome you want to make more obvious, then let the block stay focused.'],
            ['Train the session', 'Set targets, recent performance, and rest timing stay close to the work instead of hiding in separate screens.'],
            ['See what moved', 'PRs, weekly hard sets, measurements, and workout receipts make the result easier to read.'],
            ['Bring your history', 'Compatible Hevy import keeps routines, workouts, notes, and set history useful from the first session.'],
          ].map(([title, copy]) => (
            <div key={title} style={{ padding: '22px', borderRadius: '14px', border: '1px solid rgba(245,241,232,0.1)', background: '#10100f' }}>
              <h2 style={{ fontSize: '1.1rem', margin: '0 0 8px', color: '#fffaf0' }}>{title}</h2>
              <p style={{ margin: 0, color: '#a9a294', lineHeight: 1.6 }}>{copy}</p>
            </div>
          ))}
        </div>

        <section style={{ padding: '34px', background: '#f5f1e8', color: '#111', borderRadius: '18px' }}>
          <h2 style={{ margin: '0 0 12px', fontSize: '2rem', lineHeight: 1.1 }}>The site supports the app.</h2>
          <p style={{ margin: '0 0 22px', color: '#4b473f', lineHeight: 1.7 }}>
            The Surpass training library covers hypertrophy, progressive overload, RIR, deloads, exercise selection, recovery, supplements, and workout tracking. The app turns those ideas into a live session workflow on iPhone.
          </p>
          <a
            href={appStoreUrl}
            data-global-cta="about_final"
            data-app-store-placement="about_final"
            data-copy-version="about_promise_v1"
            aria-label="Start free with Surpass on iPhone"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '48px',
              padding: '0 22px',
              background: '#111',
              color: '#fffaf0',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: 800,
            }}
          >
            Start free on iPhone
          </a>
        </section>
      </section>
    </div>
  )
}
