import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'

const [webSource, layoutSource, calculatorSource, toolDataSource] = await Promise.all([
  readFile(new URL('./components/WebAnalytics.js', import.meta.url), 'utf8'),
  readFile(new URL('./layout.js', import.meta.url), 'utf8'),
  readFile(new URL('./tools/ToolCalculator.js', import.meta.url), 'utf8'),
  readFile(new URL('./tools/toolData.mjs', import.meta.url), 'utf8'),
])

assert.match(webSource, /'use client'/, 'web analytics must be a client component')
for (const eventName of [
  'web_page_view',
  'web_navigation_clicked',
  'tool_started',
  'tool_completed',
  'import_checker_completed',
  'app_store_outbound_clicked',
  'web_error_visible',
]) {
  assert.ok(webSource.includes(eventName) || calculatorSource.includes(eventName), `${eventName} should be defined`)
}

assert.match(webSource, /history\.pushState/, 'Next Link navigation should be observed through history changes')
assert.match(webSource, /history\.replaceState/, 'replaceState route changes should be observed')
assert.match(webSource, /addEventListener\('popstate'/, 'back/forward route changes should be observed')
assert.match(webSource, /createPageViewTracker/, 'page views should use a dedupe tracker')
assert.match(webSource, /const seenKeys = new Set\(\)/, 'page-view dedupe should survive strict-mode effect replay')
assert.match(webSource, /app_store_outbound_clicked/, 'App Store outbound intent should be canonical')
assert.match(webSource, /source_page: current\.pathname/, 'App Store events should identify their source page')
assert.match(webSource, /cta_placement/, 'App Store events should identify CTA placement')
assert.match(webSource, /apple_provider_token/, 'App Store events should retain the Apple provider token')
assert.match(webSource, /trackSafely/, 'analytics calls should fail harmlessly')

assert.match(layoutSource, /mixpanel\.init/, 'Mixpanel initialization should remain present')
assert.match(layoutSource, /api_host:'https:\/\/api-eu\.mixpanel\.com'/, 'the EU Mixpanel host must remain configured')
assert.match(layoutSource, /<WebAnalytics \/>/, 'the explicit page-view component should be mounted globally')
assert.match(layoutSource, /pt=128406689&ct=smart_banner&mt=8/, 'the Smart App Banner provider and campaign tokens must remain')

assert.match(toolDataSource, /APP_STORE_PROVIDER_TOKEN = '128406689'/, 'tool URLs must retain the Apple provider token')
assert.match(toolDataSource, /pt: APP_STORE_PROVIDER_TOKEN/, 'tool URLs must include the Apple provider token')
assert.match(toolDataSource, /ct: campaign/, 'tool URLs must include a deterministic campaign')
assert.match(toolDataSource, /mt: '8'/, 'tool URLs must retain Apple media type')

const analyticsStart = calculatorSource.indexOf('function analyticsProps')
const analyticsEnd = calculatorSource.indexOf('\n}\n\nfunction completionProps', analyticsStart)
assert.ok(analyticsStart >= 0 && analyticsEnd > analyticsStart, 'calculator analytics helper should remain easy to audit')
const analyticsBlock = calculatorSource.slice(analyticsStart, analyticsEnd)
for (const rawField of ['csvText', 'exercise', 'weight', 'reps', 'bodyweight', 'age', 'email', 'health']) {
  assert.doesNotMatch(analyticsBlock, new RegExp(`values\\.${rawField}\\b`), `${rawField} must not enter calculator analytics`)
}
assert.match(calculatorSource, /track\('tool_completed', props\)/, 'completed calculators should send the sanitized payload')
assert.match(calculatorSource, /track\('import_checker_completed', props\)/, 'CSV checkers should have a canonical completion event')
assert.doesNotMatch(calculatorSource, /track\('tool_completed', analyticsProps\(tool, values\)\)/, 'completion must not send raw form values')

const utilityProbe = `
  import assert from 'node:assert/strict'
  import {
    appStoreAttribution,
    buildPageViewProperties,
    captureAttribution,
    createPageViewTracker,
    trackSafely,
  } from './app/components/WebAnalytics.js'

  const calls = []
  const tracker = createPageViewTracker((name, properties) => {
    calls.push({ name, properties })
    return true
  })
  const page = { pathname: '/tools/next-set-calculator', search: '?utm_source=google&range=5-8' }
  assert.equal(tracker.track({ ...page, properties: { pathname: page.pathname } }), true)
  assert.equal(tracker.track({ ...page, properties: { pathname: page.pathname } }), false)
  assert.equal(tracker.track({ ...page, search: '?utm_source=newsletter&range=5-8', properties: { pathname: page.pathname } }), false)
  assert.equal(tracker.track({ ...page, search: '?range=8-12', properties: { pathname: page.pathname } }), true)
  assert.equal(calls.filter((call) => call.name === 'web_page_view').length, 2)

  class Storage {
    values = new Map()
    getItem(key) { return this.values.get(key) ?? null }
    setItem(key, value) { this.values.set(key, String(value)) }
  }
  const storage = new Storage()
  const firstVisit = captureAttribution({
    pathname: '/hevy-alternative',
    search: '?utm_source=google&utm_medium=organic&utm_campaign=launch&app_store_campaign=hevy_alternative_hero',
  }, storage)
  const secondVisit = captureAttribution({
    pathname: '/tools/hevy-import-checker',
    search: '?utm_source=newsletter&utm_medium=email&utm_campaign=followup&utm_content=result',
  }, storage)
  assert.equal(firstVisit.first.utm_campaign, 'launch')
  assert.equal(firstVisit.first.app_store_campaign, 'hevy_alternative_hero')
  assert.equal(secondVisit.first.utm_source, 'google')
  assert.equal(secondVisit.last.utm_source, 'newsletter')
  assert.equal(storage.getItem('jacked:attribution:landing-page'), '/hevy-alternative')

  const properties = buildPageViewProperties({
    pathname: '/tools/hevy-import-checker',
    search: '?utm_source=newsletter',
    referrer: 'https://google.example/search?email=person@example.com',
    viewportWidth: 390,
    attribution: secondVisit,
  })
  assert.equal(properties.pathname, '/tools/hevy-import-checker')
  assert.equal(properties.canonical_url, 'https://jacked.coach/tools/hevy-import-checker')
  assert.equal(properties.page_type, 'tool')
  assert.equal(properties.tool_name, 'hevy-import-checker')
  assert.equal(properties.referrer, 'https://google.example')
  assert.equal(properties.referrer_domain, 'google.example')
  assert.equal(properties.viewport_class, 'mobile')
  assert.equal(properties.first_touch_utm_source, 'google')
  assert.equal(properties.last_touch_utm_campaign, 'followup')
  assert.ok(!JSON.stringify(properties).includes('person@example.com'))

  assert.deepEqual(appStoreAttribution('https://apps.apple.com/app/apple-store/id6757132605?pt=128406689&ct=homepage_hero&mt=8'), {
    provider_token: '128406689',
    app_store_campaign: 'homepage_hero',
  })
  assert.equal(trackSafely('web_page_view', {}, undefined), false)
`

execFileSync(process.execPath, [
  '--input-type=module',
  '-e',
  utilityProbe,
], { cwd: new URL('..', import.meta.url), stdio: 'inherit' })

console.log('web analytics tests passed')
