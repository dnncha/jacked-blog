const APP_STORE_URL = 'https://apps.apple.com/app/apple-store/id6757132605?pt=128406689&ct=press_kit&mt=8'

export const metadata = {
  title: 'Press and Creator Kit',
  description: 'Surpass product facts, iPhone app footage, images, and short vertical clips for editorial and creator coverage.',
  alternates: { canonical: 'https://jacked.coach/press' },
  openGraph: {
    title: 'Surpass Press and Creator Kit',
    description: 'Product facts and downloadable iPhone app footage for Surpass, a focused workout tracker for iPhone.',
    url: 'https://jacked.coach/press',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Surpass workout tracker for iPhone',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Surpass Press and Creator Kit',
    description: 'Product facts and downloadable iPhone app footage for Surpass, a focused workout tracker for iPhone.',
    images: ['/og-image.png'],
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
    title: 'Choose what to change',
    copy: 'Start with the first change you want the block to make visible.',
    image: '/marketing/surpass-visible-priority.png',
    imageAlt: 'Surpass screen for choosing a visible training priority',
  },
  {
    title: 'Run today’s session',
    copy: 'The next load, rep range, and weekly context stay close to the work.',
    image: '/marketing/surpass-build-home.png',
    imageAlt: 'Surpass Build screen showing a planned session and weekly muscle context',
  },
  {
    title: 'See what moved',
    copy: 'Compare recent lift results and weekly muscle coverage before the next block.',
    image: '/marketing/surpass-progress.png',
    imageAlt: 'Surpass Progress screen showing lift trends and weekly muscle coverage',
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
          Build the body people notice.
        </h1>
        <p style={{ maxWidth: '760px', margin: '0 0 30px', color: '#bcb6a8', fontSize: 'clamp(1.06rem, 2.3vw, 1.28rem)', lineHeight: 1.7 }}>
          Surpass is a focused iPhone training system. It combines fast set logging with previous results, next-set targets, RIR, rest timing, and weekly muscle-set targets—without requiring an account.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '64px' }}>
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-global-cta="press_kit_hero"
            data-app-store-placement="press_kit_hero"
            data-copy-version="press_promise_v1"
            aria-label="Start free with Surpass on iPhone"
            style={{ ...buttonStyle, color: '#111', background: '#e2c95f' }}
          >
            Start free on iPhone
          </a>
          <a href="#clips" style={{ ...buttonStyle, color: '#f5f1e8', border: '1px solid rgba(245,241,232,0.22)' }}>
            See product screens
          </a>
        </div>

        <section aria-labelledby="product-footage" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 'clamp(28px, 5vw, 72px)', alignItems: 'center', marginBottom: '80px' }}>
          <div>
            <p style={{ color: '#8f897c', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: '0.76rem', margin: '0 0 10px' }}>Current product screens</p>
            <h2 id="product-footage" style={{ margin: '0 0 16px', fontSize: 'clamp(2rem, 4vw, 3.3rem)', lineHeight: 1.02, letterSpacing: '-0.04em' }}>Real Surpass screens, ready to share.</h2>
            <p style={{ margin: '0 0 24px', color: '#aaa396', lineHeight: 1.7 }}>
              These captures show the current iPhone interface with prepared demo data: a visible priority, the next session, and the progress read that tells you what moved.
            </p>
            <a
              href="/marketing/surpass-build-home.png"
              download
              style={{ ...buttonStyle, color: '#111', background: '#f5f1e8' }}
            >
              Download product screen
            </a>
          </div>
          <img
            src="/marketing/surpass-build-home.png"
            alt="Surpass iPhone Build screen showing a planned session and weekly muscle context"
            style={{ display: 'block', width: 'min(100%, 390px)', maxHeight: '720px', objectFit: 'cover', margin: '0 auto', borderRadius: '26px', border: '1px solid rgba(245,241,232,0.14)', background: '#111', boxShadow: '0 28px 70px rgba(0,0,0,0.45)' }}
          />
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
          <p style={{ color: '#8f897c', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: '0.76rem', margin: '0 0 10px' }}>Share-ready screens</p>
          <h2 id="short-clips" style={{ margin: '0 0 14px', fontSize: 'clamp(2rem, 4vw, 3.3rem)', lineHeight: 1.02, letterSpacing: '-0.04em' }}>Three clean product moments.</h2>
          <p style={{ maxWidth: '700px', margin: '0 0 28px', color: '#aaa396', lineHeight: 1.7 }}>
            Each product screen is a current Surpass capture, ready for editorial or creator use.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '18px' }}>
            {clips.map(clip => (
              <article key={clip.image} style={{ padding: '14px', borderRadius: '20px', border: '1px solid rgba(245,241,232,0.1)', background: '#10100f' }}>
                <img
                  src={clip.image}
                  alt={clip.imageAlt}
                  loading="lazy"
                  decoding="async"
                  style={{ width: '100%', display: 'block', aspectRatio: '9 / 16', objectFit: 'cover', borderRadius: '13px', background: '#050505' }}
                />
                <div style={{ padding: '16px 6px 6px' }}>
                  <h3 style={{ margin: '0 0 8px', fontSize: '1.18rem', lineHeight: 1.2 }}>{clip.title}</h3>
                  <p style={{ margin: '0 0 16px', color: '#aaa396', lineHeight: 1.55 }}>{clip.copy}</p>
                  <a href={clip.image} download style={{ color: '#e2c95f', fontWeight: 800, textDecoration: 'none' }}>Download PNG</a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="usage-notes" style={{ padding: 'clamp(24px, 5vw, 42px)', background: '#f5f1e8', color: '#111', borderRadius: '20px' }}>
          <h2 id="usage-notes" style={{ margin: '0 0 14px', fontSize: 'clamp(1.8rem, 4vw, 2.7rem)', lineHeight: 1.08 }}>Editorial notes</h2>
          <p style={{ margin: '0 0 12px', color: '#4b473f', lineHeight: 1.7 }}>
            The screens use prepared demo data and may be cropped or captioned for editorial coverage. Surpass records user-entered training data; it does not provide form coaching from video or guarantee strength or muscle gain.
          </p>
          <p style={{ margin: 0, color: '#4b473f', lineHeight: 1.7 }}>
            For interviews, additional formats, or written responses, reply to the message that sent you this kit.
          </p>
        </section>
      </section>
    </div>
  )
}
