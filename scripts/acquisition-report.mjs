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

const SEARCH_BRAND_TERMS = Object.freeze([
  'surpass',
  'surpass app',
  'surpass strength',
  'surpass workout',
  'surpass coach',
  'jacked',
  'jacked coach',
  'jacked workout app',
  'jacked workout log',
])

const SEARCH_RANGE_PREFERENCE = Object.freeze([
  'trailing-28d',
  '28d',
  'trailing-90d',
  '90d',
  'max',
])

function searchRangeValue(row) {
  const value = String(rowValue(row, 'range') ?? '').trim().toLowerCase()
  return value || ''
}

function selectedSearchRows(rows) {
  const ranges = [...new Set(rows.map(searchRangeValue).filter(Boolean))]
  if (!ranges.length) return { rows, range: null, availableRanges: [] }

  const range = SEARCH_RANGE_PREFERENCE.find(candidate => ranges.includes(candidate)) || ranges[0]
  return {
    rows: rows.filter(row => searchRangeValue(row) === range),
    range,
    availableRanges: ranges,
  }
}

function searchBrandClass(row) {
  const supplied = String(rowValue(row, 'brand_class') ?? '')
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, '-')
  if (supplied === 'branded' || supplied === 'non-branded') return supplied

  const query = String(rowValue(row, 'query') ?? '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
  if (!query) return ''
  return SEARCH_BRAND_TERMS.some(term => query.includes(term)) ? 'branded' : 'non-branded'
}

function completeMetricTotal(rows, field, emptyValue = 0) {
  if (!rows.length) return emptyValue
  const values = rows.map(row => number(rowValue(row, field)))
  if (values.some(value => value === null)) return null
  return values.reduce((total, value) => total + value, 0)
}

/**
 * Select one Search Console reporting window and calculate non-brand totals
 * from query-level rows only. Page-level rows cannot distinguish branded from
 * non-branded demand, and overlapping export windows must never be summed.
 */
export function summarizeSearchConsoleMetrics(queryRows = [], pageRows = []) {
  const querySelection = selectedSearchRows(queryRows)
  const selectedRows = querySelection.rows
  const hasQueryRows = queryRows.length > 0
  const pageCoverage = summarizeSourceCoverage(pageRows, {
    startFields: ['start_date', 'startDate', 'period_start', 'periodStart'],
    endFields: ['end_date', 'endDate', 'period_end', 'periodEnd'],
    requireConsistentRange: true,
  })

  if (!hasQueryRows) {
    return {
      available: false,
      quality: pageRows.length ? 'query-level export required for non-brand totals' : 'no Search Console query rows',
      source: pageRows.length ? 'pages' : null,
      range: null,
      available_ranges: [],
      source_rows: pageRows.length,
      selected_rows: 0,
      non_brand_rows: null,
      impressions: null,
      clicks: null,
      coverage: pageCoverage,
    }
  }

  const coverage = summarizeSourceCoverage(selectedRows, {
    startFields: ['start_date', 'startDate', 'period_start', 'periodStart'],
    endFields: ['end_date', 'endDate', 'period_end', 'periodEnd'],
    requireConsistentRange: true,
  })
  const classifications = selectedRows.map(searchBrandClass)
  const missingClassificationRows = classifications.filter(value => !value).length
  const nonBrandRows = selectedRows.filter((_, index) => classifications[index] === 'non-branded')
  const impressions = completeMetricTotal(nonBrandRows, 'impressions')
  const clicks = completeMetricTotal(nonBrandRows, 'clicks')
  let quality = 'usable'
  if (!selectedRows.length) quality = 'no query rows in selected range'
  else if (!coverage.available) quality = coverage.quality
  else if (missingClassificationRows) quality = 'brand classification incomplete'
  else if (impressions === null || clicks === null) quality = 'non-brand metric values incomplete'

  return {
    available: quality === 'usable',
    quality,
    source: 'queries',
    range: querySelection.range,
    available_ranges: querySelection.availableRanges,
    source_rows: queryRows.length,
    selected_rows: selectedRows.length,
    non_brand_rows: nonBrandRows.length,
    impressions,
    clicks,
    coverage,
  }
}

function countEvent(rows, names) {
  const set = new Set(names)
  return rows.filter(row => set.has(row.event_name || row.event || row.name)).length
}

function rowValue(row, key) {
  const direct = row?.[key]
  if (direct !== undefined && direct !== null && String(direct).trim() !== '') return direct

  if (!row?.properties) return ''
  try {
    const properties = typeof row.properties === 'string' ? JSON.parse(row.properties) : row.properties
    return properties?.[key] ?? ''
  } catch {
    return ''
  }
}

function rowHasField(row, key) {
  if (Object.prototype.hasOwnProperty.call(row ?? {}, key)) return true
  if (!row?.properties) return false
  try {
    const properties = typeof row.properties === 'string' ? JSON.parse(row.properties) : row.properties
    return Object.prototype.hasOwnProperty.call(properties ?? {}, key)
  } catch {
    return false
  }
}

const APP_STORE_METRIC_ALIASES = Object.freeze({
  productPageViews: ['product_page_views', 'productPageViews', 'Product Page Views', 'product page views', 'product_page_viewers'],
  downloads: ['downloads', 'unique_downloads', 'app_units', 'App Units', 'units'],
  campaign: ['app_store_campaign', 'appStoreCampaign', 'campaign', 'campaign_name', 'Campaign'],
})

function boundedMetricValue(value) {
  const normalized = String(value ?? '').trim()
  if (!normalized) return '(not_set)'
  return normalized.length > 160 ? `${normalized.slice(0, 157)}...` : normalized
}

function appStoreMetricSummary(rows, aliases) {
  const field = aliases.find((alias) => rows.some((row) => rowHasField(row, alias) || number(rowValue(row, alias)) !== null)) ?? null
  if (!field) {
    return { field: null, value: null, missing_rows: rows.length }
  }

  const values = rows.map((row) => number(rowValue(row, field)))
  const missingRows = values.filter((value) => value === null).length
  return {
    field,
    value: missingRows ? null : values.reduce((total, value) => total + value, 0),
    missing_rows: missingRows,
  }
}

/**
 * Summarize aggregate App Store Connect rows without treating incomplete
 * exports as zero activity. Campaign values are bounded source tokens only.
 */
export function summarizeAppStoreConnectMetrics(rows) {
  const productPageViews = appStoreMetricSummary(rows, APP_STORE_METRIC_ALIASES.productPageViews)
  const downloads = appStoreMetricSummary(rows, APP_STORE_METRIC_ALIASES.downloads)
  const campaignField = APP_STORE_METRIC_ALIASES.campaign.find((alias) => rows.some((row) => String(rowValue(row, alias) ?? '').trim())) ?? null
  const coverage = summarizeSourceCoverage(rows, {
    startFields: ['start_date', 'startDate', 'period_start', 'periodStart', 'date'],
    endFields: ['end_date', 'endDate', 'period_end', 'periodEnd', 'date'],
    requireConsistentRange: true,
  })

  let quality = 'no App Store Connect rows'
  if (rows.length) {
    quality = !coverage.available
      ? coverage.quality
      : !productPageViews.field || !downloads.field
      ? 'required metric missing'
      : productPageViews.missing_rows || downloads.missing_rows
        ? 'metric values incomplete'
        : 'usable'
  }

  const campaignRows = new Map()
  if (campaignField) {
    for (const row of rows) {
      const campaign = boundedMetricValue(rowValue(row, campaignField))
      const bucket = campaignRows.get(campaign) || []
      bucket.push(row)
      campaignRows.set(campaign, bucket)
    }
  }

  const campaigns = [...campaignRows.entries()]
    .map(([campaign, campaignRowsForKey]) => {
      const campaignPageViews = appStoreMetricSummary(campaignRowsForKey, APP_STORE_METRIC_ALIASES.productPageViews)
      const campaignDownloads = appStoreMetricSummary(campaignRowsForKey, APP_STORE_METRIC_ALIASES.downloads)
      const campaignCoverage = summarizeSourceCoverage(campaignRowsForKey, {
        startFields: ['start_date', 'startDate', 'period_start', 'periodStart', 'date'],
        endFields: ['end_date', 'endDate', 'period_end', 'periodEnd', 'date'],
        requireConsistentRange: true,
      })
      const campaignQuality = !campaignCoverage.available
        ? campaignCoverage.quality
        : !campaignPageViews.field || !campaignDownloads.field
        ? 'required metric missing'
        : campaignPageViews.missing_rows || campaignDownloads.missing_rows
          ? 'metric values incomplete'
          : 'usable'
      return {
        app_store_campaign: campaign,
        product_page_views: campaignPageViews.value,
        downloads: campaignDownloads.value,
        product_page_to_download_rate: roundedRate(campaignDownloads.value, campaignPageViews.value),
        quality: campaignQuality,
      }
    })
    .sort((left, right) => left.app_store_campaign.localeCompare(right.app_store_campaign))

  return {
    available: quality === 'usable',
    quality,
    source_rows: rows.length,
    coverage,
    product_page_views: productPageViews.value,
    downloads: downloads.value,
    product_page_to_download_rate: roundedRate(downloads.value, productPageViews.value),
    metric_fields: {
      product_page_views: productPageViews.field,
      downloads: downloads.field,
      app_store_campaign: campaignField,
    },
    campaigns,
  }
}

/**
 * Reconcile the campaign token carried by the web handoff with the campaign
 * rows supplied by App Store Connect. These are separate evidence layers: a
 * matching token is a continuity check, not a claim that every outbound
 * browser session became a product-page view.
 */
