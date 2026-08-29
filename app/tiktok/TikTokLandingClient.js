'use client'

import { useEffect, useRef, useState } from 'react'
import {
  WEB_ANALYTICS_SCHEMA_VERSION,
  buildPageViewProperties,
  captureAttribution,
  currentSessionIdentifier,
  sanitizeAnalyticsValue,
  trackSafely,
} from '../components/WebAnalytics'
import styles from './TikTokLanding.module.css'

const APP_STORE_URL = 'https://apps.apple.com/app/apple-store/id6757132605?pt=128406689&ct=surpass_coach_tiktok_landing&mt=8'
const LANDING_VARIANT = 'tiktok_v1'
const COPY_VERSION = 'tiktok_promise_v2'

function campaignContext() {
  if (typeof window === 'undefined') return { landing_variant: LANDING_VARIANT }

  const pathname = window.location.pathname || '/'
  const search = window.location.search || ''
  const params = new URLSearchParams(window.location.search)
  let referrerDomain = ''

  try {
    referrerDomain = document.referrer ? new URL(document.referrer).hostname : ''
  } catch {
    referrerDomain = ''
  }

  const attribution = captureAttribution({ pathname, search }, (() => {
    try {
      return window.localStorage
    } catch {
      return null
    }
  })())

  return {
    analytics_schema_version: WEB_ANALYTICS_SCHEMA_VERSION,
    platform: 'web',
    ...buildPageViewProperties({
      pathname,
      search,
      referrer: document.referrer,
      viewportWidth: window.innerWidth,
      attribution,
      sessionId: currentSessionIdentifier(),
    }),
    landing_variant: LANDING_VARIANT,
    copy_version: COPY_VERSION,
    source_page: pathname,
    source: sanitizeAnalyticsValue(params.get('utm_source')) || 'tiktok',
    campaign: sanitizeAnalyticsValue(params.get('utm_campaign')) || 'profile',
    creative: sanitizeAnalyticsValue(params.get('creative')) || 'unspecified',
    referrer_domain: sanitizeAnalyticsValue(referrerDomain),
  }
}

function track(event, properties = {}) {
  return trackSafely(event, { ...campaignContext(), ...properties }, window.mixpanel)
}

function AppStoreLink({ placement, className = '', children }) {
  return (
    <a
      className={`${styles.storeButton} ${className}`}
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      data-global-cta={`tiktok_${placement}`}
      data-app-store-placement={`tiktok_${placement}`}
      data-app-store-campaign="surpass_coach_tiktok_landing"
      data-experiment="tiktok_landing_cta"
      data-experiment-variant="outcome_v1"
      data-hero-presentation={placement === 'hero' ? 'screen' : undefined}
      data-copy-version={COPY_VERSION}
      onClick={() => track('tiktok_landing_cta', { placement, copy_version: COPY_VERSION })}
    >
      <span className={styles.storeEyebrow}>Download on the</span>
      <strong>{children}</strong>
    </a>
  )
}

function AppMotion() {
  return (
    <figure className={styles.motionFigure}>
      <div className={styles.phoneFrame}>
        <img
          className={styles.motionVideo}
          src="/marketing/surpass-build-home.png"
          alt="Surpass app workflow showing a visible priority, the next session, and weekly training context"
        />
      </div>
      <figcaption>Real Surpass interface. Prepared session preview.</figcaption>
    </figure>
  )
}

const outcomes = [
  ['01', 'Walk in with a target', 'See the next load, rep range, and previous result before the working set.'],
  ['02', 'Keep your focus', 'Log weight and reps, run the rest timer, and move on without rebuilding context.'],
  ['03', 'Leave with the next move', 'Your recent result stays ready for the next progression decision.'],
]

export default function TikTokLandingClient() {
  const heroCtaRef = useRef(null)
  const [showMobileDock, setShowMobileDock] = useState(false)

  useEffect(() => {
    track('tiktok_landing_view')
  }, [])

  useEffect(() => {
    const heroCta = heroCtaRef.current
    if (!heroCta) return undefined

    const observer = new IntersectionObserver(([entry]) => {
      setShowMobileDock(!entry.isIntersecting)
    })

    observer.observe(heroCta)
    return () => observer.disconnect()
  }, [])

  return (
    <div id="jacked-tiktok-landing" className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroShade} aria-hidden="true" />
        <div className={styles.shell}>
          <div className={styles.brandRow}>
            <span className={styles.brand}>SURPASS</span>
            <span className={styles.platform}>Built for iPhone</span>
          </div>

          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <p className={styles.kicker}>For lifters who train like the next set matters</p>
              <h1>Get bigger on purpose.</h1>
              <p className={styles.lede}>
                Choose what you want to change. Surpass turns it into today&apos;s clear session, then keeps
                the work and the evidence close together.
              </p>

              <div ref={heroCtaRef} className={styles.actions}>
                <AppStoreLink placement="hero">Get Surpass on the App Store</AppStoreLink>
                <a className={styles.motionLink} href="#real-app" onClick={() => track('tiktok_landing_motion_link')}>
                  See the real app work
                </a>
              </div>

              <p className={styles.storeNote}>Free to download · No account required · Requires iOS 17 or later</p>
            </div>

            <div id="real-app" className={styles.motionStage}>
              <AppMotion />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.outcomesSection}>
        <div className={styles.shell}>
          <p className={styles.sectionKicker}>No spreadsheet. No second system.</p>
          <h2>Your log should make the next decision easier.</h2>
          <div className={styles.outcomesGrid}>
            {outcomes.map(([number, title, copy]) => (
              <article className={styles.outcomeCard} key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.manifesto}>
        <div className={styles.shell}>
          <div className={styles.manifestoCopy}>
            <p className={styles.sectionKicker}>One focused training system</p>
            <h2>Know the work. Log the work. Earn the next target.</h2>
            <p>
              Bring compatible history from Hevy, Strong, or FitNotes, or start with a quick
              template. Surpass keeps the target, set log, rest, and progression in one place.
            </p>
            <AppStoreLink placement="final">Try Surpass on your next workout</AppStoreLink>
          </div>
        </div>
      </section>

      <div className={`${styles.mobileDock} ${showMobileDock ? styles.mobileDockVisible : ''}`}>
        <AppStoreLink placement="sticky">Get Surpass for iPhone</AppStoreLink>
      </div>
    </div>
  )
}
