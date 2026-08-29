#!/usr/bin/env node

import { pathToFileURL } from 'node:url'
import { auditHtml } from './public-brand-check.mjs'

export const DEFAULT_BASE_URL = 'https://jacked.coach'
export const DEFAULT_SITEMAP_PATH = '/sitemap.xml'

function sitemapUrls(xml, baseUrl) {
  return [...String(xml).matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => {
      try {
        return new URL(match[1], baseUrl).toString()
      } catch {
        return ''
      }
    })
    .filter(Boolean)
}

function releaseUrl(rawUrl, query = '') {
  const url = new URL(rawUrl)
  if (query) {
    for (const [key, value] of new URLSearchParams(query)) url.searchParams.set(key, value)
  }
  return url.toString()
}

export function summarizeBrandCrawl({ sitemapHttpStatus = 0, urls = [], pages = [] } = {}) {
  const failures = pages.filter((page) => page.status !== 'pass')
  const stale = pages.filter((page) => page.stale_brand_visible)
  const non200 = pages.filter((page) => page.http_status !== 200)
  return {
    status: sitemapHttpStatus === 200 && failures.length === 0 ? 'ready' : 'blocked',
    sitemap_http_status: sitemapHttpStatus,
    url_count: urls.length,
    checked: pages.length,
    failure_count: failures.length,
    stale_visible_count: stale.length,
    non200_count: non200.length,
    failures: failures.slice(0, 40),
  }
}

export async function runPublicBrandCrawl({
  baseUrl = process.env.PUBLIC_BRAND_CRAWL_BASE_URL || DEFAULT_BASE_URL,
  sitemapPath = process.env.PUBLIC_BRAND_CRAWL_SITEMAP_PATH || DEFAULT_SITEMAP_PATH,
  query = process.env.PUBLIC_BRAND_CRAWL_QUERY || '',
  concurrency = Number(process.env.PUBLIC_BRAND_CRAWL_CONCURRENCY || 12),
} = {}) {
  const base = new URL(baseUrl)
  if (!['http:', 'https:'].includes(base.protocol)) throw new Error('Base URL must use http or https')

  const sitemapUrl = new URL(sitemapPath, base)
  const sitemapResponse = await fetch(sitemapUrl, {
    headers: {
      accept: 'application/xml,text/xml',
      'cache-control': 'no-cache',
      'user-agent': 'SurpassPublicBrandCrawl/1.0 (+https://jacked.coach/support)',
    },
  })
  const sitemap = await sitemapResponse.text()
  const urls = sitemapResponse.ok ? sitemapUrls(sitemap, base) : []
  const pages = []
  let cursor = 0
  const workerCount = Math.max(1, Math.min(32, Number.isFinite(concurrency) ? concurrency : 12))

  const workers = Array.from({ length: workerCount }, async () => {
    while (cursor < urls.length) {
      const index = cursor++
      const canonicalUrl = urls[index]
      const url = releaseUrl(canonicalUrl, query)
      try {
        const response = await fetch(url, {
          headers: {
            accept: 'text/html,application/xhtml+xml',
            'cache-control': 'no-cache',
            'user-agent': 'SurpassPublicBrandCrawl/1.0 (+https://jacked.coach/support)',
          },
          redirect: 'follow',
        })
        const html = await response.text()
        const audit = auditHtml(html, { url: canonicalUrl, httpStatus: response.status })
        pages[index] = audit
      } catch (error) {
        pages[index] = {
          ...auditHtml('', { url: canonicalUrl, httpStatus: 0 }),
          status: 'fail',
          failures: [error?.message || String(error)],
        }
      }
    }
  })
  await Promise.all(workers)

  return {
    checked_at: new Date().toISOString(),
    base_url: base.origin,
    sitemap_url: sitemapUrl.toString(),
    query: query || '',
    ...summarizeBrandCrawl({ sitemapHttpStatus: sitemapResponse.status, urls, pages }),
  }
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  try {
    const result = await runPublicBrandCrawl()
    console.log(JSON.stringify(result, null, 2))
    if (result.status !== 'ready') process.exitCode = 1
  } catch (error) {
    console.error(error?.message || String(error))
    process.exitCode = 1
  }
}
