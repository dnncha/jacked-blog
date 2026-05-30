export const metadata = {
  title: 'About',
  description: 'Jacked is an iPhone hypertrophy workout tracker built around fast set logging, progressive overload, Hevy import, and useful progress review.',
  alternates: {
    canonical: 'https://jacked.coach/about',
  },
  openGraph: {
    title: 'About Jacked',
    description: 'Jacked is an iPhone hypertrophy workout tracker built around fast set logging, progressive overload, Hevy import, and useful progress review.',
    url: 'https://jacked.coach/about',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Jacked - iPhone hypertrophy workout tracker',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Jacked',
    description: 'Jacked is an iPhone hypertrophy workout tracker built around fast set logging, progressive overload, Hevy import, and useful progress review.',
    images: ['/og-image.png'],
  },
}

const appStoreUrl = 'https://apps.apple.com/us/app/jacked/id6757132605?utm_source=jacked_coach&utm_medium=about_page&utm_campaign=ios_install'

export default function About() {
  return (
    <div style={{ background: '#050505', color: '#f5f1e8', minHeight: '100vh' }}>
      <section style={{ width: 'min(920px, calc(100% - 32px))', margin: '0 auto', padding: '72px 0' }}>
        <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5.6rem)', lineHeight: 0.92, fontWeight: 950, margin: '0 0 22px', letterSpacing: 0 }}>
          Jacked is built for the actual workout.
        </h1>

        <p style={{ fontSize: '1.18rem', lineHeight: 1.75, color: '#bcb6a8', margin: '0 0 34px', maxWidth: '760px' }}>
          The app is an iPhone hypertrophy tracker for lifters who care about session execution: what to train today, what load to try next, how long to rest, what was imported from old history, and whether training is moving in the right direction.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', margin: '30px 0 44px' }}>
          {[
            ['Now Training', 'Today and Train center the active session, focused exercise, rest timer, and next planned sets.'],
            ['Progressive overload', 'Set targets and RIR-aware suggestions translate recent performance into a clear next attempt.'],
            ['Progress evidence', 'PRs, weekly muscle sets, measurements, body weight, and proof photos live together under Progress.'],
            ['Migration friendly', 'Hevy import preserves routines, workouts, measurements, exercise notes, and technique-set context.'],
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
            Jacked.coach is the training library for search traffic around hypertrophy, progressive overload, RIR, deloads, exercise selection, recovery, supplements, and workout tracking. The app turns those ideas into a live session workflow on iPhone.
          </p>
          <a
            href={appStoreUrl}
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
            Open the App Store listing
          </a>
        </section>
      </section>
    </div>
  )
}
