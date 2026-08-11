#!/usr/bin/env node

import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const baseUrl = new URL(process.env.SEO_AUDIT_BASE_URL || 'https://jacked.coach')
const outputDir = path.join(root, 'reports', 'seo')
const performanceDir = path.join(root, 'reports', 'performance')

function args(argv) {
  const result = {}
  for (let i = 0; i < argv.length; i += 1) {
    const value = argv[i]
    if (!value.startsWith('--')) continue
    const [rawKey, inline] = value.slice(2).split('=', 2)
    const key = rawKey.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
    if (inline !== undefined) result[key] = inline
    else if (argv[i + 1] && !argv[i + 1].startsWith('--')) result[key] = argv[++i]
    else result[key] = true
  }
  return result
}

const options = args(process.argv.slice(2))
const maxPages = Math.max(1, Number(options.maxPages || process.env.SEO_AUDIT_MAX_PAGES || 500))
const concurrency = Math.max(1, Math.min(12, Number(options.concurrency || 6)))
const timeoutMs = Math.max(1000, Number(options.timeoutMs || 12000))
const userAgent = 'JackedTechnicalAudit/1.0 (+https://jacked.coach/support)'

const knownPaths = [
  '/',
  '/blog',
  '/tools',
  '/workout-tracker',
  '/gym-workout-planner',
  '/progressive-overload',
  '/hevy-alternative',
  '/strong-alternative',
  '/fitnotes-alternative',
  '/about',
  '/support',
  '/accessibility',
  '/privacy',
  '/terms',
]

function absoluteUrl(value) {
  try {
    const url = new URL(value, baseUrl)
    if (!['http:', 'https:'].includes(url.protocol) || url.hostname !== baseUrl.hostname) return null
    url.hash = ''
    return url
  } catch {
    return null
  }
}

function keyFor(url) {
  const copy = new URL(url)
  copy.hash = ''
  if (copy.pathname.length > 1) copy.pathname = copy.pathname.replace(/\/+$/, '')
  return copy.toString()
}

function decodeHtml(value = '') {
  return String(value)
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
}

function cleanText(value = '') {
  return decodeHtml(String(value)
    .replace(/<!--([\s\S]*?)-->/g, ' ')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim()
}

function tagAttributes(tag = '') {
  const result = {}
  for (const match of tag.matchAll(/([:\w-]+)\s*=\s*["']([^"']*)["']/g)) {
    result[match[1].toLowerCase()] = decodeHtml(match[2])
  }
  return result
}

function tags(html, name) {
  return [...String(html).matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))]
    .map(match => ({ raw: match[0], attributes: tagAttributes(match[0]) }))
}

function metaContent(html, name) {
  const target = String(name).toLowerCase()
  for (const item of tags(html, 'meta')) {
    if ((item.attributes.name || item.attributes.property || '').toLowerCase() === target) {
      return item.attributes.content || ''
    }
  }
  return ''
}

function canonicalFrom(html) {
  for (const item of tags(html, 'link')) {
    const rel = (item.attributes.rel || '').toLowerCase().split(/\s+/)
    if (rel.includes('canonical')) return item.attributes.href || ''
  }
  return ''
}

function extractSitemapLocations(xml) {
  return [...String(xml).matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)]
    .map(match => absoluteUrl(decodeHtml(match[1])))
    .filter(Boolean)
    .map(keyFor)
}

