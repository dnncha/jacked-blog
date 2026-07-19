'use client'

import Link from 'next/link'

const APP_STORE_URL = 'https://apps.apple.com/app/apple-store/id6757132605?pt=128406689&ct=jacked_coach&mt=8'

const appStoreUrl = () => APP_STORE_URL

const proofPoints = [
  {
    icon: 'chart',
    title: 'Know the next lift before you start',
    copy: 'See the next load, rep range, and previous result before the working set starts.',
  },
  {
    icon: 'bolt',
    title: 'Set logging built for the rack',
    copy: 'Weight, reps, rest, and quick corrections stay in the active workout flow.',
  },
  {
    icon: 'import',
    title: 'Weekly targets that stay understandable',
    copy: 'See hard sets completed and sets left for each muscle without volume jargon.',
  },
  {
    icon: 'import',
    title: 'Bring your training history with you',
    copy: 'Import compatible workout history so the next target starts with useful context.',
  },
]

const workflow = [
  {
    step: '01',
    icon: 'clipboard',
    title: "Open today's lift",
    copy: 'Your exercises, recent sets, and targets are ready before the first warmup.',
  },
  {
    step: '02',
    icon: 'dumbbell',
    title: 'Log the work',
    copy: 'Capture weight and reps, run the rest timer, and move to the next set without leaving the workout.',
  },
  {
    step: '03',
    icon: 'trend',
    title: 'Know the next set',
    copy: 'Use the last result to decide whether to add reps, add load, repeat, or back off.',
  },
]

const featureCards = [
  {
    icon: 'bolt',
    title: 'Fast set logging',
    copy: 'Log weight and reps from one screen, with the previous result and rest timer still visible.',
    bullets: ['Previous result in view', 'Persistent rest and session state', 'Quick corrections between sets'],
  },
  {
    icon: 'chart',
    title: 'Double progression made obvious',
    copy: 'Jacked uses your rep range and recent result to show when to add reps, add load, or repeat.',
    bullets: ['Exercise-level rep ranges', 'Load and rep history', 'Clear repeat, add-reps, or add-load decisions'],
  },
  {
    icon: 'import',
    title: 'Import from Hevy',
    copy: 'Bring over the workouts, routines, notes, and set history you already trust.',
    bullets: ['Workouts and routines', 'Exercise notes', 'Set history for better first targets'],
  },
  {
    icon: 'chart',
    title: 'Weekly muscle targets',
    copy: 'See which muscles have reached their weekly hard-set target and which still need work.',
    bullets: ['Hard sets by muscle', 'Sets left this week', 'Workout history behind every total'],
  },
  {
    icon: 'library',
    title: 'Progress that leads to an action',
    copy: 'Review lift history, PRs, workout consistency, and muscle targets without a dashboard full of noise.',
    bullets: ['Lift history and PRs', 'Workout log', 'Muscle-target progress'],
  },
]

const confidenceItems = [
  {
    icon: 'chart',
    title: 'Start with targets',
    copy: 'Open the workout with the next load, rep range, and recent result already in view.',
  },
  {
    icon: 'sync',
    title: 'Keep control',
    copy: 'Run your own program, swap exercises, edit sets, and accept or ignore targets.',
  },
  {
    icon: 'shield',
    title: 'iPhone native',
    copy: 'A focused iOS training app for lifters who want the workout to stay fast in the gym.',
  },
]

const switchReasons = [
  {
    title: 'Hevy power users',
    quote: 'Keep the log you built. Turn it into the next load, rep target, and weekly muscle total.',
  },
  {
    title: 'Spreadsheet lifters',
    quote: 'Stop doing progression math between sets. Keep the plan, logger, and targets in one place.',
  },
  {
    title: 'Science-based trainees',
    quote: 'Tie rep ranges, weekly hard sets, and exercise history to the work you are about to do.',
  },
  {
    title: 'Busy lifters',
    quote: "Open today's session, train hard, log fast, and leave knowing the next progression move.",
  },
]

const faqs = [
  {
    question: 'Is Jacked only for bodybuilding?',
    answer: 'Jacked is built for hypertrophy-first training, but it works well for lifters who care about strength progress as part of building muscle.',
  },
  {
    question: 'How is Jacked different from a basic workout tracker?',
    answer: 'Most workout trackers store what you did. Jacked turns that history into a next load and rep target, then shows how the workout moves each muscle toward its weekly target.',
  },
  {
    question: 'Can I import from Hevy?',
    answer: 'Yes. Jacked includes a Hevy import path for workouts, routines, exercise notes, and set context so your existing log can keep working on day one.',
  },
  {
    question: 'Does Jacked replace a coach?',
    answer: 'No. Jacked will not coach your form. It helps you run the workout: targets, rest, progression, and training history while you are in the gym.',
  },
  {
    question: 'Does it work for advanced trainees?',
    answer: 'Yes. Advanced lifters keep control of exercise selection and programming while using Jacked for faster logging, weekly targets, and performance-driven progression.',
  },
  {
    question: 'Is Jacked free?',
    answer: 'Yes. Jacked is currently free to download and use on iPhone. The App Store listing is the source for current availability.',
  },
  {
    question: 'Where is my workout data stored?',
    answer: 'Workout history is stored locally on your iPhone. Jacked does not require a user account to start training. See the privacy policy for the full data-handling summary.',
  },
]

