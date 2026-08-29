'use client'

import { useEffect, useRef } from 'react'

export const CANONICAL_ORIGIN = 'https://jacked.coach'
export const FIRST_TOUCH_STORAGE_KEY = 'surpass:attribution:first-touch'
export const LAST_TOUCH_STORAGE_KEY = 'surpass:attribution:last-touch'
export const LANDING_PAGE_STORAGE_KEY = 'surpass:attribution:landing-page'
export const SESSION_STARTED_STORAGE_KEY = 'surpass:analytics:session-started'
export const SESSION_ID_STORAGE_KEY = 'surpass:analytics:session-id'
export const SESSION_LAST_ACTIVITY_STORAGE_KEY = 'surpass:analytics:session-last-activity'
export const VISITOR_SEEN_STORAGE_KEY = 'surpass:analytics:visitor-seen'
export const WEB_ERROR_VISIBLE_EVENT = 'surpass:web-error-visible'
export const LEGACY_WEB_ERROR_VISIBLE_EVENT = 'jacked:web-error-visible'
export const WEB_ANALYTICS_SCHEMA_VERSION = '2'
export const SESSION_TIMEOUT_MS = 30 * 60 * 1000

const LEGACY_STORAGE_KEY_ALIASES = Object.freeze({
  [FIRST_TOUCH_STORAGE_KEY]: 'jacked:attribution:first-touch',
  [LAST_TOUCH_STORAGE_KEY]: 'jacked:attribution:last-touch',
  [LANDING_PAGE_STORAGE_KEY]: 'jacked:attribution:landing-page',
  [SESSION_STARTED_STORAGE_KEY]: 'jacked:analytics:session-started',
  [SESSION_ID_STORAGE_KEY]: 'jacked:analytics:session-id',
  [SESSION_LAST_ACTIVITY_STORAGE_KEY]: 'jacked:analytics:session-last-activity',
  [VISITOR_SEEN_STORAGE_KEY]: 'jacked:analytics:visitor-seen',
})

export const WEB_VITAL_THRESHOLDS = Object.freeze({
  LCP: Object.freeze({ good: 2500, needsImprovement: 4000, unit: 'ms' }),
  CLS: Object.freeze({ good: 0.1, needsImprovement: 0.25, unit: 'score' }),
  INP: Object.freeze({ good: 200, needsImprovement: 500, unit: 'ms' }),
})

const ATTRIBUTION_FIELDS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'app_store_campaign',
]

const ATTRIBUTION_QUERY_KEYS = new Set([
  ...ATTRIBUTION_FIELDS,
  'ct',
  'pt',
  'mt',
  'gclid',
  'fbclid',
  'msclkid',
])

const EMPTY_ATTRIBUTION = Object.freeze({
  utm_source: '',
  utm_medium: '',
  utm_campaign: '',
  utm_content: '',
  utm_term: '',
  app_store_campaign: '',
})

let fallbackSessionId = ''