function extractLinks(html, sourceUrl) {
  const result = []
  for (const item of tags(html, 'a')) {
    const href = item.attributes.href || ''
    if (!href || /^(?:#|mailto:|tel:|javascript:|data:)/i.test(href)) continue
    const target = absoluteUrl(new URL(href, sourceUrl))
    if (target) result.push({ url: keyFor(target), raw: href })
  }
  return result
}

function pageType(url) {
  const pathname = new URL(url).pathname
  if (pathname === '/') return 'home'
  if (pathname === '/blog') return 'blog_hub'
  if (pathname.startsWith('/blog/')) return 'article'
  if (pathname === '/tools') return 'tools_hub'
  if (pathname.startsWith('/tools/')) return 'tool'
  if (['/workout-tracker', '/gym-workout-planner', '/progressive-overload', '/hevy-alternative', '/strong-alternative', '/fitnotes-alternative'].includes(pathname)) return 'acquisition_landing'
  return 'site_page'
}

function sha(value) {
  return crypto.createHash('sha256').update(value).digest('hex').slice(0, 12)
}

async function fetchWithRedirects(target) {
  let current = keyFor(target)
  const chain = []
  const started = Date.now()

  for (let redirects = 0; redirects <= 8; redirects += 1) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const response = await fetch(current, {
        redirect: 'manual',
        signal: controller.signal,
        headers: { accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.1', 'user-agent': userAgent },
      })
      const location = response.headers.get('location')
      if (response.status >= 300 && response.status < 400 && location) {
        const next = absoluteUrl(new URL(location, current))
        chain.push({ url: current, status: response.status, location: next ? keyFor(next) : location })
        if (!next) return { requested: keyFor(target), finalUrl: current, status: response.status, chain, html: '', headers: response.headers, durationMs: Date.now() - started, error: 'redirect leaves the audited host' }
        current = keyFor(next)
        continue
      }
      const contentType = response.headers.get('content-type') || ''
      const html = (contentType.includes('html') || contentType.includes('xml') || current.endsWith('.xml'))
        ? await response.text()
        : ''
      return { requested: keyFor(target), finalUrl: current, status: response.status, chain, html, headers: response.headers, durationMs: Date.now() - started, error: null }
    } catch (error) {
      return { requested: keyFor(target), finalUrl: current, status: 0, chain, html: '', headers: new Headers(), durationMs: Date.now() - started, error: error?.name === 'AbortError' ? `timeout after ${timeoutMs}ms` : String(error?.message || error) }
    } finally {
      clearTimeout(timer)
    }
  }
  return { requested: keyFor(target), finalUrl: current, status: 0, chain, html: '', headers: new Headers(), durationMs: Date.now() - started, error: 'redirect limit exceeded' }
}

function analysePage(result, sitemapSet) {
  const html = result.html
  const parsedUrl = new URL(result.requested)
  const finalUrl = new URL(result.finalUrl)
  const canonicalRaw = canonicalFrom(html)
  const canonicalUrl = canonicalRaw ? absoluteUrl(new URL(canonicalRaw, result.finalUrl)) : null
  const robots = metaContent(html, 'robots')
  const xRobots = result.headers.get('x-robots-tag') || ''
  const h1 = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map(match => cleanText(match[1])).filter(Boolean)
  const title = cleanText((html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || '')
  const description = metaContent(html, 'description')
  const links = extractLinks(html, result.finalUrl)
  const internalLinks = links.filter(link => new URL(link.url).hostname === baseUrl.hostname)
  const imageTags = tags(html, 'img')
  const missingAlt = imageTags.filter(item => !Object.hasOwn(item.attributes, 'alt') || !item.attributes.alt.trim()).length
  const text = cleanText(html)
  const soft404 = result.status === 200 && /(?:page not found|404|does not exist|couldn.t find)/i.test(`${title} ${h1.join(' ')} ${text.slice(0, 1200)}`)
  const jsonLdTypes = []
  let jsonLdValid = true
  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const parsed = JSON.parse(match[1].trim())
      const values = Array.isArray(parsed) ? parsed : [parsed]
      for (const value of values) {
        if (value?.['@type']) jsonLdTypes.push(...(Array.isArray(value['@type']) ? value['@type'] : [value['@type']]))
      }
    } catch {
      jsonLdValid = false
    }
  }
  const noindex = /(?:^|[,\s])noindex(?:$|[,\s])/i.test(`${robots},${xRobots}`)
  const canonicalSelf = canonicalUrl ? keyFor(canonicalUrl) === keyFor(parsedUrl) : false
  const indexable = result.status === 200 && !noindex && canonicalSelf && !soft404
  const auditStatus = result.status === 0 ? 'blocked' : 'audited'
  let action = 'Improve'
  if (auditStatus === 'blocked') action = 'Review'
  else if (result.status >= 300 && result.status < 400) action = 'Redirect'
  else if (result.status >= 400 || soft404) action = 'Remove'
  else if (noindex) action = 'Noindex'
  else if (canonicalUrl && !canonicalSelf) action = 'Merge'
  else if (['/', '/blog', '/tools', '/workout-tracker', '/gym-workout-planner', '/progressive-overload', '/hevy-alternative', '/strong-alternative', '/fitnotes-alternative'].includes(parsedUrl.pathname) || parsedUrl.pathname.startsWith('/tools/')) action = 'Keep'

  const notes = []
  if (result.error) notes.push(result.error)
  if (result.status === 200 && !canonicalRaw) notes.push('missing canonical')
  if (canonicalUrl && !canonicalSelf) notes.push('canonical differs from requested URL')
  if (noindex && sitemapSet.has(keyFor(parsedUrl))) notes.push('noindex URL appears in sitemap')
  if (result.status === 200 && h1.length !== 1) notes.push(`expected one H1, found ${h1.length}`)
  if (soft404) notes.push('soft-404 text pattern')
  if (imageTags.length > 0 && missingAlt > 0) notes.push(`${missingAlt} image(s) missing alt text`)

  return {
    url: result.requested,
    source: '',
    http_status: result.status,
    redirect_destination: result.finalUrl !== result.requested ? result.finalUrl : '',
    redirect_chain: result.chain.map(item => `${item.status}:${item.location}`).join(' | '),
    canonical: canonicalUrl ? keyFor(canonicalUrl) : '',
    robots_meta: robots,
    x_robots_tag: xRobots,
    sitemap_inclusion: sitemapSet.has(result.requested) ? 'yes' : 'no',
    title,
    meta_description: description,
    h1_count: h1.length,
    h1_text: h1.join(' | '),
    word_count: text ? text.split(/\s+/).length : 0,
    page_type: pageType(result.requested),
    structured_data_types: [...new Set(jsonLdTypes)].join('|'),
    structured_data_valid: jsonLdValid ? 'yes' : 'no',
    inbound_internal_links: 0,
    outbound_internal_links: internalLinks.length,
    image_count: imageTags.length,
    missing_alt_count: missingAlt,
    indexability_verdict: auditStatus === 'blocked' ? 'blocked' : indexable ? 'indexable' : noindex ? 'noindex' : 'needs_review',
    content_action: action,
    query_parameters: parsedUrl.search ? parsedUrl.search.slice(1) : '',
    audit_status: auditStatus,
    notes: notes.join('; '),
    duration_ms: result.durationMs,
    content_hash: text ? sha(text) : '',
    links: internalLinks.map(link => link.url),
  }
}