const acquisitionGuides = [
  ['/workout-tracker', 'Workout tracker for iPhone', 'Fast set logging, recent performance, rest timing, and weekly muscle targets in one focused training flow.'],
  ['/progressive-overload', 'Progressive overload app', 'Use rep ranges, RIR, and recent results to choose when to repeat, add reps, or add load.'],
  ['/hevy-alternative', 'Switch from Hevy', 'Import supported Hevy workout history from CSV, review it before saving, and keep useful training context.'],
  ['/strong-alternative', 'Switch from Strong', 'Use Strong’s standard English CSV export to bring supported workouts, sets, and notes into Jacked.'],
  ['/fitnotes-alternative', 'Switch from FitNotes', 'Bring supported FitNotes workout history to iPhone without rebuilding every historical lift.'],
  ['/blog/alternatives-to-rp-hypertrophy-app', 'Alternatives to RP Hypertrophy App', 'Compare Jacked, Mesostrength, Hevy, Strong, Liftosaur, and other options by switching reason.'],
  ['/blog/best-hypertrophy-app-ios-review', 'Best hypertrophy app for iOS', 'How to judge a workout tracker when progression, RIR, and volume actually matter.'],
  ['/blog/progressive-overload-app-works', 'Progressive overload apps', 'Why good targets need rep ranges, effort, and performance history.'],
  ['/blog/hypertrophy-app-vs-generic-tracker', 'Hypertrophy app vs tracker', 'The difference between storing workouts and making the next set easier to choose.'],
  ['/blog/import-hevy-to-jacked', 'Import Hevy to Jacked', 'Move workouts, routines, notes, and set history into a more progression-focused workflow.'],
  ['/tools/next-set-calculator', 'Next set calculator', 'See the repeat, add-reps, add-load, or back-off decision in isolation.'],
  ['/tools/weekly-volume-checker', 'Weekly volume checker', 'Check whether muscle-level set volume matches the work you are trying to recover from.'],
]

const gymPanels = [
  {
    image: '/marketing/generated/jacked-workout-flow.webp',
    alt: 'Man athlete seated beside a barbell reviewing an iPhone in a dark strength gym',
    title: 'Your last set stays where you need it',
    copy: 'Load, reps, rest, and recent performance stay beside the set they affect.',
  },
  {
    image: '/marketing/generated/jacked-final-woman.webp',
    alt: 'Woman athlete holding an iPhone after training in a dark strength gym',
    title: 'Carry the session forward',
    copy: 'End the workout with the next target, not another note to interpret later.',
  },
  {
    image: '/marketing/generated/jacked-final-session.webp',
    alt: 'Man athlete holding an iPhone after training beside a squat rack',
    title: 'No second system',
    copy: 'Plan, logging, rest, and progression stay in one iPhone workflow.',
  },
]

const muscleVolume = [
  ['Chest', 18, '10-20'],
  ['Back', 16, '10-20'],
  ['Shoulders', 12, '10-18'],
  ['Arms', 10, '8-16'],
  ['Legs', 20, '12-22'],
]

function Icon({ name, className = '' }) {
  const common = {
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.9',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true',
    className,
  }

  const paths = {
    flask: (
      <>
        <path d="M9 3h6" />
        <path d="M10 3v5l-5.2 8.5A3 3 0 0 0 7.4 21h9.2a3 3 0 0 0 2.6-4.5L14 8V3" />
        <path d="M8 15h8" />
      </>
    ),
    chart: (
      <>
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <path d="m7 15 3-4 3 2 5-7" />
        <path d="M18 6h2v2" />
      </>
    ),
    import: (
      <>
        <path d="M12 3v12" />
        <path d="m7 10 5 5 5-5" />
        <path d="M5 21h14" />
      </>
    ),
    library: (
      <>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 1 4 16.5z" />
        <path d="M4 16.5A2.5 2.5 0 0 1 6.5 14H20" />
      </>
    ),
    clipboard: (
      <>
        <path d="M9 4h6l1 2h3v15H5V6h3z" />
        <path d="M9 4h6v4H9z" />
        <path d="M9 12h6" />
        <path d="M9 16h4" />
      </>
    ),
    dumbbell: (
      <>
        <path d="M6 8v8" />
        <path d="M18 8v8" />
        <path d="M8 10v4" />
        <path d="M16 10v4" />
        <path d="M8 12h8" />
        <path d="M3 10v4" />
        <path d="M21 10v4" />
      </>
    ),
    trend: (
      <>
        <path d="M4 17 9 12l4 4 7-9" />
        <path d="M15 7h5v5" />
      </>
    ),
    bolt: <path d="M13 2 4 14h7l-1 8 10-13h-7z" />,
    camera: (
      <>
        <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
        <path d="M9 13.5a3 3 0 1 0 6 0 3 3 0 0 0-6 0" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z" />
        <path d="m9 12 2 2 4-5" />
      </>
    ),
    sync: (
      <>
        <path d="M20 7h-5a5 5 0 0 0-8.6-2.9L5 5.5" />
        <path d="M4 17h5a5 5 0 0 0 8.6 2.9l1.4-1.4" />
        <path d="M20 3v4h-4" />
        <path d="M4 21v-4h4" />
      </>
    ),
    support: (
      <>
        <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
        <path d="M5 13h3v5H5z" />
        <path d="M16 13h3v5h-3z" />
        <path d="M16 18c0 2-1.5 3-4 3" />
      </>
    ),
  }

  return <svg {...common}>{paths[name]}</svg>
}

function AppleMark() {
  return (
    <svg width="27" height="32" viewBox="0 0 27 32" fill="currentColor" aria-hidden="true">
      <path d="M18.4 0c.1 1.4-.4 2.8-1.4 4-1.1 1.3-2.5 2-3.9 1.9-.2-1.4.5-2.9 1.4-3.9C15.5.8 17.1.1 18.4 0Z" />
      <path d="M25.7 24.5c-.7 1.7-1.1 2.5-2 4-1.3 2-3.2 4.4-5.5 4.4-2 0-2.6-1.3-5.4-1.3s-3.5 1.3-5.4 1.3c-2.3.1-4.1-2.2-5.5-4.2-3.7-5.5-4.1-12-.2-15.5 1.4-1.3 3.3-2 5.1-2 2 0 3.9 1.3 5.3 1.3 1.3 0 3.7-1.6 6.3-1.4 1.1 0 4.1.4 6.1 3.2-5.4 3-4.5 10.3 1.2 10.2Z" />
    </svg>
  )
}

