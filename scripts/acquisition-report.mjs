#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const reportsRoot = path.join(root, 'reports')
const acquisitionRoot = path.join(reportsRoot, 'acquisition')

function parseArgs(argv) {
  const result = {}
  for (let i = 0; i < argv.length; i += 1) {
    const argument = argv[i]
    if (!argument.startsWith('--')) continue
    const [rawKey, inline] = argument.slice(2).split('=', 2)
    const key = rawKey.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
    if (inline !== undefined) result[key] = inline
    else if (argv[i + 1] && !argv[i + 1].startsWith('--')) result[key] = argv[++i]
    else result[key] = true
  }
  return result
}

function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let quoted = false
  for (let i = 0; i < String(text).length; i += 1) {
    const character = text[i]
    if (quoted) {
      if (character === '"' && text[i + 1] === '"') {
        field += '"'
        i += 1
      } else if (character === '"') quoted = false
      else field += character
    } else if (character === '"') quoted = true
    else if (character === ',') {
      row.push(field)
      field = ''
    } else if (character === '\n') {
      row.push(field.replace(/\r$/, ''))
      if (row.some(value => value !== '')) rows.push(row)
      row = []
      field = ''
    } else field += character
  }
  if (field || row.length) {
    row.push(field.replace(/\r$/, ''))
    if (row.some(value => value !== '')) rows.push(row)
  }
  if (!rows.length) return []
  const headers = rows[0]
  return rows.slice(1).map(values => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ''])))
}

async function loadCsv(file) {
  if (!file) return { status: 'missing', file: null, rows: [] }
  try {
    const absolute = path.resolve(file)
    const rows = parseCsv(await fs.readFile(absolute, 'utf8'))
    return { status: rows.length ? 'ready' : 'empty', file: absolute, rows }
  } catch (error) {
    return { status: 'unavailable', file: path.resolve(file), rows: [], error: error?.code || String(error?.message || error) }
  }
}

