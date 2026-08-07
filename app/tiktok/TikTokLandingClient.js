'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './TikTokLanding.module.css'

const APP_STORE_URL = 'https://apps.apple.com/app/apple-store/id6757132605?pt=128406689&ct=jacked_coach_tiktok_landing&mt=8'
const LANDING_VARIANT = 'tiktok_v1'

function campaignContext() {
  if (typeof window === 'undefined') return { landing_variant: LANDING_VARIANT }

  const params = new URLSearchParams(window.location.search)
  let referrerDomain = ''

  try {
    referrerDomain = document.referrer ? new URL(document.referrer).hostname : ''
  } catch {
    referrerDomain = ''
  }

  return {
    landing_variant: LANDING_VARIANT,
    source: params.get('utm_source') || 'tiktok',
    campaign: params.get('utm_campaign') || 'profile',
    creative: params.get('creative') || 'unspecified',
    referrer_domain: referrerDomain,
  }
}

function track(event, properties = {}) {
  window.mixpanel?.track?.(event, { ...campaignContext(), ...properties })
}

function AppStoreLink({ placement, className = '', children }) {
  return (
    <a
      className={`${styles.storeButton} ${className}`}
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      data-global-cta={`tiktok_${placement}`}
      onClick={() => track('tiktok_landing_cta', { placement })}
    >
      <span className={styles.storeEyebrow}>Download on the</span>
      <strong>{children}</strong>
    </a>
  )
}

function AppMotion() {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!video) return undefined

    const sync = () => setIsPlaying(!video.paused)
    const applyPreference = () => {
      if (reducedMotion.matches) {
        video.pause()
      } else {
        video.play().catch(() => setIsPlaying(false))
      }
    }

    video.addEventListener('play', sync)
    video.addEventListener('pause', sync)
    reducedMotion.addEventListener('change', applyPreference)
    applyPreference()

    return () => {
      video.removeEventListener('play', sync)
      video.removeEventListener('pause', sync)
      reducedMotion.removeEventListener('change', applyPreference)
    }
  }, [])

  const toggle = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      video.play().catch(() => setIsPlaying(false))
    } else {
      video.pause()
    }
  }

  return (
    <figure className={styles.motionFigure}>
      <div className={styles.phoneFrame}>
        <video
          ref={videoRef}
          className={styles.motionVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/marketing/jacked-app-preview-poster.png"
          aria-label="Real Jacked app workflow showing next-lift guidance and fast set logging"
        >
          <source src="/marketing/jacked-app-preview-480.mp4" type="video/mp4" />
        </video>
        <button
          type="button"
          className={styles.motionToggle}
          onClick={toggle}
          aria-pressed={isPlaying}
        >
          {isPlaying ? 'Pause app motion' : 'Play app motion'}
        </button>
      </div>
      <figcaption>Real Jacked interface. Seeded demo workout.</figcaption>
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
            <span className={styles.brand}>JACKED</span>
            <span className={styles.platform}>Built for iPhone</span>
          </div>

          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <p className={styles.kicker}>For lifters who train like the next set matters</p>
              <h1>Build the body you came for.</h1>
              <p className={styles.lede}>
                Stop guessing between sets. Jacked turns your last workout into today&apos;s load
                and rep target, then keeps workout logging fast.
              </p>

              <div ref={heroCtaRef} className={styles.actions}>
                <AppStoreLink placement="hero">Get Jacked on the App Store</AppStoreLink>
                <a className={styles.motionLink} href="#real-app" onClick={() => track('tiktok_landing_motion_link')}>
                  Watch the real app work
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
              template. Jacked keeps the target, set log, rest, and progression in one place.
            </p>
            <AppStoreLink placement="final">Try Jacked on your next workout</AppStoreLink>
          </div>
        </div>
      </section>

      <div className={`${styles.mobileDock} ${showMobileDock ? styles.mobileDockVisible : ''}`}>
        <AppStoreLink placement="sticky">Get Jacked for iPhone</AppStoreLink>
      </div>
    </div>
  )
}