function AppStoreButton({ href, children = 'Jacked for iPhone', eyebrow = 'Download', className = '', content }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-global-cta={content}
      className={`app-store-button ${className}`}
    >
      <AppleMark />
      <span>
        <small>{eyebrow}</small>
        {children}
      </span>
    </a>
  )
}

function PhoneMockup() {
  return (
    <div className="phone-shell" role="img" aria-label="Jacked app preview showing the next lift, rep range, rest timer, and weekly muscle targets">
      <div className="phone-screen" aria-hidden="true">
        <div className="phone-status">
          <span>9:41</span>
          <span>Upper Push</span>
        </div>
        <div className="app-topline">
          <div>
            <strong>Today</strong>
            <span>75 min planned</span>
          </div>
          <Icon name="clipboard" />
        </div>

        <section className="app-panel next-set">
          <p>Next set</p>
          <h3>Barbell Bench Press</h3>
          <div className="set-targets">
            <div>
              <span>Last</span>
              <strong>205</strong>
              <small>lb x 6</small>
            </div>
            <div>
              <span>Target</span>
              <strong>225</strong>
              <small>lb</small>
            </div>
            <div>
              <span>Range</span>
              <strong>6–10</strong>
              <small>reps</small>
            </div>
          </div>
          <div className="coach-note">
            <strong>Double progression</strong>
            <span>Reach 10 reps, then add load.</span>
          </div>
        </section>

        <section className="app-panel rest-row">
          <div>
            <p>Rest timer</p>
            <strong>1:15</strong>
            <span>of 2:00</span>
          </div>
          <span className="mock-button">Skip</span>
        </section>

        <section className="app-panel">
          <div className="volume-head">
            <div>
              <p>Weekly muscle targets</p>
              <span>Hard sets this week</span>
            </div>
            <strong>More</strong>
          </div>
          <div className="volume-bars">
            {muscleVolume.map(([label, value, range]) => (
              <div className="volume-row" key={label}>
                <span>{label}</span>
                <div className="bar-track">
                  <i style={{ width: `${Math.min(value * 4, 100)}%` }} />
                </div>
                <strong>{value}</strong>
                <small>{range}</small>
              </div>
            ))}
          </div>
        </section>

        <nav className="phone-tabs" aria-label="App preview tabs">
          {['Today', 'Train', 'Progress', 'Plan', 'Settings'].map((tab) => (
            <span key={tab} className={tab === 'Today' ? 'active' : ''}>{tab}</span>
          ))}
        </nav>
      </div>
    </div>
  )
}

function SectionHeader({ title, copy, align = 'center' }) {
  return (
    <div className={`section-header ${align === 'left' ? 'left' : ''}`}>
      <h2>{title}</h2>
      {copy && <p>{copy}</p>}
    </div>
  )
}

