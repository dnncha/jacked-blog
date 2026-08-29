import assert from 'node:assert/strict'
import { auditAppStoreHtml, currentVersionEntry } from './public-app-store-check.mjs'

const fixture = `
  <html>
    <head>
      <title>Surpass: Strength Training App - App Store</title>
      <link rel="canonical" href="https://apps.apple.com/us/app/surpass-strength-training/id6757132605">
      <script type="application/ld+json">{"@type":"SoftwareApplication","name":"Surpass: Strength Training","description":"Make every working set count.\\n\\nSurpass is a strength-training tracker."}</script>
    </head>
    <body>
      <p class="subtitle">Get bigger on purpose.</p>
      <h1>Version History</h1>
      <ul>
        <li><div><p>Cleaner workout recovery and clearer next targets.</p><span>4.0.3</span><time>today</time></div></li>
        <li><div><p>Jacked is now Surpass.</p><span>4.0.2</span><time>yesterday</time></div></li>
      </ul>
    </body>
  </html>
`

const current = currentVersionEntry(fixture)
assert.deepEqual(current, {
  version: '4.0.3',
  note: 'Cleaner workout recovery and clearer next targets.',
})

const ready = auditAppStoreHtml(fixture)
assert.equal(ready.status, 'pass')
assert.equal(ready.current_version, '4.0.3')
assert.equal(ready.current_note_has_stale_brand, false)
assert.equal(ready.description_repeats_subtitle, false)
assert.equal(ready.description_has_retired_onboarding_promise, false)

const stale = auditAppStoreHtml(fixture.replace('Cleaner workout recovery and clearer next targets.', 'Jacked is now Surpass.'))
assert.equal(stale.status, 'fail')
assert.deepEqual(stale.failures, ['current version note contains stale Jacked brand'])

const repeatedPromise = auditAppStoreHtml(fixture.replace('Make every working set count.', 'Get bigger on purpose.'))
assert.equal(repeatedPromise.status, 'fail')
assert.deepEqual(repeatedPromise.failures, ['description repeats the App Store subtitle as its opening line'])

const retiredOnboardingPromise = auditAppStoreHtml(fixture.replace('Surpass is a strength-training tracker.', 'Surpass is a strength-training tracker. Start with Quick Start or answer four setup questions.'))
assert.equal(retiredOnboardingPromise.status, 'fail')
assert.deepEqual(retiredOnboardingPromise.failures, ['description contains the retired Quick Start/four-question onboarding promise'])

const unavailable = auditAppStoreHtml('', { httpStatus: 503 })
assert.equal(unavailable.status, 'fail')
assert.ok(unavailable.failures.includes('HTTP 503'))

console.log('public App Store check tests passed')
