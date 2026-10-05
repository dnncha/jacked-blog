'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import AppScreenshot from './components/AppScreenshot'
import {
  BookOpen,
  ChartNoAxesCombined,
  Check,
  ClipboardList,
  Download,
  Dumbbell,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  Zap,
} from 'lucide-react'

const APP_STORE_URL_BASE = 'https://apps.apple.com/app/apple-store/id6757132605?pt=128406689'

const appStoreCampaigns = {
  hero: 'surpass_coach_home_hero_control',
  download: 'surpass_coach_home_download',
  final_cta: 'surpass_coach_home_final',
}

const HOMEPAGE_HERO_EXPERIMENT = Object.freeze({
  name: 'homepage_hero_cta',
  storageKey: 'surpass:experiment:homepage-hero-cta:v1',
})

const HOMEPAGE_COPY_VERSION = 'home_promise_v2'

const homepageHeroVariants = Object.freeze({
  control: Object.freeze({
    variant: 'control',
    campaign: appStoreCampaigns.hero,
    label: 'Start free on iPhone',
  }),
  outcome_v1: Object.freeze({
    variant: 'outcome_v1',
    campaign: 'surpass_coach_home_hero_outcome_v1',
    label: 'See your next set on iPhone',
  }),
})

let fallbackHomepageHeroVariant = ''

function validHomepageHeroVariant(value) {
  return value === 'control' || value === 'outcome_v1'
}

function randomHomepageHeroVariant() {
  try {
    const randomValues = new Uint32Array(1)
    const getRandomValues = globalThis.crypto?.getRandomValues
    if (typeof getRandomValues === 'function') {
      getRandomValues.call(globalThis.crypto, randomValues)
      return randomValues[0] % 2 === 0 ? 'control' : 'outcome_v1'
    }
  } catch {
    // Use the local fallback below when the browser crypto API is unavailable.
  }

  return Math.random() < 0.5 ? 'control' : 'outcome_v1'
}

function readHomepageHeroVariant() {
  if (typeof window === 'undefined') return 'control'

  try {
    const stored = window.localStorage?.getItem(HOMEPAGE_HERO_EXPERIMENT.storageKey)
    if (validHomepageHeroVariant(stored)) return stored

    const assigned = randomHomepageHeroVariant()
    window.localStorage?.setItem(HOMEPAGE_HERO_EXPERIMENT.storageKey, assigned)
    return assigned
  } catch {
    if (!validHomepageHeroVariant(fallbackHomepageHeroVariant)) {
      fallbackHomepageHeroVariant = randomHomepageHeroVariant()
    }
    return fallbackHomepageHeroVariant
  }
}

const appStoreUrl = (placement, campaignOverride = '') => {
  const campaign = campaignOverride || appStoreCampaigns[placement] || 'surpass_coach'
  return `${APP_STORE_URL_BASE}&ct=${campaign}&mt=8`
}

const proofPoints = [
  {
    icon: 'dumbbell',
    eyebrow: '01 · LAST TIME',
    title: 'See what you lifted',
    copy: 'Every set keeps last time beside the work you are about to do.',
  },
  {
    icon: 'chart',
    eyebrow: '02 · TARGET',
    title: 'Get a next-set target',
    copy: 'Today’s load and reps sit on the set, so progressive overload is the next number, not a guess.',
  },
  {
    icon: 'trend',
    eyebrow: '03 · PR',
    title: 'Catch the record',
    copy: 'A live alert fires when you beat your all-time best, and the summary leads with it.',
  },
]

const workflow = [
  {
    step: '01',
    icon: 'clipboard',
    title: 'Open the set with a target',
    copy: 'Last time and today’s target are already on the set before you unrack.',
    screen: 1,
    imageAlt: 'Surpass screenshot: every set shows today’s target beside what you lifted last time',
    caption: 'Target beside last time',
    presentation: 'screen',
  },
  {
    step: '02',
    icon: 'dumbbell',
    title: 'Log any weight fast',
    copy: 'A big keypad covers plates, dumbbells, and machines. The rest timer can stay on the Lock Screen.',
    screen: 3,
    imageAlt: 'Surpass screenshot: large weight keypad for plates, dumbbells, and machines',
    caption: 'Fast inside the set',
    presentation: 'screen',
  },
  {
    step: '03',
    icon: 'trend',
    title: 'Leave with the next workout',
    copy: 'The summary leads with PRs. Targets for next time are set from what you just lifted.',
    screen: 6,
    imageAlt: 'Surpass screenshot: next workout targets set from the session you just finished',
    caption: 'Next time is already set',
    presentation: 'screen',
  },
]

