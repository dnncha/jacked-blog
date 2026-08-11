'use client'

import { useEffect, useRef } from 'react'

export const CANONICAL_ORIGIN = 'https://jacked.coach'
export const FIRST_TOUCH_STORAGE_KEY = 'jacked:attribution:first-touch'
export const LAST_TOUCH_STORAGE_KEY = 'jacked:attribution:last-touch'
export const LANDING_PAGE_STORAGE_KEY = 'jacked:attribution:landing-page'
export const SESSION_STARTED_STORAGE_KEY = 'jacked:analytics:session-started'
export const VISITOR_SEEN_STORAGE_KEY = 'jacked:analytics:visitor-seen'
export const WEB_ANALYTICS_SCHEMA_VERSION = '2'

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

export function sanitizeAnalyticsValue(value) {
  const normalized = String(value ?? '').trim().replace(/\s+/g, '_')
  if (!normalized || normalized.length > 80) return ''
  if (normalized.includes('@') || /https?:\/\//i.test(normalized)) return ''
  if (/[\u0000-\u001f\u007f]/.test(normalized)) return ''
  return /^[A-Za-z0-9][A-Za-z0-9._~:/+-]*$/.test(normalized) ? normalized : ''
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
    return storage?.getItem?.(key) || ''
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

function currentPageSnapshot() {
  const pathname = normalizePathname(window.location.pathname)
  const search = window.location.search || ''
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
    }),
  }
}

export default function WebAnalytics() {
  const trackerRef = useRef(null)
  const seenCtaKeysRef = useRef(new Set())
  const seenScrollKeysRef = useRef(new Set())
  const seenVideoKeysRef = useRef(new Set())

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
    let mutationObserver = null
    const observedCtaElements = new WeakSet()
    const scrollThresholds = [25, 50, 75, 90]

    const trackSessionStarted = (current) => {
      const session = sessionStorage()
      if (storageValue(session, SESSION_STARTED_STORAGE_KEY)) return

      const visitor = browserStorage()
      const delivered = trackSafely('web_session_started', {
        ...current.properties,
        entry_page: current.pathname,
        session_type: sessionType(session, visitor),
      }, window.mixpanel)
      if (delivered) markSessionStarted(session, visitor)
    }

    const trackCtaViewed = (anchor) => {
      if (!anchor || !isAppStoreLink(anchor.href)) return
      const current = currentPageSnapshot()
      const url = new URL(anchor.href)
      const placement = ctaPlacement(anchor, url)
      const key = `${pageViewKey(current.pathname, current.search)}:${placement}`
      if (seenCtaKeysRef.current.has(key)) return

      const appStore = appStoreAttribution(anchor.href)
      const delivered = trackSafely('web_cta_viewed', {
        ...current.properties,
        source_page: current.pathname,
        cta_placement: placement,
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

    const trackScrollDepth = () => {
      if (!active) return
      const current = currentPageSnapshot()
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
      const current = currentPageSnapshot()
      const key = `${pageViewKey(current.pathname, current.search)}:${videoName}:${eventName}`
      if (seenVideoKeysRef.current.has(key)) return
      const delivered = trackSafely(eventName, {
        ...current.properties,
        source_page: current.pathname,
        video_name: videoName,
      }, window.mixpanel)
      if (delivered) seenVideoKeysRef.current.add(key)
    }

    const trackCurrentPage = () => {
      if (!active) return
      const current = currentPageSnapshot()
      registerWebAnalyticsContext(window.mixpanel, current.properties)
      trackerRef.current.track(current)
      trackSessionStarted(current)
      observeCtas()
      trackScrollDepth()
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
      const current = currentPageSnapshot()

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

      trackCtaViewed(anchor)
      const url = new URL(anchor.href)
      const appStore = appStoreAttribution(anchor.href)
      trackSafely('app_store_outbound_clicked', {
        ...current.properties,
        source_page: current.pathname,
        cta_placement: ctaPlacement(anchor, url),
        app_store_campaign: appStore.app_store_campaign || current.properties.app_store_campaign,
        apple_provider_token: appStore.provider_token,
        target: 'app_store',
      }, window.mixpanel)
    }

    const handleVideoPlay = (event) => {
      if (event.target instanceof HTMLVideoElement) trackVideoEvent(event.target, 'web_video_played')
    }
    const handleVideoEnded = (event) => {
      if (event.target instanceof HTMLVideoElement) trackVideoEvent(event.target, 'web_video_completed')
    }

    const handleErrorVisible = (event) => {
      const current = currentPageSnapshot()
      trackSafely('web_error_visible', {
        ...current.properties,
        error_category: sanitizeAnalyticsValue(event.detail?.category) || 'unknown',
      }, window.mixpanel)
    }

    if ('MutationObserver' in window && document.body) {
      mutationObserver = new MutationObserver(() => observeCtas())
      mutationObserver.observe(document.body, { childList: true, subtree: true })
    }

    document.addEventListener('click', handleClick, true)
    document.addEventListener('play', handleVideoPlay, true)
    document.addEventListener('ended', handleVideoEnded, true)
    window.addEventListener('jacked:web-error-visible', handleErrorVisible)

    return () => {
      active = false
      window.clearTimeout(retryTimer)
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame)
      ctaObserver?.disconnect()
      mutationObserver?.disconnect()
      window.removeEventListener('popstate', schedulePageView)
      window.removeEventListener('scroll', scheduleScrollDepth)
      window.removeEventListener('jacked:web-error-visible', handleErrorVisible)
      document.removeEventListener('click', handleClick, true)
      document.removeEventListener('play', handleVideoPlay, true)
      document.removeEventListener('ended', handleVideoEnded, true)
      if (window.history.pushState === wrappedPushState) window.history.pushState = originalPushState
      if (window.history.replaceState === wrappedReplaceState) window.history.replaceState = originalReplaceState
    }
  }, [])

  return null
}