export function sanitizeAnalyticsValue(value) {
  const normalized = String(value ?? '').trim().replace(/\s+/g, '_')
  if (!normalized || normalized.length > 80) return ''
  if (normalized.includes('@') || /https?:\/\//i.test(normalized)) return ''
  if (/[\u0000-\u001f\u007f]/.test(normalized)) return ''
  return /^[A-Za-z0-9][A-Za-z0-9._~:/+-]*$/.test(normalized) ? normalized : ''
}

export function webVitalProperties(metricName, value) {
  const name = String(metricName || '').toUpperCase()
  const threshold = WEB_VITAL_THRESHOLDS[name]
  const numericValue = Number(value)
  if (!threshold || !Number.isFinite(numericValue) || numericValue < 0) return null

  const normalizedValue = name === 'CLS'
    ? Math.round(numericValue * 1000) / 1000
    : Math.round(numericValue)
  const rating = normalizedValue <= threshold.good
    ? 'good'
    : normalizedValue <= threshold.needsImprovement
      ? 'needs_improvement'
      : 'poor'

  return {
    metric_name: name,
    metric_value: normalizedValue,
    metric_rating: rating,
    metric_unit: threshold.unit,
  }
}

export function normalizePathname(pathname = '/') {
  try {
    const path = new URL(String(pathname || '/'), CANONICAL_ORIGIN).pathname
    return path || '/'
  } catch {
    return '/'
  }
}

export function meaningfulSearchParams(search = '') {
  const entries = [...new URLSearchParams(search || '')]
    .filter(([key, value]) => value && !ATTRIBUTION_QUERY_KEYS.has(key.toLowerCase()))
    .sort(([firstKey, firstValue], [secondKey, secondValue]) => (
      firstKey.localeCompare(secondKey) || firstValue.localeCompare(secondValue)
    ))

  return new URLSearchParams(entries).toString()
}

export function pageViewKey(pathname = '/', search = '') {
  const path = normalizePathname(pathname)
  const searchString = meaningfulSearchParams(search)
  return searchString ? `${path}?${searchString}` : path
}

function storageValue(storage, key) {
  try {
    const canonicalValue = storage?.getItem?.(key)
    if (canonicalValue) return canonicalValue

    const legacyKey = LEGACY_STORAGE_KEY_ALIASES[key]
    if (!legacyKey) return canonicalValue || ''

    const legacyValue = storage?.getItem?.(legacyKey)
    if (!legacyValue) return canonicalValue || ''

    // Preserve existing anonymous attribution/session state across the
    // public rebrand, then blank the legacy key so an expired canonical
    // session cannot be resurrected from the old namespace.
    storage?.setItem?.(key, legacyValue)
    storage?.setItem?.(legacyKey, '')
    return legacyValue
  } catch {
    return ''
  }
}

function setStorageValue(storage, key, value) {
  try {
    storage?.setItem?.(key, value)
  } catch {
    // Storage can be disabled or unavailable in a privacy mode. Analytics stays optional.
  }
}

function browserStorage() {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

function sessionStorage() {
  try {
    return window.sessionStorage
  } catch {
    return null
  }
}

function newSessionId() {
  try {
    if (typeof globalThis.crypto?.randomUUID === 'function') {
      return globalThis.crypto.randomUUID()
    }
  } catch {
    // Fall through to a local-only fallback when crypto APIs are unavailable.
  }

  return `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 14)}`
}

export function sessionIdentifier(storage) {
  const existing = sanitizeAnalyticsValue(storageValue(storage, SESSION_ID_STORAGE_KEY))
  if (existing) return existing

  if (!storage) {
    if (!fallbackSessionId) fallbackSessionId = sanitizeAnalyticsValue(newSessionId())
    return fallbackSessionId
  }

  const created = sanitizeAnalyticsValue(newSessionId())
  if (created) setStorageValue(storage, SESSION_ID_STORAGE_KEY, created)
  return created
}

export function currentSessionIdentifier() {
  const storage = sessionStorage()
  return prepareSession(storage) || sessionIdentifier(storage)
}

export function prepareSession(storage, now = Date.now()) {
  if (!storage) return ''

  const lastActivity = Number(storageValue(storage, SESSION_LAST_ACTIVITY_STORAGE_KEY))
  const sessionExpired = !Number.isFinite(lastActivity)
    || lastActivity <= 0
    || now < lastActivity
    || now - lastActivity >= SESSION_TIMEOUT_MS

  if (sessionExpired) {
    // Attribution remains first/last-touch state in localStorage. Only the
    // ephemeral session identity and its started marker rotate here.
    setStorageValue(storage, SESSION_ID_STORAGE_KEY, '')
    setStorageValue(storage, SESSION_STARTED_STORAGE_KEY, '')
  }

  const sessionId = sessionIdentifier(storage)
  setStorageValue(storage, SESSION_LAST_ACTIVITY_STORAGE_KEY, String(now))
  return sessionId
}

function readJson(storage, key) {
  try {
    const value = JSON.parse(storageValue(storage, key))
    return value && typeof value === 'object' ? value : null
  } catch {
    return null
  }
}

function emptyAttribution() {
  return { ...EMPTY_ATTRIBUTION }
}

function storedAttribution(storage, key) {
  const value = readJson(storage, key)
  if (!value) return null

  const result = emptyAttribution()
  for (const field of ATTRIBUTION_FIELDS) result[field] = sanitizeAnalyticsValue(value[field])
  return Object.values(result).some(Boolean) ? result : null
}

function hasAttribution(value) {
  return ATTRIBUTION_FIELDS.some((field) => value?.[field])
}

export function attributionFromSearch(search = '') {
  const params = new URLSearchParams(search || '')
  const result = emptyAttribution()

  for (const field of ATTRIBUTION_FIELDS) {
    const queryValue = field === 'app_store_campaign'
      ? params.get('app_store_campaign') || params.get('ct')
      : params.get(field)
    result[field] = sanitizeAnalyticsValue(queryValue)
  }

  return result
}

export function captureAttribution({ pathname = '/', search = '' } = {}, storage) {
  const path = normalizePathname(pathname)
  const current = attributionFromSearch(search)
  let first = storedAttribution(storage, FIRST_TOUCH_STORAGE_KEY) || emptyAttribution()
  const last = storedAttribution(storage, LAST_TOUCH_STORAGE_KEY) || emptyAttribution()
  const storedLandingPage = normalizePathname(storageValue(storage, LANDING_PAGE_STORAGE_KEY))
  const landingPage = storedLandingPage === '/' && storageValue(storage, LANDING_PAGE_STORAGE_KEY) === ''
    ? path
    : storedLandingPage

  if (!storageValue(storage, LANDING_PAGE_STORAGE_KEY)) {
    setStorageValue(storage, LANDING_PAGE_STORAGE_KEY, path)
  }

  if (hasAttribution(current)) {
    if (!hasAttribution(first)) {
      first = current
      setStorageValue(storage, FIRST_TOUCH_STORAGE_KEY, JSON.stringify(current))
    }
    setStorageValue(storage, LAST_TOUCH_STORAGE_KEY, JSON.stringify(current))
  }

  return {
    current,
    first,
    last: hasAttribution(current) ? current : last,
    landing_page: landingPage,
  }
}

function referrerProperties(referrer = '') {
  try {
    const url = new URL(referrer)
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Unsupported referrer')
    return { referrer: url.origin, referrer_domain: url.hostname }
  } catch {
    return { referrer: '', referrer_domain: '' }
  }
}

function pageDescription(pathname, articleCategory = '') {
  const path = normalizePathname(pathname)
  const segments = path.split('/').filter(Boolean)
  const pageSlug = segments.at(-1) || 'home'

  if (path === '/') return { page_type: 'home', page_slug: 'home' }
  if (path === '/tools') return { page_type: 'tools_hub', page_slug: 'tools' }
  if (path.startsWith('/tools/')) return { page_type: 'tool', page_slug: pageSlug, tool_name: pageSlug }
  if (path === '/blog') return { page_type: 'blog_hub', page_slug: 'blog' }
  if (path.startsWith('/blog/')) {
    return {
      page_type: 'article',
      page_slug: pageSlug,
      ...(articleCategory ? { article_category: sanitizeAnalyticsValue(articleCategory) } : {}),
    }
  }
  if (path.startsWith('/tiktok')) return { page_type: 'campaign', page_slug: pageSlug }
  return { page_type: 'page', page_slug: pageSlug }
}

export function viewportClass(width) {
  if (!Number.isFinite(Number(width))) return 'unknown'
  if (Number(width) < 768) return 'mobile'
  if (Number(width) < 1024) return 'tablet'
  return 'desktop'
}

export function canonicalUrlForPath(pathname = '/') {
  return `${CANONICAL_ORIGIN}${normalizePathname(pathname)}`
}

export function buildPageViewProperties({
  pathname = '/',
  search = '',
  referrer = '',
  viewportWidth,
  attribution,
  articleCategory = '',
  sessionId = '',
} = {}) {
  const path = normalizePathname(pathname)
  const attributionState = attribution || {
    current: attributionFromSearch(search),
    first: emptyAttribution(),
    last: emptyAttribution(),
    landing_page: path,
  }
  const current = attributionState.current || emptyAttribution()
  const first = attributionState.first || emptyAttribution()
  const last = attributionState.last || emptyAttribution()
  const page = pageDescription(path, articleCategory)

  return {
    pathname: path,
    canonical_url: canonicalUrlForPath(path),
    ...(sanitizeAnalyticsValue(sessionId) ? { session_id: sanitizeAnalyticsValue(sessionId) } : {}),
    ...page,
    ...referrerProperties(referrer),
    landing_page: normalizePathname(attributionState.landing_page || path),
    first_touch_utm_source: first.utm_source || '',
    first_touch_utm_medium: first.utm_medium || '',
    first_touch_utm_campaign: first.utm_campaign || '',
    last_touch_utm_source: last.utm_source || '',
    last_touch_utm_medium: last.utm_medium || '',
    last_touch_utm_campaign: last.utm_campaign || '',
    utm_content: current.utm_content || last.utm_content || '',
    utm_term: current.utm_term || last.utm_term || '',
    app_store_campaign: current.app_store_campaign || last.app_store_campaign || '',
    first_touch_app_store_campaign: first.app_store_campaign || '',
    last_touch_app_store_campaign: last.app_store_campaign || '',
    viewport_class: viewportClass(viewportWidth),
  }
}

export function trackSafely(eventName, properties = {}, mixpanel) {
  try {
    if (!mixpanel || typeof mixpanel.track !== 'function') return false
    mixpanel.track(eventName, properties)
    return true
  } catch {
    return false
  }
}

export function registerWebAnalyticsContext(mixpanel, properties = {}) {
  try {
    if (!mixpanel || typeof mixpanel.register !== 'function') return false

    const currentContext = {
      analytics_schema_version: WEB_ANALYTICS_SCHEMA_VERSION,
      platform: 'web',
      landing_page: normalizePathname(properties.landing_page || '/'),
      viewport_class: sanitizeAnalyticsValue(properties.viewport_class) || 'unknown',
      last_touch_utm_source: sanitizeAnalyticsValue(properties.last_touch_utm_source),
      last_touch_utm_medium: sanitizeAnalyticsValue(properties.last_touch_utm_medium),
      last_touch_utm_campaign: sanitizeAnalyticsValue(properties.last_touch_utm_campaign),
      last_touch_app_store_campaign: sanitizeAnalyticsValue(properties.last_touch_app_store_campaign),
    }
    mixpanel.register(currentContext)

    if (typeof mixpanel.register_once === 'function') {
      const firstTouch = {}
      for (const field of [
        'first_touch_utm_source',
        'first_touch_utm_medium',
        'first_touch_utm_campaign',
        'first_touch_app_store_campaign',
      ]) {
        const value = sanitizeAnalyticsValue(properties[field])
        if (value) firstTouch[field] = value
      }
      if (Object.keys(firstTouch).length) mixpanel.register_once(firstTouch)
    }
    return true
  } catch {
    return false
  }
}

function sessionType(storage, visitorStorage) {
  const isReturning = Boolean(storageValue(visitorStorage, VISITOR_SEEN_STORAGE_KEY))
  return isReturning ? 'returning' : 'new'
}

function markSessionStarted(storage, visitorStorage) {
  setStorageValue(storage, SESSION_STARTED_STORAGE_KEY, '1')
  setStorageValue(visitorStorage, VISITOR_SEEN_STORAGE_KEY, '1')
}

export function createPageViewTracker(track) {
  const seenKeys = new Set()

  return {
    track({ pathname = '/', search = '', properties = {} } = {}) {
      const key = pageViewKey(pathname, search)
      if (seenKeys.has(key)) return false
      const delivered = track?.('web_page_view', properties)
      if (delivered === false) return false
      seenKeys.add(key)
      return true
    },
    hasSeen(pathname, search = '') {
      return seenKeys.has(pageViewKey(pathname, search))
    },
  }
}

export function appStoreAttribution(href = '') {
  try {
    const url = new URL(href)
    return {
      provider_token: sanitizeAnalyticsValue(url.searchParams.get('pt')),
      app_store_campaign: sanitizeAnalyticsValue(url.searchParams.get('ct') || url.searchParams.get('app_store_campaign')),
    }
  } catch {
    return { provider_token: '', app_store_campaign: '' }
  }
}

export function outboundClickKey({ pathname = '/', search = '', placement = '', appStoreCampaign = '' } = {}) {
  return [
    pageViewKey(pathname, search),
    sanitizeAnalyticsValue(placement) || 'unknown',
    sanitizeAnalyticsValue(appStoreCampaign),
  ].join(':')
}

export function ctaViewKey({
  pathname = '/',
  search = '',
  placement = '',
  experimentName = '',
  experimentVariant = '',
  appStoreCampaign = '',
} = {}) {
  return [
    pageViewKey(pathname, search),
    sanitizeAnalyticsValue(placement) || 'unknown',
    sanitizeAnalyticsValue(experimentName),
    sanitizeAnalyticsValue(experimentVariant),
    sanitizeAnalyticsValue(appStoreCampaign),
  ].join(':')
}

function isAppStoreLink(href) {
  try {
    const hostname = new URL(href).hostname
    return hostname === 'apps.apple.com' || hostname.endsWith('.apps.apple.com')
  } catch {
    return false
  }
}

function targetPath(href) {
  try {
    const url = new URL(href, window.location.href)
    return url.origin === window.location.origin ? normalizePathname(url.pathname) : url.hostname
  } catch {
    return ''
  }
}

function ctaPlacement(anchor, url) {
  const explicit = anchor.getAttribute('data-app-store-placement') || anchor.getAttribute('data-global-cta')
  if (explicit) return sanitizeAnalyticsValue(explicit)

  const tool = anchor.getAttribute('data-tool-app-store')
  if (tool) return `${sanitizeAnalyticsValue(tool.replaceAll('-', '_'))}_result`

  return sanitizeAnalyticsValue(url.searchParams.get('ct')) || 'unknown'
}

export function experimentProperties(anchor) {
  const experimentName = sanitizeAnalyticsValue(anchor?.getAttribute?.('data-experiment'))
  const experimentVariant = sanitizeAnalyticsValue(anchor?.getAttribute?.('data-experiment-variant'))
  const heroPresentation = sanitizeAnalyticsValue(anchor?.getAttribute?.('data-hero-presentation'))
  const copyVersion = sanitizeAnalyticsValue(anchor?.getAttribute?.('data-copy-version'))
  return {
    ...(experimentName && experimentVariant ? {
      experiment_name: experimentName,
      experiment_variant: experimentVariant,
    } : {}),
    ...(heroPresentation ? { hero_presentation: heroPresentation } : {}),
    ...(copyVersion ? { copy_version: copyVersion } : {}),
  }
}

export function experimentReady(anchor) {
  return anchor?.getAttribute?.('data-experiment-ready') !== 'false'
}

export function toolCompletionProperties(anchor) {
  const state = sanitizeAnalyticsValue(anchor?.getAttribute?.('data-tool-completion-state'))
  return state ? { tool_completion_state: state } : {}
}

function currentPageSnapshot() {
  const pathname = normalizePathname(window.location.pathname)
  const search = window.location.search || ''
  const sessionId = currentSessionIdentifier()
  const attribution = captureAttribution({ pathname, search }, browserStorage())
  const articleCategory = document.querySelector('meta[name="article:section"]')?.getAttribute('content')
    || document.querySelector('[data-article-category]')?.getAttribute('data-article-category')
    || ''

  return {
    pathname,
    search,
    properties: buildPageViewProperties({
      pathname,
      search,
      referrer: document.referrer,
      viewportWidth: window.innerWidth,
      attribution,
      articleCategory,
      sessionId,
    }),
  }
}

export default function WebAnalytics() {
  const trackerRef = useRef(null)
  const seenCtaKeysRef = useRef(new Set())
  const seenOutboundClickKeysRef = useRef(new Set())
  const seenScrollKeysRef = useRef(new Set())
  const seenVideoKeysRef = useRef(new Set())
  const seenMediaKeysRef = useRef(new Set())
  const seenWebVitalKeysRef = useRef(new Set())

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return undefined

    if (!trackerRef.current) {
      trackerRef.current = createPageViewTracker((eventName, properties) => (
        trackSafely(eventName, properties, window.mixpanel)
      ))
    }

    let active = true
    let scrollFrame = 0
    let ctaObserver = null
    let mediaObserver = null
    let mutationObserver = null
    let webVitalsCleanup = () => {}
    let webVitalsPageKey = ''
    let fallbackSessionStarted = false
    const observedCtaElements = new WeakSet()
    const observedMediaElements = new WeakSet()
    const scrollThresholds = [25, 50, 75, 90]

    const trackSessionStarted = (current) => {
      const session = sessionStorage()
      if (storageValue(session, SESSION_STARTED_STORAGE_KEY)) return
      if (!session && fallbackSessionStarted) return

      const visitor = browserStorage()
      const delivered = trackSafely('web_session_started', {
        ...current.properties,
        entry_page: current.pathname,
        session_type: sessionType(session, visitor),
      }, window.mixpanel)
      if (delivered) {
        markSessionStarted(session, visitor)
        fallbackSessionStarted = true
      }
    }

    const currentPageWithSession = () => {
      const current = currentPageSnapshot()
      // This also covers a visitor who leaves a tab open past the inactivity
      // boundary and then returns directly to a CTA or another interaction.
      trackSessionStarted(current)
      return current
    }

    const trackCtaViewed = (anchor) => {
      if (!anchor || !isAppStoreLink(anchor.href)) return
      if (!experimentReady(anchor)) return
      const current = currentPageWithSession()
      const url = new URL(anchor.href)
      const placement = ctaPlacement(anchor, url)
      const appStore = appStoreAttribution(anchor.href)
      const experiment = experimentProperties(anchor)
      const key = ctaViewKey({
        pathname: current.pathname,
        search: current.search,
        placement,
        experimentName: experiment.experiment_name,
        experimentVariant: experiment.experiment_variant,
        appStoreCampaign: appStore.app_store_campaign,
      })
      if (seenCtaKeysRef.current.has(key)) return

      const delivered = trackSafely('web_cta_viewed', {
        ...current.properties,
        source_page: current.pathname,
        cta_placement: placement,
        ...experimentProperties(anchor),
        ...toolCompletionProperties(anchor),
        app_store_campaign: appStore.app_store_campaign || current.properties.app_store_campaign,
        apple_provider_token: appStore.provider_token,
        target: 'app_store',
      }, window.mixpanel)
      if (delivered) seenCtaKeysRef.current.add(key)
    }

      const observeCtas = () => {
        const anchors = [...document.querySelectorAll('a[href]')]
          .filter((anchor) => isAppStoreLink(anchor.href))

        for (const anchor of anchors) {
          // A server-rendered experiment control is intentionally navigable,
          // but it is not a valid exposure until the client has assigned the
          // arm. Do not mark it observed while it is still waiting; hydration
          // will flip the attribute and the mutation observer below will give
          // it a fresh viewport check.
          if (!experimentReady(anchor)) continue
          if (observedCtaElements.has(anchor)) continue
          observedCtaElements.add(anchor)

        if (ctaObserver) {
          ctaObserver.observe(anchor)
        } else {
          const rect = anchor.getBoundingClientRect()
          if (rect.top < window.innerHeight && rect.bottom > 0) trackCtaViewed(anchor)
        }
      }
    }

    const trackMediaViewed = (media) => {
      const mediaName = sanitizeAnalyticsValue(media.getAttribute('data-analytics-media'))
      if (!mediaName) return
      const current = currentPageWithSession()
      const key = `${pageViewKey(current.pathname, current.search)}:${mediaName}`
      if (seenMediaKeysRef.current.has(key)) return
      const delivered = trackSafely('web_media_viewed', {
        ...current.properties,
        source_page: current.pathname,
        media_name: mediaName,
      }, window.mixpanel)
      if (delivered) seenMediaKeysRef.current.add(key)
    }

    const observeMedia = () => {
      const mediaElements = [...document.querySelectorAll('[data-analytics-media]')]

      for (const media of mediaElements) {
        if (observedMediaElements.has(media)) continue
        observedMediaElements.add(media)

        if (mediaObserver) {
          mediaObserver.observe(media)
        } else {
          const rect = media.getBoundingClientRect()
          if (rect.top < window.innerHeight && rect.bottom > 0) trackMediaViewed(media)
        }
      }
    }

    const trackScrollDepth = () => {
      if (!active) return
      const current = currentPageWithSession()
      const pageKey = pageViewKey(current.pathname, current.search)
      const documentHeight = Math.max(
        document.documentElement?.scrollHeight || 0,
        document.body?.scrollHeight || 0
      )
      const visibleBottom = window.scrollY + window.innerHeight
      const percent = documentHeight <= window.innerHeight
        ? 100
        : Math.min(100, Math.round((visibleBottom / documentHeight) * 100))

      for (const threshold of scrollThresholds) {
        if (percent < threshold) continue
        const key = `${pageKey}:${threshold}`
        if (seenScrollKeysRef.current.has(key)) continue
        const delivered = trackSafely('web_scroll_depth', {
          ...current.properties,
          source_page: current.pathname,
          depth_bucket: String(threshold),
        }, window.mixpanel)
        if (delivered) seenScrollKeysRef.current.add(key)
      }
    }

    const scheduleScrollDepth = () => {
      if (scrollFrame) return
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = 0
        trackScrollDepth()
      })
    }

    const trackVideoEvent = (video, eventName) => {
      const videoName = sanitizeAnalyticsValue(video.getAttribute('data-analytics-video'))
      if (!videoName) return
      const current = currentPageWithSession()
      const key = `${pageViewKey(current.pathname, current.search)}:${videoName}:${eventName}`
      if (seenVideoKeysRef.current.has(key)) return
      const delivered = trackSafely(eventName, {
        ...current.properties,
        source_page: current.pathname,
        video_name: videoName,
      }, window.mixpanel)
      if (delivered) seenVideoKeysRef.current.add(key)
    }

    const observeWebVitals = (current) => {
      if (!('PerformanceObserver' in window)) return () => {}

      const pageKey = pageViewKey(current.pathname, current.search)
      const reported = new Set()
      const observers = []
      let finished = false
      let lcpValue = 0
      let clsValue = 0
      let inpValue = 0
      let lcpSeen = false
      let clsSeen = false
      let inpSeen = false

      const observe = (entryType, callback) => {
        try {
          const observer = new PerformanceObserver((list) => callback(list.getEntries()))
          observer.observe({ type: entryType, buffered: true })
          observers.push(observer)
          return true
        } catch {
          try {
            const observer = new PerformanceObserver((list) => callback(list.getEntries()))
            observer.observe({ entryTypes: [entryType] })
            observers.push(observer)
            return true
          } catch {
            return false
          }
        }
      }

      observe('largest-contentful-paint', (entries) => {
        const entry = entries.at(-1)
        if (!entry) return
        const value = Number(entry.startTime)
        if (!Number.isFinite(value) || value < 0) return
        lcpValue = Math.max(lcpValue, value)
        lcpSeen = true
      })
      observe('layout-shift', (entries) => {
        for (const entry of entries) {
          if (entry.hadRecentInput) continue
          const value = Number(entry.value)
          if (!Number.isFinite(value) || value < 0) continue
          clsValue += value
          clsSeen = true
        }
      })
      observe('event', (entries) => {
        for (const entry of entries) {
          if (!entry.interactionId) continue
          const value = Number(entry.duration)
          if (!Number.isFinite(value) || value < 0) continue
          inpValue = Math.max(inpValue, value)
          inpSeen = true
        }
      })

      const trackVital = (metricName, value) => {
        const key = `${pageKey}:${metricName}`
        if (reported.has(key) || seenWebVitalKeysRef.current.has(key)) return
        const properties = webVitalProperties(metricName, value)
        if (!properties) return
        const delivered = trackSafely('web_vital_measured', {
          ...current.properties,
          source_page: current.pathname,
          ...properties,
        }, window.mixpanel)
        if (delivered) {
          reported.add(key)
          seenWebVitalKeysRef.current.add(key)
        }
      }

      const finish = () => {
        if (finished) return
        finished = true
        if (lcpSeen) trackVital('LCP', lcpValue)
        if (clsSeen) trackVital('CLS', clsValue)
        if (inpSeen) trackVital('INP', inpValue)
        for (const observer of observers) observer.disconnect()
        document.removeEventListener('visibilitychange', handleVisibilityChange)
        window.removeEventListener('pagehide', finish)
      }
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') finish()
      }

      document.addEventListener('visibilitychange', handleVisibilityChange)
      window.addEventListener('pagehide', finish)
      return finish
    }

    const trackCurrentPage = () => {
      if (!active) return
      const current = currentPageWithSession()
      registerWebAnalyticsContext(window.mixpanel, current.properties)
      trackerRef.current.track(current)
      observeCtas()
      observeMedia()
      trackScrollDepth()
      const currentPageKey = pageViewKey(current.pathname, current.search)
      if (currentPageKey !== webVitalsPageKey) {
        webVitalsCleanup()
        webVitalsPageKey = currentPageKey
        webVitalsCleanup = observeWebVitals(current)
      }
    }
    const schedulePageView = () => {
      Promise.resolve().then(trackCurrentPage)
    }

    if ('IntersectionObserver' in window) {
      ctaObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) trackCtaViewed(entry.target)
        }
      }, { threshold: 0.5 })
      mediaObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) trackMediaViewed(entry.target)
        }
      }, { threshold: 0.5 })
    }

    trackCurrentPage()
    const retryTimer = window.setTimeout(trackCurrentPage, 250)

    const originalPushState = window.history.pushState
    const originalReplaceState = window.history.replaceState
    const wrappedPushState = function (...args) {
      const result = originalPushState.apply(this, args)
      schedulePageView()
      return result
    }
    const wrappedReplaceState = function (...args) {
      const result = originalReplaceState.apply(this, args)
      schedulePageView()
      return result
    }

    window.history.pushState = wrappedPushState
    window.history.replaceState = wrappedReplaceState
    window.addEventListener('popstate', schedulePageView)
    window.addEventListener('scroll', scheduleScrollDepth, { passive: true })

    const handleClick = (event) => {
      const element = event.target instanceof Element ? event.target : null
      const anchor = element?.closest('a')
      const navigation = element?.closest('[data-nav-section], [data-related-tool]')
      const current = currentPageWithSession()

      if (navigation) {
        trackSafely('web_navigation_clicked', {
          ...current.properties,
          source_page: current.pathname,
          navigation_section: sanitizeAnalyticsValue(navigation.getAttribute('data-nav-section')),
          related_tool: sanitizeAnalyticsValue(navigation.getAttribute('data-related-tool')),
          target_path: targetPath(navigation.getAttribute('href') || ''),
        }, window.mixpanel)
      }

      if (!anchor || !isAppStoreLink(anchor.href)) return
      // Do not attribute a pre-hydration click to the server-rendered control
      // arm. The link remains navigable, but the outbound event waits for a
      // real assignment so experiment denominators stay trustworthy.
      if (!experimentReady(anchor)) return

      trackCtaViewed(anchor)
      const url = new URL(anchor.href)
      const appStore = appStoreAttribution(anchor.href)
      const placement = ctaPlacement(anchor, url)
      const clickKey = outboundClickKey({
        pathname: current.pathname,
        search: current.search,
        placement,
        appStoreCampaign: appStore.app_store_campaign,
      })
      if (seenOutboundClickKeysRef.current.has(clickKey)) return

      const delivered = trackSafely('app_store_outbound_clicked', {
        ...current.properties,
        source_page: current.pathname,
        cta_placement: placement,
        ...experimentProperties(anchor),
        ...toolCompletionProperties(anchor),
        app_store_campaign: appStore.app_store_campaign || current.properties.app_store_campaign,
        apple_provider_token: appStore.provider_token,
        target: 'app_store',
      }, window.mixpanel)
      if (delivered) seenOutboundClickKeysRef.current.add(clickKey)
    }

    const handleVideoPlay = (event) => {
      if (event.target instanceof HTMLVideoElement) trackVideoEvent(event.target, 'web_video_played')
    }
    const handleVideoEnded = (event) => {
      if (event.target instanceof HTMLVideoElement) trackVideoEvent(event.target, 'web_video_completed')
    }

    const handleErrorVisible = (event) => {
      const current = currentPageWithSession()
      trackSafely('web_error_visible', {
        ...current.properties,
        error_category: sanitizeAnalyticsValue(event.detail?.category) || 'unknown',
      }, window.mixpanel)
    }

    if ('MutationObserver' in window && document.body) {
      mutationObserver = new MutationObserver(() => {
        observeCtas()
        observeMedia()
      })
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-experiment-ready'],
      })
    }

    document.addEventListener('click', handleClick, true)
    document.addEventListener('play', handleVideoPlay, true)
    document.addEventListener('ended', handleVideoEnded, true)
    window.addEventListener(WEB_ERROR_VISIBLE_EVENT, handleErrorVisible)
    window.addEventListener(LEGACY_WEB_ERROR_VISIBLE_EVENT, handleErrorVisible)

    return () => {
      active = false
      window.clearTimeout(retryTimer)
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame)
      ctaObserver?.disconnect()
      mediaObserver?.disconnect()
      mutationObserver?.disconnect()
      webVitalsCleanup()
      window.removeEventListener('popstate', schedulePageView)
      window.removeEventListener('scroll', scheduleScrollDepth)
      window.removeEventListener(WEB_ERROR_VISIBLE_EVENT, handleErrorVisible)
      window.removeEventListener(LEGACY_WEB_ERROR_VISIBLE_EVENT, handleErrorVisible)
      document.removeEventListener('click', handleClick, true)
      document.removeEventListener('play', handleVideoPlay, true)
      document.removeEventListener('ended', handleVideoEnded, true)
      if (window.history.pushState === wrappedPushState) window.history.pushState = originalPushState
      if (window.history.replaceState === wrappedReplaceState) window.history.replaceState = originalReplaceState
    }
  }, [])

  return null
}
