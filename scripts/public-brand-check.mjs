#!/usr/bin/env node

import { fileURLToPath } from 'node:url'

const DEFAULT_PATHS = [
  '/',
  '/workout-tracker',
  '/gym-workout-planner',
  '/progressive-overload',
  '/hevy-alternative',
  '/import-workout-history',
  '/support',
  '/privacy',
]

function decodeEntities(value = '') {
  return String(value)
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
}

export function visibleText(html = '') {
  const body = String(html).match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] || String(html)
  return decodeEntities(body
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim()
}

function pageTitle(html = '') {
  return decodeEntities(String(html).match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '')
    .replace(/\s+/g, ' ')
    .trim()
}

function headings(html = '') {
  return [...String(html).matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)]
    .map((match) => visibleText(`<body>${match[1]}</body>`))
    .filter(Boolean)
}

function containsBrand(value, brand) {
  return new RegExp(`\\b${String(brand).replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}\\b`, 'i').test(value)
}

function staleBrandAuditText(value = '') {
  // The canonical public hostname is still jacked.coach; its hostname and
  // support email are operational identifiers, not visible product branding.
  return String(value).replace(/(?:www\.)?jacked\.coach/gi, ' ')
}

export function auditHtml(html, {
  url = '',
  expectedBrand = 'Surpass',
  staleBrand = 'Jacked',
  httpStatus = 200,
} = {}) {
  const title = pageTitle(html)
  const h1 = headings(html)
  const text = visibleText(html)
  const failures = []
  const expectedVisible = containsBrand(`${title} ${text}`, expectedBrand)
  const staleVisible = containsBrand(staleBrandAuditText(text), staleBrand)

  if (httpStatus !== 200) failures.push(`HTTP ${httpStatus}`)
  if (!expectedVisible) failures.push(`missing visible ${expectedBrand} brand`)
  if (staleVisible) failures.push(`stale visible ${staleBrand} brand`)

  return {
    url,
    http_status: httpStatus,
    title,
    h1,
    visible_text_sample: text.slice(0, 240),
    expected_brand_visible: expectedVisible,
    stale_brand_visible: staleVisible,
    status: failures.length ? 'fail' : 'pass',
    failures,
  }
}

async function fetchPage(url) {
  try {
    const response = await fetch(url, {
      headers: {
        accept: 'text/html,application/xhtml+xml',
        'cache-control': 'no-cache',
        'user-agent': 'SurpassPublicBrandCheck/1.0 (+https://jacked.coach/support)',
      },
      redirect: 'follow',
    })
    const html = await response.text()
    return auditHtml(html, { url, httpStatus: response.status })
  } catch (error) {
    const result = auditHtml('', {
      url,
      httpStatus: 0,
    })
    return {
      ...result,
      status: 'fail',
      failures: [error?.message || String(error)],
    }
  }
}

export async function runPublicBrandCheck({ baseUrl = process.env.PUBLIC_BRAND_CHECK_BASE_URL || 'https://jacked.coach', paths = DEFAULT_PATHS } = {}) {
  const base = new URL(baseUrl)
  if (!['http:', 'https:'].includes(base.protocol)) throw new Error('Base URL must use http or https')

  const pages = await Promise.all(paths.map((pathname) => {
    const url = new URL(pathname, base)
    return fetchPage(url.toString())
  }))
  const failures = pages.filter((page) => page.status !== 'pass')
  return {
    checked_at: new Date().toISOString(),
    base_url: base.origin,
    status: failures.length ? 'blocked' : 'ready',
    pages,
    failure_count: failures.length,
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  runPublicBrandCheck()
    .then((report) => {
      console.log(JSON.stringify(report, null, 2))
      if (report.status !== 'ready') process.exitCode = 1
    })
    .catch((error) => {
      console.error(error?.stack || error)
      process.exitCode = 1
    })
}