function csv(value) {
  const string = String(value ?? '')
  return /[",\n\r]/.test(string) ? `"${string.replaceAll('"', '""')}"` : string
}

function writeCsv(file, rows, columns) {
  return fs.writeFile(file, `${columns.join(',')}\n${rows.map(row => columns.map(column => csv(row[column])).join(',')).join('\n')}${rows.length ? '\n' : ''}`)
}

function percentile(values, fraction) {
  if (!values.length) return null
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.min(sorted.length - 1, Math.floor((sorted.length - 1) * fraction))]
}

function markdownList(values) {
  return values.length ? values.map(value => `- ${value}`).join('\n') : '- None observed in the audited set.'
}

async function main() {
  await fs.mkdir(outputDir, { recursive: true })
  await fs.mkdir(performanceDir, { recursive: true })

  const sitemapUrl = new URL('/sitemap.xml', baseUrl)
  const sitemapResult = await fetchWithRedirects(sitemapUrl)
  const sitemapSet = new Set(extractSitemapLocations(sitemapResult.html))
  const sources = new Map()
  const queue = []
  const queued = new Set()
  const add = (value, source) => {
    const url = absoluteUrl(value)
    if (!url) return
    const key = keyFor(url)
    if (!sources.has(key)) sources.set(key, new Set())
    sources.get(key).add(source)
    if (!queued.has(key)) {
      queued.add(key)
      queue.push(key)
    }
  }

  for (const url of sitemapSet) add(url, 'sitemap')
  for (const pathname of knownPaths) add(new URL(pathname, baseUrl), 'known')
  if (sitemapResult.html) {
    for (const link of extractLinks(sitemapResult.html, sitemapResult.finalUrl)) add(link.url, 'sitemap-link')
  }

  const records = new Map()
  let next = 0
  const worker = async () => {
    while (true) {
      const index = next++
      if (index >= queue.length || index >= maxPages) return
      const requested = queue[index]
      if (records.has(requested)) continue
      const result = await fetchWithRedirects(requested)
      const record = analysePage(result, sitemapSet)
      record.source = [...(sources.get(requested) || [])].join('|')
      records.set(requested, record)
      for (const link of record.links) add(link, `internal:${requested}`)
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker))

  for (const url of queue) {
    if (records.has(url)) continue
    records.set(url, {
      url,
      source: [...(sources.get(url) || [])].join('|'),
      http_status: '',
      redirect_destination: '',
      redirect_chain: '',
      canonical: '',
      robots_meta: '',
      x_robots_tag: '',
      sitemap_inclusion: sitemapSet.has(url) ? 'yes' : 'no',
      title: '',
      meta_description: '',
      h1_count: '',
      h1_text: '',
      word_count: '',
      page_type: pageType(url),
      structured_data_types: '',
      structured_data_valid: '',
      inbound_internal_links: 0,
      outbound_internal_links: '',
      image_count: '',
      missing_alt_count: '',
      indexability_verdict: 'not_audited',
      content_action: 'Review',
      query_parameters: new URL(url).search.slice(1),
      audit_status: 'not_audited',
      notes: 'Page was discovered but not fetched because --max-pages was reached.',
      duration_ms: '',
      content_hash: '',
      links: [],
    })
  }

  const allRecords = [...records.values()]
  const byUrl = new Map(allRecords.map(record => [record.url, record]))
  for (const record of allRecords) {
    for (const link of record.links || []) {
      const target = byUrl.get(link)
      if (target) target.inbound_internal_links += 1
    }
  }

  const hashGroups = new Map()
  for (const record of allRecords) {
    if (!record.content_hash) continue
    if (!hashGroups.has(record.content_hash)) hashGroups.set(record.content_hash, [])
    hashGroups.get(record.content_hash).push(record.url)
  }
  for (const group of hashGroups.values()) {
    if (group.length < 2) continue
    for (const url of group) {
      const record = byUrl.get(url)
      record.notes = `${record.notes ? `${record.notes}; ` : ''}exact-content-duplicate-group=${sha(group.join('|'))}`
    }
  }

  const titles = new Map()
  const descriptions = new Map()
  for (const record of allRecords) {
    if (record.title) {
      if (!titles.has(record.title)) titles.set(record.title, [])
      titles.get(record.title).push(record.url)
    }
    if (record.meta_description) {
      if (!descriptions.has(record.meta_description)) descriptions.set(record.meta_description, [])
      descriptions.get(record.meta_description).push(record.url)
    }
  }
  const duplicateTitles = [...titles.values()].filter(group => group.length > 1)
  const duplicateDescriptions = [...descriptions.values()].filter(group => group.length > 1)
  const brokenInternal = allRecords.flatMap(record => (record.links || []).filter(link => byUrl.has(link) && Number(byUrl.get(link).http_status) >= 400).map(link => `${record.url} -> ${link}`))
  const noindexInSitemap = allRecords.filter(record => record.sitemap_inclusion === 'yes' && record.indexability_verdict === 'noindex').map(record => record.url)
  const queryUrls = allRecords.filter(record => record.query_parameters).map(record => record.url)
  const stagingUrls = allRecords.filter(record => /(?:^|\/)(?:staging|preview)(?:[./?]|$)|(?:localhost|vercel\.app|pages\.dev)/i.test(record.url)).map(record => record.url)
  const responseTimes = allRecords.filter(record => record.audit_status === 'audited' && Number(record.http_status) === 200 && Number.isFinite(Number(record.duration_ms))).map(record => Number(record.duration_ms))
  const sitemapAuditCount = allRecords.filter(record => record.sitemap_inclusion === 'yes').length
  const notAudited = allRecords.filter(record => record.audit_status === 'not_audited').length
  const blocked = allRecords.filter(record => record.audit_status === 'blocked').length
  const columns = [
    'url', 'source', 'http_status', 'redirect_destination', 'redirect_chain', 'canonical', 'robots_meta', 'x_robots_tag', 'sitemap_inclusion',
    'title', 'meta_description', 'h1_count', 'h1_text', 'word_count', 'page_type', 'structured_data_types', 'structured_data_valid',
    'inbound_internal_links', 'outbound_internal_links', 'image_count', 'missing_alt_count', 'indexability_verdict', 'content_action',
    'query_parameters', 'audit_status', 'notes',
  ]
  const rows = allRecords.map(record => Object.fromEntries(columns.map(column => [column, record[column]])))
  await writeCsv(path.join(outputDir, 'url-inventory.csv'), rows, columns)

  const redirects = allRecords.filter(record => record.redirect_destination || (Number(record.http_status) >= 300 && Number(record.http_status) < 400)).map(record => ({
    source_url: record.url,
    http_status: record.http_status,
    destination: record.redirect_destination,
    chain: record.redirect_chain,
    chain_length: record.redirect_chain ? record.redirect_chain.split('|').length : 0,
    notes: record.notes,
  }))
  await writeCsv(path.join(outputDir, 'redirect-map.csv'), redirects, ['source_url', 'http_status', 'destination', 'chain', 'chain_length', 'notes'])

  const runDate = new Date().toISOString()
  const auditMarkdown = `# Technical SEO audit

Run: ${runDate}

Base URL: \`${baseUrl.origin}\`

## Scope and completeness

- Sitemap fetch: ${sitemapResult.status || 'blocked'}${sitemapResult.error ? ` (${sitemapResult.error})` : ''}
- URLs listed in sitemap: ${sitemapSet.size}
- URLs discovered from sitemap, known routes, and internal links: ${queue.length}
- URLs audited: ${allRecords.filter(record => record.audit_status === 'audited').length}
- URLs not audited because of the bound: ${notAudited}
- Fetch-blocked URLs: ${blocked}
- Audit bound: ${maxPages} pages, ${concurrency} concurrent requests, ${timeoutMs}ms timeout

The inventory gives every discovered URL an explicit provisional action. A \`Review\` action means evidence or the fetch bound was insufficient; it is not permission to remove a URL.

## Indexability checks

- Sitemap URLs with noindex in the audited rows: ${noindexInSitemap.length}
- URLs with query parameters: ${queryUrls.length}
- Potential staging/deployment URLs: ${stagingUrls.length}
- Broken internal links observed: ${brokenInternal.length}
- Duplicate titles: ${duplicateTitles.length} groups
- Duplicate descriptions: ${duplicateDescriptions.length} groups

### Noindex URLs in sitemap

${markdownList(noindexInSitemap)}

### Broken internal links

${markdownList(brokenInternal.slice(0, 100))}

### Potential staging URLs

${markdownList(stagingUrls)}

## Findings requiring review

- A sitemap URL should be 200, indexable, canonical to itself, and useful before it is retained in the sitemap.
- A missing or non-self canonical is recorded as \`needs_review\` or \`Merge\`; no redirect is applied by this audit.
- Duplicate metadata and exact-content duplicate groups are recorded for content review. The script does not infer backlinks, Search Console demand, or a safe redirect destination.
- JavaScript-disabled rendering, mobile layout, structured-data visibility after hydration, and browser interaction are not proven by this HTTP crawl.

## Provisional decision counts

${['Keep', 'Improve', 'Merge', 'Redirect', 'Noindex', 'Remove', 'Review'].map(action => `- ${action}: ${allRecords.filter(record => record.content_action === action).length}`).join('\n')}
`
  await fs.writeFile(path.join(outputDir, 'technical-audit.md'), auditMarkdown)

  const performanceMarkdown = `# Core Web Vitals audit

Run: ${runDate}

## Measurement boundary

This run used dependency-free HTTP fetches against \`${baseUrl.origin}\`. It did not run Lighthouse, a browser, JavaScript interaction, a throttled mobile trace, CrUX, or PageSpeed Insights. LCP, INP, and CLS are therefore **not measured** and no Core Web Vitals pass/fail claim is made.

## Available HTTP timing signal

Successful HTML responses in the audited set: ${responseTimes.length}

- HTTP response duration p50: ${percentile(responseTimes, 0.50) ?? 'unknown'} ms
- HTTP response duration p75: ${percentile(responseTimes, 0.75) ?? 'unknown'} ms
- HTTP response duration p95: ${percentile(responseTimes, 0.95) ?? 'unknown'} ms

These durations include network and response-body transfer from this machine. They are not TTFB and must not be substituted for LCP, INP, or CLS.

## Required next measurement

Run representative home, acquisition, tool, and article templates in a browser on a throttled mobile profile with JavaScript enabled and disabled where relevant. Record field or lab evidence for LCP, INP, CLS, total blocking time, transferred bytes, image dimensions, video loading, hydration cost, font shifts, and third-party script cost. Compare the homepage hero, app-preview video, Mermaid requests, Mixpanel initialization, and the largest tool/article templates before changing implementation.
`
  await fs.writeFile(path.join(performanceDir, 'core-web-vitals.md'), performanceMarkdown)

  console.log(JSON.stringify({
    baseUrl: baseUrl.origin,
    sitemapUrls: sitemapSet.size,
    discoveredUrls: queue.length,
    auditedUrls: allRecords.length - notAudited,
    notAudited,
    blocked,
    brokenInternalLinks: brokenInternal.length,
    noindexInSitemap: noindexInSitemap.length,
  }, null, 2))
}

main().catch(error => {
  console.error(error?.stack || error)
  process.exitCode = 1
})