export function summarizeAppStoreCampaignContinuity(webRows, appStoreSummary) {
  const webSourcePresent = Array.isArray(webRows)
  const webCampaigns = new Map()
  let webOutboundEventRows = 0
  let missingWebCampaignEventRows = 0
  let missingWebIdentityEventRows = 0

  for (const row of matchingRows(webRows || [], ['app_store_outbound_clicked'])) {
    webOutboundEventRows += 1
    const campaign = boundedMetricValue(rowValue(row, 'app_store_campaign'))
    if (campaign === '(not_set)') {
      missingWebCampaignEventRows += 1
      continue
    }

    const entry = webCampaigns.get(campaign) || {
      event_rows: 0,
      sessions: new Set(),
      missing_identity: false,
    }
    entry.event_rows += 1
    const identity = identityValue(row, ['session_id', 'browser_session_id'])
    if (identity) entry.sessions.add(identity)
    else {
      entry.missing_identity = true
      missingWebIdentityEventRows += 1
    }
    webCampaigns.set(campaign, entry)
  }

  const appCampaigns = new Map(
    (appStoreSummary?.campaigns || [])
      .filter((campaign) => campaign?.app_store_campaign)
      .map((campaign) => [String(campaign.app_store_campaign), campaign]),
  )
  const campaignNames = [...new Set([...webCampaigns.keys(), ...appCampaigns.keys()])]
    .sort((left, right) => left.localeCompare(right))

  const campaigns = campaignNames.map((campaign) => {
    const web = webCampaigns.get(campaign)
    const appStore = appCampaigns.get(campaign)
    const webPresent = Boolean(web)
    const appStorePresent = Boolean(appStore)
    let quality = 'usable'

    if (!webPresent) quality = 'not observed on web'
    else if (!appStorePresent) quality = 'not present in App Store Connect'
    else if (web.missing_identity) quality = 'web session identity incomplete'
    else if (appStore.quality !== 'usable') quality = `App Store metrics ${appStore.quality}`

    return {
      app_store_campaign: campaign,
      web_outbound_event_rows: web?.event_rows ?? 0,
      web_outbound_sessions: web ? (web.missing_identity ? null : web.sessions.size) : 0,
      product_page_views: appStore?.product_page_views ?? null,
      downloads: appStore?.downloads ?? null,
      product_page_to_download_rate: appStore?.product_page_to_download_rate ?? null,
      web_campaign_present: webPresent,
      app_store_campaign_present: appStorePresent,
      quality,
    }
  })

  let quality = 'usable'
  if (!webSourcePresent) quality = 'web analytics source missing'
  else if (!appStoreSummary) quality = 'App Store Connect source missing'
  else if (!campaigns.length) quality = 'no campaign rows'
  else if (missingWebCampaignEventRows || missingWebIdentityEventRows) quality = 'web campaign or identity incomplete'
  else if (!campaigns.some((campaign) => campaign.quality === 'usable')) quality = 'no matched usable campaign'
  else if (campaigns.some((campaign) => campaign.quality !== 'usable')) quality = 'partial campaign continuity'

  return {
    available: campaigns.some((campaign) => campaign.quality === 'usable'),
    quality,
    web_outbound_event_rows: webOutboundEventRows,
    missing_web_campaign_event_rows: missingWebCampaignEventRows,
    missing_web_identity_event_rows: missingWebIdentityEventRows,
    web_campaign_count: webCampaigns.size,
    app_store_campaign_count: appCampaigns.size,
    campaigns,
  }
}

export function eventName(row) {
  return String(rowValue(row, 'event_name') || rowValue(row, 'event') || rowValue(row, 'name') || '').trim()
}

function matchingRows(rows, names) {
  const set = new Set(names)
  return rows.filter(row => set.has(eventName(row)))
}

