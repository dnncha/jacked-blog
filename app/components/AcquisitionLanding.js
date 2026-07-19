import Link from 'next/link'

function AppStoreLink({ href, placement, children = 'View Jacked on the App Store' }) {
  return (
    <a
      className="acquisition-store-link"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-global-cta={placement}
    >
      <span aria-hidden="true"></span>
      <span>
        <small>Download free on iPhone</small>
        {children}
      </span>
    </a>
  )
}

export default function AcquisitionLanding({
  eyebrow,
  title,
  intro,
  campaignUrl,
  campaignKey,
  heroImage,
  heroImageAlt,
  benefits,
  steps,
  comparison,
  faqs,
  related,
  finalTitle,
  finalCopy,
  heroPresentation = 'photo',
  benefitsTitle = 'Less admin between sets. More useful training context.',
  benefitsIntro = 'Jacked keeps the details that change your next decision inside the active workout.',
  flowTitle = 'From your last result to the next working set.',
  flowIntro = 'The app stays focused on the workout you are running, not a feed or a generic dashboard.',
  comparisonTitle = 'A training log should help with the next decision.',
  comparisonIntro = 'History is most useful when it is visible before the set it affects.',
  comparisonLabel = 'Basic workout log and Jacked comparison',
  faqTitle = 'Questions lifters ask before switching.',
}) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  }

  return (
    <div className="acquisition-page">
      <style>{`
        :root {
          --acq-gold: #f5b935;
          --acq-gold-bright: #ffd46a;
          --acq-text: #fff8ea;
          --acq-muted: #b8b0a2;
          --acq-line: rgba(255, 248, 234, 0.14);
          --acq-panel: #11110f;
        }

        .acquisition-page,
        .acquisition-page * { box-sizing: border-box; }

        .acquisition-page {
          color: var(--acq-text);
          background: #050505;
        }

        .acquisition-wrap {
          width: min(1120px, calc(100% - 32px));
          margin: 0 auto;
        }

        .acquisition-hero {
          min-height: 690px;
          display: grid;
          align-items: center;
          border-bottom: 1px solid var(--acq-line);
          background:
            linear-gradient(90deg, rgba(3,3,3,0.98) 0%, rgba(3,3,3,0.82) 44%, rgba(3,3,3,0.28) 78%, rgba(3,3,3,0.18) 100%),
            linear-gradient(180deg, transparent 52%, #050505 100%),
            var(--acq-hero-image) 68% center / cover no-repeat;
        }

        .acquisition-hero.screen {
          background:
            linear-gradient(90deg, rgba(3,3,3,1) 0%, rgba(3,3,3,0.94) 46%, rgba(3,3,3,0.42) 70%, rgba(3,3,3,0.12) 100%),
            linear-gradient(180deg, transparent 70%, #050505 100%),
            var(--acq-hero-image) calc(100% - 8vw) center / auto 82% no-repeat,
            #050505;
        }

        .acquisition-hero-copy { max-width: 690px; padding: 76px 0 88px; }

        .acquisition-eyebrow {
          margin: 0 0 16px;
          color: var(--acq-gold);
          font-size: 0.8rem;
          font-weight: 850;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .acquisition-hero h1 {
          max-width: 780px;
          margin: 0;
          font-size: clamp(3rem, 7vw, 6rem);
          line-height: 0.96;
          letter-spacing: -0.055em;
          font-weight: 950;
        }

        .acquisition-hero-copy > p:not(.acquisition-eyebrow) {
          max-width: 650px;
          margin: 24px 0 0;
          color: var(--acq-muted);
          font-size: clamp(1.05rem, 2vw, 1.22rem);
          line-height: 1.65;
        }

        .acquisition-actions { margin-top: 30px; }

        .acquisition-store-link {
          display: inline-flex;
          align-items: center;
          gap: 13px;
          min-height: 62px;
          padding: 0 22px;
          border: 1px solid rgba(255,255,255,0.24);
          border-radius: 10px;
          color: #11100c;
          background: linear-gradient(180deg, var(--acq-gold-bright), var(--acq-gold));
          box-shadow: 0 16px 38px rgba(245,185,53,0.2);
          text-decoration: none;
          font-size: 1.04rem;
          font-weight: 850;
        }

        .acquisition-store-link > span:first-child { font-size: 2rem; line-height: 1; }
        .acquisition-store-link > span:last-child { display: grid; line-height: 1.12; }
        .acquisition-store-link small { font-size: 0.68rem; font-weight: 730; }

        .acquisition-store-note {
          margin: 13px 0 0;
          color: #9d9689;
          font-size: 0.84rem;
          font-weight: 650;
        }

        .acquisition-section { padding: 88px 0; border-bottom: 1px solid var(--acq-line); }
        .acquisition-section.soft { background: #0a0a09; }

        .acquisition-heading { max-width: 740px; margin-bottom: 38px; }
        .acquisition-heading h2 {
          margin: 0;
          font-size: clamp(2rem, 4vw, 3.4rem);
          line-height: 1.06;
          letter-spacing: -0.04em;
        }
        .acquisition-heading p { margin: 15px 0 0; color: var(--acq-muted); font-size: 1.04rem; }

        .acquisition-benefits {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .acquisition-card {
          padding: 27px;
          border: 1px solid var(--acq-line);
          border-radius: 12px;
          background: linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.022));
        }
        .acquisition-card span {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          margin-bottom: 18px;
          border-radius: 8px;
          color: #111;
          background: var(--acq-gold);
          font-weight: 900;
        }
        .acquisition-card h3 { margin: 0; font-size: 1.2rem; line-height: 1.25; }
        .acquisition-card p { margin: 11px 0 0; color: var(--acq-muted); line-height: 1.65; }

        .acquisition-flow { display: grid; grid-template-columns: 0.82fr 1.18fr; gap: 56px; align-items: center; }
        .acquisition-photo {
          width: 100%;
          min-height: 520px;
          object-fit: cover;
          border: 1px solid var(--acq-line);
          border-radius: 14px;
          filter: saturate(0.8) contrast(1.05);
        }
        .acquisition-photo.screen {
          max-height: 680px;
          padding: 20px;
          object-fit: contain;
          background: #090a0c;
        }
        .acquisition-steps { display: grid; gap: 12px; }
        .acquisition-step { display: grid; grid-template-columns: 46px 1fr; gap: 16px; padding: 20px 0; border-bottom: 1px solid var(--acq-line); }
        .acquisition-step > strong { color: var(--acq-gold); font-size: 1.15rem; }
        .acquisition-step h3 { margin: 0; font-size: 1.12rem; }
        .acquisition-step p { margin: 6px 0 0; color: var(--acq-muted); }

        .acquisition-comparison { overflow: hidden; border: 1px solid var(--acq-line); border-radius: 12px; }
        .acquisition-comparison-row { display: grid; grid-template-columns: 0.72fr 1fr 1fr; }
        .acquisition-comparison-row + .acquisition-comparison-row { border-top: 1px solid var(--acq-line); }
        .acquisition-comparison-row > * { padding: 19px 22px; }
        .acquisition-comparison-row > * + * { border-left: 1px solid var(--acq-line); }
        .acquisition-comparison-row strong { color: #f7f0df; }
        .acquisition-comparison-row span { color: var(--acq-muted); }
        .acquisition-comparison-head { background: #171512; font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 850; }
        .acquisition-comparison-head > *:last-child { color: var(--acq-gold); }

        .acquisition-faq { display: grid; gap: 10px; }
        .acquisition-faq details { padding: 21px 23px; border: 1px solid var(--acq-line); border-radius: 10px; background: var(--acq-panel); }
        .acquisition-faq summary { cursor: pointer; font-weight: 800; }
        .acquisition-faq p { margin: 12px 0 0; color: var(--acq-muted); }

        .acquisition-related { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 28px; }
        .acquisition-related a { padding: 9px 13px; border: 1px solid var(--acq-line); border-radius: 999px; color: #e8d67b; text-decoration: none; font-size: 0.88rem; font-weight: 720; }

        .acquisition-final { padding: 96px 0; text-align: center; background: radial-gradient(circle at 50% 20%, rgba(245,185,53,0.13), transparent 28rem), #050505; }
        .acquisition-final h2 { max-width: 760px; margin: 0 auto; font-size: clamp(2.2rem, 5vw, 4.3rem); line-height: 1; letter-spacing: -0.045em; }
        .acquisition-final p { max-width: 620px; margin: 20px auto 28px; color: var(--acq-muted); font-size: 1.08rem; }

        @media (max-width: 820px) {
          .acquisition-hero { min-height: 620px; background-position: 61% center; }
          .acquisition-hero-copy { padding: 70px 0; }
          .acquisition-benefits { grid-template-columns: 1fr; }
          .acquisition-flow { grid-template-columns: 1fr; gap: 34px; }
          .acquisition-photo { min-height: 390px; }
          .acquisition-comparison-row { grid-template-columns: 1fr; }
          .acquisition-comparison-row > * + * { border-left: 0; border-top: 1px solid var(--acq-line); }
          .acquisition-comparison-head > *:first-child { display: none; }
          .acquisition-hero.screen {
            min-height: 850px;
            align-items: start;
            background:
              linear-gradient(180deg, rgba(3,3,3,1) 0%, rgba(3,3,3,0.96) 44%, rgba(3,3,3,0.2) 72%, #050505 100%),
              var(--acq-hero-image) center calc(100% - 18px) / auto 52% no-repeat,
              #050505;
          }
          .acquisition-hero.screen .acquisition-hero-copy { padding: 56px 0 430px; }
        }
      `}</style>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className={`acquisition-hero ${heroPresentation}`} style={{ '--acq-hero-image': `url('${heroImage}')` }}>
        <div className="acquisition-wrap">
          <div className="acquisition-hero-copy">
            <p className="acquisition-eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p>{intro}</p>
            <div className="acquisition-actions">
              <AppStoreLink href={campaignUrl} placement={`${campaignKey}_hero`} />
            </div>
            <p className="acquisition-store-note">Free to download. No account required. Workout history stays on your iPhone.</p>
          </div>
        </div>
      </section>

      <section className="acquisition-section">
        <div className="acquisition-wrap">
          <div className="acquisition-heading">
            <h2>{benefitsTitle}</h2>
            <p>{benefitsIntro}</p>
          </div>
          <div className="acquisition-benefits">
            {benefits.map((benefit, index) => (
              <article className="acquisition-card" key={benefit.title}>
                <span>{index + 1}</span>
                <h3>{benefit.title}</h3>
                <p>{benefit.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="acquisition-section soft">
        <div className="acquisition-wrap acquisition-flow">
          <img className={`acquisition-photo ${heroPresentation}`} src={heroImage} alt={heroImageAlt} loading="lazy" decoding="async" />
          <div>
            <div className="acquisition-heading">
              <h2>{flowTitle}</h2>
              <p>{flowIntro}</p>
            </div>
            <div className="acquisition-steps">
              {steps.map((step, index) => (
                <div className="acquisition-step" key={step.title}>
                  <strong>0{index + 1}</strong>
                  <div><h3>{step.title}</h3><p>{step.copy}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="acquisition-section">
        <div className="acquisition-wrap">
          <div className="acquisition-heading">
            <h2>{comparisonTitle}</h2>
            <p>{comparisonIntro}</p>
          </div>
          <div className="acquisition-comparison" role="table" aria-label={comparisonLabel}>
            <div className="acquisition-comparison-row acquisition-comparison-head" role="row">
              <span role="columnheader">Training moment</span><span role="columnheader">Basic log</span><span role="columnheader">Jacked</span>
            </div>
            {comparison.map(([moment, basic, jacked]) => (
              <div className="acquisition-comparison-row" role="row" key={moment}>
                <strong role="cell">{moment}</strong><span role="cell">{basic}</span><span role="cell">{jacked}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="acquisition-section soft">
        <div className="acquisition-wrap">
          <div className="acquisition-heading"><h2>{faqTitle}</h2></div>
          <div className="acquisition-faq">
            {faqs.map(({ question, answer }) => (
              <details key={question}><summary>{question}</summary><p>{answer}</p></details>
            ))}
          </div>
          <div className="acquisition-related" aria-label="Related Jacked guides">
            {related.map(([href, label]) => <Link href={href} key={href}>{label}</Link>)}
          </div>
        </div>
      </section>

      <section className="acquisition-final">
        <div className="acquisition-wrap">
          <h2>{finalTitle}</h2>
          <p>{finalCopy}</p>
          <AppStoreLink href={campaignUrl} placement={`${campaignKey}_final`} />
        </div>
      </section>
    </div>
  )
}
