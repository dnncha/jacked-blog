'use client'

import { useEffect, useRef } from 'react'

export const CANONICAL_ORIGIN = 'https://jacked.coach'
export const FIRST_TOUCH_STORAGE_KEY = 'jacked:attribution:first-touch'
export const LAST_TOUCH_STORAGE_KEY = 'jacked:attribution:last-touch'
export const LANDING_PAGE_STORAGE_KEY = 'jacked:attribution:landing-page'

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

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return undefined

    if (!trackerRef.current) {
      trackerRef.current = createPageViewTracker((eventName, properties) => (
        trackSafely(eventName, properties, window.mixpanel)
      ))
    }

    let active = true
    const trackCurrentPage = () => {
      if (!active) return
      const current = currentPageSnapshot()
      trackerRef.current.track(current)
    }
    const schedulePageView = () => {
      Promise.resolve().then(trackCurrentPage)
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

    const handleErrorVisible = (event) => {
      const current = currentPageSnapshot()
      trackSafely('web_error_visible', {
        ...current.properties,
        error_category: sanitizeAnalyticsValue(event.detail?.category) || 'unknown',
      }, window.mixpanel)
    }

    document.addEventListener('click', handleClick, true)
    window.addEventListener('jacked:web-error-visible', handleErrorVisible)

    return () => {
      active = false
      window.clearTimeout(retryTimer)
      window.removeEventListener('popstate', schedulePageView)
      window.removeEventListener('jacked:web-error-visible', handleErrorVisible)
      document.removeEventListener('click', handleClick, true)
      if (window.history.pushState === wrappedPushState) window.history.pushState = originalPushState
      if (window.history.replaceState === wrappedReplaceState) window.history.replaceState = originalReplaceState
    }
  }, [])

  return null
}
