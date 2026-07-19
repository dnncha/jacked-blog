const APP_STORE_URL = 'https://apps.apple.com/app/apple-store/id6757132605?pt=128406689&ct=press_kit&mt=8'

export const metadata = {
  title: 'Press and Creator Kit',
  description: 'Jacked product facts, iPhone app footage, images, and short vertical clips for editorial and creator coverage.',
  alternates: { canonical: 'https://jacked.coach/press' },
  openGraph: {
    title: 'Jacked Press and Creator Kit',
    description: 'Product facts and downloadable iPhone app footage for Jacked, a focused workout tracker for iPhone.',
    url: 'https://jacked.coach/press',
    images: [{
      url: '/marketing/generated/jacked-acquisition-social.jpg',
      width: 1200,
      height: 630,
      alt: 'Jacked workout tracker for iPhone',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jacked Press and Creator Kit',
    description: 'Product facts and downloadable iPhone app footage for Jacked, a focused workout tracker for iPhone.',
    images: ['/marketing/generated/jacked-acquisition-social.jpg'],
  },
}

const facts = [
  ['Platform', 'Native iPhone app'],
  ['Availability', 'Currently free; see the App Store for current availability'],
  ['Account', 'No account required'],
  ['Data', 'Workout history is stored locally on the iPhone'],
  ['Focus', 'Fast set logging, next-set targets, RIR, rest timing, and weekly hard-set targets'],
  ['Imports', 'Compatible CSV imports from Hevy, Strong, and FitNotes'],
]

const clips = [
  {
    title: 'Know your next lift',
    copy: 'Previous performance, target load, and rep range inside the active workout.',
    video: '/press/creator-next-lift.mp4',
    poster: '/press/creator-next-lift-thumbnail.png',
    duration: '8.5 seconds',
  },
  {
    title: 'Log a working set quickly',
    copy: 'Weight, reps, RIR, and the rest timer stay in the session flow.',
    video: '/press/creator-log-fast.mp4',
    poster: '/press/creator-log-fast-thumbnail.png',
    duration: '10 seconds',
  },
  {
    title: 'See weekly muscle targets',
    copy: 'Completed hard sets and sets left are visible by muscle group.',
    video: '/press/creator-weekly-targets.mp4',
    poster: '/press/creator-weekly-targets-thumbnail.png',
    duration: '11.6 seconds',
  },
]

const buttonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '48px',
  padding: '0 20px',
  borderRadius: '10px',
  textDecoration: 'none',
  fontWeight: 800,
}

export default function PressPage() {
  return (
    <div style={{ background: '#050505', color: '#f5f1e8', minHeight: '100vh' }}>
      <section style={{ width: 'min(1120px, calc(100% - 32px))', margin: '0 auto', padding: '68px 0 84px' }}>
        <p style={{ margin: '0 0 18px', color: '#e2c95f', fontSize: '0.82rem', fontWeight: 850, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          Press and creator kit
        </p>
        <h1 style={{ maxWidth: '920px', margin: '0 0 24px', fontSize: 'clamp(3rem, 8vw, 6.4rem)', fontWeight: 950, letterSpacing: '-0.055em', lineHeight: 0.92 }}>
          Jacked keeps the next set clear.
        </h1>
        <p style={{ maxWidth: '760px', margin: '0 0 30px', color: '#bcb6a8', fontSize: 'clamp(1.06rem, 2.3vw, 1.28rem)', lineHeight: 1.7 }}>
          Jacked is a focused workout tracker for iPhone. It combines fast set logging with previous results, next-set targets, RIR, rest timing, and weekly muscle-set targets—without requiring an account.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '64px' }}>
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-global-cta="press_kit_hero"
            style={{ ...buttonStyle, color: '#111', background: '#e2c95f' }}
          >
            View Jacked on the App Store
          </a>
          <a href="#clips" style={{ ...buttonStyle, color: '#f5f1e8', border: '1px solid rgba(245,241,232,0.22)' }}>
            Download short clips
          </a>
        </div>

        <section aria-labelledby="product-footage" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 'clamp(28px, 5vw, 72px)', alignItems: 'center', marginBottom: '80px' }}>
          <div>
            <p style={{ color: '#8f897c', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: '0.76rem', margin: '0 0 10px' }}>29-second product walkthrough</p>
            <h2 id="product-footage" style={{ margin: '0 0 16px', fontSize: 'clamp(2rem, 4vw, 3.3rem)', lineHeight: 1.02, letterSpacing: '-0.04em' }}>Real app footage, ready to embed.</h2>
            <p style={{ margin: '0 0 24px', color: '#aaa396', lineHeight: 1.7 }}>
              This walkthrough shows the current iPhone interface with seeded demo workout data. It covers the training dashboard, active set logging, next-set guidance, and weekly targets.
            </p>
            <a
              href="/marketing/jacked-app-preview-480.mp4"
              download
              style={{ ...buttonStyle, color: '#111', background: '#f5f1e8' }}
            >
              Download product walkthrough
            </a>
          </div>
          <video
            controls
            playsInline
            preload="metadata"
            poster="/marketing/jacked-app-preview-poster.png"
            aria-label="Jacked iPhone app product walkthrough"
            style={{ display: 'block', width: 'min(100%, 390px)', maxHeight: '720px', margin: '0 auto', borderRadius: '26px', border: '1px solid rgba(245,241,232,0.14)', background: '#111', boxShadow: '0 28px 70px rgba(0,0,0,0.45)' }}
          >
            <source src="/marketing/jacked-app-preview-480.mp4" type="video/mp4" />
          </video>
        </section>

        <section aria-labelledby="product-facts" style={{ marginBottom: '80px' }}>
          <p style={{ color: '#8f897c', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: '0.76rem', margin: '0 0 10px' }}>Product facts</p>
          <h2 id="product-facts" style={{ margin: '0 0 26px', fontSize: 'clamp(2rem, 4vw, 3.3rem)', lineHeight: 1.02, letterSpacing: '-0.04em' }}>The short version.</h2>
          <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '12px', margin: 0 }}>
            {facts.map(([label, value]) => (
              <div key={label} style={{ padding: '22px', borderRadius: '14px', border: '1px solid rgba(245,241,232,0.1)', background: '#10100f' }}>
                <dt style={{ color: '#e2c95f', fontSize: '0.75rem', fontWeight: 850, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '7px' }}>{label}</dt>
                <dd style={{ margin: 0, color: '#f5f1e8', lineHeight: 1.55, fontWeight: 650 }}>{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="clips" aria-labelledby="short-clips" style={{ marginBottom: '80px', scrollMarginTop: '90px' }}>
          <p style={{ color: '#8f897c', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: '0.76rem', margin: '0 0 10px' }}>Vertical clips</p>
          <h2 id="short-clips" style={{ margin: '0 0 14px', fontSize: 'clamp(2rem, 4vw, 3.3rem)', lineHeight: 1.02, letterSpacing: '-0.04em' }}>Three clean product moments.</h2>
          <p style={{ maxWidth: '700px', margin: '0 0 28px', color: '#aaa396', lineHeight: 1.7 }}>
            Each H.264 clip is 1080 × 1920, silent, and ready for short-form editorial or creator use.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '18px' }}>
            {clips.map(clip => (
              <article key={clip.video} style={{ padding: '14px', borderRadius: '20px', border: '1px solid rgba(245,241,232,0.1)', background: '#10100f' }}>
                <video
                  controls
                  playsInline
                  preload="metadata"
                  poster={clip.poster}
                  aria-label={`${clip.title} Jacked app clip`}
                  style={{ width: '100%', display: 'block', aspectRatio: '9 / 16', objectFit: 'cover', borderRadius: '13px', background: '#050505' }}
                >
                  <source src={clip.video} type="video/mp4" />
                </video>
                <div style={{ padding: '16px 6px 6px' }}>
                  <p style={{ color: '#8f897c', margin: '0 0 6px', fontSize: '0.78rem', fontWeight: 750 }}>{clip.duration}</p>
                  <h3 style={{ margin: '0 0 8px', fontSize: '1.18rem', lineHeight: 1.2 }}>{clip.title}</h3>
                  <p style={{ margin: '0 0 16px', color: '#aaa396', lineHeight: 1.55 }}>{clip.copy}</p>
                  <a href={clip.video} download style={{ color: '#e2c95f', fontWeight: 800, textDecoration: 'none' }}>Download MP4</a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="usage-notes" style={{ padding: 'clamp(24px, 5vw, 42px)', background: '#f5f1e8', color: '#111', borderRadius: '20px' }}>
          <h2 id="usage-notes" style={{ margin: '0 0 14px', fontSize: 'clamp(1.8rem, 4vw, 2.7rem)', lineHeight: 1.08 }}>Editorial notes</h2>
          <p style={{ margin: '0 0 12px', color: '#4b473f', lineHeight: 1.7 }}>
            The footage uses seeded demo data and may be cropped or captioned for editorial coverage. Jacked records user-entered training data; it does not provide form coaching from video or guarantee strength or muscle gain.
          </p>
          <p style={{ margin: 0, color: '#4b473f', lineHeight: 1.7 }}>
            For interviews, additional formats, or written responses, reply to the message that sent you this kit.
          </p>
        </section>
      </section>
    </div>
  )
}
