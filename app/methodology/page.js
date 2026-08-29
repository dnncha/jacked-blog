import Link from 'next/link'
import { appStoreUrl } from '../tools/toolData.mjs'

const pageUrl = 'https://jacked.coach/methodology'
const pageTitle = 'Training Calculator Methodology | How Surpass Makes Set Decisions'
const pageDescription = 'See how Surpass uses reps, RIR, rep ranges, recent performance, and weekly hard-set targets to produce transparent training guidance, with clear assumptions and privacy limits.'

const principles = [
  {
    number: '01',
    title: 'Start with a valid signal',
    copy: 'A recent set gives the method weight, reps, rep range, and—when available—reps in reserve. Missing or uncertain inputs reduce confidence instead of being disguised as precision.',
  },
  {
    number: '02',
    title: 'Choose the smallest useful move',
    copy: 'The next action can be add reps, add a small amount of load, hold steady, or reduce the target. The result depends on the range and effort target, not load alone.',
  },
  {
    number: '03',
    title: 'Keep context beside the set',
    copy: 'RIR, recent performance, rest timing, and weekly hard-set coverage make a number more useful than a one-off max estimate.',
  },
]

const methodNotes = [
  ['Next-set guidance', 'The method compares completed reps and RIR with the target range. Reaching the top of the range at the intended effort can justify a small load increase; otherwise, the safer action is usually more reps or the same load.'],
  ['Estimated one-rep max', 'Where the tool needs an e1RM, it combines common formulas such as Epley and Brzycki when the inputs are valid. An estimate is training context, not a tested personal record.'],
  ['RIR and RPE', 'RIR means the clean reps you believe remained. The simple conversion is RPE = 10 − RIR. It is useful only when execution and effort estimates are reasonably consistent.'],
  ['Weekly hard sets', 'The volume checker counts hard working sets by muscle and compares them with the selected target. It is a planning signal, not a direct measurement of muscle growth or recovery.'],
  ['Warm-ups and plates', 'The utility tools solve practical loading decisions from the target weight, bar, available plates, and exercise context. Rounding is made visible when the exact load is not possible.'],
]

const limitations = [
  'A calculator cannot see technique, range of motion, fatigue, pain, sleep, or the actual quality of a set.',
  'RIR is an estimate. High-rep sets, unfamiliar exercises, changing equipment, and inconsistent execution make the estimate noisier.',
  'Strength standards are practical reference points, not official rankings or guarantees of performance.',
  'Training guidance should be adjusted when a movement hurts, a clinician has given different advice, or the input no longer describes the current session.',
]

const faqs = [
  ['Does Surpass claim to predict muscle growth?', 'No. Surpass uses training history, effort, and volume as decision context. The tools do not directly measure muscle growth or guarantee an outcome.'],
  ['Is an estimated 1RM the same as a personal record?', 'No. An e1RM is calculated from a submaximal set. A personal record is a result you actually performed and logged.'],
  ['Are calculator inputs sent to a server?', 'The calculator inputs are handled in the browser. The privacy-safe web analytics contract records only bounded tool and context metadata, not exercise names, weights, reps, RIR, CSV contents, or result numbers.'],
]

export const metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: pageUrl },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: pageUrl,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Surpass training methodology' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description: pageDescription,
    images: ['/og-image.png'],
  },
}