const featureCards = [
  {
    icon: 'bolt',
    title: 'Next-set targets',
    copy: 'Each set shows what you lifted last time and a target for today, side by side.',
    bullets: ['Last time stays visible', 'Today’s load and reps on the set', 'Targets update from the session you just saved'],
  },
  {
    icon: 'chart',
    title: 'Live all-time PRs',
    copy: 'Surpass compares the set with your all-time best and alerts you the moment you beat it. Share it in one tap.',
    bullets: ['PR against all-time best', 'One-tap sharing', 'Workout summary leads with PRs'],
  },
  {
    icon: 'import',
    title: 'Import Hevy, Strong, or FitNotes',
    copy: 'Bring a CSV onto the phone. Surpass reads it on device. No account on either side.',
    bullets: ['Hevy, Strong, and FitNotes CSV', 'Review before anything is saved', 'Routines stay free and uncapped'],
  },
  {
    icon: 'dumbbell',
    title: 'Big weight keypad',
    copy: 'Type plates, dumbbells, and machines without hunting through a tiny picker.',
    bullets: ['Large keys between sets', 'Previous sets stay after edits', 'New exercises start with 3 sets'],
  },
  {
    icon: 'library',
    title: 'Programs and the week',
    copy: 'Start Full Body, Upper/Lower, or Push/Pull/Legs. Today shows this week and your streak.',
    bullets: ['Proven programs included', 'This-week strip and streak', 'Optional Surpass Pro for auto-progression'],
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
    title: 'Coming from Hevy or Strong',
    quote: 'Keep the sets you already logged. Surpass puts a next-set target beside last time, without an account.',
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
    question: 'Is Surpass only for bodybuilding?',
    answer: 'Surpass is built for hypertrophy-first training, but it works well for lifters who care about strength progress as part of building muscle.',
  },
  {
    question: 'How is Surpass different from a basic workout tracker?',
    answer: 'Most workout trackers store what you did. Surpass turns that history into a next load and rep target on the set you are about to do.',
  },
  {
    question: 'Can I import from Hevy?',
    answer: 'Yes. Surpass includes a Hevy import path for workouts, routines, exercise notes, and set context so your existing log can keep working on day one.',
  },
  {
    question: 'Does Surpass replace a coach?',
    answer: 'No. Surpass will not coach your form. It helps you run the workout: targets, rest, progression, and training history while you are in the gym.',
  },
  {
    question: 'Does it work for advanced trainees?',
    answer: 'Yes. You keep the program. Surpass shows last time, a next-set target, and an all-time PR alert while you log. Optional Pro adds auto-progression, adaptive programs, and insights.',
  },
  {
    question: 'Is Surpass free?',
    answer: 'Logging, routines, personal records, and CSV import are free, with no account. Surpass Pro is optional: in the US App Store on 5 October 2026 it was $59.99 a year or $12.99 a month, with a 7-day trial. Apple shows the local price in the subscription sheet.',
  },
  {
    question: 'Where is my workout data stored?',
    answer: 'Workout history is stored locally on your iPhone. Surpass does not require a user account to start training. See the privacy policy for the full data-handling summary.',
  },
]

const homepageFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
}

