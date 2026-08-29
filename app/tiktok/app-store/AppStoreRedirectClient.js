'use client'

import { useEffect } from 'react'
import {
  WEB_ANALYTICS_SCHEMA_VERSION,
  buildPageViewProperties,
  captureAttribution,
  currentSessionIdentifier,
  sanitizeAnalyticsValue,
} from '../../components/WebAnalytics'
import styles from '../TikTokLanding.module.css'

const APP_STORE_URL = 'https://apps.apple.com/app/apple-store/id6757132605?pt=128406689&ct=surpass_coach_tiktok_direct&mt=8'
const HANDOFF_SETTLE_MS = 300
const LANDING_VARIANT = 'tiktok_direct_v1'
const COPY_VERSION = 'tiktok_direct_promise_v1'

function safeToken(value, fallback = '') {
  const normalized = String(value ?? '').trim().replace(/\s+/g, '_')
  if (!normalized || normalized.length > 80 || normalized.includes('@') || /https?:\/\//i.test(normalized)) return fallback
  return /^[A-Za-z0-9][A-Za-z0-9._~:/+-]*$/.test(normalized) ? normalized : fallback
}

function handoffContext() {
  if (typeof window === 'undefined') return { source: 'tiktok', campaign: 'profile', creative: 'unspecified', session_id: '' }

  const pathname = window.location.pathname || '/tiktok/app-store'
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
    source: safeToken(params.get('utm_source'), 'tiktok'),
    campaign: safeToken(params.get('utm_campaign'), 'profile'),
    creative: safeToken(params.get('creative'), 'unspecified'),
    referrer_domain: sanitizeAnalyticsValue(referrerDomain),
  }
}

export default function AppStoreRedirectClient() {
  useEffect(() => {
    const context = handoffContext()
    const events = [
      ['app_store_outbound_clicked', {
      ...context,
      pathname: '/tiktok/app-store',
      canonical_url: 'https://jacked.coach/tiktok/app-store',
      page_type: 'campaign',
      page_slug: 'app-store',
      source_page: '/tiktok/app-store',
      cta_placement: 'tiktok_direct_handoff',
      app_store_campaign: 'surpass_coach_tiktok_direct',
      apple_provider_token: '128406689',
      target: 'app_store',
      handoff_type: 'automatic',
      }],
      ['tiktok_direct_app_store_handoff', {
        ...context,
        landing_variant: 'tiktok_direct_v1',
      }],
    ]

    let redirected = false
    const redirect = () => {
      if (redirected) return
      redirected = true
      window.location.replace(APP_STORE_URL)
    }
    const fallbackTimer = window.setTimeout(redirect, HANDOFF_SETTLE_MS)
    const mixpanel = window.mixpanel

    if (!mixpanel || typeof mixpanel.track !== 'function') {
      window.clearTimeout(fallbackTimer)
      redirect()
      return undefined
    }

    try {
      events.forEach(([eventName, properties], index) => {
        const isLastEvent = index === events.length - 1
        mixpanel.track(eventName, properties, isLastEvent ? () => {
          window.clearTimeout(fallbackTimer)
          redirect()
        } : undefined)
      })
    } catch {
      window.clearTimeout(fallbackTimer)
      redirect()
    }

    return () => window.clearTimeout(fallbackTimer)
  }, [])

  return (
    <div id="jacked-tiktok-app-store" className={styles.redirectPage}>
      <span className={styles.brand}>SURPASS</span>
      <p>Opening Surpass on the App Store…</p>
      <a
        href={APP_STORE_URL}
        data-global-cta="tiktok_direct_fallback"
        data-app-store-placement="tiktok_direct_handoff"
        data-app-store-campaign="surpass_coach_tiktok_direct"
        data-experiment="tiktok_direct_handoff"
        data-experiment-variant="v1"
        data-copy-version={COPY_VERSION}
      >
        Continue to the App Store
      </a>
    </div>
  )
}