function number(value) {
  if (value === undefined || value === null || String(value).trim() === '') return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function sum(rows, field) {
  const values = rows.map(row => number(row[field])).filter(value => value !== null)
  return values.length ? values.reduce((total, value) => total + value, 0) : null
}

function countEvent(rows, names) {
  const set = new Set(names)
  return rows.filter(row => set.has(row.event_name || row.event || row.name)).length
}

function display(value) {
  return value === null || value === undefined ? 'unknown' : String(value)
}

function sourceLine(name, source) {
  return `| ${name} | ${source.status} | ${source.rows.length} | ${source.file || 'not supplied'} |`
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const searchQueries = await loadCsv(options.searchQueries || process.env.ACQUISITION_SEARCH_QUERIES || path.join(reportsRoot, 'seo', 'search-console-queries.csv'))
  const searchPages = await loadCsv(options.searchPages || process.env.ACQUISITION_SEARCH_PAGES || path.join(reportsRoot, 'seo', 'search-console-pages.csv'))
  const webEvents = await loadCsv(options.webEvents || process.env.ACQUISITION_WEB_EVENTS)
  const appStore = await loadCsv(options.appStore || process.env.ACQUISITION_APP_STORE)
  const appAnalytics = await loadCsv(options.appAnalytics || process.env.ACQUISITION_APP_ANALYTICS)

  const searchReady = searchQueries.status === 'ready' || searchPages.status === 'ready'
  const webReady = webEvents.status === 'ready'
  const appStoreReady = appStore.status === 'ready'
  const appAnalyticsReady = appAnalytics.status === 'ready'
  const sourceStatuses = [searchReady, webReady, appStoreReady, appAnalyticsReady]
  const status = sourceStatuses.every(Boolean) ? 'ready' : sourceStatuses.some(Boolean) ? 'partial' : 'blocked'

  const searchImpressions = sum(searchQueries.rows, 'impressions') ?? sum(searchPages.rows, 'impressions')
  const searchClicks = sum(searchQueries.rows, 'clicks') ?? sum(searchPages.rows, 'clicks')
  const toolStarts = webReady ? countEvent(webEvents.rows, ['tool_started']) : null
  const toolCompletions = webReady ? countEvent(webEvents.rows, ['tool_completed']) : null
  const appStoreClicks = webReady ? countEvent(webEvents.rows, ['app_store_outbound_clicked']) : null
  const downloads = appStoreReady ? sum(appStore.rows, 'downloads') : null
  const firstWorkouts = appAnalyticsReady ? countEvent(appAnalytics.rows, ['first_workout', 'workout_started']) : null
  const completedWorkouts = appAnalyticsReady ? countEvent(appAnalytics.rows, ['first_completed_workout', 'workout_completed']) : null

  const snapshot = {
    generatedAt: new Date().toISOString(),
    status,
    sources: {
      searchConsole: { status: searchQueries.status === 'ready' || searchPages.status === 'ready' ? 'ready' : 'blocked', queryRows: searchQueries.rows.length, pageRows: searchPages.rows.length },
      webAnalytics: { status: webEvents.status, rows: webEvents.rows.length },
      appStoreConnect: { status: appStore.status, rows: appStore.rows.length },
      appAnalytics: { status: appAnalytics.status, rows: appAnalytics.rows.length },
    },
    funnel: {
      nonBrandSearchImpressions: searchImpressions,
      searchClicks,
      webPageViews: webReady ? countEvent(webEvents.rows, ['web_page_view']) : null,
      toolStarts,
      toolCompletions,
      appStoreOutboundClicks: appStoreClicks,
      downloads,
      firstWorkouts,
      completedWorkouts,
    },
    notes: [
      'Missing source data is represented as null, not zero.',
      'Search Console query/page totals remain unknown when the exporter has no rows.',
      'App Store and app activation data require authorized exports and are not inferred from web events.',
    ],
  }

  const missing = [
    ['Search Console', !searchReady, 'Run scripts/search-console-export.mjs with an authorized read-only token.'],
    ['Web analytics', !webReady, 'Export EU Mixpanel events or provide an approved aggregate event CSV.'],
    ['App Store Connect', !appStoreReady, 'Provide a campaign-linked App Store Connect export.'],
    ['App analytics', !appAnalyticsReady, 'Provide an attribution-safe activation export.'],
  ].filter(([, isMissing]) => isMissing)

  const markdown = `# Acquisition report

Generated: ${snapshot.generatedAt}

Status: **${status.toUpperCase()}**

This report connects search visibility to web and product acquisition only when the corresponding source export is present. Null values mean the source was missing or had no usable rows; they do not mean zero activity.

## Source status

| Source | Status | Rows | File |
| --- | --- | ---: | --- |
${sourceLine('Search Console queries', searchQueries)}
${sourceLine('Search Console pages', searchPages)}
${sourceLine('Web analytics', webEvents)}
${sourceLine('App Store Connect', appStore)}
${sourceLine('App analytics', appAnalytics)}

## Funnel

| Stage | Value |
| --- | ---: |
| Non-brand search impressions | ${display(snapshot.funnel.nonBrandSearchImpressions)} |
| Search clicks | ${display(snapshot.funnel.searchClicks)} |
| Web page views | ${display(snapshot.funnel.webPageViews)} |
| Tool starts | ${display(snapshot.funnel.toolStarts)} |
| Tool completions | ${display(snapshot.funnel.toolCompletions)} |
| App Store outbound clicks | ${display(snapshot.funnel.appStoreOutboundClicks)} |
| Downloads | ${display(snapshot.funnel.downloads)} |
| First workouts | ${display(snapshot.funnel.firstWorkouts)} |
| Completed workouts | ${display(snapshot.funnel.completedWorkouts)} |

## Required next inputs

${missing.length ? missing.map(([name, , next]) => `- **${name}:** ${next}`).join('\n') : '- All configured source inputs were present.'}

## Decisions

- Keep search visibility, web behaviour, App Store activity, and app activation as separate evidence layers.
- Do not interpret blocked connectors as zero traffic.
- Do not declare an experiment winner without a predeclared window, sufficient sample, and rollback path.
`

  await fs.mkdir(acquisitionRoot, { recursive: true })
  await fs.writeFile(path.join(acquisitionRoot, 'latest.json'), `${JSON.stringify(snapshot, null, 2)}\n`)
  await fs.writeFile(path.join(acquisitionRoot, 'latest.md'), markdown)
  console.log(JSON.stringify(snapshot, null, 2))
}

main().catch(error => {
  console.error(error?.stack || error)
  process.exitCode = 1
})