const acquisitionGuides = [
  ['/hevy-vs-strong', 'Hevy vs Strong', 'A fair, dated comparison of Hevy and Strong, and where Surpass fits if you want next-set targets without an account.'],
  ['/import-hevy', 'Import Hevy workouts', 'Export a Hevy CSV, then import it into Surpass on your iPhone.'],
  ['/import-strong', 'Import Strong workouts', 'Export Strong Data as CSV, then review it in Surpass before saving.'],
  ['/tools/progressive-overload-planner', 'Progressive overload planner', 'Plan the next few weeks of double progression from your last set.'],
  ['/tools/one-rep-max-calculator', '1RM calculator', 'Estimate a one-rep max with Epley and Brzycki, then pick a training weight.'],
  ['/tools/plate-calculator', 'Plate calculator', 'See which plates to load for the target on the bar.'],
  ['/workout-tracker', 'Workout tracker for iPhone', 'Fast set logging, last-time targets, rest timing, and live PR alerts.'],
  ['/gym-workout-planner', 'Gym workout planner for iPhone', 'Build your split, then carry each result into the next set target.'],
  ['/progressive-overload', 'Progressive overload app', 'Use rep ranges and recent results to choose when to repeat, add reps, or add load.'],
  ['/hypertrophy-app', 'Hypertrophy app for iPhone', 'Track hard sets by muscle, keep effort and recent performance in view, and make a clearer next-set decision.'],
  ['/alpha-progression-alternative', 'Alpha Progression alternative', 'Compare a focused priority-block workflow with Alpha Progression before choosing your iPhone training app.'],
  ['/hevy-alternative', 'Switch from Hevy', 'Import supported Hevy workout history from CSV, review it before saving, and keep useful training context.'],
  ['/strong-alternative', 'Switch from Strong', 'Use Strong’s standard English CSV export to bring supported workouts, sets, and notes into Surpass.'],
  ['/fitnotes-alternative', 'Switch from FitNotes', 'Bring supported FitNotes workout history to iPhone without rebuilding every historical lift.'],
  ['/import-workout-history', 'Import workout history', 'Compare the supported Hevy, Strong, and FitNotes CSV paths before moving your training record.'],
  ['/surpass-vs-hevy', 'Surpass vs Hevy', 'A free social log, or a block aimed at the muscle you want people to notice. An honest comparison with prices.'],
  ['/surpass-vs-fitbod', 'Surpass vs Fitbod', 'Let an algorithm pick each workout, or pick the muscle yourself and train a block for it.'],
  ['/best-physique-tracker-apps', 'Best physique tracker apps', 'Scores, scans and plans compared: what eight physique apps give you and where each one stops.'],
  ['/bigger-arms', 'Bigger arms', 'Give your biceps and triceps their own weekly set target, then check the change from the front and side.'],
  ['/wider-shoulders', 'Wider shoulders', 'Side-delt work leads the block, with matched photos from three angles to show the width.'],
  ['/bigger-chest', 'More chest', 'Presses and flies at enough weekly sets, with a weight and rep target on every set.'],
  ['/wider-back', 'Wider back', 'Pulldowns and rows aimed at your lats, and back photos so you can finally see it.'],
  ['/whole-frame', 'Better whole frame', 'Chest, back and side delts built together for a bigger upper body.'],
  ['/blog/alternatives-to-rp-hypertrophy-app', 'Alternatives to RP Hypertrophy App', 'Compare Surpass, Mesostrength, Hevy, Strong, Liftosaur, and other options by switching reason.'],
  ['/blog/best-hypertrophy-app-ios-review', 'Best hypertrophy app for iOS', 'How to judge a workout tracker when progression, RIR, and volume actually matter.'],
  ['/blog/progressive-overload-app-works', 'Progressive overload apps', 'Why good targets need rep ranges, effort, and performance history.'],
  ['/blog/hypertrophy-app-vs-generic-tracker', 'Hypertrophy app vs tracker', 'The difference between storing workouts and making the next set easier to choose.'],
  ['/blog/import-hevy-to-surpass', 'Import Hevy to Surpass', 'Move workouts, routines, notes, and set history into a more progression-focused workflow.'],
  ['/tools/next-set-calculator', 'Next set calculator', 'See the repeat, add-reps, add-load, or back-off decision in isolation.'],
  ['/tools/weekly-volume-checker', 'Weekly volume checker', 'Check whether muscle-level set volume matches the work you are trying to recover from.'],
]

const gymPanels = [
  {
    screen: 2,
    alt: 'Surpass screenshot of a live all-time personal record alert with one-tap sharing',
    title: 'The PR shows up while you are still under the bar',
    copy: 'The alert compares the set with your all-time best, not just last week.',
  },
  {
    screen: 4,
    alt: 'Surpass workout summary screenshot leading with personal records, volume, and time',
    title: 'Finish with the wins',
    copy: 'PRs, volume, and time are the first thing you see when the session ends.',
  },
  {
    screen: 8,
    alt: 'Surpass screenshot of proven programs including Full Body, Upper/Lower, and Push/Pull/Legs',
    title: 'Or start from a proven program',
    copy: 'Full Body, Upper/Lower, Push/Pull/Legs, and more. Routines are free and uncapped.',
  },
]

