import assert from 'node:assert/strict'
import { auditAcquisitionConversionHtml, auditHomepageConversionHtml } from './public-conversion-check.mjs'

const fixture = `
  <html>
    <head>
      <style>
        .conversion-dock[aria-hidden="true"] { display: none; }
        .conversion-dock .app-store-button > span { display: block; color: #11100c; }
      </style>
    </head>
    <body>
      <a data-global-cta="homepage_hero" data-experiment="homepage_hero_cta" data-experiment-variant="control" data-experiment-ready="false">Start free on iPhone</a>
      <div class="conversion-dock" aria-hidden="true" aria-label="Download Surpass">
        <a data-global-cta="homepage_mobile_dock" data-experiment="homepage_lower_cta" data-experiment-variant="outcome_v1">Start free</a>
      </div>
    </body>
  </html>
`

const ready = auditHomepageConversionHtml(fixture)
assert.equal(ready.status, 'pass')
assert.equal(ready.hero_experiment_ready_present, true)
assert.equal(ready.mobile_dock_hidden_before_hydration, true)

const stale = auditHomepageConversionHtml(fixture
  .replace('class="conversion-dock" aria-hidden="true"', 'class="conversion-dock"')
  .replace('.conversion-dock[aria-hidden="true"] { display: none; }', '')
  .replace('color: #11100c;', 'color: inherit;'))
assert.equal(stale.status, 'fail')
assert.deepEqual(stale.failures, [
  'homepage mobile conversion dock is not hidden before hydration',
  'homepage mobile dock has no pre-hydration display guard',
  'homepage mobile dock button has no explicit high-contrast label color',
])

const unavailable = auditHomepageConversionHtml('', { httpStatus: 503 })
assert.equal(unavailable.status, 'fail')
assert.ok(unavailable.failures.includes('HTTP 503'))

const acquisitionFixture = `
  <style>
    .acquisition-mobile-dock[aria-hidden="true"] { display: none; }
    .acquisition-mobile-dock-link > span:last-child { display: block; color: #11100c; }
  </style>
  <a data-experiment="acquisition_hero_cta" data-experiment-variant="outcome_v1" data-hero-presentation="screen" data-copy-version="acquisition_promise_v2">Start free</a>
  <a data-app-store-placement="workout_tracker_final">Start free</a>
  <div class="acquisition-mobile-dock" aria-hidden="true">
    <a class="acquisition-mobile-dock-link" data-experiment="acquisition_mobile_cta" data-experiment-variant="sticky_outcome_v1"><span>Start free</span></a>
  </div>
`

const acquisitionReady = auditAcquisitionConversionHtml(acquisitionFixture, { url: 'https://jacked.coach/workout-tracker' })
assert.equal(acquisitionReady.status, 'pass')
assert.equal(acquisitionReady.final_cta_present, true)
assert.equal(acquisitionReady.mobile_dock_hidden_before_hydration, true)

const acquisitionMissing = auditAcquisitionConversionHtml(acquisitionFixture
  .replace('data-experiment-variant="sticky_outcome_v1"', '')
  .replace('.acquisition-mobile-dock[aria-hidden="true"] { display: none; }', ''), {
    url: 'https://jacked.coach/workout-tracker',
  })
assert.equal(acquisitionMissing.status, 'fail')
assert.ok(acquisitionMissing.failures.includes('acquisition mobile dock CTA is missing its outcome variant'))
assert.ok(acquisitionMissing.failures.includes('acquisition mobile dock has no pre-hydration display guard'))

console.log('public conversion check tests passed')