export default function MethodologyPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: pageTitle,
        description: pageDescription,
        url: pageUrl,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jacked.coach/' },
            { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://jacked.coach/tools' },
            { '@type': 'ListItem', position: 3, name: 'Methodology', item: pageUrl },
          ],
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map(([question, answer]) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      },
    ],
  }

  return (
    <main style={{ background: '#050505', color: '#f5f1e8', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section style={{ width: 'min(1120px, calc(100% - 32px))', margin: '0 auto', padding: '76px 0 46px' }}>
        <p style={{ margin: '0 0 16px', color: '#f4cb65', fontSize: '0.76rem', fontWeight: 850, letterSpacing: '0.18em' }}>
          SURPASS / METHOD
        </p>
        <h1 style={{ maxWidth: '920px', margin: 0, fontSize: 'clamp(3rem, 8vw, 6.8rem)', lineHeight: 0.92, letterSpacing: '-0.045em', fontWeight: 950 }}>
          A clear method for the next useful decision.
        </h1>
        <p style={{ maxWidth: '760px', margin: '28px 0 0', color: '#bcb6a8', fontSize: 'clamp(1.05rem, 2vw, 1.3rem)', lineHeight: 1.7 }}>
          Surpass turns a recent set into training context: what to try next, how hard to take it, and how the work fits the week. This page explains the logic, the assumptions, and where the method stops.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '30px' }}>
          <Link href="/tools" style={{ display: 'inline-flex', alignItems: 'center', minHeight: '48px', padding: '0 20px', borderRadius: '12px', background: '#f4cb65', color: '#11100c', textDecoration: 'none', fontWeight: 850 }}>
            Try the free tools
          </Link>
          <a href={appStoreUrl('methodology', 'hero_cta')} target="_blank" rel="noopener noreferrer" data-global-cta="methodology_hero" data-app-store-placement="methodology_hero" style={{ display: 'inline-flex', alignItems: 'center', minHeight: '48px', padding: '0 20px', borderRadius: '12px', border: '1px solid rgba(245,241,232,0.24)', color: '#fff8ea', textDecoration: 'none', fontWeight: 800 }}>
            Start free on iPhone
          </a>
        </div>
      </section>

      <section style={{ width: 'min(1120px, calc(100% - 32px))', margin: '0 auto', padding: '12px 0 56px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '14px' }}>
          {principles.map((principle) => (
            <article key={principle.number} style={{ padding: '24px', minHeight: '190px', border: '1px solid rgba(245,241,232,0.12)', borderRadius: '16px', background: '#10100f' }}>
              <p style={{ margin: 0, color: '#f4cb65', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.14em' }}>{principle.number}</p>
              <h2 style={{ margin: '28px 0 10px', color: '#fffaf0', fontSize: '1.2rem', lineHeight: 1.2 }}>{principle.title}</h2>
              <p style={{ margin: 0, color: '#a9a294', lineHeight: 1.65 }}>{principle.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={{ width: 'min(920px, calc(100% - 32px))', margin: '0 auto', padding: '10px 0 64px' }}>
        <p style={{ margin: '0 0 12px', color: '#f4cb65', fontSize: '0.76rem', fontWeight: 850, letterSpacing: '0.16em' }}>THE DECISION LAYERS</p>
        <h2 style={{ margin: 0, fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1, letterSpacing: '-0.03em' }}>Useful context beats false precision.</h2>
        <div style={{ marginTop: '28px', borderTop: '1px solid rgba(245,241,232,0.16)' }}>
          {methodNotes.map(([title, copy]) => (
            <article key={title} style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 0.38fr) 1fr', gap: '28px', padding: '22px 0', borderBottom: '1px solid rgba(245,241,232,0.1)' }}>
              <h3 style={{ margin: 0, color: '#fffaf0', fontSize: '1.05rem' }}>{title}</h3>
              <p style={{ margin: 0, color: '#bcb6a8', lineHeight: 1.7 }}>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={{ width: 'min(1120px, calc(100% - 32px))', margin: '0 auto', padding: '0 0 64px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <article style={{ padding: '28px', borderRadius: '16px', background: '#f5f1e8', color: '#11100c' }}>
            <p style={{ margin: '0 0 10px', fontSize: '0.76rem', fontWeight: 900, letterSpacing: '0.14em' }}>ASSUMPTIONS</p>
            <h2 style={{ margin: '0 0 16px', fontSize: '2rem', lineHeight: 1.05 }}>The input still matters.</h2>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#4b473f', lineHeight: 1.7 }}>
              {limitations.map((limitation) => <li key={limitation} style={{ marginBottom: '9px' }}>{limitation}</li>)}
            </ul>
          </article>
          <article style={{ padding: '28px', borderRadius: '16px', border: '1px solid rgba(245,241,232,0.14)', background: '#10100f' }}>
            <p style={{ margin: '0 0 10px', color: '#f4cb65', fontSize: '0.76rem', fontWeight: 900, letterSpacing: '0.14em' }}>PRIVACY</p>
            <h2 style={{ margin: '0 0 16px', color: '#fffaf0', fontSize: '2rem', lineHeight: 1.05 }}>The web tool stays local.</h2>
            <p style={{ margin: 0, color: '#bcb6a8', lineHeight: 1.7 }}>
              Calculator inputs are handled in the browser. The site’s optional analytics records only bounded tool and context metadata. It does not send entered exercise names, weights, reps, RIR, bodyweight, CSV contents, email addresses, or result numbers.
            </p>
            <p style={{ margin: '16px 0 0', color: '#bcb6a8', lineHeight: 1.7 }}>
              Read the full <Link href="/privacy" style={{ color: '#f4cb65' }}>Privacy Policy</Link> before using the tools.
            </p>
          </article>
        </div>
      </section>

      <section style={{ width: 'min(920px, calc(100% - 32px))', margin: '0 auto', padding: '0 0 64px' }}>
        <h2 style={{ margin: '0 0 22px', fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1 }}>Common questions</h2>
        <div style={{ display: 'grid', gap: '12px' }}>
          {faqs.map(([question, answer]) => (
            <article key={question} style={{ padding: '20px 22px', border: '1px solid rgba(245,241,232,0.12)', borderRadius: '14px', background: '#10100f' }}>
              <h3 style={{ margin: '0 0 8px', color: '#fffaf0', fontSize: '1.05rem' }}>{question}</h3>
              <p style={{ margin: 0, color: '#a9a294', lineHeight: 1.65 }}>{answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={{ width: 'min(920px, calc(100% - 32px))', margin: '0 auto', padding: '0 0 88px' }}>
        <div style={{ padding: '30px', borderRadius: '18px', background: '#191714', border: '1px solid rgba(244,203,101,0.25)' }}>
          <p style={{ margin: '0 0 10px', color: '#f4cb65', fontSize: '0.76rem', fontWeight: 900, letterSpacing: '0.14em' }}>PUT IT TO WORK</p>
          <h2 style={{ margin: '0 0 12px', color: '#fffaf0', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', lineHeight: 1.05 }}>Check the method. Then build with intent.</h2>
          <p style={{ maxWidth: '670px', margin: '0 0 22px', color: '#bcb6a8', lineHeight: 1.7 }}>Use a calculator for one decision, or run the complete session in Surpass with targets, rest timing, history, and progress review together.</p>
          <Link href="/tools" style={{ display: 'inline-flex', alignItems: 'center', minHeight: '46px', padding: '0 18px', borderRadius: '11px', background: '#f4cb65', color: '#11100c', textDecoration: 'none', fontWeight: 850 }}>
            Explore the training tools
          </Link>
        </div>
      </section>
    </main>
  )
}