function Icon({ name, className = '' }) {
  const icons = {
    bolt: Zap,
    chart: ChartNoAxesCombined,
    clipboard: ClipboardList,
    dumbbell: Dumbbell,
    import: Download,
    library: BookOpen,
    shield: ShieldCheck,
    sync: RefreshCw,
    trend: TrendingUp,
  }
  const Glyph = icons[name] ?? Dumbbell
  return <Glyph aria-hidden="true" className={className} size={24} strokeWidth={1.9} />
}

function AppStoreButton({ href, children = 'Surpass for iPhone', eyebrow = 'Download', className = '', content, experiment = '', variant = '', heroPresentation = '', copyVersion = '', experimentReady = true, ariaLabel = '' }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel || undefined}
      data-global-cta={content}
      data-experiment={experiment || undefined}
      data-experiment-variant={variant || undefined}
      data-hero-presentation={heroPresentation || undefined}
      data-copy-version={copyVersion || undefined}
      data-experiment-ready={experiment ? String(experimentReady) : undefined}
      className={`app-store-button ${className}`}
    >
      <Download aria-hidden="true" size={23} strokeWidth={2.2} />
      <span>
        <small>{eyebrow}</small>
        {children}
      </span>
    </a>
  )
}

function AppPreviewImage() {
  return (
    <figure className="app-preview-figure" data-analytics-media="app_preview">
      <div className="phone-shell app-preview-shell">
        <AppScreenshot
          index={1}
          className="app-preview-image"
          priority
          sizes="(max-width: 760px) 240px, 320px"
          alt="Surpass workout screen with a next-set target beside what you lifted last time"
        />
      </div>
      <figcaption>Real Surpass interface · next-set target beside last time</figcaption>
    </figure>
  )
}

