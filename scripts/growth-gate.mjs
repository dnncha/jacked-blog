#!/usr/bin/env node

import { spawn } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const scriptsRoot = path.join(root, 'scripts')
const reportPath = path.join(root, 'reports', 'acquisition', 'growth-gate-latest.json')

const CHECK_DEFINITIONS = Object.freeze([
  { name: 'public_brand', layer: 'release', script: 'public-brand-check.mjs' },
  { name: 'public_conversion', layer: 'release', script: 'public-conversion-check.mjs' },
  { name: 'public_app_store', layer: 'release', script: 'public-app-store-check.mjs' },
  { name: 'public_brand_crawl', layer: 'release', script: 'public-brand-crawl.mjs' },
  { name: 'seo_audit', layer: 'release', script: 'seo-audit.mjs' },
  { name: 'acquisition_report', layer: 'measurement', script: 'acquisition-report.mjs' },
])

function parseArgs(argv) {
  const result = {}
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]
    if (!argument.startsWith('--')) continue
    const [rawKey, inline] = argument.slice(2).split('=', 2)
    const key = rawKey.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
    if (inline !== undefined) result[key] = inline
    else if (argv[index + 1] && !argv[index + 1].startsWith('--')) result[key] = argv[++index]
    else result[key] = true
  }
  return result
}

function tail(value, maxLength = 1200) {
  const normalized = String(value || '').trim()
  return normalized.length > maxLength ? normalized.slice(-maxLength) : normalized
}

function parseJsonOutput(output) {
  const source = String(output || '').trim()
  if (!source) return null

  try {
    return JSON.parse(source)
  } catch {
    // Some local runners prepend a warning. Try each object boundary while
    // keeping the parser dependency-free and bounded to stdout.
  }

  const starts = [...source.matchAll(/(?:^|\n)\s*([{[])/g)].map((match) => match.index + match[0].length - 1)
  for (const start of starts) {
    try {
      return JSON.parse(source.slice(start))
    } catch {
      // Keep looking for the first complete JSON document.
    }
  }
  return null
}

function statusForCheck(name, parsed, { exitCode, timedOut }) {
  if (timedOut || !parsed) return 'error'
  if (name === 'seo_audit') {
    return parsed.blocked === 0
      && parsed.notAudited === 0
      && parsed.brokenInternalLinks === 0
      && parsed.noindexInSitemap === 0
      ? 'pass'
      : 'blocked'
  }
  if (name === 'public_brand_crawl') return parsed.status === 'ready' ? 'pass' : 'blocked'
  if (name === 'public_brand') return parsed.status === 'ready' ? 'pass' : 'blocked'
  if (name === 'acquisition_report') return parsed.status === 'ready' ? 'pass' : 'blocked'
  return parsed.status === 'pass' && exitCode === 0 ? 'pass' : 'blocked'
}

function runCheck(definition, { timeoutMs }) {
  return new Promise((resolve) => {
    const startedAt = Date.now()
    const child = spawn(process.execPath, [path.join(scriptsRoot, definition.script)], {
      cwd: root,
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    let stdout = ''
    let stderr = ''
    let timedOut = false
    const timer = setTimeout(() => {
      timedOut = true
      child.kill('SIGTERM')
    }, timeoutMs)

    child.stdout.on('data', (chunk) => { stdout += chunk })
    child.stderr.on('data', (chunk) => { stderr += chunk })
    child.on('error', (error) => {
      clearTimeout(timer)
      resolve({
        ...definition,
        status: 'error',
        exit_code: null,
        signal: null,
        duration_ms: Date.now() - startedAt,
        result: null,
        error: error?.message || String(error),
        stderr: tail(stderr),
      })
    })
    child.on('close', (exitCode, signal) => {
      clearTimeout(timer)
      const result = parseJsonOutput(stdout)
      const status = statusForCheck(definition.name, result, { exitCode, timedOut })
      resolve({
        ...definition,
        status,
        exit_code: exitCode,
        signal,
        duration_ms: Date.now() - startedAt,
        result,
        ...(timedOut ? { error: `timed out after ${timeoutMs}ms` } : {}),
        ...(stderr.trim() ? { stderr: tail(stderr) } : {}),
      })
    })
  })
}

/**
 * Combine release and measurement checks without collapsing missing
 * connectors into zero traffic or treating an omitted optional crawl as a
 * failure. This is the decision boundary consumed by CI and owner handoff.
 */
export function summarizeGrowthGate(checks) {
  const releaseChecks = checks.filter((check) => check.layer === 'release' && check.status !== 'skipped')
  const measurementChecks = checks.filter((check) => check.layer === 'measurement' && check.status !== 'skipped')
  const releaseBlockers = releaseChecks.filter((check) => check.status !== 'pass')
  const measurementBlockers = measurementChecks.filter((check) => check.status !== 'pass')

  const blocker = (check) => ({
    name: check.name,
    status: check.status,
    failures: check.result?.failures || [],
    source_status: check.result?.status || null,
    error: check.error || null,
  })

  return {
    status: releaseBlockers.length || measurementBlockers.length ? 'blocked' : 'pass',
    release_status: releaseBlockers.length ? 'blocked' : 'pass',
    measurement_status: measurementBlockers.length ? 'blocked' : 'pass',
    release_blockers: releaseBlockers.map(blocker),
    measurement_blockers: measurementBlockers.map(blocker),
    checks,
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const timeoutMs = Math.max(5_000, Number(options.timeoutMs || 120_000))
  const skipCrawl = options.skipCrawl === true || options.skipCrawl === 'true'
  const definitions = CHECK_DEFINITIONS.filter((definition) => !(skipCrawl && definition.name === 'public_brand_crawl'))
  const checks = await Promise.all(definitions.map((definition) => runCheck(definition, { timeoutMs })))
  if (skipCrawl) {
    checks.push({
      name: 'public_brand_crawl',
      layer: 'release',
      script: 'public-brand-crawl.mjs',
      status: 'skipped',
      exit_code: null,
      signal: null,
      duration_ms: 0,
      result: null,
      error: 'skipped by --skip-crawl',
    })
  }

  const summary = summarizeGrowthGate(checks)
  const report = {
    generated_at: new Date().toISOString(),
    base_url: process.env.PUBLIC_BRAND_CHECK_BASE_URL || 'https://jacked.coach',
    timeout_ms: timeoutMs,
    crawl_skipped: skipCrawl,
    ...summary,
  }

  await fs.mkdir(path.dirname(reportPath), { recursive: true })
  await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`)
  console.log(JSON.stringify(report, null, 2))
  if (report.status !== 'pass') process.exitCode = 1
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error?.stack || error)
    process.exitCode = 1
  })
}