function identityValue(row, fields) {
  for (const field of fields) {
    const value = String(rowValue(row, field) ?? '').trim()
    if (!value || value.length > 160 || value.includes('@') || /https?:\/\//i.test(value) || /[\u0000-\u001f\u007f]/.test(value)) continue
    return value
  }
  return ''
}

function timestampValue(row) {
  const raw = rowValue(row, 'time') || rowValue(row, 'timestamp') || rowValue(row, 'event_time') || rowValue(row, 'captured_at') || rowValue(row, 'capturedAt') || rowValue(row, 'created_at')
  if (raw === undefined || raw === null || String(raw).trim() === '') return null

  const numeric = Number(raw)
  if (Number.isFinite(numeric)) return numeric < 1e12 ? numeric * 1000 : numeric

  const parsed = Date.parse(String(raw))
  return Number.isFinite(parsed) ? parsed : null
}

function isoDateValue(value) {
  const raw = String(value ?? '').trim()
  if (!raw) return null

  const numeric = Number(raw)
  const parsed = Number.isFinite(numeric)
    ? new Date(numeric < 1e12 ? numeric * 1000 : numeric)
    : new Date(raw)
  if (Number.isNaN(parsed.getTime())) return null
  return parsed.toISOString().slice(0, 10)
}

function firstDateValue(row, fields) {
  for (const field of fields) {
    const value = isoDateValue(rowValue(row, field))
    if (value) return value
  }
  return null
}

/**
 * Establish the observed date window before any source is used for a rate.
 * Event exports need a valid event timestamp; aggregate exports need explicit
 * period boundaries. Missing or contradictory coverage remains invalid rather
 * than being silently treated as a current or complete window.
 */
export function summarizeSourceCoverage(rows = [], {
  eventTime = false,
  startFields = [],
  endFields = [],
  requireConsistentRange = false,
} = {}) {
  const sourceRows = Array.isArray(rows) ? rows : []
  if (!sourceRows.length) {
    return {
      available: false,
      quality: 'no rows',
      source_rows: 0,
      covered_rows: 0,
      missing_rows: 0,
      invalid_rows: 0,
      distinct_ranges: 0,
      start_date: null,
      end_date: null,
    }
  }

  let missingRows = 0
  let invalidRows = 0
  const ranges = []

  for (const row of sourceRows) {
    let start = null
    let end = null
    if (eventTime) {
      const timestamp = timestampValue(row)
      if (timestamp !== null) {
        start = new Date(timestamp).toISOString().slice(0, 10)
        end = start
      }
    } else {
      start = firstDateValue(row, startFields)
      end = firstDateValue(row, endFields)
    }

    if (!start || !end) {
      missingRows += 1
      continue
    }
    if (end < start) {
      invalidRows += 1
      continue
    }
    ranges.push({ start, end })
  }

  const startDate = ranges.length ? ranges.map(range => range.start).sort()[0] : null
  const endDate = ranges.length ? ranges.map(range => range.end).sort().at(-1) : null
  const distinctRanges = new Set(ranges.map(range => `${range.start}|${range.end}`))
  const inconsistentRange = requireConsistentRange && distinctRanges.size > 1
  const quality = invalidRows
    ? 'date coverage invalid'
    : missingRows
      ? 'date coverage incomplete'
      : inconsistentRange
        ? 'date coverage inconsistent'
        : 'usable'

  return {
    available: quality === 'usable',
    quality,
    source_rows: sourceRows.length,
    covered_rows: ranges.length,
    missing_rows: missingRows,
    invalid_rows: invalidRows,
    distinct_ranges: distinctRanges.size,
    start_date: startDate,
    end_date: endDate,
  }
}

export function uniqueEventCount(rows, names, identityFields) {
  const matching = matchingRows(rows, names)
  if (!matching.length) return { value: 0, missingIdentity: false, matchedRows: 0 }

  const identities = new Set()
  for (const row of matching) {
    const identity = identityValue(row, identityFields)
    if (!identity) return { value: null, missingIdentity: true, matchedRows: matching.length }
    identities.add(identity)
  }

  return { value: identities.size, missingIdentity: false, matchedRows: matching.length }
}

function uniqueIdentitySet(rows, names, identityFields) {
  const matching = matchingRows(rows, names)
  if (!matching.length) return { value: 0, missingIdentity: false, matchedRows: 0, identities: new Set() }

  const identities = new Set()
  for (const row of matching) {
    const identity = identityValue(row, identityFields)
    if (!identity) return { value: null, missingIdentity: true, matchedRows: matching.length, identities: null }
    identities.add(identity)
  }

  return { value: identities.size, missingIdentity: false, matchedRows: matching.length, identities }
}

function timedEvents(rows, names, identityFields) {
  const matching = matchingRows(rows, names)
  const values = []
  let missingIdentity = false
  let missingTime = false

  for (const row of matching) {
    const identity = identityValue(row, identityFields)
    const time = timestampValue(row)
    if (!identity) missingIdentity = true
    if (time === null) missingTime = true
    if (identity && time !== null) values.push({ identity, time })
  }

  return { values, matchingRows: matching.length, missingIdentity, missingTime }
}

function firstTimes(events) {
  const result = new Map()
  for (const event of events) {
    const current = result.get(event.identity)
    if (current === undefined || event.time < current) result.set(event.identity, event.time)
  }
  return result
}

function roundedRate(numerator, denominator) {
  if (numerator === null || denominator === null || denominator <= 0) return null
  return Math.round((numerator / denominator) * 10000) / 10000
}

// This is a decision aid, not a claim generator. A CTA experiment remains
// below the decision floor until each arm has a reasonable exposure count and
// the uncertainty interval excludes no change.
export const MIN_EXPERIMENT_CTA_VIEW_SESSIONS = 100
const CONFIDENCE_Z_95 = 1.96

function wilsonInterval(successes, trials) {
  if (!Number.isFinite(successes) || !Number.isFinite(trials)
    || trials <= 0 || successes < 0 || successes > trials) return null

  const proportion = successes / trials
  const zSquared = CONFIDENCE_Z_95 ** 2
  const denominator = 1 + zSquared / trials
  const centre = (proportion + zSquared / (2 * trials)) / denominator
  const margin = (CONFIDENCE_Z_95 / denominator) * Math.sqrt(
    (proportion * (1 - proportion) / trials) + (zSquared / (4 * trials ** 2))
  )

  return [
    Math.max(0, centre - margin),
    Math.min(1, centre + margin),
  ]
}

function experimentGroupKey(segment) {
  // Do not include the App Store campaign token: control and treatment need
  // different tokens so the handoff remains attributable, but they are still
  // the same experiment surface for comparison purposes.
  return JSON.stringify({
    source_page: segment.source_page,
    cta_placement: segment.cta_placement,
    experiment_name: segment.experiment_name,
    hero_presentation: segment.hero_presentation,
    copy_version: segment.copy_version,
    viewport_class: segment.viewport_class,
  })
}

function comparisonQuality(control, treatment) {
  if (!control || !treatment) return 'comparison arm missing'
  if (control.missing_session_identity || treatment.missing_session_identity) return 'identity missing'
  if (control.cta_viewed_sessions === null || treatment.cta_viewed_sessions === null
    || control.outbound_sessions === null || treatment.outbound_sessions === null) {
    return 'denominator unavailable'
  }
  return 'usable'
}

/**
 * Compare privacy-safe unique-session CTA rates by experiment arm. This emits
 * a bounded readout only; it never declares a product winner or reaches into
 * user-level rows.
 */
export function summarizeExperimentComparisons(segments) {
  const groups = new Map()
  for (const segment of segments) {
    if (segment.experiment_name === '(not_set)' || segment.experiment_variant === '(not_set)') continue
    const key = experimentGroupKey(segment)
    if (!groups.has(key)) groups.set(key, { fields: segment, variants: new Map() })
    groups.get(key).variants.set(segment.experiment_variant, segment)
  }

  const comparisons = []
  for (const { fields, variants } of groups.values()) {
    const control = variants.get('control') || null
    const treatments = [...variants.entries()].filter(([variant]) => variant !== 'control')

    if (!control) {
      for (const [variant, treatment] of treatments) {
        comparisons.push(buildExperimentComparison(fields, null, variant, treatment))
      }
      continue
    }

    if (!treatments.length) {
      comparisons.push(buildExperimentComparison(fields, control, null, null))
      continue
    }

    for (const [variant, treatment] of treatments) {
      comparisons.push(buildExperimentComparison(fields, control, variant, treatment))
    }
  }

  return comparisons.sort((left, right) => JSON.stringify(left).localeCompare(JSON.stringify(right)))
}

function buildExperimentComparison(fields, control, treatmentVariant, treatment) {
  const quality = comparisonQuality(control, treatment)
  const controlViews = control?.cta_viewed_sessions ?? null
  const treatmentViews = treatment?.cta_viewed_sessions ?? null
  const controlOutbound = control?.outbound_sessions ?? null
  const treatmentOutbound = treatment?.outbound_sessions ?? null
  const controlRate = control?.qualified_store_intent_rate ?? null
  const treatmentRate = treatment?.qualified_store_intent_rate ?? null
  const exposureSufficient = controlViews !== null && treatmentViews !== null
    && controlViews >= MIN_EXPERIMENT_CTA_VIEW_SESSIONS
    && treatmentViews >= MIN_EXPERIMENT_CTA_VIEW_SESSIONS
  const controlInterval = wilsonInterval(controlOutbound, controlViews)
  const treatmentInterval = wilsonInterval(treatmentOutbound, treatmentViews)
  const delta = controlRate !== null && treatmentRate !== null
    ? Math.round((treatmentRate - controlRate) * 10000) / 10000
    : null
  const confidenceInterval = controlInterval && treatmentInterval
    ? [
      Math.round((treatmentInterval[0] - controlInterval[1]) * 10000) / 10000,
      Math.round((treatmentInterval[1] - controlInterval[0]) * 10000) / 10000,
    ]
    : null

  let decision = 'inconclusive_95_ci'
  if (!control || !treatment) decision = control ? 'no_treatment' : 'no_control'
  else if (quality !== 'usable') decision = 'data_quality_insufficient'
  else if (!exposureSufficient) decision = 'below_minimum_exposure'
  else if (confidenceInterval?.[0] > 0) decision = 'treatment_ahead_95_ci'
  else if (confidenceInterval?.[1] < 0) decision = 'treatment_behind_95_ci'

  return {
    source_page: fields.source_page,
    cta_placement: fields.cta_placement,
    experiment_name: fields.experiment_name,
    hero_presentation: fields.hero_presentation,
    copy_version: fields.copy_version,
    viewport_class: fields.viewport_class,
    control_variant: control ? 'control' : null,
    treatment_variant: treatmentVariant,
    control_cta_viewed_sessions: controlViews,
    treatment_cta_viewed_sessions: treatmentViews,
    control_outbound_sessions: controlOutbound,
    treatment_outbound_sessions: treatmentOutbound,
    control_rate: controlRate,
    treatment_rate: treatmentRate,
    delta,
    confidence_interval_95: confidenceInterval,
    exposure_sufficient: exposureSufficient,
    decision,
    quality,
  }
}

const RETURN_WINDOWS = Object.freeze([
  ['1d', 1 * 24 * 60 * 60 * 1000],
  ['7d', 7 * 24 * 60 * 60 * 1000],
  ['30d', 30 * 24 * 60 * 60 * 1000],
])

const TIME_TO_FIRST_SET_BUCKETS = Object.freeze([
  ['under_2m', 2 * 60],
  ['2_5m', 5 * 60],
  ['5_10m', 10 * 60],
  ['10_20m', 20 * 60],
  ['20m_plus', Number.POSITIVE_INFINITY],
])

function percentile(sortedValues, fraction) {
  if (!sortedValues.length) return null
  const index = Math.min(sortedValues.length - 1, Math.ceil((sortedValues.length - 1) * fraction))
  return sortedValues[index]
}

function summarizeTimeToFirstSet(values, dataComplete) {
  if (!dataComplete) {
    return {
      available: false,
      sampleInstallations: null,
      medianSeconds: null,
      p75Seconds: null,
      buckets: null,
    }
  }

  const sorted = values
    .filter((value) => Number.isFinite(value) && value >= 0)
    .sort((left, right) => left - right)
  const buckets = Object.fromEntries(TIME_TO_FIRST_SET_BUCKETS.map(([name]) => [name, 0]))
  for (const seconds of sorted) {
    const bucket = TIME_TO_FIRST_SET_BUCKETS.find(([, upperBound]) => seconds < upperBound)
    if (bucket) buckets[bucket[0]] += 1
  }

  return {
    available: true,
    sampleInstallations: sorted.length > 0 ? sorted.length : null,
    medianSeconds: sorted.length > 0 ? Math.round(percentile(sorted, 0.5)) : null,
    p75Seconds: sorted.length > 0 ? Math.round(percentile(sorted, 0.75)) : null,
    buckets: sorted.length > 0 ? buckets : null,
  }
}

function summarizeActivationTimeToFirstSet({ activationFirst, setsByInstallation, dataComplete }) {
  const sevenDays = 7 * 24 * 60 * 60 * 1000
  const elapsedSeconds = []
  for (const [installation, enteredAt] of activationFirst) {
    const firstSetTime = (setsByInstallation.get(installation) || [])
      .filter((time) => time >= enteredAt && time <= enteredAt + sevenDays)
      .sort((left, right) => left - right)[0]
    if (firstSetTime !== undefined) elapsedSeconds.push((firstSetTime - enteredAt) / 1000)
  }
  return summarizeTimeToFirstSet(elapsedSeconds, dataComplete)
}

function latestObservedTime(rows) {
  let latest = null
  for (const row of rows) {
    const time = timestampValue(row)
    if (time !== null && (latest === null || time > latest)) latest = time
  }
  return latest
}

function summarizeReturnWindows({ firstWorkouts, workoutsByInstallation, observedUntil, dataComplete }) {
  return Object.fromEntries(RETURN_WINDOWS.map(([key, windowMs]) => {
    if (!dataComplete || observedUntil === null) {
      return [key, {
        eligibleFirstWorkoutInstallations: null,
        returningWorkoutInstallations: null,
        rate: null,
        cohortMature: false,
      }]
    }

    let eligible = 0
    let returned = 0
    for (const [installation, startedAt] of firstWorkouts) {
      if (observedUntil < startedAt + windowMs) continue
      eligible += 1
      const laterWorkouts = (workoutsByInstallation.get(installation) || [])
        .some(time => time > startedAt && time <= startedAt + windowMs)
      if (laterWorkouts) returned += 1
    }

    return [key, {
      eligibleFirstWorkoutInstallations: eligible > 0 ? eligible : null,
      returningWorkoutInstallations: eligible > 0 ? returned : null,
      rate: roundedRate(eligible > 0 ? returned : null, eligible > 0 ? eligible : null),
      cohortMature: eligible > 0,
    }]
  }))
}

function nextSessionPreviewSource(row) {
  const source = String(rowValue(row, 'source') ?? '').trim()
  return source === 'after_workout' || source === 'manual' ? source : '(not_set)'
}

/**
 * Relate the post-workout preview, an explicit start intent, and the later
 * scheduled workout start without treating event rows as people. This is a
 * diagnostic inside the valid activation cohort; it is not a retention or
 * causal measure.
 */
export function summarizeNextSessionPreview({ rows, activationFirst }) {
  const mountedRows = matchingRows(rows, ['next_session_preview_mounted'])
  const activatedRows = matchingRows(rows, ['next_session_preview_activated'])
  const startedRows = matchingRows(rows, ['workout_started']).filter(row => (
    String(rowValue(row, 'source') ?? '').trim() === 'next_session_preview'
  ))
  const relevantRows = [...mountedRows, ...activatedRows, ...startedRows]
  const diagnostics = {
    available: false,
    quality: 'no observed handoff events',
    activationUsers: activationFirst.size,
    eventRows: 0,
    sources: [],
    startsWithoutIntentUsers: null,
    startsWithoutIntentEvents: null,
    missingInstallationIdentity: false,
    missingEventTime: false,
  }

  if (!relevantRows.length) return diagnostics

  const timed = relevantRows.map(row => ({
    row,
    identity: identityValue(row, ['installation_id']),
    time: timestampValue(row),
  }))
  diagnostics.missingInstallationIdentity = timed.some(event => !event.identity)
  diagnostics.missingEventTime = timed.some(event => event.time === null)
  if (diagnostics.missingInstallationIdentity || diagnostics.missingEventTime) {
    diagnostics.quality = 'identity or event time missing'
    return diagnostics
  }

  const cohortEvents = timed
    .filter(event => activationFirst.has(event.identity))
    .filter(event => event.time >= activationFirst.get(event.identity))
    .sort((left, right) => left.time - right.time)
  if (!cohortEvents.length) {
    diagnostics.quality = 'no handoff events in activation cohort'
    return diagnostics
  }

  const groups = new Map()
  const startsWithoutIntentUsers = new Set()
  let startsWithoutIntentEvents = 0
  const groupFor = (source) => {
    if (!groups.has(source)) {
      groups.set(source, {
        mountedUsers: new Set(),
        mountedEvents: 0,
        activatedUsers: new Set(),
        activatedEvents: 0,
        startedUsers: new Set(),
        startedEvents: 0,
      })
    }
    return groups.get(source)
  }
  const eventsByInstallation = new Map()
  for (const event of cohortEvents) {
    const events = eventsByInstallation.get(event.identity) || []
    events.push(event)
    eventsByInstallation.set(event.identity, events)
  }

  for (const [installation, events] of eventsByInstallation) {
    const intents = events.filter(event => event.row.event_name === 'next_session_preview_activated'
      || eventName(event.row) === 'next_session_preview_activated')
    for (const event of events) {
      const name = eventName(event.row)
      if (name === 'next_session_preview_mounted') {
        const group = groupFor(nextSessionPreviewSource(event.row))
        group.mountedUsers.add(installation)
        group.mountedEvents += 1
      } else if (name === 'next_session_preview_activated') {
        const group = groupFor(nextSessionPreviewSource(event.row))
        group.activatedUsers.add(installation)
        group.activatedEvents += 1
      } else if (name === 'workout_started') {
        const priorIntents = intents.filter(intent => intent.time <= event.time)
        if (!priorIntents.length) {
          startsWithoutIntentUsers.add(installation)
          startsWithoutIntentEvents += 1
          continue
        }
        const source = nextSessionPreviewSource(priorIntents[priorIntents.length - 1].row)
        const group = groupFor(source)
        group.startedUsers.add(installation)
        group.startedEvents += 1
      }
    }
  }

  diagnostics.available = true
  diagnostics.quality = 'usable'
  diagnostics.eventRows = cohortEvents.length
  diagnostics.startsWithoutIntentUsers = startsWithoutIntentUsers.size
  diagnostics.startsWithoutIntentEvents = startsWithoutIntentEvents
  diagnostics.sources = [...groups.entries()]
    .map(([source, group]) => {
      const mountedUsers = group.mountedUsers.size
      const activatedUsers = group.activatedUsers.size
      const startedUsers = group.startedUsers.size
      return {
        source,
        mounted_users: mountedUsers,
        mounted_events: group.mountedEvents,
        activated_users: activatedUsers,
        activated_events: group.activatedEvents,
        started_users: startedUsers,
        started_events: group.startedEvents,
        activation_from_mounted: roundedRate(activatedUsers, mountedUsers),
        start_from_activated: roundedRate(startedUsers, activatedUsers),
        start_from_mounted: roundedRate(startedUsers, mountedUsers),
      }
    })
    .sort((left, right) => left.source.localeCompare(right.source))
  return diagnostics
}

function weeklyReviewDataState(row) {
  const value = String(rowValue(row, 'data_state') ?? '').trim()
  return value === 'empty' || value === 'populated' ? value : '(not_set)'
}

/**
 * Relate the loaded Weekly Review surface, explicit OPEN TODAY intent, and a
 * later workout start inside the valid activation cohort. This is a recovery
 * path diagnostic, not an activation, retention, or causal outcome.
 */
export function summarizeWeeklyReviewRecovery({ rows, activationFirst }) {
  const surfaceRows = matchingRows(rows, ['weekly_review_surface_mounted'])
  const intentRows = matchingRows(rows, ['weekly_review_open_today'])
  const startedRows = matchingRows(rows, ['workout_started'])
  const weeklyRows = [...surfaceRows, ...intentRows]
  const relevantRows = [...weeklyRows, ...startedRows]
  const diagnostics = {
    available: false,
    quality: 'no observed Weekly Review events',
    activationUsers: activationFirst.size,
    eventRows: 0,
    states: [],
    intentsWithoutSurfaceUsers: null,
    intentsWithoutSurfaceEvents: null,
    startsWithoutIntentUsers: null,
    startsWithoutIntentEvents: null,
    missingInstallationIdentity: false,
    missingEventTime: false,
    invalidDataState: false,
  }

  if (!weeklyRows.length) return diagnostics

  const timed = relevantRows.map(row => ({
    row,
    name: eventName(row),
    identity: identityValue(row, ['installation_id']),
    time: timestampValue(row),
    dataState: weeklyReviewDataState(row),
  }))
  diagnostics.missingInstallationIdentity = timed.some(event => !event.identity)
  diagnostics.missingEventTime = timed.some(event => event.time === null)
  diagnostics.invalidDataState = timed
    .filter(event => event.name !== 'workout_started')
    .some(event => event.dataState === '(not_set)')
  if (diagnostics.missingInstallationIdentity || diagnostics.missingEventTime) {
    diagnostics.quality = 'identity or event time missing'
    return diagnostics
  }
  if (diagnostics.invalidDataState) {
    diagnostics.quality = 'invalid data_state'
    return diagnostics
  }

  const cohortEvents = timed
    .filter(event => activationFirst.has(event.identity))
    .filter(event => event.time >= activationFirst.get(event.identity))
    .sort((left, right) => left.time - right.time)
  if (!cohortEvents.length) {
    diagnostics.quality = 'no Weekly Review events in activation cohort'
    return diagnostics
  }

  const groups = new Map()
  const intentsWithoutSurfaceUsers = new Set()
  const startsWithoutIntentUsers = new Set()
  let intentsWithoutSurfaceEvents = 0
  let startsWithoutIntentEvents = 0
  const groupFor = (dataState) => {
    if (!groups.has(dataState)) {
      groups.set(dataState, {
        mountedUsers: new Set(),
        mountedEvents: 0,
        intentUsers: new Set(),
        intentEvents: 0,
        startedUsers: new Set(),
        startedEvents: 0,
      })
    }
    return groups.get(dataState)
  }
  const eventsByInstallation = new Map()
  for (const event of cohortEvents) {
    const events = eventsByInstallation.get(event.identity) || []
    events.push(event)
    eventsByInstallation.set(event.identity, events)
  }

  for (const [installation, events] of eventsByInstallation) {
    const surfaces = events.filter(event => event.name === 'weekly_review_surface_mounted')
    const intents = events.filter(event => event.name === 'weekly_review_open_today')
    for (const event of surfaces) {
      const group = groupFor(event.dataState)
      group.mountedUsers.add(installation)
      group.mountedEvents += 1
    }
    for (const event of intents) {
      const group = groupFor(event.dataState)
      group.intentUsers.add(installation)
      group.intentEvents += 1
      const priorSurface = surfaces
        .filter(surface => surface.dataState === event.dataState && surface.time <= event.time)
        .sort((left, right) => left.time - right.time)
        .at(-1)
      if (!priorSurface) {
        intentsWithoutSurfaceUsers.add(installation)
        intentsWithoutSurfaceEvents += 1
      }
    }
    for (const event of events.filter(candidate => candidate.name === 'workout_started')) {
      const priorIntent = intents
        .filter(intent => intent.time < event.time)
        .sort((left, right) => left.time - right.time)
        .at(-1)
      if (!priorIntent) {
        startsWithoutIntentUsers.add(installation)
        startsWithoutIntentEvents += 1
        continue
      }
      const group = groupFor(priorIntent.dataState)
      group.startedUsers.add(installation)
      group.startedEvents += 1
    }
  }

  diagnostics.available = true
  diagnostics.quality = 'usable'
  diagnostics.eventRows = cohortEvents.length
  diagnostics.intentsWithoutSurfaceUsers = intentsWithoutSurfaceUsers.size
  diagnostics.intentsWithoutSurfaceEvents = intentsWithoutSurfaceEvents
  diagnostics.startsWithoutIntentUsers = startsWithoutIntentUsers.size
  diagnostics.startsWithoutIntentEvents = startsWithoutIntentEvents
  diagnostics.states = [...groups.entries()]
    .map(([dataState, group]) => {
      const mountedUsers = group.mountedUsers.size
      const intentUsers = group.intentUsers.size
      const startedUsers = group.startedUsers.size
      return {
        data_state: dataState,
        mounted_users: mountedUsers,
        mounted_events: group.mountedEvents,
        open_today_users: intentUsers,
        open_today_events: group.intentEvents,
        started_after_intent_users: startedUsers,
        started_after_intent_events: group.startedEvents,
        intent_from_mounted: roundedRate(intentUsers, mountedUsers),
        start_after_intent: roundedRate(startedUsers, intentUsers),
      }
    })
    .sort((left, right) => left.data_state.localeCompare(right.data_state))
  return diagnostics
}

function boundedSegmentValue(row, key) {
  const value = String(rowValue(row, key) ?? '').trim()
  if (!value) return '(not_set)'
  return value.length > 160 ? `${value.slice(0, 157)}...` : value
}

function ctaSegmentFields(row) {
  return {
    source_page: boundedSegmentValue(row, 'source_page'),
    cta_placement: boundedSegmentValue(row, 'cta_placement'),
    experiment_name: boundedSegmentValue(row, 'experiment_name'),
    experiment_variant: boundedSegmentValue(row, 'experiment_variant'),
    hero_presentation: boundedSegmentValue(row, 'hero_presentation'),
    copy_version: boundedSegmentValue(row, 'copy_version'),
    viewport_class: boundedSegmentValue(row, 'viewport_class'),
    app_store_campaign: boundedSegmentValue(row, 'app_store_campaign'),
  }
}

/**
 * Produce experiment-ready CTA rows without treating event rows as people.
 * Every segment keeps its own identity-quality flag so one malformed export
 * cannot silently turn a rate into a plausible-looking number.
 */
export function summarizeCtaSegments(rows) {
  const segments = new Map()
  const sessionFields = ['session_id', 'browser_session_id']
  const eventTypes = [
    ['web_cta_viewed', 'viewed'],
    ['app_store_outbound_clicked', 'outbound'],
  ]

  for (const [eventName, kind] of eventTypes) {
    for (const row of matchingRows(rows, [eventName])) {
      const fields = ctaSegmentFields(row)
      const key = JSON.stringify(fields)
      if (!segments.has(key)) {
        segments.set(key, {
          ...fields,
          viewedEventRows: 0,
          outboundEventRows: 0,
          viewedSessions: new Set(),
          outboundSessions: new Set(),
          missingViewedIdentity: false,
          missingOutboundIdentity: false,
        })
      }

      const segment = segments.get(key)
      const identity = identityValue(row, sessionFields)
      if (kind === 'viewed') {
        segment.viewedEventRows += 1
        if (identity) segment.viewedSessions.add(identity)
        else segment.missingViewedIdentity = true
      } else {
        segment.outboundEventRows += 1
        if (identity) segment.outboundSessions.add(identity)
        else segment.missingOutboundIdentity = true
      }
    }
  }

  return [...segments.values()]
    .map((segment) => {
      const missingSessionIdentity = segment.missingViewedIdentity || segment.missingOutboundIdentity
      const viewedSessions = segment.missingViewedIdentity ? null : segment.viewedSessions.size
      const outboundSessions = segment.missingOutboundIdentity ? null : segment.outboundSessions.size
      const qualifiedOutboundSessions = missingSessionIdentity
        ? null
        : [...segment.outboundSessions].filter((identity) => segment.viewedSessions.has(identity)).length
      return {
        source_page: segment.source_page,
        cta_placement: segment.cta_placement,
        experiment_name: segment.experiment_name,
        experiment_variant: segment.experiment_variant,
        hero_presentation: segment.hero_presentation,
        copy_version: segment.copy_version,
        viewport_class: segment.viewport_class,
        app_store_campaign: segment.app_store_campaign,
        cta_viewed_event_rows: segment.viewedEventRows,
        outbound_event_rows: segment.outboundEventRows,
        cta_viewed_sessions: viewedSessions,
        outbound_sessions: outboundSessions,
        qualified_outbound_sessions: qualifiedOutboundSessions,
        outbound_sessions_without_cta_view: missingSessionIdentity
          ? null
          : outboundSessions - qualifiedOutboundSessions,
        qualified_store_intent_rate: roundedRate(qualifiedOutboundSessions, viewedSessions),
        missing_session_identity: missingSessionIdentity,
      }
    })
    .sort((left, right) => JSON.stringify(left).localeCompare(JSON.stringify(right)))
}

function firstOnboardingPaths(rows) {
  const result = new Map()
  for (const row of matchingRows(rows, ['onboarding_path_selected'])) {
    const identity = identityValue(row, ['installation_id'])
    const time = timestampValue(row)
    const path = String(rowValue(row, 'path') ?? '').trim()
    if (!identity || time === null || !path) continue
    const current = result.get(identity)
    if (current === undefined || time < current.time) result.set(identity, { path, time })
  }
  return result
}

function firstActivationMetadata(rows) {
  const result = new Map()
  for (const row of matchingRows(rows, ['activation_entry'])) {
    const identity = identityValue(row, ['installation_id'])
    const time = timestampValue(row)
    if (!identity || time === null) continue
    const buildValue = rowValue(row, 'app_build') || rowValue(row, 'build_number')
    const event = {
      identity,
      time,
      app_version: boundedSegmentValue(row, 'app_version'),
      app_build: buildValue ? String(buildValue).trim() : '(not_set)',
    }
    const current = result.get(identity)
    if (current === undefined || time < current.time) result.set(identity, event)
  }
  return result
}

export function summarizeWebEvents(rows) {
  const sessionFields = ['session_id', 'browser_session_id']
  const coverage = summarizeSourceCoverage(rows, { eventTime: true })
  const sessions = uniqueEventCount(rows, ['web_session_started'], sessionFields)
  const ctaViewed = uniqueEventCount(rows, ['web_cta_viewed'], sessionFields)
  const outbound = uniqueEventCount(rows, ['app_store_outbound_clicked'], sessionFields)
  const ctaViewedIdentities = uniqueIdentitySet(rows, ['web_cta_viewed'], sessionFields)
  const outboundIdentities = uniqueIdentitySet(rows, ['app_store_outbound_clicked'], sessionFields)
  const toolStarts = uniqueEventCount(rows, ['tool_started'], sessionFields)
  const toolCompletions = uniqueEventCount(rows, ['tool_completed'], sessionFields)
  const ctaSegments = summarizeCtaSegments(rows)
  const qualifiedOutboundSessions = ctaViewedIdentities.identities && outboundIdentities.identities
    ? [...outboundIdentities.identities].filter((identity) => ctaViewedIdentities.identities.has(identity)).length
    : null

  return {
    eventRows: rows.length,
    coverage,
    webPageViewRows: countEvent(rows, ['web_page_view']),
    sessionCount: sessions.value,
    ctaViewedSessions: ctaViewed.value,
    outboundSessions: outbound.value,
    outboundEventRows: countEvent(rows, ['app_store_outbound_clicked']),
    qualifiedOutboundSessions,
    outboundSessionsWithoutCtaView: ctaViewedIdentities.identities && outboundIdentities.identities
      ? outboundIdentities.value - qualifiedOutboundSessions
      : null,
    qualifiedStoreIntentRate: roundedRate(qualifiedOutboundSessions, ctaViewed.value),
    ctaViewRate: roundedRate(ctaViewed.value, sessions.value),
    toolStarts: toolStarts.value,
    toolCompletions: toolCompletions.value,
    identityFields: sessionFields,
    missingSessionIdentity: [sessions, ctaViewed, outbound, toolStarts, toolCompletions].some(result => result.missingIdentity),
    ctaSegments,
    experimentComparisons: summarizeExperimentComparisons(ctaSegments),
  }
}

export function summarizeAppEvents(rows) {
  const installationFields = ['installation_id']
  const coverage = summarizeSourceCoverage(rows, { eventTime: true })
  const appOpened = timedEvents(rows, ['app_opened'], installationFields)
  const activationEntry = timedEvents(rows, ['activation_entry'], installationFields)
  const firstSet = timedEvents(rows, ['first_set_logged'], installationFields)
  const workouts = timedEvents(rows, ['workout_started'], installationFields)
  const observedUntil = latestObservedTime(rows)
  const activationMetadata = firstActivationMetadata(rows)
  const activationFirst = firstTimes([...activationMetadata.values()])
  const workoutFirst = firstTimes(workouts.values)
  const setsByInstallation = new Map()
  const workoutsByInstallation = new Map()

  for (const event of firstSet.values) {
    const values = setsByInstallation.get(event.identity) || []
    values.push(event.time)
    setsByInstallation.set(event.identity, values)
  }
  for (const event of workouts.values) {
    const values = workoutsByInstallation.get(event.identity) || []
    values.push(event.time)
    workoutsByInstallation.set(event.identity, values)
  }

  const sevenDays = 7 * 24 * 60 * 60 * 1000
  let activated = 0
  for (const [installation, enteredAt] of activationFirst) {
    const setTimes = setsByInstallation.get(installation) || []
    if (setTimes.some(time => time >= enteredAt && time <= enteredAt + sevenDays)) activated += 1
  }

  // app_opened includes returning users. activation_entry is emitted only
  // when onboarding is still required and is therefore the new-user
  // denominator for first-set activation.
  const activationDataComplete = activationEntry.matchingRows > 0
    && !activationEntry.missingIdentity
    && !activationEntry.missingTime
    && !firstSet.missingIdentity
    && !firstSet.missingTime
  const timeToFirstSet = summarizeActivationTimeToFirstSet({
    activationFirst,
    setsByInstallation,
    dataComplete: activationDataComplete,
  })
  const returnDataComplete = workouts.matchingRows === 0 || (!workouts.missingIdentity && !workouts.missingTime)
  const returnWindows = summarizeReturnWindows({
    firstWorkouts: workoutFirst,
    workoutsByInstallation,
    observedUntil,
    dataComplete: returnDataComplete,
  })
  const nextSessionPreviewDiagnostics = summarizeNextSessionPreview({
    rows,
    activationFirst,
  })
  const weeklyReviewRecoveryDiagnostics = summarizeWeeklyReviewRecovery({
    rows,
    activationFirst,
  })
  const openedInstallations = uniqueEventCount(rows, ['app_opened'], installationFields)
  const activationInstallations = uniqueEventCount(rows, ['activation_entry'], installationFields)
  const firstSetInstallations = uniqueEventCount(rows, ['first_set_logged'], installationFields)
  const firstWorkoutInstallations = uniqueEventCount(rows, ['workout_started'], installationFields)
  const completedWorkouts = uniqueEventCount(rows, ['workout_completed', 'first_completed_workout'], installationFields)
  const onboardingPaths = firstOnboardingPaths(rows)
  const pathSegments = new Map()
  for (const [installation, enteredAt] of activationFirst) {
    const path = onboardingPaths.get(installation)?.path || '(not_set)'
    if (!pathSegments.has(path)) pathSegments.set(path, { activationEntries: 0, activated: 0 })
    const segment = pathSegments.get(path)
    segment.activationEntries += 1
    const setTimes = setsByInstallation.get(installation) || []
    if (activationDataComplete && setTimes.some(time => time >= enteredAt && time <= enteredAt + sevenDays)) {
      segment.activated += 1
    }
  }
  const activationPathSegments = [...pathSegments.entries()]
    .map(([path, segment]) => ({
      path,
      activation_entries: segment.activationEntries,
      first_set_activated_installations: activationDataComplete ? segment.activated : null,
      first_set_activation_rate: activationDataComplete
        ? roundedRate(segment.activated, segment.activationEntries)
        : null,
      path_missing: path === '(not_set)',
    }))
    .sort((left, right) => left.path.localeCompare(right.path))
  const releaseSegments = new Map()
  for (const event of activationMetadata.values()) {
    const key = JSON.stringify({ app_version: event.app_version, app_build: event.app_build })
    if (!releaseSegments.has(key)) {
      releaseSegments.set(key, {
        app_version: event.app_version,
        app_build: event.app_build,
        activationEntries: 0,
        activated: 0,
      })
    }
    const segment = releaseSegments.get(key)
    segment.activationEntries += 1
    const setTimes = setsByInstallation.get(event.identity) || []
    if (activationDataComplete && setTimes.some(time => time >= event.time && time <= event.time + sevenDays)) {
      segment.activated += 1
    }
  }
  const activationReleaseSegments = [...releaseSegments.values()]
    .map((segment) => ({
      app_version: segment.app_version,
      app_build: segment.app_build,
      activation_entries: segment.activationEntries,
      first_set_activated_installations: activationDataComplete ? segment.activated : null,
      first_set_activation_rate: activationDataComplete
        ? roundedRate(segment.activated, segment.activationEntries)
        : null,
      release_metadata_missing: segment.app_version === '(not_set)' || segment.app_build === '(not_set)',
    }))
    .sort((left, right) => JSON.stringify(left).localeCompare(JSON.stringify(right)))

  return {
    eventRows: rows.length,
    coverage,
    appOpenedInstallations: openedInstallations.value,
    activationEntryInstallations: activationInstallations.value,
    activationDenominatorAvailable: activationDataComplete,
    firstSetActivatedInstallations: activationDataComplete ? activated : null,
    firstSetActivationRate: activationDataComplete ? roundedRate(activated, activationFirst.size) : null,
    timeToFirstSet,
    firstWorkoutInstallations: firstWorkoutInstallations.value,
    secondWorkoutWithin1dInstallations: returnWindows['1d'].returningWorkoutInstallations,
    oneDayReturnRate: returnWindows['1d'].rate,
    secondWorkoutWithin7dInstallations: returnWindows['7d'].returningWorkoutInstallations,
    sevenDayReturnRate: returnWindows['7d'].rate,
    secondWorkoutWithin30dInstallations: returnWindows['30d'].returningWorkoutInstallations,
    thirtyDayReturnRate: returnWindows['30d'].rate,
    returnWindowSummaries: returnWindows,
    returnObservationEnd: observedUntil,
    nextSessionPreviewDiagnostics,
    weeklyReviewRecoveryDiagnostics,
    completedWorkoutInstallations: completedWorkouts.value,
    identityFields: installationFields,
    missingInstallationIdentity: [openedInstallations, activationInstallations, firstSetInstallations, firstWorkoutInstallations, completedWorkouts].some(result => result.missingIdentity),
    missingEventTime: activationEntry.missingTime || firstSet.missingTime || !returnDataComplete,
    activationPathSegments,
    activationReleaseSegments,
  }
}

function display(value) {
  return value === null || value === undefined ? 'unknown' : String(value)
}

function markdownValue(value) {
  return display(value).replaceAll('|', '\\|')
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

  const searchSourcePresent = searchQueries.status === 'ready' || searchPages.status === 'ready'
  const searchSummary = summarizeSearchConsoleMetrics(searchQueries.rows, searchPages.rows)
  const searchReady = searchSummary.available
  const webInputReady = webEvents.status === 'ready'
  const appStoreInputReady = appStore.status === 'ready'
  const appAnalyticsInputReady = appAnalytics.status === 'ready'
  const webSummary = webInputReady ? summarizeWebEvents(webEvents.rows) : null
  const appStoreSummary = appStoreInputReady ? summarizeAppStoreConnectMetrics(appStore.rows) : null
  const appSummary = appAnalyticsInputReady ? summarizeAppEvents(appAnalytics.rows) : null
  const webReady = Boolean(webSummary?.coverage.available)
  const appStoreReady = Boolean(appStoreSummary?.available)
  const appAnalyticsReady = Boolean(appSummary?.coverage.available)
  const reportableWeb = webReady ? webSummary : null
  const reportableAppStore = appStoreReady ? appStoreSummary : null
  const reportableApp = appAnalyticsReady ? appSummary : null
  const reportableSearch = searchReady ? searchSummary : null
  const sourceStatuses = [searchReady, webReady, appStoreReady, appAnalyticsReady]
  const status = sourceStatuses.every(Boolean) ? 'ready' : sourceStatuses.some(Boolean) ? 'partial' : 'blocked'

  const searchImpressions = reportableSearch?.impressions ?? null
  const searchClicks = reportableSearch?.clicks ?? null
  const toolStarts = reportableWeb?.toolStarts ?? null
  const toolCompletions = reportableWeb?.toolCompletions ?? null
  const appStoreClicks = reportableWeb?.outboundSessions ?? null
  const appStoreOutboundEventRows = reportableWeb?.outboundEventRows ?? null
  const qualifiedStoreIntentSessions = reportableWeb?.qualifiedOutboundSessions ?? null
  const outboundSessionsWithoutCtaView = reportableWeb?.outboundSessionsWithoutCtaView ?? null
  const downloads = reportableAppStore?.downloads ?? null
  const appStoreProductPageViews = reportableAppStore?.product_page_views ?? null
  const appStoreProductPageToDownloadRate = reportableAppStore?.product_page_to_download_rate ?? null
  const firstWorkouts = reportableApp?.firstWorkoutInstallations ?? null
  const completedWorkouts = reportableApp?.completedWorkoutInstallations ?? null
  const ctaSegments = reportableWeb?.ctaSegments ?? []
  const experimentComparisons = reportableWeb?.experimentComparisons ?? []
  const activationPathSegments = reportableApp?.activationPathSegments ?? []
  const activationReleaseSegments = reportableApp?.activationReleaseSegments ?? []
  const returnWindowSummaries = reportableApp?.returnWindowSummaries ?? {}
  const nextSessionPreviewDiagnostics = reportableApp?.nextSessionPreviewDiagnostics ?? null
  const weeklyReviewRecoveryDiagnostics = reportableApp?.weeklyReviewRecoveryDiagnostics ?? null
  const appStoreCampaignContinuity = summarizeAppStoreCampaignContinuity(
    webReady && appStoreReady ? webEvents.rows : null,
    reportableAppStore,
  )

  const snapshot = {
    generatedAt: new Date().toISOString(),
    status,
    sources: {
      searchConsole: {
        status: searchSummary.available ? 'ready' : searchSourcePresent ? 'invalid' : 'blocked',
        quality: searchSummary.quality,
        range: searchSummary.range,
        availableRanges: searchSummary.available_ranges,
        queryRows: searchQueries.rows.length,
        pageRows: searchPages.rows.length,
        coverage: searchSummary.coverage,
      },
      webAnalytics: {
        status: webInputReady ? (webReady ? 'ready' : 'invalid') : webEvents.status,
        quality: webSummary?.coverage.quality ?? webEvents.status,
        rows: webEvents.rows.length,
        coverage: webSummary?.coverage ?? null,
      },
      appStoreConnect: {
        status: appStoreInputReady ? (appStoreReady ? 'ready' : 'invalid') : appStore.status,
        quality: appStoreSummary?.quality ?? appStore.status,
        rows: appStore.rows.length,
        coverage: appStoreSummary?.coverage ?? null,
      },
      appAnalytics: {
        status: appAnalyticsInputReady ? (appAnalyticsReady ? 'ready' : 'invalid') : appAnalytics.status,
        quality: appSummary?.coverage.quality ?? appAnalytics.status,
        rows: appAnalytics.rows.length,
        coverage: appSummary?.coverage ?? null,
      },
    },
    funnel: {
      nonBrandSearchImpressions: searchImpressions,
      searchClicks,
      searchWindow: searchSummary.range,
      webPageViews: reportableWeb?.webPageViewRows ?? null,
      webSessions: reportableWeb?.sessionCount ?? null,
      toolStarts,
      toolCompletions,
      appStoreOutboundClicks: appStoreClicks,
      appStoreOutboundEventRows,
      appStoreOutboundSessions: reportableWeb?.outboundSessions ?? null,
      ctaViewedSessions: reportableWeb?.ctaViewedSessions ?? null,
      qualifiedStoreIntentSessions,
      outboundSessionsWithoutCtaView,
      qualifiedStoreIntentRate: reportableWeb?.qualifiedStoreIntentRate ?? null,
      ctaViewRate: reportableWeb?.ctaViewRate ?? null,
      appStoreProductPageViews,
      appStoreProductPageToDownloadRate,
      downloads,
      firstWorkouts,
      completedWorkouts,
      activationEntryInstallations: reportableApp?.activationEntryInstallations ?? null,
      firstSetActivatedInstallations: reportableApp?.firstSetActivatedInstallations ?? null,
      firstSetActivationRate: reportableApp?.firstSetActivationRate ?? null,
      timeToFirstSet: reportableApp?.timeToFirstSet ?? null,
      secondWorkoutWithin7dInstallations: reportableApp?.secondWorkoutWithin7dInstallations ?? null,
      sevenDayReturnRate: reportableApp?.sevenDayReturnRate ?? null,
      secondWorkoutWithin1dInstallations: reportableApp?.secondWorkoutWithin1dInstallations ?? null,
      oneDayReturnRate: reportableApp?.oneDayReturnRate ?? null,
      secondWorkoutWithin30dInstallations: reportableApp?.secondWorkoutWithin30dInstallations ?? null,
      thirtyDayReturnRate: reportableApp?.thirtyDayReturnRate ?? null,
      returnToTraining: returnWindowSummaries,
    },
    measurement: {
      search_console: searchSummary,
      web: webSummary
        ? {
          reportable: webReady,
          coverage: webSummary.coverage,
          identity_fields: webSummary.identityFields,
          missing_session_identity: reportableWeb?.missingSessionIdentity ?? null,
          qualified_outbound_sessions: reportableWeb?.qualifiedOutboundSessions ?? null,
          outbound_sessions_without_cta_view: reportableWeb?.outboundSessionsWithoutCtaView ?? null,
          cta_segments: ctaSegments,
          experiment_comparisons: experimentComparisons,
        }
        : null,
      app: appSummary
        ? {
          reportable: appAnalyticsReady,
          coverage: appSummary.coverage,
          identity_fields: appSummary.identityFields,
          missing_installation_identity: reportableApp?.missingInstallationIdentity ?? null,
          missing_event_time: reportableApp?.missingEventTime ?? null,
          activation_denominator_event: 'activation_entry',
          activation_denominator_available: reportableApp?.activationDenominatorAvailable ?? false,
          activation_path_segments: activationPathSegments,
          activation_release_segments: activationReleaseSegments,
          time_to_first_set: appSummary.timeToFirstSet,
          return_window_summaries: returnWindowSummaries,
          next_session_preview_diagnostics: nextSessionPreviewDiagnostics,
          weekly_review_recovery_diagnostics: weeklyReviewRecoveryDiagnostics,
        }
        : null,
      app_store_connect: appStoreSummary,
      app_store_campaign_continuity: appStoreCampaignContinuity,
    },
    breakdowns: {
      webCtaSegments: ctaSegments,
      webExperimentComparisons: experimentComparisons,
      appActivationPaths: activationPathSegments,
      appActivationReleases: activationReleaseSegments,
      appNextSessionPreview: nextSessionPreviewDiagnostics,
      appWeeklyReviewRecovery: weeklyReviewRecoveryDiagnostics,
      appStoreCampaigns: reportableAppStore?.campaigns ?? null,
      appStoreCampaignContinuity: appStoreCampaignContinuity,
    },
    notes: [
      'Missing source data is represented as null, not zero.',
      'Search Console query/page totals remain unknown when the exporter has no rows.',
      'Non-brand Search Console totals use one preferred query-level window and never sum overlapping ranges or substitute page-level rows.',
      'App Store and app activation data require authorized exports and are not inferred from web events.',
      'App Store product-page-to-download rate remains unknown unless complete product_page_views and downloads fields are present.',
      'Web-to-App Store campaign continuity is a handoff diagnostic; matching tokens do not equate browser clicks with product-page views or downloads.',
      'Qualified store-intent rate uses the intersection of CTA-viewed and outbound session identities; clicks without a recorded CTA view remain a separate diagnostic.',
      'Every reportable source must retain a complete observed date window; incomplete or contradictory coverage leaves that source invalid and its funnel values null.',
    ],
  }

  const missing = [
    ['Search Console', !searchReady, 'Run scripts/search-console-export.mjs with an authorized read-only token and retain query-level brand_class, range, start_date, and end_date fields.'],
    ['Web analytics', !webReady, webInputReady ? 'Retain a valid event timestamp on every exported row before using web rates.' : 'Export EU Mixpanel events or provide an approved aggregate event CSV.'],
    ['App Store Connect', !appStoreReady, appStoreInputReady ? 'Retain complete start/end date fields on every campaign-period row before using store rates.' : 'Provide a campaign-linked App Store Connect export.'],
    ['App analytics', !appAnalyticsReady, appAnalyticsInputReady ? 'Retain a valid event timestamp on every exported row before using activation or return rates.' : 'Provide an attribution-safe activation export.'],
  ].filter(([, isMissing]) => isMissing)

  const returnWindowRows = [
    ['1d', '1 day'],
    ['7d', '7 days'],
    ['30d', '30 days'],
  ].map(([key, label]) => {
    const summary = returnWindowSummaries[key]
    const rate = summary?.rate == null ? 'unknown' : `${(summary.rate * 100).toFixed(2)}%`
    const maturity = summary?.cohortMature ? 'mature' : 'not mature / unavailable'
    return `| ${label} | ${display(summary?.eligibleFirstWorkoutInstallations)} | ${display(summary?.returningWorkoutInstallations)} | ${rate} | ${maturity} |`
  }).join('\n')

  const markdown = `# Acquisition report

Generated: ${snapshot.generatedAt}

Status: **${status.toUpperCase()}**

This report connects search visibility to web and product acquisition only when the corresponding source export is present. Null values mean the source was missing or had no usable rows; they do not mean zero activity.

## Source status

| Source | Status | Rows | File |
| --- | --- | ---: | --- |
${sourceLine('Search Console queries', searchQueries)}
${sourceLine('Search Console pages', searchPages)}
| Search Console metric selection | ${searchSummary.available ? 'ready' : searchSourcePresent ? 'invalid' : 'blocked'} | ${searchSummary.selected_rows} | ${searchSummary.range || searchSummary.quality} |
${sourceLine('Web analytics', webEvents)}
${sourceLine('App Store Connect', appStore)}
${sourceLine('App analytics', appAnalytics)}
| Search Console date coverage | ${markdownValue(searchSummary.coverage?.quality)} | ${display(searchSummary.coverage?.covered_rows)} / ${display(searchSummary.coverage?.source_rows)} | ${markdownValue(searchSummary.coverage?.start_date)} to ${markdownValue(searchSummary.coverage?.end_date)} |
| Web event date coverage | ${markdownValue(webSummary?.coverage?.quality)} | ${display(webSummary?.coverage?.covered_rows)} / ${display(webSummary?.coverage?.source_rows)} | ${markdownValue(webSummary?.coverage?.start_date)} to ${markdownValue(webSummary?.coverage?.end_date)} |
| App Store Connect date coverage | ${markdownValue(appStoreSummary?.coverage?.quality)} | ${display(appStoreSummary?.coverage?.covered_rows)} / ${display(appStoreSummary?.coverage?.source_rows)} | ${markdownValue(appStoreSummary?.coverage?.start_date)} to ${markdownValue(appStoreSummary?.coverage?.end_date)} |
| App event date coverage | ${markdownValue(appSummary?.coverage?.quality)} | ${display(appSummary?.coverage?.covered_rows)} / ${display(appSummary?.coverage?.source_rows)} | ${markdownValue(appSummary?.coverage?.start_date)} to ${markdownValue(appSummary?.coverage?.end_date)} |

## Funnel

| Stage | Value |
| --- | ---: |
| Non-brand search impressions | ${display(snapshot.funnel.nonBrandSearchImpressions)} |
| Search clicks | ${display(snapshot.funnel.searchClicks)} |
| Search metric window | ${display(snapshot.funnel.searchWindow)} |
| Search metric quality | ${markdownValue(searchSummary.quality)} |
| Web page views | ${display(snapshot.funnel.webPageViews)} |
| Web sessions | ${display(snapshot.funnel.webSessions)} |
| Tool starts | ${display(snapshot.funnel.toolStarts)} |
| Tool completions | ${display(snapshot.funnel.toolCompletions)} |
| App Store outbound sessions | ${display(snapshot.funnel.appStoreOutboundClicks)} |
| App Store outbound event rows (diagnostic) | ${display(snapshot.funnel.appStoreOutboundEventRows)} |
| CTA-view sessions | ${display(snapshot.funnel.ctaViewedSessions)} |
| Qualified outbound sessions (CTA viewed and handoff) | ${display(snapshot.funnel.qualifiedStoreIntentSessions)} |
| Outbound sessions without a CTA view (diagnostic) | ${display(snapshot.funnel.outboundSessionsWithoutCtaView)} |
| Qualified store-intent rate | ${snapshot.funnel.qualifiedStoreIntentRate === null ? 'unknown' : `${(snapshot.funnel.qualifiedStoreIntentRate * 100).toFixed(2)}%`} |
| CTA-view rate | ${snapshot.funnel.ctaViewRate === null ? 'unknown' : `${(snapshot.funnel.ctaViewRate * 100).toFixed(2)}%`} |
| App Store product-page views | ${display(snapshot.funnel.appStoreProductPageViews)} |
| App Store product-page-to-download rate | ${snapshot.funnel.appStoreProductPageToDownloadRate === null ? 'unknown' : `${(snapshot.funnel.appStoreProductPageToDownloadRate * 100).toFixed(2)}%`} |
| Downloads | ${display(snapshot.funnel.downloads)} |
| First workouts | ${display(snapshot.funnel.firstWorkouts)} |
| Activation-entry installations | ${display(snapshot.funnel.activationEntryInstallations)} |
| First-set activated installations | ${display(snapshot.funnel.firstSetActivatedInstallations)} |
| First-set activation rate | ${snapshot.funnel.firstSetActivationRate === null ? 'unknown' : `${(snapshot.funnel.firstSetActivationRate * 100).toFixed(2)}%`} |
| Median time to first set | ${display(reportableApp?.timeToFirstSet?.medianSeconds)} seconds |
| P75 time to first set | ${display(reportableApp?.timeToFirstSet?.p75Seconds)} seconds |
| Second workout within seven days | ${display(snapshot.funnel.secondWorkoutWithin7dInstallations)} |
| Seven-day return rate | ${snapshot.funnel.sevenDayReturnRate === null ? 'unknown' : `${(snapshot.funnel.sevenDayReturnRate * 100).toFixed(2)}%`} |
| Second workout within one day | ${display(snapshot.funnel.secondWorkoutWithin1dInstallations)} |
| One-day return rate | ${snapshot.funnel.oneDayReturnRate === null ? 'unknown' : `${(snapshot.funnel.oneDayReturnRate * 100).toFixed(2)}%`} |
| Second workout within 30 days | ${display(snapshot.funnel.secondWorkoutWithin30dInstallations)} |
| 30-day return rate | ${snapshot.funnel.thirtyDayReturnRate === null ? 'unknown' : `${(snapshot.funnel.thirtyDayReturnRate * 100).toFixed(2)}%`} |
| Completed workouts | ${display(snapshot.funnel.completedWorkouts)} |

## App Store Connect metrics

These aggregate metrics are reportable only when the supplied export contains
complete product-page-view and download values. They are not inferred from
website clicks, and missing or incomplete rows remain unknown.

| Metric | Value |
| --- | ---: |
| Source rows | ${display(appStoreSummary?.source_rows)} |
| Metric quality | ${display(appStoreSummary?.quality)} |
| Product-page views | ${display(reportableAppStore?.product_page_views)} |
| Downloads | ${display(reportableAppStore?.downloads)} |
| Product-page-to-download rate | ${reportableAppStore?.product_page_to_download_rate === null || reportableAppStore?.product_page_to_download_rate === undefined ? 'unknown' : `${(reportableAppStore.product_page_to_download_rate * 100).toFixed(2)}%`} |
| Product-page field | ${markdownValue(appStoreSummary?.metric_fields?.product_page_views)} |
| Download field | ${markdownValue(appStoreSummary?.metric_fields?.downloads)} |

### App Store Connect campaign breakdown

| Campaign | Product-page views | Downloads | Product-page-to-download rate | Quality |
| --- | ---: | ---: | ---: | --- |
${reportableAppStore?.campaigns?.length ? reportableAppStore.campaigns.map((campaign) => `| ${markdownValue(campaign.app_store_campaign)} | ${display(campaign.product_page_views)} | ${display(campaign.downloads)} | ${campaign.product_page_to_download_rate === null ? 'unknown' : `${(campaign.product_page_to_download_rate * 100).toFixed(2)}%`} | ${markdownValue(campaign.quality)} |`).join('\n') : '| none | unknown | unknown | unknown | source missing, invalid coverage, campaign field missing, or no complete rows |'}

## Web-to-App Store campaign continuity

Campaign tokens are compared across the browser handoff and App Store Connect
rows to expose routing or export mismatches. This is a continuity diagnostic;
web outbound sessions are not substituted for App Store product-page views or
downloads, and a matched token does not establish that the same visitor
installed the app.

| Campaign | Web outbound sessions | Product-page views | Downloads | Product-page-to-download rate | Quality |
| --- | ---: | ---: | ---: | ---: | --- |
${appStoreCampaignContinuity.campaigns.length ? appStoreCampaignContinuity.campaigns.map((campaign) => `| ${markdownValue(campaign.app_store_campaign)} | ${display(campaign.web_outbound_sessions)} | ${display(campaign.product_page_views)} | ${display(campaign.downloads)} | ${campaign.product_page_to_download_rate === null ? 'unknown' : `${(campaign.product_page_to_download_rate * 100).toFixed(2)}%`} | ${markdownValue(campaign.quality)} |`).join('\n') : '| none | unknown | unknown | unknown | unknown | source missing, empty, or no campaign rows |'}

## Return-to-training cohorts

Each denominator contains only first-workout installations whose elapsed
window is mature by the latest valid event time in the export. A recent cohort
is therefore reported as unavailable rather than as a non-return.

| Window | Mature first-workout installations | Returning installations | Rate | Cohort status |
| --- | ---: | ---: | ---: | --- |
${returnWindowRows}

## Time to first set diagnostic

This diagnostic uses only the elapsed time between the first
'activation_entry' and the first valid 'first_set_logged' for each app-scoped
installation. It is an aggregate onboarding-speed signal, not a user-level
report; missing identity or event time keeps it unknown.

| Metric | Value |
| --- | ---: |
| Qualified installations | ${display(appSummary?.timeToFirstSet?.sampleInstallations)} |
| Median seconds | ${display(appSummary?.timeToFirstSet?.medianSeconds)} |
| P75 seconds | ${display(appSummary?.timeToFirstSet?.p75Seconds)} |
| Under 2 minutes | ${display(appSummary?.timeToFirstSet?.buckets?.under_2m)} |
| 2–5 minutes | ${display(appSummary?.timeToFirstSet?.buckets?.['2_5m'])} |
| 5–10 minutes | ${display(appSummary?.timeToFirstSet?.buckets?.['5_10m'])} |
| 10–20 minutes | ${display(appSummary?.timeToFirstSet?.buckets?.['10_20m'])} |
| 20 minutes or more | ${display(appSummary?.timeToFirstSet?.buckets?.['20m_plus'])} |

## Next-session handoff diagnostic

This diagnostic relates preview exposure, explicit \`START NEXT SESSION\` intent,
and the later \`workout_started(source=next_session_preview)\` signal inside the
valid activation cohort. It is not a retention or causal measure. Source rows
may overlap when an installation is observed across multiple sessions.

| Source | Preview mounted users | Preview mounted events | Intent users | Intent events | Started after intent users | Started after intent events | Exposure to intent | Intent to start | Exposure to start |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
${nextSessionPreviewDiagnostics?.available && nextSessionPreviewDiagnostics.sources.length
    ? nextSessionPreviewDiagnostics.sources.map((row) => `| ${markdownValue(row.source)} | ${display(row.mounted_users)} | ${display(row.mounted_events)} | ${display(row.activated_users)} | ${display(row.activated_events)} | ${display(row.started_users)} | ${display(row.started_events)} | ${row.activation_from_mounted === null ? 'unknown' : `${(row.activation_from_mounted * 100).toFixed(2)}%`} | ${row.start_from_activated === null ? 'unknown' : `${(row.start_from_activated * 100).toFixed(2)}%`} | ${row.start_from_mounted === null ? 'unknown' : `${(row.start_from_mounted * 100).toFixed(2)}%`} |`).join('\n')
    : `| none | unknown | unknown | unknown | unknown | unknown | unknown | unknown | unknown | ${nextSessionPreviewDiagnostics?.quality || 'source missing or empty'} |`}

Starts without a preceding explicit intent: ${display(nextSessionPreviewDiagnostics?.startsWithoutIntentEvents)} event rows across ${display(nextSessionPreviewDiagnostics?.startsWithoutIntentUsers)} installations.

## Weekly Review recovery diagnostic

This diagnostic relates a resolved Weekly Review surface, explicit
\`OPEN TODAY\` intent, and a later \`workout_started\` event inside the valid
activation cohort. It segments the bounded \`data_state\` (\`empty\` or
\`populated\`) and is not an activation, retention, revenue, or causal measure.
Same-timestamp intent/start pairs are not treated as ordered by this report.

| Data state | Surface mounted users | Surface mounted events | OPEN TODAY users | OPEN TODAY events | Started after intent users | Started after intent events | Intent from surface | Start after intent |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
${weeklyReviewRecoveryDiagnostics?.available && weeklyReviewRecoveryDiagnostics.states.length
    ? weeklyReviewRecoveryDiagnostics.states.map((row) => `| ${markdownValue(row.data_state)} | ${display(row.mounted_users)} | ${display(row.mounted_events)} | ${display(row.open_today_users)} | ${display(row.open_today_events)} | ${display(row.started_after_intent_users)} | ${display(row.started_after_intent_events)} | ${row.intent_from_mounted === null ? 'unknown' : `${(row.intent_from_mounted * 100).toFixed(2)}%`} | ${row.start_after_intent === null ? 'unknown' : `${(row.start_after_intent * 100).toFixed(2)}%`} |`).join('\n')
    : `| none | unknown | unknown | unknown | unknown | unknown | unknown | unknown | ${weeklyReviewRecoveryDiagnostics?.quality || 'source missing or empty'} |`}

Intents without a preceding same-state surface: ${display(weeklyReviewRecoveryDiagnostics?.intentsWithoutSurfaceEvents)} event rows across ${display(weeklyReviewRecoveryDiagnostics?.intentsWithoutSurfaceUsers)} installations. Starts without a preceding Weekly Review intent: ${display(weeklyReviewRecoveryDiagnostics?.startsWithoutIntentEvents)} event rows across ${display(weeklyReviewRecoveryDiagnostics?.startsWithoutIntentUsers)} installations.

## Measurement quality

| Layer | Identity fields | Quality status |
| --- | --- | --- |
| Web | ${snapshot.measurement.web?.identity_fields?.join(', ') || 'unknown'} | ${snapshot.measurement.web === null ? 'source missing' : snapshot.measurement.web.missing_session_identity ? 'missing session identity in matched events' : 'identity present'} |
| App | ${snapshot.measurement.app?.identity_fields?.join(', ') || 'unknown'} | ${snapshot.measurement.app === null ? 'source missing' : !snapshot.measurement.app.activation_denominator_available ? 'activation_entry denominator unavailable' : snapshot.measurement.app.missing_installation_identity ? 'missing installation identity in matched events' : snapshot.measurement.app.missing_event_time ? 'event time missing in matched events' : 'identity and time present'} |

Unique-session and unique-installation rates remain unknown when the required
identity or event-time fields are absent. Raw event rows are retained only as
diagnostics and are not used as people or session denominators.

## Web CTA segments

The rows below are the experiment-ready view of CTA exposure and outbound
handoff. An unknown rate means a required identity was missing in that segment.

| Source page | Placement | Experiment | Variant | Hero presentation | Copy version | Viewport | Campaign | CTA-view sessions | Outbound sessions | Qualified outbound sessions | Outbound without CTA view | Qualified intent | Quality |
| --- | --- | --- | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
${ctaSegments.length ? ctaSegments.map((segment) => `| ${markdownValue(segment.source_page)} | ${markdownValue(segment.cta_placement)} | ${markdownValue(segment.experiment_name)} | ${markdownValue(segment.experiment_variant)} | ${markdownValue(segment.hero_presentation)} | ${markdownValue(segment.copy_version)} | ${markdownValue(segment.viewport_class)} | ${markdownValue(segment.app_store_campaign)} | ${markdownValue(segment.cta_viewed_sessions)} | ${markdownValue(segment.outbound_sessions)} | ${markdownValue(segment.qualified_outbound_sessions)} | ${markdownValue(segment.outbound_sessions_without_cta_view)} | ${segment.qualified_store_intent_rate === null ? 'unknown' : `${(segment.qualified_store_intent_rate * 100).toFixed(2)}%`} | ${segment.missing_session_identity ? 'identity missing' : 'usable'} |`).join('\n') : '| none | none | none | none | none | none | none | none | unknown | unknown | unknown | unknown | unknown | source missing or empty |'}

## Web experiment comparisons

These rows compare unique CTA-view sessions, not raw event rows. The primary
rate is outbound sessions that share the same session identity as a CTA view,
divided by CTA-view sessions. A result is only
decision-eligible once both arms reach ${MIN_EXPERIMENT_CTA_VIEW_SESSIONS}
CTA-view sessions and the 95% Newcombe-Wilson interval for treatment minus
control excludes zero. The report does not convert that diagnostic into a
winner.

| Source page | Placement | Experiment | Hero | Copy version | Viewport | Control | Treatment | Control views | Treatment views | Control intent | Treatment intent | Delta | 95% CI delta | Decision | Quality |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
${experimentComparisons.length ? experimentComparisons.map((comparison) => `| ${markdownValue(comparison.source_page)} | ${markdownValue(comparison.cta_placement)} | ${markdownValue(comparison.experiment_name)} | ${markdownValue(comparison.hero_presentation)} | ${markdownValue(comparison.copy_version)} | ${markdownValue(comparison.viewport_class)} | ${markdownValue(comparison.control_variant)} | ${markdownValue(comparison.treatment_variant)} | ${markdownValue(comparison.control_cta_viewed_sessions)} | ${markdownValue(comparison.treatment_cta_viewed_sessions)} | ${comparison.control_rate === null ? 'unknown' : `${(comparison.control_rate * 100).toFixed(2)}%`} | ${comparison.treatment_rate === null ? 'unknown' : `${(comparison.treatment_rate * 100).toFixed(2)}%`} | ${comparison.delta === null ? 'unknown' : `${(comparison.delta * 100).toFixed(2)}%`} | ${comparison.confidence_interval_95 ? `[${(comparison.confidence_interval_95[0] * 100).toFixed(2)}%, ${(comparison.confidence_interval_95[1] * 100).toFixed(2)}%]` : 'unknown'} | ${markdownValue(comparison.decision)} | ${markdownValue(comparison.quality)} |`).join('\n') : '| none | none | none | none | none | none | none | none | unknown | unknown | unknown | unknown | unknown | unknown | source missing or no comparable arms |'}

## App activation paths

activation_entry is the new-user denominator. app_opened remains a launch
diagnostic and is not used to measure onboarding activation because returning
users can also open the app.

| Onboarding path | Activation entries | First-set activated installations | First-set activation rate | Quality |
| --- | ---: | ---: | ---: | --- |
${activationPathSegments.length ? activationPathSegments.map((segment) => `| ${markdownValue(segment.path)} | ${markdownValue(segment.activation_entries)} | ${markdownValue(segment.first_set_activated_installations)} | ${segment.first_set_activation_rate === null ? 'unknown' : `${(segment.first_set_activation_rate * 100).toFixed(2)}%`} | ${segment.path_missing ? 'path missing' : 'usable'} |`).join('\n') : '| none | unknown | unknown | unknown | activation_entry export missing or empty |'}

## App activation by release

Release rows use the first valid activation_entry for each app-scoped
installation. They make build-level activation regressions visible without
turning app version or build into a user identifier.

| App version | App build | Activation entries | First-set activated installations | First-set activation rate | Quality |
| --- | --- | ---: | ---: | ---: | --- |
${activationReleaseSegments.length ? activationReleaseSegments.map((segment) => `| ${markdownValue(segment.app_version)} | ${markdownValue(segment.app_build)} | ${markdownValue(segment.activation_entries)} | ${markdownValue(segment.first_set_activated_installations)} | ${segment.first_set_activation_rate === null ? 'unknown' : `${(segment.first_set_activation_rate * 100).toFixed(2)}%`} | ${segment.release_metadata_missing ? 'release metadata missing' : 'usable'} |`).join('\n') : '| none | none | unknown | unknown | unknown | activation_entry export missing or empty |'}

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

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    console.error(error?.stack || error)
    process.exitCode = 1
  })
}