function AcquisitionGuides() {
  return (
    <section id="science" className="science-section">
      <div className="wrap science-layout">
        <div className="science-copy">
          <h2>Guides for training volume, recovery, and progression.</h2>
          <p>
            Read practical guides and use free tools to understand training volume, deloads,
            exercise selection, recovery, and progressive overload.
          </p>
          <Link href="/blog" className="text-link" data-nav-section="training_library">
            Browse training guides
          </Link>
        </div>
        <div className="guide-grid" aria-label="Jacked guides and tools">
          {acquisitionGuides.map(([href, title, copy]) => (
            <Link key={href} href={href} className="guide-card">
              <strong>{title}</strong>
              <span>{copy}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function GymStory() {
  return (
    <section className="section visual-section">
      <div className="wrap">
        <SectionHeader
          title="Built for the work between sets."
          copy="Your last result, target reps, load, and rest stay visible when you need them."
        />
        <div className="visual-grid">
          {gymPanels.map((panel, index) => (
            <article className={`visual-panel ${index === 0 ? 'large' : ''}`} key={panel.title}>
              <img
                src={panel.image}
                alt={panel.alt}
                loading="lazy"
                decoding="async"
              />
              <div className="visual-panel-copy">
                <h3>{panel.title}</h3>
                <p>{panel.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProgressionSection() {
  return (
    <section id="progression" className="section coach-section">
      <div className="wrap coach-grid">
        <div>
          <SectionHeader
            align="left"
            title="Double progression without mid-workout math."
            copy="Jacked keeps the useful details in view: target range, last result, logged reps, load, rest, and recent performance."
          />
          <div className="coach-list">
            {[
              ['1', 'Know the target before the set', 'Weight, rep range, and your last result are visible before the work starts.'],
              ['2', 'Record the set result', 'Log the actual weight and reps while the set is still fresh.'],
              ['3', 'Let history guide the next move', 'Recent performance informs whether you repeat, add reps, add load, or hold steady.'],
            ].map(([number, title, copy]) => (
              <div key={title} className="coach-row">
                <span>{number}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="coach-visual">
          <img
            className="coach-photo"
            src="/marketing/generated/jacked-hero-lifter.webp"
            alt=""
            loading="lazy"
            decoding="async"
          />
          <h3>What changes inside the workout</h3>
          <div className="decision-table">
            {[
              ['Old flow', 'Your last set is buried when you need it most.', 'Jacked', 'Target load, rep range, and last result are visible before the set.'],
              ['Old flow', 'Rest timing lives in a separate mental checklist.', 'Jacked', 'Rest stays attached to the active workout.'],
              ['Old flow', 'Weekly volume is difficult to judge across a split.', 'Jacked', 'Hard sets and sets left stay visible by muscle.'],
              ['Old flow', 'Switching tools means rebuilding context.', 'Jacked', 'Hevy import keeps prior training data available.'],
            ].map(([oldLabel, oldCopy, newLabel, newCopy]) => (
              <div key={newCopy} className="decision-row">
                <div>
                  <span>{oldLabel}</span>
                  <strong>{oldCopy}</strong>
                </div>
                <div className="wins">
                  <span>{newLabel}</span>
                  <strong>{newCopy}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function HomeClient() {
  return (
    <div className="home-page">
      <style>{`
        :root {
          --bg: #050505;
          --bg-soft: #0b0b0a;
          --panel: #11110f;
          --panel-2: #171512;
          --text: #fff8ea;
          --muted: #b8b0a2;
          --subtle: #8c8477;
          --line: rgba(255, 248, 234, 0.13);
          --gold: #f5b935;
          --gold-2: #ffd46a;
          --green: #72d36b;
          --danger: #ff7d4a;
        }

        .home-page *,
        .home-page *::before,
        .home-page *::after {
          box-sizing: border-box;
        }

        .home-page {
          min-height: 100vh;
          color: var(--text);
          background:
            radial-gradient(circle at 50% 0%, rgba(245, 185, 53, 0.11), transparent 34rem),
            linear-gradient(180deg, #030303 0%, var(--bg) 100%);
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", sans-serif;
        }

        .wrap {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
        }

        .hero {
          position: relative;
          overflow: hidden;
          min-height: 760px;
          border-bottom: 1px solid var(--line);
          background-image:
            linear-gradient(90deg, rgba(3,3,3,0.98) 0%, rgba(3,3,3,0.76) 38%, rgba(3,3,3,0.24) 74%, rgba(3,3,3,0.2) 100%),
            linear-gradient(180deg, rgba(3,3,3,0.05) 0%, rgba(3,3,3,0.78) 100%),
            url('/marketing/generated/jacked-hero-woman.webp');
          background-position: 63% center;
          background-size: cover;
        }

        .hero .wrap {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(330px, 0.82fr);
          align-items: center;
          gap: 54px;
          min-height: 760px;
          padding: 56px 0 70px;
        }

        .hero-copy {
          max-width: 680px;
        }

        .hero-copy h1 {
          margin: 0;
          line-height: 0.98;
          letter-spacing: 0;
          font-weight: 950;
        }

        .hero-wordmark {
          display: block;
          color: #ffffff;
          font-size: 6rem;
          line-height: 0.86;
          letter-spacing: 0;
        }

        .hero-promise {
          display: block;
          margin-top: 24px;
          max-width: 650px;
          font-size: 2.35rem;
          line-height: 1.08;
          letter-spacing: 0;
        }

        .gold-text {
          color: var(--gold);
        }

        .hero-copy > p {
          margin: 26px 0 0;
          max-width: 590px;
          color: var(--muted);
          font-size: 1.12rem;
          line-height: 1.65;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 13px;
          margin-top: 30px;
        }

        .app-store-button,
        .secondary-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 58px;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 850;
          letter-spacing: 0;
          transition: transform 160ms ease, border-color 160ms ease, background 160ms ease;
        }

        .app-store-button {
          gap: 13px;
          min-width: 278px;
          padding: 0 22px;
          color: #11100c;
          background: linear-gradient(180deg, var(--gold-2), var(--gold));
          border: 1px solid rgba(255,255,255,0.24);
          box-shadow: 0 16px 38px rgba(245, 185, 53, 0.22);
        }

        .app-store-button span {
          display: grid;
          line-height: 1.05;
          font-size: 1.08rem;
          text-align: left;
        }

        .app-store-button small {
          font-size: 0.68rem;
          font-weight: 760;
        }

        .secondary-button {
          min-width: 224px;
          padding: 0 21px;
          color: var(--text);
          border: 1px solid rgba(255,255,255,0.26);
          background: rgba(255,255,255,0.04);
        }

        .app-store-button:hover,
        .secondary-button:hover {
          transform: translateY(-1px);
        }

        .trust-line {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 18px;
          color: #a59d90;
          font-size: 0.9rem;
          font-weight: 650;
        }

        .store-note {
          margin: 12px 0 0;
          max-width: 560px;
          color: #b8b0a3;
          font-size: 0.88rem;
          line-height: 1.5;
          font-weight: 650;
        }

        .trust-line i {
          position: relative;
          width: 17px;
          height: 17px;
          border: 1px solid rgba(255,255,255,0.4);
          border-radius: 999px;
          display: inline-block;
          font-style: normal;
          flex: 0 0 auto;
        }

        .trust-line i::before {
          content: "";
          position: absolute;
          left: 5px;
          top: 2px;
          width: 5px;
          height: 9px;
          border-right: 2px solid var(--gold);
          border-bottom: 2px solid var(--gold);
          transform: rotate(42deg);
        }

        .trust-chips {
          display: flex;
          gap: 9px;
          flex-wrap: wrap;
          margin-top: 18px;
        }

        .trust-chips span {
          display: inline-flex;
          min-height: 34px;
          align-items: center;
          border: 1px solid rgba(245,185,53,0.36);
          border-radius: 999px;
          padding: 0 12px;
          color: #ecd976;
          background: rgba(5,5,5,0.48);
          font-size: 0.82rem;
          font-weight: 820;
          white-space: nowrap;
        }

        .phone-shell {
          width: min(390px, 100%);
          margin: 0 auto;
          border-radius: 42px;
          padding: 12px;
          background: linear-gradient(145deg, #56524b, #0b0b0b 24%, #292622 74%, #050505);
          border: 1px solid rgba(255,255,255,0.28);
          box-shadow: 0 36px 90px rgba(0,0,0,0.56);
        }

        .phone-screen {
          position: relative;
          overflow: hidden;
          border-radius: 34px;
          min-height: 670px;
          padding: 22px 18px 15px;
          background: #050505;
          border: 1px solid rgba(255,255,255,0.08);
        }

        .phone-status,
        .app-topline,
        .volume-head,
        .phone-tabs {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .phone-status {
          color: #f8f5ed;
          font-weight: 800;
          font-size: 0.82rem;
          margin-bottom: 20px;
        }

        .app-topline {
          margin-bottom: 13px;
        }

        .app-topline strong {
          display: block;
          color: #fff;
          font-size: 1.35rem;
          line-height: 1.15;
        }

        .app-topline span,
        .volume-head span,
        .coach-note span,
        .rest-row span {
          color: var(--subtle);
          font-size: 0.78rem;
        }

        .app-topline svg {
          color: var(--gold);
          width: 22px;
          height: 22px;
        }

        .app-panel {
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.11);
          background: linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.025));
          padding: 15px;
          margin-bottom: 12px;
        }

        .app-panel p {
          margin: 0;
          color: #c9c1b5;
          font-size: 0.78rem;
          font-weight: 760;
          text-transform: uppercase;
          letter-spacing: 0;
        }

        .next-set h3 {
          margin: 4px 0 15px;
          font-size: 1.04rem;
          line-height: 1.2;
          color: #fff;
        }

        .set-targets {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          border-top: 1px solid rgba(255,255,255,0.12);
          border-bottom: 1px solid rgba(255,255,255,0.12);
          padding: 13px 0;
        }

        .set-targets div {
          text-align: center;
        }

        .set-targets span,
        .set-targets small {
          display: block;
          color: var(--subtle);
          font-size: 0.68rem;
          text-transform: uppercase;
        }

        .set-targets strong {
          display: block;
          color: #fff;
          font-size: 2rem;
          line-height: 1;
          margin: 5px 0;
        }

        .coach-note {
          display: grid;
          gap: 3px;
          margin-top: 12px;
        }

        .coach-note strong {
          color: var(--green);
          font-size: 0.88rem;
        }

        .rest-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background:
            radial-gradient(circle at 50% 50%, rgba(245,185,53,0.15), transparent 42%),
            linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.025));
        }

        .rest-row strong {
          display: block;
          color: #fff;
          font-size: 2.05rem;
          line-height: 1;
          margin-top: 8px;
        }

        .mock-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 38px;
          padding: 0 16px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.28);
          background: rgba(255,255,255,0.05);
          color: #fff;
          font-weight: 800;
          font-size: 0.82rem;
        }

        .volume-head {
          gap: 15px;
          margin-bottom: 12px;
        }

        .volume-head p {
          margin-bottom: 4px;
        }

        .volume-head strong {
          color: var(--gold);
          font-size: 0.78rem;
        }

        .volume-bars {
          display: grid;
          gap: 10px;
        }

        .volume-row {
          display: grid;
          grid-template-columns: 74px 1fr 28px 42px;
          align-items: center;
          gap: 8px;
          color: #d8d1c6;
          font-size: 0.76rem;
        }

        .bar-track {
          height: 9px;
          border-radius: 999px;
          overflow: hidden;
          background: rgba(255,255,255,0.13);
        }

        .bar-track i {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, var(--green), var(--gold));
        }

        .volume-row strong {
          color: #fff;
          font-size: 0.78rem;
        }

        .volume-row small {
          color: var(--subtle);
        }

        .phone-tabs {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 13px 16px 12px;
          border-top: 1px solid rgba(255,255,255,0.1);
          background: rgba(5,5,5,0.92);
        }

        .phone-tabs span {
          color: var(--subtle);
          font-size: 0.66rem;
          font-weight: 760;
        }

        .phone-tabs .active {
          color: var(--gold);
        }

        .proof-strip {
          border-bottom: 1px solid var(--line);
          background: rgba(5,5,5,0.92);
        }

        .proof-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: var(--line);
        }

        .proof-card {
          min-height: 152px;
          padding: 26px 22px;
          background: #070707;
        }

        .proof-card svg {
          color: var(--gold);
          width: 32px;
          height: 32px;
          margin-bottom: 14px;
        }

        .proof-card h3,
        .feature-card h3,
        .workflow-card h3,
        .reason-card h3,
        .confidence-card h3 {
          margin: 0;
          color: #fff;
          letter-spacing: 0;
        }

        .proof-card h3 {
          font-size: 1.03rem;
        }

        .proof-card p,
        .feature-card p,
        .workflow-card p,
        .reason-card p,
        .confidence-card p,
        .faq-item p {
          margin: 8px 0 0;
          color: var(--muted);
          line-height: 1.56;
          font-size: 0.94rem;
        }

        .section {
          padding: 88px 0;
        }

        .section-header {
          max-width: 760px;
          margin: 0 auto 34px;
          text-align: center;
        }

        .section-header.left {
          margin-left: 0;
          text-align: left;
        }

        .section-header h2,
        .final-cta h2 {
          margin: 0;
          color: #fff;
          font-size: 3.05rem;
          line-height: 1.06;
          letter-spacing: 0;
        }

        .section-header p,
        .final-cta p {
          margin: 14px 0 0;
          color: var(--muted);
          font-size: 1.06rem;
          line-height: 1.65;
        }

        .workflow-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: var(--line);
          border: 1px solid var(--line);
          border-radius: 8px;
          overflow: hidden;
        }

        .workflow-card {
          display: grid;
          grid-template-columns: 54px 1fr;
          gap: 18px;
          min-height: 210px;
          padding: 30px;
          background: #090908;
        }

        .workflow-number {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border: 1px solid var(--gold);
          border-radius: 999px;
          color: var(--gold);
          font-size: 0.95rem;
          font-weight: 900;
        }

        .workflow-card svg {
          color: var(--gold);
          width: 34px;
          height: 34px;
          margin-bottom: 12px;
        }

        .workflow-card h3 {
          font-size: 1.22rem;
          text-transform: uppercase;
        }

        .features-section {
          padding-top: 22px;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 12px;
        }

        .feature-card,
        .reason-card,
        .confidence-card,
        .faq-item {
          border: 1px solid var(--line);
          border-radius: 8px;
          background: linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.022));
        }

        .feature-card {
          min-height: 390px;
          padding: 18px;
        }

        .feature-card svg {
          color: var(--gold);
          width: 30px;
          height: 30px;
          margin-bottom: 14px;
        }

        .feature-card h3 {
          font-size: 1.02rem;
          line-height: 1.2;
        }

        .feature-card ul {
          list-style: none;
          margin: 17px 0 0;
          padding: 0;
          display: grid;
          gap: 9px;
        }

        .feature-card li {
          display: grid;
          grid-template-columns: 15px 1fr;
          gap: 8px;
          color: #e6ded0;
          font-size: 0.86rem;
          line-height: 1.35;
        }

        .feature-card li::before {
          content: "";
          width: 6px;
          height: 6px;
          border-radius: 999px;
          margin-top: 7px;
          background: var(--gold);
        }

        .visual-section {
          padding-top: 28px;
          background:
            radial-gradient(circle at 16% 12%, rgba(245,185,53,0.09), transparent 24rem),
            #050505;
        }

        .visual-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
          grid-auto-rows: minmax(250px, auto);
          gap: 12px;
        }

        .visual-panel {
          position: relative;
          min-height: 254px;
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 8px;
          background: #090908;
          isolation: isolate;
        }

        .visual-panel.large {
          grid-row: span 2;
          min-height: 520px;
        }

        .visual-panel img {
          width: 100%;
          height: 100%;
          min-height: inherit;
          display: block;
          object-fit: cover;
          filter: saturate(0.88) contrast(1.06);
          transform: scale(1.01);
        }

        .visual-panel::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 1;
          background:
            linear-gradient(180deg, rgba(0,0,0,0.03), rgba(0,0,0,0.84)),
            radial-gradient(circle at 78% 12%, rgba(245,185,53,0.2), transparent 18rem);
        }

        .visual-panel-copy {
          position: absolute;
          left: 24px;
          right: 24px;
          bottom: 24px;
          z-index: 2;
          max-width: 500px;
        }

        .visual-panel-copy h3 {
          margin: 0;
          color: #fff;
          font-size: 1.3rem;
          line-height: 1.18;
        }

        .visual-panel-copy p {
          margin: 9px 0 0;
          color: #d9d1c4;
          line-height: 1.5;
          font-size: 0.94rem;
          max-width: 420px;
        }

        .coach-section {
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          background:
            radial-gradient(circle at 100% 0%, rgba(245,185,53,0.12), transparent 28rem),
            #080807;
        }

        .coach-grid {
          display: grid;
          grid-template-columns: minmax(0, 0.78fr) minmax(340px, 1fr);
          gap: 44px;
          align-items: center;
        }

        .coach-list {
          display: grid;
          gap: 12px;
        }

        .coach-row {
          display: grid;
          grid-template-columns: 42px 1fr;
          gap: 14px;
          align-items: start;
          padding: 18px;
          border: 1px solid var(--line);
          border-radius: 8px;
          background: rgba(255,255,255,0.035);
        }

        .coach-row span {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 8px;
          color: #11100c;
          background: var(--gold);
          font-weight: 950;
        }

        .coach-row h3 {
          margin: 0;
          color: #fff;
          font-size: 1.02rem;
        }

        .coach-row p {
          margin: 4px 0 0;
          color: var(--muted);
          line-height: 1.5;
          font-size: 0.92rem;
        }

        .coach-visual {
          position: relative;
          min-height: 430px;
          border: 1px solid var(--line);
          border-radius: 8px;
          padding: 26px;
          overflow: hidden;
          background:
            linear-gradient(145deg, rgba(245,185,53,0.12), transparent 36%),
            #0d0d0c;
        }

        .coach-photo {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: saturate(0.82) contrast(1.06);
          opacity: 0.38;
        }

        .coach-visual::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, rgba(8,8,7,0.9), rgba(8,8,7,0.55) 48%, rgba(8,8,7,0.82)),
            linear-gradient(180deg, rgba(8,8,7,0.24), rgba(8,8,7,0.86));
        }

        .coach-visual h3 {
          position: relative;
          z-index: 1;
          margin: 0 0 20px;
          color: #fff;
          font-size: 1.28rem;
        }

        .decision-table {
          position: relative;
          z-index: 1;
          display: grid;
          gap: 10px;
        }

        .decision-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          align-items: stretch;
        }

        .decision-row > div {
          padding: 15px;
          border-radius: 8px;
          background: rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(14px);
        }

        .decision-row span {
          display: block;
          color: var(--subtle);
          font-size: 0.78rem;
          font-weight: 800;
          text-transform: uppercase;
          margin-bottom: 7px;
        }

        .decision-row strong {
          color: #fff;
          line-height: 1.35;
        }

        .decision-row .wins {
          border-color: rgba(245,185,53,0.45);
        }

        .decision-row .wins strong {
          color: var(--gold-2);
        }

        .confidence-section {
          padding-top: 70px;
        }

        .confidence-layout {
          display: grid;
          grid-template-columns: 1fr 0.72fr;
          gap: 14px;
          align-items: stretch;
        }

        .confidence-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .confidence-card {
          padding: 22px;
          min-height: 175px;
        }

        .confidence-card svg {
          color: var(--gold);
          width: 34px;
          height: 34px;
          margin-bottom: 14px;
        }

        .download-panel {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 18px;
          min-height: 240px;
          padding: 34px;
          border-radius: 8px;
          border: 1px solid rgba(245,185,53,0.36);
          background:
            linear-gradient(145deg, rgba(245,185,53,0.18), rgba(255,255,255,0.02)),
            #10100f;
        }

        .download-panel h3 {
          margin: 0;
          color: #fff;
          font-size: 2rem;
          line-height: 1.12;
        }

        .download-panel p {
          margin: 0;
          color: var(--muted);
          line-height: 1.6;
        }

        .reasons-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .reason-card {
          padding: 22px;
          min-height: 205px;
        }

        .reason-card h3 {
          font-size: 1rem;
        }

        .reason-card p {
          font-size: 0.94rem;
        }

        .science-section {
          padding: 82px 0;
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          background:
            radial-gradient(circle at 20% 0%, rgba(245,185,53,0.1), transparent 30rem),
            #080807;
        }

        .science-layout {
          display: grid;
          grid-template-columns: minmax(0, 0.74fr) minmax(420px, 1fr);
          gap: 42px;
          align-items: start;
        }

        .science-copy h2 {
          margin: 0;
          color: #fff;
          font-size: clamp(2.15rem, 5vw, 3.25rem);
          line-height: 1.04;
          letter-spacing: 0;
        }

        .science-copy p {
          margin: 16px 0 22px;
          color: var(--muted);
          font-size: 1.04rem;
          line-height: 1.68;
        }

        .text-link {
          color: var(--gold);
          font-weight: 850;
          text-decoration: underline;
          text-underline-offset: 4px;
        }

        .guide-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .guide-card {
          min-height: 132px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 12px;
          border: 1px solid var(--line);
          border-radius: 8px;
          padding: 18px;
          color: inherit;
          text-decoration: none;
          background: linear-gradient(180deg, rgba(255,255,255,0.052), rgba(255,255,255,0.02));
          transition: transform 160ms ease, border-color 160ms ease;
        }

        .guide-card:hover {
          transform: translateY(-1px);
          border-color: rgba(245,185,53,0.42);
        }

        .guide-card strong {
          color: #fff;
          font-size: 1rem;
          line-height: 1.25;
        }

        .guide-card span {
          color: var(--muted);
          font-size: 0.88rem;
          line-height: 1.45;
        }

        .faq-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .faq-item {
          padding: 0;
          overflow: hidden;
        }

        .faq-item summary {
          cursor: pointer;
          list-style: none;
          padding: 18px 20px;
          color: #fff;
          font-weight: 820;
        }

        .faq-item summary::-webkit-details-marker {
          display: none;
        }

        .faq-item summary::after {
          content: "+";
          float: right;
          color: var(--gold);
          font-size: 1.25rem;
          line-height: 1;
        }

        .faq-item[open] summary::after {
          content: "-";
        }

        .faq-item p {
          margin: 0;
          padding: 0 20px 18px;
        }

        .final-cta {
          padding: 74px 0 90px;
          text-align: center;
        }

        .final-cta-inner {
          position: relative;
          overflow: hidden;
          max-width: 950px;
          margin: 0 auto;
          padding: 46px 24px;
          border: 1px solid var(--line);
          border-radius: 8px;
          background:
            linear-gradient(90deg, rgba(8,8,7,0.94), rgba(8,8,7,0.78) 45%, rgba(8,8,7,0.18) 100%),
            linear-gradient(135deg, rgba(245,185,53,0.14), rgba(255,255,255,0.015)),
            url('/marketing/generated/jacked-final-woman.webp');
          background-size: cover;
          background-position: 63% center;
        }

        .final-cta-inner > * {
          position: relative;
          z-index: 1;
        }

        .final-cta p {
          max-width: 650px;
          margin-left: auto;
          margin-right: auto;
        }

        .final-cta .app-store-button {
          margin-top: 24px;
        }

        @media (max-width: 1080px) {
          .hero .wrap,
          .coach-grid,
          .confidence-layout,
          .visual-grid,
          .science-layout {
            grid-template-columns: 1fr;
          }

          .phone-shell {
            max-width: 370px;
          }

          .proof-grid,
          .reasons-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .feature-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .visual-panel.large {
            grid-row: auto;
            min-height: 420px;
          }
        }

        @media (max-width: 760px) {
          .hero {
            min-height: auto;
            background-image:
              linear-gradient(180deg, rgba(3,3,3,0.72) 0%, rgba(3,3,3,0.88) 46%, rgba(3,3,3,0.97) 100%),
              url('/marketing/generated/jacked-hero-woman.webp');
            background-position: 61% top;
          }

          .hero .wrap {
            min-height: auto;
            padding: 50px 0 54px;
            gap: 36px;
          }

          .hero-wordmark {
            font-size: 4rem;
          }

          .hero-promise {
            font-size: 1.8rem;
            margin-top: 18px;
          }

          .hero-copy > p,
          .section-header p,
          .final-cta p {
            font-size: 1rem;
          }

          .hero-actions,
          .app-store-button {
            width: 100%;
          }

          .secondary-button {
            width: auto;
            min-width: 0;
            min-height: 0;
            padding: 0;
            border: 0;
            background: transparent;
            color: var(--gold);
            text-decoration: underline;
            text-underline-offset: 4px;
          }

          .phone-screen {
            min-height: 570px;
          }

          .proof-grid,
          .workflow-grid,
          .feature-grid,
          .confidence-grid,
          .reasons-grid,
          .guide-grid,
          .faq-grid {
            grid-template-columns: 1fr;
          }

          .section {
            padding: 66px 0;
          }

          .section-header h2,
          .final-cta h2 {
            font-size: 2.1rem;
          }

          .workflow-card {
            min-height: auto;
            padding: 23px;
          }

          .feature-card,
          .reason-card {
            min-height: auto;
          }

          .visual-panel,
          .visual-panel.large {
            min-height: 270px;
          }

          .visual-panel-copy {
            left: 16px;
            right: 16px;
            bottom: 16px;
          }

          .visual-panel-copy h3 {
            font-size: 1.05rem;
          }

          .coach-visual {
            min-height: auto;
            padding: 18px;
          }

          .decision-row {
            grid-template-columns: 1fr;
          }

          .download-panel h3 {
            font-size: 1.6rem;
          }

        }

        @media (prefers-reduced-motion: reduce) {
          .app-store-button,
          .secondary-button,
          .guide-card {
            transition: none;
          }

          .app-store-button:hover,
          .secondary-button:hover,
          .guide-card:hover {
            transform: none;
          }
        }
      `}</style>

      <section className="hero">
        <div className="wrap">
          <div className="hero-copy">
            <h1>
              <span className="hero-wordmark">JACKED</span>
              <span className="hero-promise">
                Hit your <span className="gold-text">weekly targets.</span> Progress every lift.
              </span>
            </h1>
            <p>
              Jacked turns recent performance into your next load and rep target, shows the hard
              sets left for each muscle, and keeps workout logging fast. Free on iPhone.
            </p>
            <div className="hero-actions">
              <AppStoreButton href={appStoreUrl('hero')} content="homepage_hero" eyebrow="View on the">
                App Store
              </AppStoreButton>
              <a href="#progression" className="secondary-button" data-nav-section="progression">
                See how targets work
              </a>
            </div>
            <p className="store-note">Free to download. No account required.</p>
            <div className="trust-line">
              <i aria-hidden="true" />
              <span>For iPhone lifters who have outgrown plain workout logs and spreadsheet upkeep.</span>
            </div>
            <div className="trust-chips" aria-label="Jacked core capabilities">
              <span>Next lift decided</span>
              <span>Weekly hard-set targets</span>
              <span>Double progression</span>
              <span>Fast workout logging</span>
            </div>
          </div>

          <PhoneMockup />
        </div>
      </section>

      <section className="proof-strip" aria-label="Jacked proof points">
        <div className="wrap proof-grid">
          {proofPoints.map((point) => (
            <article key={point.title} className="proof-card">
              <Icon name={point.icon} />
              <h3>{point.title}</h3>
              <p>{point.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <ProgressionSection />

      <section className="section">
        <div className="wrap">
          <SectionHeader
            title="Walk into the gym knowing what to do next."
            copy="Jacked shows the target load, rep range, and last result before you start logging."
          />
          <div className="workflow-grid">
            {workflow.map((item) => (
              <article key={item.title} className="workflow-card">
                <div className="workflow-number">{item.step}</div>
                <div>
                  <Icon name={item.icon} />
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="section features-section">
        <div className="wrap">
          <SectionHeader
            title="A workout log that tells you what comes next."
            copy="Log weight, reps, rest, and notes without losing sight of what you did last time or what should happen next."
          />
          <div className="feature-grid">
            {featureCards.map((feature) => (
              <article key={feature.title} className="feature-card">
                <Icon name={feature.icon} />
                <h3>{feature.title}</h3>
                <p>{feature.copy}</p>
                <ul>
                  {feature.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <GymStory />

      <section id="download" className="section confidence-section">
        <div className="wrap">
          <SectionHeader
            title="Try it on your next workout."
            copy="Download Jacked for free, no account required, and run one session with targets, rest timing, and history in one place."
          />
          <div className="confidence-layout">
            <div className="confidence-grid">
              {confidenceItems.map((item) => (
                <article key={item.title} className="confidence-card">
                  <Icon name={item.icon} />
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </article>
              ))}
            </div>
            <aside className="download-panel">
              <h3>Pick the next session now.</h3>
              <p>Use it for your next upper, lower, push, pull, or full-body session. Import history if you have it, or start with a quick template.</p>
              <AppStoreButton href={appStoreUrl('download')} content="homepage_download" eyebrow="View on the">
                App Store
              </AppStoreButton>
            </aside>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHeader
            title="Turn your log into today's targets."
            copy="Hevy, spreadsheets, and basic trackers can hold your history. Jacked turns that history into the next load, rep range, and weekly muscle target."
          />
          <div className="reasons-grid">
            {switchReasons.map((reason) => (
              <article key={reason.title} className="reason-card">
                <h3>{reason.title}</h3>
                <p>{reason.quote}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="section">
        <div className="wrap">
          <SectionHeader title="FAQ" copy="Answers for lifters who want to know exactly how Jacked fits their training." />
          <div className="faq-grid">
            {faqs.map((faq) => (
              <details key={faq.question} className="faq-item">
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <AcquisitionGuides />

      <section className="final-cta">
        <div className="wrap">
          <div className="final-cta-inner">
            <h2>See if Jacked fits your next workout.</h2>
            <p>
              Free on iPhone. Start with a balanced plan or import compatible history for context
              from day one.
            </p>
            <AppStoreButton href={appStoreUrl('final_cta')} content="homepage_final" eyebrow="View on the">
              App Store
            </AppStoreButton>
          </div>
        </div>
      </section>
    </div>
  )
}
