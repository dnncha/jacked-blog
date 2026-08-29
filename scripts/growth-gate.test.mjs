import assert from 'node:assert/strict'
import test from 'node:test'
import { summarizeGrowthGate } from './growth-gate.mjs'

const passingChecks = [
  { name: 'public_brand', layer: 'release', status: 'pass', result: { status: 'pass' } },
  { name: 'public_conversion', layer: 'release', status: 'pass', result: { status: 'pass' } },
  { name: 'public_app_store', layer: 'release', status: 'pass', result: { status: 'pass' } },
  { name: 'public_brand_crawl', layer: 'release', status: 'pass', result: { status: 'ready' } },
  { name: 'seo_audit', layer: 'release', status: 'pass', result: { status: 'pass' } },
  { name: 'acquisition_report', layer: 'measurement', status: 'pass', result: { status: 'ready' } },
]

test('growth gate passes only when release and measurement layers pass', () => {
  const summary = summarizeGrowthGate(passingChecks)
  assert.equal(summary.status, 'pass')
  assert.equal(summary.release_status, 'pass')
  assert.equal(summary.measurement_status, 'pass')
  assert.deepEqual(summary.release_blockers, [])
  assert.deepEqual(summary.measurement_blockers, [])
})

test('growth gate keeps public blockers separate from missing measurement inputs', () => {
  const summary = summarizeGrowthGate([
    ...passingChecks.map((check) => check.name === 'public_conversion'
      ? { ...check, status: 'blocked', result: { status: 'fail', failures: ['stale public bundle'] } }
      : check.name === 'acquisition_report'
        ? { ...check, status: 'blocked', result: { status: 'blocked' } }
        : check),
  ])
  assert.equal(summary.status, 'blocked')
  assert.equal(summary.release_status, 'blocked')
  assert.equal(summary.measurement_status, 'blocked')
  assert.equal(summary.release_blockers[0].name, 'public_conversion')
  assert.equal(summary.measurement_blockers[0].name, 'acquisition_report')
})

test('an explicitly skipped crawl is not reported as a release blocker', () => {
  const summary = summarizeGrowthGate(passingChecks.map((check) => check.name === 'public_brand_crawl'
    ? { ...check, status: 'skipped', result: null }
    : check))
  assert.equal(summary.status, 'pass')
  assert.deepEqual(summary.release_blockers, [])
})

console.log('growth gate tests passed')
