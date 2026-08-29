#!/usr/bin/env node

import { fileURLToPath } from 'node:url'

export const DEFAULT_HOMEPAGE_URL = 'https://jacked.coach/'
export const DEFAULT_ACQUISITION_PATHS = [
  '/workout-tracker',
  '/gym-workout-planner',
  '/progressive-overload',
  '/hypertrophy-app',
  '/hevy-alternative',
  '/import-workout-history',
]

function tagForAttribute(html, attribute, value) {
  const escaped = String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return String(html).match(new RegExp(`<[^>]+\\b${attribute}=["']${escaped}["'][^>]*>`, 'i'))?.[0] || ''
}

function tagWithClass(html, className) {
  const escaped = String(className).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return String(html).match(new RegExp(`<[^>]+\\bclass=["'][^"']*\\b${escaped}\\b[^"']*["'][^>]*>`, 'i'))?.[0] || ''
}

export function auditHomepageConversionHtml(html, {
  url = DEFAULT_HOMEPAGE_URL,
  httpStatus = 200,
} = {}) {
  const source = String(html)
  const failures = []
  const heroCta = tagForAttribute(source, 'data-global-cta', 'homepage_hero')
  const mobileDock = tagWithClass(source, 'conversion-dock')
  const mobileDockCta = tagForAttribute(source, 'data-global-cta', 'homepage_mobile_dock')
  const styles = source.replace(/\s+/g, ' ')

  if (httpStatus !== 200) failures.push(`HTTP ${httpStatus}`)
  if (!heroCta) failures.push('missing homepage hero CTA')
  if (!/\bdata-experiment-ready=["'][^"']+["']/i.test(heroCta)) {
    failures.push('homepage hero CTA is missing experiment readiness state')
  }
  if (!/\bdata-experiment=["']homepage_hero_cta["']/i.test(heroCta)) {
    failures.push('homepage hero CTA is missing its experiment name')
  }
  if (!/\bdata-experiment-variant=["'][^"']+["']/i.test(heroCta)) {
    failures.push('homepage hero CTA is missing its experiment variant')
  }
  if (!mobileDock) failures.push('missing homepage mobile conversion dock')
  if (!/\baria-hidden=["']true["']/i.test(mobileDock)) {
    failures.push('homepage mobile conversion dock is not hidden before hydration')
  }
  if (!mobileDockCta) failures.push('missing homepage mobile dock CTA')
  if (!/\bdata-experiment=["']homepage_lower_cta["']/i.test(mobileDockCta)) {
    failures.push('homepage mobile dock CTA is missing its experiment name')
  }
  if (!/\.conversion-dock\[aria-hidden=["']true["']\]\s*\{[^}]*display:\s*none\s*;/i.test(styles)) {
    failures.push('homepage mobile dock has no pre-hydration display guard')
  }
  if (!/\.conversion-dock \.app-store-button > span\s*\{[^}]*color:\s*#11100c\b/i.test(styles)) {
    failures.push('homepage mobile dock button has no explicit high-contrast label color')
  }

  return {
    checked_url: url,
    http_status: httpStatus,
    hero_cta_present: Boolean(heroCta),
    hero_experiment_ready_present: /\bdata-experiment-ready=["'][^"']+["']/i.test(heroCta),
    mobile_dock_present: Boolean(mobileDock),
    mobile_dock_hidden_before_hydration: /\baria-hidden=["']true["']/i.test(mobileDock),
    mobile_dock_experiment_present: /\bdata-experiment=["']homepage_lower_cta["']/i.test(mobileDockCta),
    status: failures.length ? 'fail' : 'pass',
    failures,
  }
}

export function auditAcquisitionConversionHtml(html, {
  url = '',
  httpStatus = 200,
} = {}) {
  const source = String(html)
  const failures = []
  const heroCta = tagForAttribute(source, 'data-experiment', 'acquisition_hero_cta')
  const mobileDock = tagWithClass(source, 'acquisition-mobile-dock')
  const mobileDockCta = tagForAttribute(source, 'data-experiment', 'acquisition_mobile_cta')
  const finalCta = source.match(/<[^>]+data-app-store-placement=["'][^"']+_final["'][^>]*>/i)?.[0] || ''
  const styles = source.replace(/\s+/g, ' ')

  if (httpStatus !== 200) failures.push(`HTTP ${httpStatus}`)
  if (!heroCta) failures.push('missing acquisition hero CTA')
  if (!/\bdata-experiment-variant=["']outcome_v1["']/i.test(heroCta)) {
    failures.push('acquisition hero CTA is missing its outcome variant')
  }
  if (!/\bdata-hero-presentation=["'][^"']+["']/i.test(heroCta)) {
    failures.push('acquisition hero CTA is missing its presentation marker')
  }
  if (!/\bdata-copy-version=["']acquisition_promise_v2["']/i.test(heroCta)) {
    failures.push('acquisition hero CTA is missing its copy version')
  }
  if (!finalCta) failures.push('missing acquisition final CTA')
  if (!mobileDock) failures.push('missing acquisition mobile conversion dock')
  if (!/\baria-hidden=["']true["']/i.test(mobileDock)) {
    failures.push('acquisition mobile conversion dock is not hidden before hydration')
  }
  if (!mobileDockCta) failures.push('missing acquisition mobile dock CTA')
  if (!/\bdata-experiment-variant=["']sticky_outcome_v1["']/i.test(mobileDockCta)) {
    failures.push('acquisition mobile dock CTA is missing its outcome variant')
  }
  if (!/\.acquisition-mobile-dock\[aria-hidden=["']true["']\]\s*\{[^}]*display:\s*none\s*;/i.test(styles)) {
    failures.push('acquisition mobile dock has no pre-hydration display guard')
  }
  if (!/\.acquisition-mobile-dock-link > span:last-child\s*\{[^}]*color:\s*#11100c\b/i.test(styles)) {
    failures.push('acquisition mobile dock button has no explicit high-contrast label color')
  }

  return {
    checked_url: url,
    http_status: httpStatus,
    hero_cta_present: Boolean(heroCta),
    final_cta_present: Boolean(finalCta),
    mobile_dock_present: Boolean(mobileDock),
    mobile_dock_hidden_before_hydration: /\baria-hidden=["']true["']/i.test(mobileDock),
    mobile_dock_experiment_present: /\bdata-experiment-variant=["']sticky_outcome_v1["']/i.test(mobileDockCta),
    status: failures.length ? 'fail' : 'pass',
    failures,
  }
}

async function fetchConversionPage(url, audit) {
  try {
    const response = await fetch(url, {
      headers: {
        accept: 'text/html,application/xhtml+xml',
        'cache-control': 'no-cache',
        'user-agent': 'SurpassPublicConversionCheck/1.0 (+https://jacked.coach/support)',
      },
      redirect: 'follow',
    })
    return audit(await response.text(), { url, httpStatus: response.status })
  } catch (error) {
    return {
      ...audit('', { url, httpStatus: 0 }),
      status: 'fail',
      failures: [error?.message || String(error)],
    }
  }
}

async function fetchHomepage(url) {
  return fetchConversionPage(url, auditHomepageConversionHtml)
}

async function fetchAcquisitionPage(url) {
  return fetchConversionPage(url, auditAcquisitionConversionHtml)
}

export async function runPublicConversionCheck({
  url = process.env.PUBLIC_CONVERSION_CHECK_URL || DEFAULT_HOMEPAGE_URL,
  acquisitionPaths = DEFAULT_ACQUISITION_PATHS,
} = {}) {
  const target = new URL(url)
  if (!['http:', 'https:'].includes(target.protocol)) throw new Error('Homepage URL must use http or https')
  const homepage = await fetchHomepage(target.toString())
  const acquisitionPages = await Promise.all(acquisitionPaths.map((pathname) => {
    const pageUrl = new URL(pathname, target.origin)
    return fetchAcquisitionPage(pageUrl.toString())
  }))
  const failures = [
    ...(homepage.status === 'pass' ? [] : homepage.failures.map((failure) => `homepage: ${failure}`)),
    ...acquisitionPages.flatMap((page) => page.status === 'pass'
      ? []
      : page.failures.map((failure) => `${page.checked_url}: ${failure}`)),
  ]

  return {
    checked_at: new Date().toISOString(),
    ...homepage,
    acquisition_pages: acquisitionPages,
    status: failures.length ? 'fail' : 'pass',
    failures,
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  runPublicConversionCheck()
    .then((report) => {
      console.log(JSON.stringify(report, null, 2))
      if (report.status !== 'pass') process.exitCode = 1
    })
    .catch((error) => {
      console.error(error?.stack || error)
      process.exitCode = 1
    })
}
