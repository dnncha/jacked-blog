import assert from 'node:assert/strict'
import { auditHtml } from './public-brand-check.mjs'

const ready = auditHtml(`
  <html><head><title>Surpass | Workout tracker</title></head>
  <body><header>SURPASS</header><main><h1>Get bigger on purpose.</h1><p>Start with Surpass.</p></main></body></html>
`, { url: 'https://jacked.coach/' })

assert.equal(ready.status, 'pass')
assert.equal(ready.expected_brand_visible, true)
assert.equal(ready.stale_brand_visible, false)

const canonicalDomain = auditHtml(`
  <html><head><title>Support | Surpass</title></head>
  <body><main><h1>Support</h1><p>Email support@jacked.coach for help.</p></main></body></html>
`, { url: 'https://jacked.coach/support/' })

assert.equal(canonicalDomain.status, 'pass')
assert.equal(canonicalDomain.expected_brand_visible, true)
assert.equal(canonicalDomain.stale_brand_visible, false)

const stale = auditHtml(`
  <html><head><title>Jacked | Free Gym Workout Tracker</title></head>
  <body><header>JACKED</header><main><h1>Hit your weekly targets.</h1></main></body></html>
`, { url: 'https://jacked.coach/' })

assert.equal(stale.status, 'fail')
assert.equal(stale.expected_brand_visible, false)
assert.equal(stale.stale_brand_visible, true)
assert.deepEqual(stale.failures, ['missing visible Surpass brand', 'stale visible Jacked brand'])

const unavailable = auditHtml('', { url: 'https://jacked.coach/', httpStatus: 503 })
assert.equal(unavailable.status, 'fail')
assert.deepEqual(unavailable.failures, ['HTTP 503', 'missing visible Surpass brand'])

console.log('public brand check tests passed')
