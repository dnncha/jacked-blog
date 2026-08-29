#!/usr/bin/env node

import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const defaultOutputDir = path.join(projectRoot, 'reports', 'seo')
const searchAnalyticsEndpoint = 'https://www.googleapis.com/webmasters/v3/sites'
const oauthTokenEndpoint = 'https://oauth2.googleapis.com/token'
const readOnlyScope = 'https://www.googleapis.com/auth/webmasters.readonly'

const defaultDimensions = ['date', 'query', 'page', 'device', 'country', 'searchAppearance']
const pageDimensions = ['date', 'page', 'device', 'country', 'searchAppearance']
const queryDimensions = ['date', 'query', 'device', 'country', 'searchAppearance']
const cannibalizationDimensions = ['query', 'page']
const supportedDimensions = new Set([
  'date',
  'query',
  'page',
  'device',
  'country',
  'searchAppearance',
  'hour',
])

const brandTerms = [
  'surpass',
  'surpass app',
  'surpass strength',
  'surpass workout',
  'surpass coach',
  'jacked',
  'jacked coach',
  'jacked workout app',
  'jacked workout log',
]
const commercialTerms = [
  'workout tracker',
  'hypertrophy app',
  'progressive overload app',
  'hevy alternative',
  'strong alternative',
  'fitnotes alternative',
  'gym workout planner',
]
const utilityTerms = [
  'next set calculator',
  'rir calculator',
  'weekly volume calculator',
  'weekly volume checker',
  'warm up calculator',
  'warm-up calculator',
  'plate calculator',
  '1rm calculator',
  'one rep max calculator',
  'workout csv validator',
]

const detailedColumns = [
  'range',
  'start_date',
  'end_date',
  'date',
  'query',
  'page',
  'device',
  'country',
  'search_appearance',
  'hour',
  'brand_class',
  'intent_view',
  'clicks',
  'impressions',
  'ctr',
  'position',
]

const pageColumns = [
  'range',
  'start_date',
  'end_date',
  'date',
  'page',
  'device',
  'country',
  'search_appearance',
  'clicks',
  'impressions',
  'ctr',
  'position',
]

const queryColumns = [
  'range',
  'start_date',
  'end_date',
  'date',
  'query',
  'device',
  'country',
  'search_appearance',
  'brand_class',
  'intent_view',
  'clicks',
  'impressions',
  'ctr',
  'position',
]

const cannibalizationColumns = [
  'range',
  'start_date',
  'end_date',
  'brand_class',
  'intent_view',
  'query',
  'page_count',
  'pages',
  'total_clicks',
  'total_impressions',
  'ctr',
  'position',
]

function printHelp() {
  console.log(`Search Console Search Analytics export

Usage:
  node scripts/search-console-export.mjs [options]

Options:
  --property <value>       Search Console property (default: sc-domain:jacked.coach)
  --ranges <list>          max,90d,28d or custom names (default: max,90d,28d)
  --start-date <date>      Use one custom range when --ranges is not supplied
  --end-date <date>        Inclusive YYYY-MM-DD end date (default: UTC today - 3 days)
  --dimensions <list>      Detailed raw dimensions (default: date,query,page,device,country,searchAppearance)
  --row-limit <number>     API page size, 1-25000 (default: 1000)
  --max-rows <number>      Local row cap per query/range; 0 means no local cap (default: 10000)
  --data-state <value>     final or all (default: final)
  --type <value>           Search type, normally web (default: web)
  --output-dir <path>      Report directory (default: reports/seo)
  --config <path>          Ignored/out-of-repository JSON config file
  --no-detailed             Skip optional search-console-dimensional.csv
  --help                    Show this message

Credentials are accepted only from environment variables or the JSON config path:
  GSC_ACCESS_TOKEN
  GSC_OAUTH_CLIENT_ID, GSC_OAUTH_CLIENT_SECRET, GSC_OAUTH_REFRESH_TOKEN
  GSC_SERVICE_ACCOUNT_FILE or GSC_SERVICE_ACCOUNT_JSON
`)
}

function parseArgs(argv) {
  const args = {}

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]
    if (argument === '--help' || argument === '-h') {
      args.help = true
      continue
    }
    if (!argument.startsWith('--')) {
      throw new Error(`Unexpected argument: ${argument}`)
    }

    const raw = argument.slice(2)
    const equalsIndex = raw.indexOf('=')
    const rawName = equalsIndex === -1 ? raw : raw.slice(0, equalsIndex)
    const inlineValue = equalsIndex === -1 ? undefined : raw.slice(equalsIndex + 1)
    const name = rawName.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())

    if (inlineValue !== undefined) {
      args[name] = inlineValue
      continue
    }

    const next = argv[index + 1]
    if (next && !next.startsWith('--')) {
      args[name] = next
      index += 1
    } else {
      args[name] = true
    }
  }

  return args
}

