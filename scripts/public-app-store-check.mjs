#!/usr/bin/env node

import { fileURLToPath } from 'node:url'

export const DEFAULT_APP_STORE_URL = 'https://apps.apple.com/us/app/surpass-strength-training/id6757132605'

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
  return decodeEntities(String(html)
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim()
}

function pageTitle(html = '') {
  return visibleText(String(html).match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '')
}

function canonicalUrl(html = '') {
  const match = String(html).match(/<link\b[^>]*rel=["'][^"']*canonical[^"']*["'][^>]*>/i)
    || String(html).match(/<link\b[^>]*href=["'][^"']*["'][^>]*rel=["'][^"']*canonical[^"']*["'][^>]*>/i)
  return decodeEntities(match?.[0]?.match(/href=["']([^"']+)["']/i)?.[1] || '')
}

function softwareApplication(html = '') {
  for (const match of String(html).matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const parsed = JSON.parse(match[1])
      const items = Array.isArray(parsed) ? parsed : [parsed]
      const result = items.find((item) => String(item?.['@type'] || '').split(/\s+/).includes('SoftwareApplication'))
      if (result) return result
    } catch {
      // Ignore unrelated or malformed JSON-LD blocks; the remaining checks
      // still report the missing storefront fields.
    }
  }
  return null
}

function pageSubtitle(html = '') {
  const match = String(html).match(/<p\b[^>]*class=["'][^"']*\bsubtitle\b[^"']*["'][^>]*>([\s\S]*?)<\/p>/i)
  return visibleText(match?.[1] || '')
}

export function currentVersionEntry(html = '') {
  const marker = String(html).indexOf('Version History')
  if (marker < 0) return { version: '', note: '' }

  const history = String(html).slice(marker)
  const firstItem = history.match(/<li\b[^>]*>([\s\S]*?)<\/li>/i)?.[1] || ''
  const note = visibleText(firstItem.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i)?.[1] || '')
  const version = visibleText(firstItem.match(/<span\b[^>]*>\s*([0-9]+(?:\.[0-9]+)+)\s*<\/span>/i)?.[1] || '')
  return { version, note }
}

function includesWord(value, word) {
  return new RegExp(`\\b${String(word).replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}\\b`, 'i').test(value)
}

function containsRetiredOnboardingPromise(value = '') {
  return /\bQuick Start\b|\bfour setup questions\b|\banswer four setup questions\b/i.test(String(value))
}

export function auditAppStoreHtml(html, {
  url = DEFAULT_APP_STORE_URL,
  expectedBrand = 'Surpass',
  staleBrand = 'Jacked',
  httpStatus = 200,
} = {}) {
  const title = pageTitle(html)
  const canonical = canonicalUrl(html)
  const app = softwareApplication(html)
  const subtitle = pageSubtitle(html)
  const description = String(app?.description || '').trim()
  const current = currentVersionEntry(html)
  const failures = []
  const expectedUrl = new URL(url)

  if (httpStatus !== 200) failures.push(`HTTP ${httpStatus}`)
  if (!includesWord(`${title} ${app?.name || ''}`, expectedBrand)) failures.push(`missing ${expectedBrand} app identity`)
  if (!canonical || canonical !== expectedUrl.toString()) failures.push('canonical App Store URL mismatch')
  if (!app?.description) failures.push('missing SoftwareApplication description')
  if (!current.version || !current.note) failures.push('missing current version history entry')
  if (includesWord(current.note, staleBrand)) failures.push(`current version note contains stale ${staleBrand} brand`)

  const firstDescriptionLine = description.split(/\n+/).map((line) => line.trim()).find(Boolean) || ''
  if (subtitle && firstDescriptionLine && subtitle.localeCompare(firstDescriptionLine, undefined, { sensitivity: 'accent' }) === 0) {
    failures.push('description repeats the App Store subtitle as its opening line')
  }
  if (containsRetiredOnboardingPromise(description)) {
    failures.push('description contains the retired Quick Start/four-question onboarding promise')
  }

  return {
    checked_url: url,
    http_status: httpStatus,
    title,
    canonical,
    app_name: app?.name || '',
    subtitle,
    current_version: current.version,
    current_version_note: current.note,
    current_note_has_stale_brand: includesWord(current.note, staleBrand),
    description_opening: firstDescriptionLine,
    description_repeats_subtitle: Boolean(subtitle && firstDescriptionLine && subtitle.localeCompare(firstDescriptionLine, undefined, { sensitivity: 'accent' }) === 0),
    description_has_retired_onboarding_promise: containsRetiredOnboardingPromise(description),
    status: failures.length ? 'fail' : 'pass',
    failures,
  }
}

async function fetchListing(url) {
  try {
    const response = await fetch(url, {
      headers: {
        accept: 'text/html,application/xhtml+xml',
        'cache-control': 'no-cache',
        'user-agent': 'SurpassPublicAppStoreCheck/1.0 (+https://jacked.coach/support)',
      },
      redirect: 'follow',
    })
    return auditAppStoreHtml(await response.text(), { url, httpStatus: response.status })
  } catch (error) {
    const result = auditAppStoreHtml('', {
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

export async function runPublicAppStoreCheck({ url = process.env.PUBLIC_APP_STORE_URL || DEFAULT_APP_STORE_URL } = {}) {
  const target = new URL(url)
  if (target.protocol !== 'https:') throw new Error('App Store URL must use HTTPS')
  const report = await fetchListing(target.toString())
  return {
    checked_at: new Date().toISOString(),
    ...report,
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  runPublicAppStoreCheck()
    .then((report) => {
      console.log(JSON.stringify(report, null, 2))
      if (report.status !== 'pass') process.exitCode = 1
    })
    .catch((error) => {
      console.error(error?.stack || error)
      process.exitCode = 1
    })
}
