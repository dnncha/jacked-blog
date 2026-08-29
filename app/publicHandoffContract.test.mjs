import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const [aboutSource, pressSource, proofSource] = await Promise.all([
  readFile(new URL('./about/page.js', import.meta.url), 'utf8'),
  readFile(new URL('./press/page.js', import.meta.url), 'utf8'),
  readFile(new URL('./proof/proof.client.js', import.meta.url), 'utf8'),
])

assert.match(aboutSource, /ct=surpass_coach_about&mt=8/)
assert.match(aboutSource, /data-app-store-placement="about_final"/)
assert.match(aboutSource, /data-copy-version="about_promise_v1"/)
assert.match(aboutSource, /Start free on iPhone/)
assert.doesNotMatch(aboutSource, /Open the App Store listing/)

assert.match(pressSource, /ct=press_kit&mt=8/)
assert.match(pressSource, /data-app-store-placement="press_kit_hero"/)
assert.match(pressSource, /data-copy-version="press_promise_v1"/)
assert.match(pressSource, /Start free on iPhone/)
assert.doesNotMatch(pressSource, /View Surpass on the App Store/)

assert.match(proofSource, /data-app-store-placement="invalid_proof"/)
assert.match(proofSource, /data-app-store-placement="proof_public"/)
assert.match(proofSource, /data-copy-version="proof_promise_v1"/)
assert.match(proofSource, /Start free on iPhone/)
assert.doesNotMatch(proofSource, /View Surpass on the App Store/)

console.log('public handoff contract checks passed')