async function readConfig(configPath) {
  if (!configPath) return {config: {}, directory: projectRoot, error: null}

  const absolutePath = path.resolve(configPath)
  try {
    const contents = await fs.readFile(absolutePath, 'utf8')
    const config = JSON.parse(contents)
    if (!config || typeof config !== 'object' || Array.isArray(config)) {
      throw new Error('the JSON root must be an object')
    }
    return {config, directory: path.dirname(absolutePath), error: null}
  } catch (error) {
    return {
      config: {},
      directory: path.dirname(absolutePath),
      error: `Could not read GSC_CONFIG_FILE: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

function setting(args, config, argumentName, environmentName, configName, fallback) {
  if (args[argumentName] !== undefined) return args[argumentName]
  if (process.env[environmentName] !== undefined) return process.env[environmentName]
  if (config[configName] !== undefined) return config[configName]
  return fallback
}

function isoDate(date = new Date()) {
  return date.toISOString().slice(0, 10)
}

function shiftDays(value, amount) {
  const date = new Date(`${value}T00:00:00.000Z`)
  date.setUTCDate(date.getUTCDate() + amount)
  return isoDate(date)
}

function shiftMonths(value, amount) {
  const source = new Date(`${value}T00:00:00.000Z`)
  const day = source.getUTCDate()
  const target = new Date(Date.UTC(source.getUTCFullYear(), source.getUTCMonth() + amount, 1))
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate()
  target.setUTCDate(Math.min(day, lastDay))
  return isoDate(target)
}

function assertDate(value, label) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`${label} must use YYYY-MM-DD: ${value}`)
  }
  const parsed = new Date(`${value}T00:00:00.000Z`)
  if (Number.isNaN(parsed.getTime()) || isoDate(parsed) !== value) {
    throw new Error(`${label} is not a valid calendar date: ${value}`)
  }
  return value
}

function parseDimensions(value) {
  const dimensions = String(value)
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)

  if (dimensions.length === 0) throw new Error('At least one detailed dimension is required.')
  const unique = [...new Set(dimensions)]
  const unsupported = unique.filter(dimension => !supportedDimensions.has(dimension))
  if (unsupported.length > 0) {
    throw new Error(`Unsupported dimension(s): ${unsupported.join(', ')}. Supported values: ${[...supportedDimensions].join(', ')}`)
  }
  if (unique.length !== dimensions.length) throw new Error('Detailed dimensions must not repeat.')
  return unique
}

function resolveRanges(args, config) {
  const endDate = assertDate(
    setting(args, config, 'endDate', 'GSC_END_DATE', 'endDate', shiftDays(isoDate(), -3)),
    'end date',
  )
  const explicitStart = setting(args, config, 'startDate', 'GSC_START_DATE', 'startDate', undefined)
  const configuredRanges = args.ranges ?? process.env.GSC_RANGES ?? config.ranges
  const rangeNames = configuredRanges
    ? String(configuredRanges).split(',').map(value => value.trim()).filter(Boolean)
    : explicitStart
      ? ['custom']
      : ['max', '90d', '28d']

  if (rangeNames.length === 0) throw new Error('At least one range is required.')
  const maxHistoryStart = setting(
    args,
    config,
    'maxHistoryStartDate',
    'GSC_MAX_HISTORY_START_DATE',
    'maxHistoryStartDate',
    shiftMonths(endDate, -16),
  )

  const ranges = rangeNames.map(name => {
    const normalizedName = name.toLowerCase()
    let startDate
    let label

    if (normalizedName === 'max' || normalizedName === 'maximum' || normalizedName === '16m') {
      startDate = maxHistoryStart
      label = 'max'
    } else if (normalizedName === '90d' || normalizedName === 'trailing-90d' || normalizedName === 'trailing90d') {
      startDate = shiftDays(endDate, -89)
      label = 'trailing-90d'
    } else if (normalizedName === '28d' || normalizedName === 'trailing-28d' || normalizedName === 'trailing28d') {
      startDate = shiftDays(endDate, -27)
      label = 'trailing-28d'
    } else if (normalizedName === 'custom') {
      if (!explicitStart) throw new Error('The custom range requires --start-date or GSC_START_DATE.')
      startDate = explicitStart
      label = 'custom'
    } else {
      throw new Error(`Unknown range: ${name}. Use max, 90d, 28d, or custom.`)
    }

    startDate = assertDate(startDate, `${label} start date`)
    if (startDate > endDate) throw new Error(`${label} start date must not be after the end date.`)
    return {key: label, startDate, endDate}
  })

  const seen = new Set()
  return ranges.filter(range => {
    if (seen.has(range.key)) return false
    seen.add(range.key)
    return true
  })
}

function normaliseQuery(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
}

function includesTerm(query, term) {
  return query.includes(normaliseQuery(term))
}

function classifyQuery(query) {
  const normalized = normaliseQuery(query)
  if (!normalized) return {brandClass: '', intentView: ''}
  return {
    brandClass: brandTerms.some(term => includesTerm(normalized, term)) ? 'branded' : 'non-branded',
    intentView: commercialTerms.some(term => includesTerm(normalized, term))
      ? 'commercial'
      : utilityTerms.some(term => includesTerm(normalized, term))
        ? 'utility'
        : 'other',
  }
}

function dimensionColumn(dimension) {
  return dimension === 'searchAppearance' ? 'search_appearance' : dimension
}

function numberValue(value) {
  const number = Number(value)
  return Number.isFinite(number) ? number : 0
}

function mapApiRow(row, dimensions, range) {
  const record = {
    range: range.key,
    start_date: range.startDate,
    end_date: range.endDate,
  }

  for (const [index, dimension] of dimensions.entries()) {
    record[dimensionColumn(dimension)] = row.keys?.[index] ?? ''
  }

  record.clicks = numberValue(row.clicks)
  record.impressions = numberValue(row.impressions)
  record.ctr = numberValue(row.ctr)
  record.position = numberValue(row.position)

  if (record.query !== undefined) {
    const classification = classifyQuery(record.query)
    record.brand_class = classification.brandClass
    record.intent_view = classification.intentView
  }

  return record
}

function encodeBase64Url(value) {
  const bytes = Buffer.isBuffer(value)
    ? value
    : Buffer.from(typeof value === 'string' ? value : JSON.stringify(value))
  return bytes
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

function parseJsonString(value, label) {
  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('the JSON root must be an object')
    return parsed
  } catch (error) {
    throw new Error(`Invalid ${label}: ${error instanceof Error ? error.message : String(error)}`)
  }
}

async function responsePayload(response) {
  const text = await response.text()
  let json
  try {
    json = text ? JSON.parse(text) : {}
  } catch {
    json = {}
  }
  return {json, text}
}

function responseMessage(payload) {
  return payload.json?.error?.message
    || payload.json?.error_description
    || payload.text
    || 'no error message returned'
}

function compactError(value) {
  return String(value).replace(/\s+/g, ' ').trim().slice(0, 360)
}

function resolvePath(value, directory) {
  if (!value) return undefined
  return path.isAbsolute(value) ? value : path.resolve(directory, value)
}

function makeAuth(args, config, configDirectory, configError) {
  const oauth = config.oauth && typeof config.oauth === 'object' ? config.oauth : {}
  const serviceAccount = config.serviceAccount && typeof config.serviceAccount === 'object' ? config.serviceAccount : {}

  const directAccessToken = process.env.GSC_ACCESS_TOKEN || config.accessToken
  if (directAccessToken) {
    return {
      mode: 'access-token',
      getToken: async () => String(directAccessToken).trim(),
      setupIssue: configError,
    }
  }

  const clientId = process.env.GSC_OAUTH_CLIENT_ID || config.oauthClientId || oauth.clientId
  const clientSecret = process.env.GSC_OAUTH_CLIENT_SECRET || config.oauthClientSecret || oauth.clientSecret
  const refreshToken = process.env.GSC_OAUTH_REFRESH_TOKEN || config.oauthRefreshToken || oauth.refreshToken
  if (clientId && clientSecret && refreshToken) {
    let tokenPromise
    return {
      mode: 'oauth-refresh-token',
      getToken: async () => {
        tokenPromise ||= requestOAuthRefreshToken({clientId, clientSecret, refreshToken})
        return tokenPromise
      },
      setupIssue: configError,
    }
  }

  const serviceAccountFile = resolvePath(
    process.env.GSC_SERVICE_ACCOUNT_FILE || config.serviceAccountFile || serviceAccount.file,
    configDirectory,
  )
  const serviceAccountJson = process.env.GSC_SERVICE_ACCOUNT_JSON || config.serviceAccountJson || serviceAccount.json
  if (serviceAccountFile || serviceAccountJson) {
    let tokenPromise
    return {
      mode: 'service-account',
      getToken: async () => {
        tokenPromise ||= requestServiceAccountToken({serviceAccountFile, serviceAccountJson})
        return tokenPromise
      },
      setupIssue: configError,
    }
  }

  return {
    mode: 'none',
    getToken: async () => {
      throw new Error(configError || 'No Search Console credential was supplied.')
    },
    setupIssue: configError || 'Set GSC_ACCESS_TOKEN, the OAuth refresh-token variables, or GSC_SERVICE_ACCOUNT_FILE.',
  }
}

async function requestOAuthRefreshToken({clientId, clientSecret, refreshToken}) {
  const body = new URLSearchParams({
    client_id: String(clientId),
    client_secret: String(clientSecret),
    refresh_token: String(refreshToken),
    grant_type: 'refresh_token',
  })
  const response = await fetch(oauthTokenEndpoint, {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body,
  })
  const payload = await responsePayload(response)
  if (!response.ok || !payload.json.access_token) {
    throw new Error(`OAuth refresh-token request failed with HTTP ${response.status}: ${compactError(responseMessage(payload))}`)
  }
  return payload.json.access_token
}

async function requestServiceAccountToken({serviceAccountFile, serviceAccountJson}) {
  let credentials
  if (serviceAccountJson) {
    credentials = parseJsonString(serviceAccountJson, 'GSC_SERVICE_ACCOUNT_JSON')
  } else {
    try {
      credentials = parseJsonString(await fs.readFile(serviceAccountFile, 'utf8'), 'service-account file')
    } catch (error) {
      throw new Error(`Could not read the service-account file: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  if (!credentials.client_email || !credentials.private_key) {
    throw new Error('The service-account JSON must contain client_email and private_key.')
  }

  const issuedAt = Math.floor(Date.now() / 1000)
  const header = {alg: 'RS256', typ: 'JWT'}
  const claims = {
    iss: credentials.client_email,
    scope: readOnlyScope,
    aud: oauthTokenEndpoint,
    iat: issuedAt,
    exp: issuedAt + 3600,
  }
  const unsignedToken = `${encodeBase64Url(header)}.${encodeBase64Url(claims)}`
  const signer = crypto.createSign('RSA-SHA256')
  signer.update(unsignedToken)
  signer.end()
  const signature = signer.sign(String(credentials.private_key).replace(/\\n/g, '\n'))
  const assertion = `${unsignedToken}.${encodeBase64Url(signature)}`

  const response = await fetch(oauthTokenEndpoint, {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  })
  const payload = await responsePayload(response)
  if (!response.ok || !payload.json.access_token) {
    throw new Error(`Service-account token request failed with HTTP ${response.status}: ${compactError(responseMessage(payload))}`)
  }
  return payload.json.access_token
}

async function querySearchAnalytics({property, range, dimensions, type, dataState, rowLimit, maxRows, getToken}) {
  const token = await getToken()
  const endpoint = `${searchAnalyticsEndpoint}/${encodeURIComponent(property)}/searchAnalytics/query`
  const rows = []
  let startRow = 0
  let requestCount = 0

  while (true) {
    const remaining = maxRows > 0 ? maxRows - rows.length : rowLimit
    if (remaining <= 0) break
    const requestedRowLimit = Math.min(rowLimit, remaining)
    const body = {
      startDate: range.startDate,
      endDate: range.endDate,
      dimensions,
      type,
      dataState,
      rowLimit: requestedRowLimit,
      startRow,
    }
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    const payload = await responsePayload(response)
    if (!response.ok) {
      throw new Error(`Search Console query failed with HTTP ${response.status}: ${compactError(responseMessage(payload))}`)
    }

    const page = Array.isArray(payload.json.rows) ? payload.json.rows : []
    rows.push(...page.map(row => mapApiRow(row, dimensions, range)))
    requestCount += 1

    if (page.length < requestedRowLimit) break
    if (requestCount >= 1000) throw new Error('Pagination stopped after 1000 API requests; lower the range or max-rows.')
    startRow += page.length
  }

  return rows
}

function csvEscape(value) {
  if (value === undefined || value === null) return ''
  const text = String(value)
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

function toCsv(columns, rows) {
  const lines = [columns.join(',')]
  for (const row of rows) lines.push(columns.map(column => csvEscape(row[column])).join(','))
  return `${lines.join('\n')}\n`
}

async function writeCsv(outputDir, filename, columns, rows) {
  await fs.writeFile(path.join(outputDir, filename), toCsv(columns, rows), 'utf8')
}

function aggregateRecords(rows, keyName) {
  const buckets = new Map()
  for (const row of rows) {
    const key = String(row[keyName] || '')
    if (!key) continue
    const bucket = buckets.get(key) || {
      key,
      clicks: 0,
      impressions: 0,
      weightedPosition: 0,
      positionWeight: 0,
      rows: 0,
    }
    bucket.clicks += numberValue(row.clicks)
    bucket.impressions += numberValue(row.impressions)
    const impressions = numberValue(row.impressions)
    if (impressions > 0 && Number.isFinite(Number(row.position))) {
      bucket.weightedPosition += numberValue(row.position) * impressions
      bucket.positionWeight += impressions
    }
    bucket.rows += 1
    buckets.set(key, bucket)
  }

  return [...buckets.values()].map(bucket => ({
    ...bucket,
    ctr: bucket.impressions > 0 ? bucket.clicks / bucket.impressions : 0,
    position: bucket.positionWeight > 0 ? bucket.weightedPosition / bucket.positionWeight : 0,
  }))
}

function aggregateByClassification(rows, fieldName) {
  const buckets = new Map()
  for (const row of rows) {
    const key = row[fieldName]
    if (!key) continue
    const bucket = buckets.get(key) || {
      key,
      clicks: 0,
      impressions: 0,
      rows: 0,
    }
    bucket.clicks += numberValue(row.clicks)
    bucket.impressions += numberValue(row.impressions)
    bucket.rows += 1
    buckets.set(key, bucket)
  }
  return [...buckets.values()].map(bucket => ({
    ...bucket,
    ctr: bucket.impressions > 0 ? bucket.clicks / bucket.impressions : 0,
  }))
}

function rangeTotals(rows) {
  if (rows.length === 0) return {known: false, clicks: 0, impressions: 0, ctr: 0, position: 0}
  const row = rows[0]
  return {
    known: true,
    clicks: numberValue(row.clicks),
    impressions: numberValue(row.impressions),
    ctr: numberValue(row.ctr),
    position: numberValue(row.position),
  }
}

function formatCount(value) {
  return Number.isFinite(Number(value)) ? Math.round(Number(value)).toLocaleString('en-US') : '—'
}

function formatPercent(value) {
  return Number.isFinite(Number(value)) ? `${(Number(value) * 100).toFixed(2)}%` : '—'
}

function formatPosition(value) {
  return Number.isFinite(Number(value)) && Number(value) > 0 ? Number(value).toFixed(1) : '—'
}

function markdownCell(value) {
  return String(value ?? '—').replace(/\|/g, '\\|').replace(/\n/g, ' ')
}

function markdownTable(headers, rows) {
  const lines = [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
  ]
  for (const row of rows) lines.push(`| ${row.map(markdownCell).join(' | ')} |`)
  return lines.join('\n')
}

function queryOpportunityRows(queryRows) {
  return aggregateRecords(queryRows, 'query')
    .filter(row => row.impressions > 0 && row.position >= 4 && row.position <= 20)
    .sort((left, right) => right.impressions - left.impressions || left.position - right.position)
    .slice(0, 10)
    .map(row => {
      const source = queryRows.find(candidate => candidate.query === row.key)
      const classification = classifyQuery(row.key)
      return {...row, brandClass: source?.brand_class || classification.brandClass, intentView: source?.intent_view || classification.intentView}
    })
}

function buildCannibalizationRows(rows, range) {
  const byQuery = new Map()
  for (const row of rows) {
    if (!row.query || !row.page) continue
    const bucket = byQuery.get(row.query) || {
      query: row.query,
      pages: new Set(),
      clicks: 0,
      impressions: 0,
      weightedPosition: 0,
      positionWeight: 0,
      brandClass: row.brand_class,
      intentView: row.intent_view,
    }
    bucket.pages.add(row.page)
    bucket.clicks += numberValue(row.clicks)
    bucket.impressions += numberValue(row.impressions)
    const impressions = numberValue(row.impressions)
    if (impressions > 0) {
      bucket.weightedPosition += numberValue(row.position) * impressions
      bucket.positionWeight += impressions
    }
    byQuery.set(row.query, bucket)
  }

  return [...byQuery.values()]
    .filter(bucket => bucket.pages.size > 1)
    .sort((left, right) => right.impressions - left.impressions)
    .map(bucket => ({
      range: range.key,
      start_date: range.startDate,
      end_date: range.endDate,
      brand_class: bucket.brandClass,
      intent_view: bucket.intentView,
      query: bucket.query,
      page_count: bucket.pages.size,
      pages: [...bucket.pages].sort().join(' | '),
      total_clicks: bucket.clicks,
      total_impressions: bucket.impressions,
      ctr: bucket.impressions > 0 ? bucket.clicks / bucket.impressions : 0,
      position: bucket.positionWeight > 0 ? bucket.weightedPosition / bucket.positionWeight : 0,
    }))
}

function requestedRangeMarkdown(ranges) {
  return markdownTable(
    ['View', 'Start', 'End', 'Data status'],
    ranges.map(range => [range.key, range.startDate, range.endDate, 'Not retrieved']),
  )
}

function buildBlockedBaseline({property, ranges, dimensions, reason, generatedAt}) {
  const rangeText = requestedRangeMarkdown(ranges)
  return `# Search Console organic-search baseline

Status: **BLOCKED**

Generated at (UTC): ${generatedAt}

## Why this baseline is blocked

No Search Console data was retrieved. ${reason}

The configured property is \`${property}\`, but the property, permissions, sitemap submission, and Search Console data are not confirmed by this run. No numbers, URLs, rankings, or opportunity claims have been inferred.

## Reporting range

${rangeText}

The \`max\` view requests a 16-calendar-month lookback by default, which is a configurable proxy for the Search Console history window. The \`trailing-90d\` and \`trailing-28d\` views are inclusive date ranges. The API end date defaults to UTC today minus three days unless overridden.

## Latest complete data date

**Unknown.** A finalized date-dimension request requires Search Console access.

## Totals

**Not available.** Total clicks, impressions, CTR, and average position are intentionally omitted because no API response was received.

## Branded and non-branded split

**Not available.** The export applies documented query filters only after Search Console rows are returned.

## URLs with impressions or clicks

**Not available.** A sitemap URL inventory and Search Console page rows are separate evidence sources. The technical URL audit is intentionally outside this lane.

## Top opportunity queries

**Not available.** No query, page, device, country, or search-appearance rows were retrieved.

## Required setup step

Authorize a Google account or service account that can read the verified \`${property}\` property in Search Console, then provide one of the supported environment-variable/configuration paths in [docs/search-console-setup.md](../../docs/search-console-setup.md). The smallest practical one-run path is a bearer token in \`GSC_ACCESS_TOKEN\` with the \`webmasters.readonly\` scope.

## Limitations

- This is a blocked access baseline, not evidence that Google has zero impressions.
- Search Console data freshness, property verification, sitemap fetch status, anonymized queries, API row limits, and top-row sampling remain unverified.
- The raw files are header-only and preserve the intended schema: detailed dimensions requested were \`${dimensions.join(',')}\`.
- No technical URL audit, crawl test, canonical check, or sitemap fetch check is included here.
- No Mixpanel or App Store outbound-event data is included in this Search Console report.
`
}

function buildCompleteBaseline({property, ranges, latestCompleteDate, totals, pageRows, queryRows, dimensions, generatedAt}) {
  const maxRange = ranges.find(range => range.key === 'max') || ranges[0]
  const maxPages = pageRows.filter(row => row.range === maxRange.key)
  const maxQueries = queryRows.filter(row => row.range === maxRange.key)
  const pageAggregates = aggregateRecords(maxPages, 'page').sort((left, right) => right.impressions - left.impressions)
  const queryOpportunities = queryOpportunityRows(maxQueries)
  const brandSplit = aggregateByClassification(maxQueries, 'brand_class')
  const intentSplit = aggregateByClassification(maxQueries, 'intent_view')
  const devices = aggregateRecords(maxPages, 'device').sort((left, right) => right.clicks - left.clicks).slice(0, 5)
  const countries = aggregateRecords(maxPages, 'country').sort((left, right) => right.clicks - left.clicks).slice(0, 5)

  const totalsTable = ranges.map(range => {
    const total = totals.get(range.key)
    return [
      range.key,
      range.startDate,
      range.endDate,
      total?.known ? formatCount(total.clicks) : 'Not returned',
      total?.known ? formatCount(total.impressions) : 'Not returned',
      total?.known ? formatPercent(total.ctr) : 'Not returned',
      total?.known ? formatPosition(total.position) : 'Not returned',
    ]
  })

  const brandTable = brandSplit.length > 0
    ? brandSplit.sort((left, right) => right.impressions - left.impressions).map(row => [row.key, formatCount(row.clicks), formatCount(row.impressions), formatPercent(row.ctr), formatCount(row.rows)])
    : [['Not returned', '—', '—', '—', '—']]
  const intentTable = intentSplit.length > 0
    ? intentSplit.sort((left, right) => right.impressions - left.impressions).map(row => [row.key, formatCount(row.clicks), formatCount(row.impressions), formatPercent(row.ctr), formatCount(row.rows)])
    : [['Not returned', '—', '—', '—', '—']]
  const pageTable = pageAggregates.slice(0, 10).map(row => [row.key, formatCount(row.clicks), formatCount(row.impressions), formatPercent(row.ctr), formatPosition(row.position)])
  const opportunityTable = queryOpportunities.map(row => [row.key, row.brandClass, row.intentView, formatCount(row.clicks), formatCount(row.impressions), formatPercent(row.ctr), formatPosition(row.position)])
  const deviceTable = devices.map(row => [row.key, formatCount(row.clicks), formatCount(row.impressions), formatPercent(row.ctr)])
  const countryTable = countries.map(row => [row.key, formatCount(row.clicks), formatCount(row.impressions), formatPercent(row.ctr)])

  return `# Search Console organic-search baseline

Status: **COMPLETE**

Generated at (UTC): ${generatedAt}

Property: \`${property}\`

## Reporting range

${markdownTable(['View', 'Start', 'End', 'Clicks', 'Impressions', 'CTR', 'Avg position'], totalsTable)}

The \`max\` view uses a 16-calendar-month lookback by default; replace it with \`--max-history-start-date\` or \`GSC_MAX_HISTORY_START_DATE\` when the property’s actual available history is known. All figures above come from finalized Search Console aggregate responses.

## Latest complete data date

${latestCompleteDate || '**Not returned by the finalized date query.**'}

## Branded and non-branded split

These figures are sums of returned query-dimension rows, not a substitute for the property totals above. Search Console omits anonymized queries and may cap returned rows.

${markdownTable(['Query class', 'Clicks', 'Impressions', 'CTR', 'Returned rows'], brandTable)}

## Commercial and utility query views

The \`intent_view\` column is a documented substring filter over returned query text. It is not a Search Console dimension, and a query can be non-branded while belonging to either intent view.

${markdownTable(['Intent view', 'Clicks', 'Impressions', 'CTR', 'Returned rows'], intentTable)}

## URLs with impressions or clicks

In the \`${maxRange.key}\` page export, ${formatCount(new Set(maxPages.filter(row => row.impressions > 0 && row.page).map(row => row.page)).size)} distinct returned URLs had impressions and ${formatCount(new Set(maxPages.filter(row => row.clicks > 0 && row.page).map(row => row.page)).size)} had clicks. These are returned Search Console page rows; they are not a count of all sitemap URLs.

${pageTable.length > 0 ? markdownTable(['Returned URL', 'Clicks', 'Impressions', 'CTR', 'Avg position'], pageTable) : 'No page rows were returned for this range.'}

## Top opportunity queries

The table shows returned queries with an impression-weighted average position from 4.0 through 20.0, sorted by impressions. It is a prioritization view, not a promise of ranking improvement.

${opportunityTable.length > 0 ? markdownTable(['Query', 'Brand class', 'Intent view', 'Clicks', 'Impressions', 'CTR', 'Avg position'], opportunityTable) : 'No qualifying query rows were returned.'}

## Device and country views

These are traffic views only. Search Console does not identify a “qualified” visitor or an App Store outbound event.

${deviceTable.length > 0 ? markdownTable(['Device', 'Clicks', 'Impressions', 'CTR'], deviceTable) : 'No device rows were returned.'}

${countryTable.length > 0 ? markdownTable(['Country', 'Clicks', 'Impressions', 'CTR'], countryTable) : 'No country rows were returned.'}

## Known limitations

- Search Console returns finalized data for this export, but the latest available date still depends on Google’s processing schedule.
- The Search Analytics API has a per-request row limit of 25,000 and can expose only a bounded top set of rows; the script paginates until the configured local cap or an empty page.
- Anonymized queries are omitted by Search Console, so query-derived branded/non-branded and intent views may not sum to property totals.
- Search appearance is preserved when returned. It may be blank when a row has no appearance value.
- The detailed CSV uses the configured dimensions \`${dimensions.join(',')}\`; page and query reports use fixed dimensions documented in [docs/search-console-setup.md](../../docs/search-console-setup.md).
- Sitemap submission/fetch status, canonical/indexability, crawlability, and technical URL decisions are deliberately separate from this report.
- Mixpanel page views, App Store outbound clicks, downloads, and first-workout activation are not available from Search Console and are not inferred here.
`
}

async function writeBlockedOutputs({outputDir, property, ranges, dimensions, reason}) {
  await fs.mkdir(outputDir, {recursive: true})
  const generatedAt = new Date().toISOString()
  await writeCsv(outputDir, 'search-console-dimensional.csv', detailedColumns, [])
  await writeCsv(outputDir, 'search-console-pages.csv', pageColumns, [])
  await writeCsv(outputDir, 'search-console-queries.csv', queryColumns, [])
  await writeCsv(outputDir, 'query-page-cannibalization.csv', cannibalizationColumns, [])
  await fs.writeFile(
    path.join(outputDir, 'baseline.md'),
    buildBlockedBaseline({property, ranges, dimensions, reason: compactError(reason), generatedAt}),
    'utf8',
  )
}

async function runExport({args, configInfo}) {
  const {config, directory: configDirectory, error: configError} = configInfo
  const property = String(setting(args, config, 'property', 'GSC_PROPERTY', 'property', 'sc-domain:jacked.coach')).trim()
  const dimensions = parseDimensions(setting(args, config, 'dimensions', 'GSC_DIMENSIONS', 'dimensions', defaultDimensions.join(',')))
  const rowLimit = Number(setting(args, config, 'rowLimit', 'GSC_ROW_LIMIT', 'rowLimit', 1000))
  const maxRows = Number(setting(args, config, 'maxRows', 'GSC_MAX_ROWS', 'maxRows', 10000))
  const type = String(setting(args, config, 'type', 'GSC_TYPE', 'type', 'web')).trim()
  const dataState = String(setting(args, config, 'dataState', 'GSC_DATA_STATE', 'dataState', 'final')).trim().toLowerCase()
  const outputDir = path.resolve(projectRoot, String(setting(args, config, 'outputDir', 'GSC_OUTPUT_DIR', 'outputDir', path.relative(projectRoot, defaultOutputDir))))
  const ranges = resolveRanges(args, config)
  const skipDetailed = Boolean(args.noDetailed)

  if (!Number.isInteger(rowLimit) || rowLimit < 1 || rowLimit > 25000) throw new Error('--row-limit must be an integer from 1 through 25000.')
  if (!Number.isInteger(maxRows) || maxRows < 0) throw new Error('--max-rows must be a non-negative integer; use 0 for no local cap.')
  if (!['final', 'all'].includes(dataState)) throw new Error('--data-state must be final or all.')

  const auth = makeAuth(args, config, configDirectory, configError)
  if (auth.mode === 'none') {
    await writeBlockedOutputs({
      outputDir,
      property,
      ranges,
      dimensions,
      reason: auth.setupIssue || 'No Search Console credential was supplied.',
    })
    console.log(`BLOCKED: no Search Console credential was available. Wrote header-only reports to ${path.relative(projectRoot, outputDir)}.`)
    return {status: 'BLOCKED', outputDir}
  }

  const detailedRows = []
  const pages = []
  const queries = []
  const cannibalization = []
  const totals = new Map()
  let latestCompleteDate = ''

  try {
    for (const range of ranges) {
      const totalRows = await querySearchAnalytics({
        property,
        range,
        dimensions: [],
        type,
        dataState,
        rowLimit: 1,
        maxRows: 1,
        getToken: auth.getToken,
      })
      totals.set(range.key, rangeTotals(totalRows))

      const dateRows = await querySearchAnalytics({
        property,
        range,
        dimensions: ['date'],
        type,
        dataState,
        rowLimit,
        maxRows,
        getToken: auth.getToken,
      })
      for (const row of dateRows) {
        if (row.date && (!latestCompleteDate || row.date > latestCompleteDate)) latestCompleteDate = row.date
      }

      const pageRows = await querySearchAnalytics({
        property,
        range,
        dimensions: pageDimensions,
        type,
        dataState,
        rowLimit,
        maxRows,
        getToken: auth.getToken,
      })
      pages.push(...pageRows)

      const queryRows = await querySearchAnalytics({
        property,
        range,
        dimensions: queryDimensions,
        type,
        dataState,
        rowLimit,
        maxRows,
        getToken: auth.getToken,
      })
      queries.push(...queryRows)

      const queryPageRows = await querySearchAnalytics({
        property,
        range,
        dimensions: cannibalizationDimensions,
        type,
        dataState,
        rowLimit,
        maxRows,
        getToken: auth.getToken,
      })
      cannibalization.push(...buildCannibalizationRows(queryPageRows, range))

      if (!skipDetailed) {
        const rawRows = await querySearchAnalytics({
          property,
          range,
          dimensions,
          type,
          dataState,
          rowLimit,
          maxRows,
          getToken: auth.getToken,
        })
        detailedRows.push(...rawRows)
      }
    }
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)
    await writeBlockedOutputs({outputDir, property, ranges, dimensions, reason})
    throw new Error(`BLOCKED: Search Console access was not usable; wrote header-only reports. ${reason}`)
  }

  await fs.mkdir(outputDir, {recursive: true})
  if (!skipDetailed) await writeCsv(outputDir, 'search-console-dimensional.csv', detailedColumns, detailedRows)
  await writeCsv(outputDir, 'search-console-pages.csv', pageColumns, pages)
  await writeCsv(outputDir, 'search-console-queries.csv', queryColumns, queries)
  await writeCsv(outputDir, 'query-page-cannibalization.csv', cannibalizationColumns, cannibalization)
  await fs.writeFile(
    path.join(outputDir, 'baseline.md'),
    buildCompleteBaseline({
      property,
      ranges,
      latestCompleteDate,
      totals,
      pageRows: pages,
      queryRows: queries,
      dimensions,
      generatedAt: new Date().toISOString(),
    }),
    'utf8',
  )

  console.log(`COMPLETE: exported Search Console data for ${property} to ${path.relative(projectRoot, outputDir)}.`)
  return {status: 'COMPLETE', outputDir}
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  if (args.help) {
    printHelp()
    return
  }

  const configPath = args.config || process.env.GSC_CONFIG_FILE
  const configInfo = await readConfig(configPath)
  await runExport({args, configInfo})
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exitCode = 1
})