function StepVisual({ item }) {
  return (
    <figure className={`story-visual story-visual-${item.presentation}`}>
      <AppScreenshot index={item.screen} alt={item.imageAlt} sizes="(max-width: 760px) 78vw, 280px" />
      <figcaption>
        <span>{item.step}</span>
        <strong>{item.caption}</strong>
      </figcaption>
    </figure>
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
        <div className="guide-grid" aria-label="Surpass guides and tools">
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
              <AppScreenshot index={panel.screen} alt={panel.alt} sizes="(max-width: 760px) 88vw, 360px" />
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

const appStoreShots = [
  [1, 'Every set has a target', 'Last time and today’s target sit on the set before you unrack.'],
  [2, 'Never miss a PR', 'A live alert fires when the set beats your all-time best, with one-tap sharing.'],
  [3, 'Type any weight. Fast.', 'The keypad covers plates, dumbbells, and machines between sets.'],
  [4, 'Finish with your wins', 'The summary leads with personal records, volume, and time.'],
  [5, 'Keep the streak alive', 'Today shows this week and the streak without a separate dashboard.'],
  [6, 'Your next workout, ready', 'Targets for next time are set from the session you just saved.'],
  [7, 'A plan that fits your week', 'The week stays visible so the next session is already chosen.'],
  [8, 'Start a proven program', 'Full Body, Upper/Lower, and Push/Pull/Legs are included. Routines stay free.'],
]

function ScreenshotGallery() {
  return (
    <section id="screens" className="section visual-section">
      <div className="wrap">
        <SectionHeader
          title="The App Store screens, in listing order."
          copy="These are Surpass’s real iPhone screens. Each one is the same capture used on the App Store."
        />
        <div className="visual-grid">
          {appStoreShots.map(([index, title, copy]) => (
            <article className="visual-panel" key={title}>
              <AppScreenshot
                index={index}
                alt={`Surpass App Store screenshot ${index}: ${title}`}
                sizes="(max-width: 760px) 46vw, 240px"
              />
              <div className="visual-panel-copy">
                <h3>{title}</h3>
                <p>{copy}</p>
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
            copy="Surpass keeps the useful details in view: target range, last result, logged reps, load, rest, and recent performance."
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
          <AppScreenshot
            className="coach-photo"
            index={5}
            sizes="(max-width: 760px) 78vw, 300px"
            alt="Surpass Today screen showing this week’s training strip and streak"
          />
          <h3>What changes inside the workout</h3>
          <div className="decision-table">
            {[
              ['Old flow', 'Your last set is buried when you need it most.', 'Surpass', 'Target load, rep range, and last result are visible before the set.'],
              ['Old flow', 'Rest timing lives in a separate mental checklist.', 'Surpass', 'Rest stays attached to the active workout.'],
              ['Old flow', 'The week is a separate spreadsheet.', 'Surpass', 'This week and your streak stay on Today.'],
              ['Old flow', 'Switching tools means rebuilding context.', 'Surpass', 'Hevy import keeps prior training data available.'],
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
  const heroActionsRef = useRef(null)
  const [showConversionDock, setShowConversionDock] = useState(false)
  const [homepageHeroVariant, setHomepageHeroVariant] = useState('control')
  const [homepageHeroExperimentReady, setHomepageHeroExperimentReady] = useState(false)

  const heroVariant = homepageHeroVariants[homepageHeroVariant] ?? homepageHeroVariants.control

  useEffect(() => {
    setHomepageHeroVariant(readHomepageHeroVariant())
    setHomepageHeroExperimentReady(true)
  }, [])

  useEffect(() => {
    const heroActions = heroActionsRef.current
    if (!heroActions) return undefined
    if (!('IntersectionObserver' in window)) {
      setShowConversionDock(true)
      return undefined
    }

    const observer = new IntersectionObserver(([entry]) => {
      setShowConversionDock(!entry.isIntersecting)
    }, { threshold: 0.15 })
    observer.observe(heroActions)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <link
        rel="preload"
        as="image"
        type="image/avif"
        href="/marketing/screens/surpass-01-480.avif"
        imageSrcSet="/marketing/screens/surpass-01-320.avif 320w, /marketing/screens/surpass-01-480.avif 480w, /marketing/screens/surpass-01-640.avif 640w, /marketing/screens/surpass-01-960.avif 960w"
        imageSizes="(max-width: 760px) 240px, 320px"
        fetchPriority="high"
      />
      <div className="home-page">
      <style>{`
        .home-page {
          color: #fff8ea;
          background: #050505;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", sans-serif;
        }
        .hero .wrap {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
        }
        .hero-copy { align-self: start; max-width: 660px; }
        .hero-copy h1 { margin: 0; font-weight: 950; }
        .hero-wordmark, .hero-promise { display: block; }
        .hero-copy > p:not(.hero-eyebrow):not(.store-note) {
          max-width: 570px;
          margin: 30px 0 0;
          font-size: clamp(1.03rem, 1.9vw, 1.22rem);
          line-height: 1.58;
        }
        @media (max-width: 760px) {
          .hero .wrap { width: calc(100% - 20px); padding: 48px 18px 26px; }
          .hero-copy > p:not(.hero-eyebrow):not(.store-note) { margin-top: 24px; font-size: 1rem; }
        }
      `}</style>

      <section className="hero">
        <div className="wrap">
          <div className="hero-copy">
            <p className="hero-eyebrow">GYM LOG WITH NEXT-SET TARGETS</p>
            <h1>
              <span className="hero-wordmark">SURPASS</span>
              <span className="hero-promise">
                Every set has a <span className="gold-text">target.</span>
              </span>
            </h1>
            <p>
              Beat last week. Surpass puts today’s load and reps beside what you lifted last time, alerts you on an all-time PR, and keeps the log on your iPhone.
            </p>
            <div className="hero-benefits" aria-label="Surpass product benefits">
              <span><Check aria-hidden="true" size={16} strokeWidth={2.4} /> Next-set targets</span>
              <span><Check aria-hidden="true" size={16} strokeWidth={2.4} /> Live PR alerts</span>
              <span><Check aria-hidden="true" size={16} strokeWidth={2.4} /> No account required</span>
            </div>
            <div ref={heroActionsRef} className="hero-actions">
              <AppStoreButton
                href={appStoreUrl('hero', heroVariant.campaign)}
                content="homepage_hero"
                eyebrow="Free on the App Store"
                experiment={HOMEPAGE_HERO_EXPERIMENT.name}
                variant={heroVariant.variant}
                heroPresentation="screen"
                copyVersion={HOMEPAGE_COPY_VERSION}
                experimentReady={homepageHeroExperimentReady}
              >
                {heroVariant.label}
              </AppStoreButton>
              <a href="#hiw" className="secondary-button" data-nav-section="how_it_works">
                See the system
              </a>
            </div>
            <p className="store-note">
              Your workout history stays on your iPhone. Import it when you&apos;re ready.
            </p>
            <a className="app-store-badge" href={appStoreUrl('hero', heroVariant.campaign)} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', marginTop: 14 }}>
              <img src="/marketing/app-store-badge.svg" width={120} height={40} alt="Download on the App Store" />
            </a>
          </div>

          <div className="hero-preview-wrap">
            <div className="hero-preview-callout hero-preview-callout-top">
              <span>Next set</span>
              <strong>90kg · 6–10 reps</strong>
            </div>
          <AppPreviewImage />
            <div className="hero-preview-callout hero-preview-callout-bottom">
              <span>All-time PR</span>
              <strong>Live alert · one tap to share</strong>
            </div>
          </div>
        </div>
      </section>




      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageFaqSchema) }} />

      <section className="proof-strip signal-rail" aria-label="Surpass proof points">
        <div className="wrap signal-rail-grid">
          <div className="signal-rail-intro">
            <p className="section-kicker">PROGRESSIVE OVERLOAD, ON THE SET</p>
            <h2>Last time. Today’s target. The PR when you earn it.</h2>
          </div>
          <div className="proof-grid">
            {proofPoints.map((point) => (
              <article key={point.title} className="proof-card">
                <div className="proof-card-icon"><Icon name={point.icon} /></div>
                <div>
                  <span className="proof-card-eyebrow">{point.eyebrow}</span>
                  <h3>{point.title}</h3>
                  <p>{point.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="hiw" className="section how-it-works-section">
        <div className="wrap">
          <div className="story-heading">
            <p className="section-kicker">HOW SURPASS WORKS</p>
            <h2>Log the set. Beat last time. Keep the record.</h2>
            <p>Surpass is a gym log for people who lift. The next target is on the set, not in a spreadsheet you open later.</p>
          </div>
          <div className="story-steps">
            {workflow.map((item, index) => (
              <article key={item.title} className={`story-step story-step-${index % 2 === 0 ? 'image-first' : 'copy-first'}`}>
                <StepVisual item={item} />
                <div className="story-step-copy">
                  <div className="story-step-number">{item.step}</div>
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
            title="Everything needed for the next decision."
            copy="A focused toolkit for the moment between your last set and your next one."
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
      <ScreenshotGallery />

      <section id="download" className="section confidence-section">
        <div className="wrap">
          <SectionHeader
            title="The free log is the whole workout."
            copy="Logging, routines, personal records, and CSV import do not require Surpass Pro or an account."
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
              <h3>Start with the first useful session.</h3>
              <p>Choose the change you care about, import history if you have it, or start with a focused template and make the next session count.</p>
              <AppStoreButton href={appStoreUrl('download')} content="homepage_download" eyebrow="Free on the App Store" experiment="homepage_lower_cta" variant="outcome_v1" copyVersion={HOMEPAGE_COPY_VERSION}>
                Start free on iPhone
              </AppStoreButton>
            </aside>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHeader
            title="Bring your history. Keep the context."
            copy="Import compatible training history or start clean. Surpass keeps the useful context attached to the work you are about to do."
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
          <SectionHeader title="FAQ" copy="A clear answer to the questions that matter before your next training block." />
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
            <h2>Beat last week.</h2>
            <p>
              Download Surpass on iPhone. Log sets with next-set targets, catch all-time PRs, and keep the history on the device. No account required.
            </p>
            <AppStoreButton href={appStoreUrl('final_cta')} content="homepage_final" eyebrow="Free on the App Store" experiment="homepage_lower_cta" variant="outcome_v1" copyVersion={HOMEPAGE_COPY_VERSION}>
              Start free on iPhone
            </AppStoreButton>
          </div>
        </div>
      </section>

      <div
        className={`conversion-dock${showConversionDock ? ' conversion-dock-visible' : ''}`}
        aria-hidden={!showConversionDock}
        aria-label="Download Surpass"
      >
        <div className="conversion-dock-copy">
          <strong>Keep your build moving.</strong>
          <span>Free on iPhone · no account required</span>
        </div>
        <AppStoreButton href={appStoreUrl('final_cta')} content="homepage_mobile_dock" eyebrow="Free on iPhone" experiment="homepage_lower_cta" variant="outcome_v1" copyVersion={HOMEPAGE_COPY_VERSION} ariaLabel="Start free with Surpass on iPhone">
          Start free
        </AppStoreButton>
      </div>
      </div>
    </>
  )
}
