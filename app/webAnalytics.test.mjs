import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'

const [webSource, layoutSource, calculatorSource, toolDataSource, pageSource, toolPageSource, toolsHubSource] = await Promise.all([
  readFile(new URL('./components/WebAnalytics.js', import.meta.url), 'utf8'),
  readFile(new URL('./layout.js', import.meta.url), 'utf8'),
  readFile(new URL('./tools/ToolCalculator.js', import.meta.url), 'utf8'),
  readFile(new URL('./tools/toolData.mjs', import.meta.url), 'utf8'),
  readFile(new URL('./page.client.js', import.meta.url), 'utf8'),
  readFile(new URL('./tools/[slug]/page.js', import.meta.url), 'utf8'),
  readFile(new URL('./tools/page.js', import.meta.url), 'utf8'),
])

assert.match(webSource, /'use client'/, 'web analytics must be a client component')
for (const eventName of [
  'web_page_view',
  'web_navigation_clicked',
  'tool_started',
  'tool_completed',
  'import_checker_completed',
  'app_store_outbound_clicked',
  'web_session_started',
  'web_cta_viewed',
  'web_scroll_depth',
  'web_vital_measured',
  'web_media_viewed',
  'web_video_played',
  'web_video_completed',
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
assert.match(webSource, /seenOutboundClickKeysRef/, 'App Store outbound intent should be deduplicated within a page session')
assert.match(webSource, /outboundClickKey/, 'App Store outbound dedupe should use a canonical key')
assert.match(webSource, /source_page: current\.pathname/, 'App Store events should identify their source page')
assert.match(webSource, /cta_placement/, 'App Store events should identify CTA placement')
assert.match(webSource, /apple_provider_token/, 'App Store events should retain the Apple provider token')
assert.match(webSource, /trackSafely/, 'analytics calls should fail harmlessly')
assert.match(webSource, /registerWebAnalyticsContext/, 'Mixpanel should receive stable context properties')
assert.match(webSource, /register_once/, 'first-touch attribution should be registered once')
assert.match(webSource, /IntersectionObserver/, 'CTA impressions should use viewport visibility')
assert.match(webSource, /SESSION_STARTED_STORAGE_KEY/, 'sessions should be deduplicated without an account')
assert.match(webSource, /SESSION_ID_STORAGE_KEY/, 'web events should carry an ephemeral session key for unique-session reporting')
assert.match(webSource, /SESSION_LAST_ACTIVITY_STORAGE_KEY/, 'sessions should retain only a bounded activity timestamp')
assert.match(webSource, /SESSION_TIMEOUT_MS/, 'session boundaries should use an explicit inactivity window')
assert.match(webSource, /prepareSession/, 'session identity should rotate after inactivity')
assert.match(webSource, /sessionIdentifier/, 'web session identifiers should be created and reused within a browser session')
assert.match(webSource, /currentPageWithSession/, 'interactions after inactivity should create a measurable session before conversion events')
assert.match(webSource, /depth_bucket/, 'scroll depth should be bucketed')
assert.match(webSource, /data-analytics-video/, 'video events should use explicit markers')
assert.match(webSource, /PerformanceObserver/, 'field web vitals should use the browser performance API')
assert.match(webSource, /metric_rating/, 'field web vitals should include a bounded rating')
assert.match(webSource, /metric_unit/, 'field web vitals should declare their unit')
assert.match(webSource, /experimentProperties/, 'controlled CTA experiments should carry explicit markers')
assert.match(webSource, /experiment_variant/, 'controlled CTA events should identify their assigned variant')
assert.match(webSource, /hero_presentation/, 'acquisition CTA events should retain the bounded hero presentation')
assert.match(webSource, /copy_version/, 'CTA events should retain the bounded creative message version')
assert.match(webSource, /pre-hydration click/, 'pre-hydration experiment clicks must not be attributed to a default arm')
assert.match(webSource, /if \(!experimentReady\(anchor\)\) return/, 'outbound clicks must wait for experiment assignment')
assert.match(webSource, /if \(!experimentReady\(anchor\)\) continue/, 'CTA impressions must not be marked observed before experiment assignment')
assert.match(webSource, /attributeFilter: \['data-experiment-ready'\]/, 'CTA assignment changes must trigger a fresh observation pass')

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
assert.match(calculatorSource, /share_method/, 'tool sharing should identify the successful method')
assert.match(calculatorSource, /Start free on iPhone/, 'tool results should use the current outcome-led App Store copy')
assert.match(calculatorSource, /data-tool-completion-state/, 'tool result CTAs should expose completion state for denominator-safe analysis')
assert.match(calculatorSource, /tool_result_handoff/, 'tool result CTAs should carry the handoff experiment marker')
assert.match(webSource, /toolCompletionProperties/, 'App Store events should retain bounded tool completion state')
assert.match(toolPageSource, /Start free on iPhone/, 'tool final CTAs should use the current outcome-led App Store copy')
assert.match(toolPageSource, /data-app-store-placement=\{`tools_\$\{tool\.campaign\}_final`\}/, 'tool final CTAs should retain a campaign-specific placement')
assert.doesNotMatch(toolPageSource, /Download Surpass for iPhone/, 'tool pages should not retain generic download CTA copy')
assert.match(toolsHubSource, /data-app-store-placement="tools_hub_final"/, 'tools hub CTA should retain a measurable placement')
assert.match(toolsHubSource, /Start free on iPhone/, 'tools hub CTA should use the current outcome-led App Store copy')
assert.doesNotMatch(toolsHubSource, /Download Surpass for iPhone/, 'tools hub should not retain generic download CTA copy')
assert.match(pageSource, /data-analytics-media="app_preview"/, 'the app preview should be measurable')
assert.match(pageSource, /name: 'homepage_hero_cta'/, 'the homepage hero should identify its current experiment')
assert.match(pageSource, /variant: 'control'/, 'the homepage hero should define its control variant')
assert.match(pageSource, /variant: 'outcome_v1'/, 'the homepage hero should define its treatment variant')
assert.match(pageSource, /data-experiment-ready/, 'the homepage hero should delay CTA exposure until assignment is ready')

const utilityProbe = `
  import assert from 'node:assert/strict'
  import {
    appStoreAttribution,
    buildPageViewProperties,
    captureAttribution,
    ctaViewKey,
    createPageViewTracker,
    experimentProperties,
    experimentReady,
    outboundClickKey,
    prepareSession,
    registerWebAnalyticsContext,
    sessionIdentifier,
    LANDING_PAGE_STORAGE_KEY,
    SESSION_ID_STORAGE_KEY,
    SESSION_TIMEOUT_MS,
    SESSION_STARTED_STORAGE_KEY,
    trackSafely,
  toolCompletionProperties,
  webVitalProperties,
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
  const sessionId = sessionIdentifier(storage)
  assert.match(sessionId, /^[A-Za-z0-9][A-Za-z0-9._~:/+-]*$/)
  assert.equal(sessionIdentifier(storage), sessionId)
  assert.equal(sessionIdentifier(null), sessionIdentifier(null), 'blocked session storage should still reuse an in-memory session key')

  const sessionState = new Storage()
  const firstSession = prepareSession(sessionState, 1_000)
  const continuedSession = prepareSession(sessionState, 1_000 + SESSION_TIMEOUT_MS - 1)
  const expiredSession = prepareSession(sessionState, 1_000 + SESSION_TIMEOUT_MS - 1 + SESSION_TIMEOUT_MS)
  assert.equal(continuedSession, firstSession, 'active sessions should retain their ephemeral identity')
  assert.notEqual(expiredSession, firstSession, 'inactive sessions should rotate their ephemeral identity')
  assert.equal(sessionState.getItem(SESSION_STARTED_STORAGE_KEY), '', 'rotating a session should require a fresh session-start event')
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
  assert.equal(storage.getItem(LANDING_PAGE_STORAGE_KEY), '/hevy-alternative')

  const legacyStorage = new Storage()
  legacyStorage.setItem('jacked:analytics:session-id', 'legacy-session-1')
  assert.equal(sessionIdentifier(legacyStorage), 'legacy-session-1')
  assert.equal(legacyStorage.getItem(SESSION_ID_STORAGE_KEY), 'legacy-session-1')
  assert.equal(legacyStorage.getItem('jacked:analytics:session-id'), '')

  const properties = buildPageViewProperties({
    pathname: '/tools/hevy-import-checker',
    search: '?utm_source=newsletter',
    referrer: 'https://google.example/search?email=person@example.com',
    viewportWidth: 390,
    attribution: secondVisit,
    sessionId,
  })
  assert.equal(properties.pathname, '/tools/hevy-import-checker')
  assert.equal(properties.canonical_url, 'https://jacked.coach/tools/hevy-import-checker')
  assert.equal(properties.page_type, 'tool')
  assert.equal(properties.tool_name, 'hevy-import-checker')
  assert.equal(properties.referrer, 'https://google.example')
  assert.equal(properties.referrer_domain, 'google.example')
  assert.equal(properties.viewport_class, 'mobile')
  assert.equal(properties.session_id, sessionId)
  assert.equal(properties.first_touch_utm_source, 'google')
  assert.equal(properties.last_touch_utm_campaign, 'followup')
  assert.ok(!JSON.stringify(properties).includes('person@example.com'))

  assert.deepEqual(appStoreAttribution('https://apps.apple.com/app/apple-store/id6757132605?pt=128406689&ct=homepage_hero&mt=8'), {
    provider_token: '128406689',
    app_store_campaign: 'homepage_hero',
  })
  assert.equal(
    outboundClickKey({ pathname: '/workout-tracker', search: '?utm_source=google&range=5-8', placement: 'seo_workout_tracker_hero', appStoreCampaign: 'seo_workout_tracker' }),
    '/workout-tracker?range=5-8:seo_workout_tracker_hero:seo_workout_tracker',
  )
  assert.equal(
    outboundClickKey({ pathname: '/workout-tracker', search: '?range=5-8&utm_source=other', placement: 'seo_workout_tracker_hero', appStoreCampaign: 'seo_workout_tracker' }),
    '/workout-tracker?range=5-8:seo_workout_tracker_hero:seo_workout_tracker',
    'attribution-only query changes should not create a second outbound-click key',
  )
  assert.equal(
    ctaViewKey({
      pathname: '/',
      placement: 'homepage_hero',
      experimentName: 'homepage_hero_cta',
      experimentVariant: 'outcome_v1',
      appStoreCampaign: 'surpass_coach_home_hero_outcome_v1',
    }),
    '/:homepage_hero:homepage_hero_cta:outcome_v1:surpass_coach_home_hero_outcome_v1',
    'CTA exposure identity must retain variant and campaign so assignment changes cannot be merged',
  )
  assert.equal(trackSafely('web_page_view', {}, undefined), false)

  const experimentAnchor = {
    getAttribute(name) {
      return {
        'data-experiment': 'homepage_hero_cta',
        'data-experiment-variant': 'control',
        'data-hero-presentation': 'screen',
        'data-copy-version': 'home_promise_v2',
      }[name] || null
    },
  }
  assert.deepEqual(experimentProperties(experimentAnchor), {
    experiment_name: 'homepage_hero_cta',
    experiment_variant: 'control',
    hero_presentation: 'screen',
    copy_version: 'home_promise_v2',
  })
  assert.equal(experimentReady(experimentAnchor), true)
  assert.equal(experimentReady({ getAttribute(name) { return name === 'data-experiment-ready' ? 'false' : null } }), false)
  assert.deepEqual(experimentProperties({ getAttribute: () => 'https://not-allowed.example' }), {})
  assert.deepEqual(toolCompletionProperties({
    getAttribute(name) { return name === 'data-tool-completion-state' ? 'completed' : null }
  }), { tool_completion_state: 'completed' })

  assert.deepEqual(webVitalProperties('LCP', 2499.7), {
    metric_name: 'LCP',
    metric_value: 2500,
    metric_rating: 'good',
    metric_unit: 'ms',
  })
  assert.deepEqual(webVitalProperties('CLS', 0.12345), {
    metric_name: 'CLS',
    metric_value: 0.123,
    metric_rating: 'needs_improvement',
    metric_unit: 'score',
  })
  assert.equal(webVitalProperties('INP', -1), null)
  assert.equal(webVitalProperties('URL', 100), null)

  const registrations = []
  const mixpanel = {
    register(properties) { registrations.push(['register', properties]) },
    register_once(properties) { registrations.push(['register_once', properties]) },
  }
  assert.equal(registerWebAnalyticsContext(mixpanel, {
    landing_page: '/workout-tracker',
    viewport_class: 'mobile',
    first_touch_utm_source: 'google',
    last_touch_utm_campaign: 'followup',
  }), true)
  assert.equal(registrations[0][1].analytics_schema_version, '2')
  assert.equal(registrations[0][1].platform, 'web')
  assert.equal(registrations[0][1].landing_page, '/workout-tracker')
  assert.equal(registrations[1][1].first_touch_utm_source, 'google')
`

execFileSync(process.execPath, [
  '--input-type=module',
  '-e',
  utilityProbe,
], { cwd: new URL('..', import.meta.url), stdio: 'inherit' })

console.log('web analytics tests passed')
