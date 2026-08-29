import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const paths = [
  './tiktok/page.js',
  './tiktok/TikTokLandingClient.js',
  './tiktok/TikTokLanding.module.css',
  './tiktok/app-store/page.js',
  './tiktok/app-store/AppStoreRedirectClient.js',
]

const sources = Object.fromEntries(await Promise.all(paths.map(async path => [path, await readFile(new URL(path, import.meta.url), 'utf8')])))
const all = Object.values(sources).join('\n')
const client = sources['./tiktok/TikTokLandingClient.js']
const styles = sources['./tiktok/TikTokLanding.module.css']

for (const phrase of [
  'Get bigger on purpose.',
  'Built for iPhone',
  'Choose what you want to change.',
  'Free to download',
  'No account required',
  'Requires iOS 17 or later',
  'Real Surpass interface. Prepared session preview.',
]) {
  assert.ok(all.includes(phrase), `TikTok landing path should contain: ${phrase}`)
}

assert.match(client, /<img[\s\S]*surpass-build-home\.png[\s\S]*alt=/, 'TikTok landing path should show a current Surpass product screen')
assert.ok(client.includes('/marketing/surpass-build-home.png'), 'TikTok landing path should use the verified Surpass app screen')
assert.ok(client.includes('tiktok_landing_view'), 'TikTok landing path should measure visits')
assert.ok(client.includes('tiktok_landing_cta'), 'TikTok landing path should measure App Store intent')
assert.ok(client.includes('WEB_ANALYTICS_SCHEMA_VERSION'), 'TikTok diagnostics should carry the shared web analytics schema version')
assert.ok(client.includes('buildPageViewProperties'), 'TikTok diagnostics should carry canonical page context and attribution')
assert.ok(client.includes('trackSafely'), 'TikTok diagnostics should use the shared safe tracking boundary')
assert.ok(client.includes('source_page: pathname'), 'TikTok diagnostics should identify the campaign landing page without sending a raw destination URL')
assert.ok(client.includes("params.get('creative')"), 'TikTok landing path should preserve creative-level attribution')
assert.ok(client.includes('sanitizeAnalyticsValue'), 'TikTok landing attribution should use the shared privacy-safe token sanitizer')
assert.ok(client.includes('data-app-store-placement'), 'TikTok landing CTAs should expose a canonical CTA placement')
assert.ok(client.includes('data-app-store-campaign'), 'TikTok landing CTAs should expose their App Store campaign')
assert.ok(client.includes('data-experiment="tiktok_landing_cta"'), 'TikTok landing CTAs should identify the controlled experiment')
assert.ok(client.includes('data-copy-version={COPY_VERSION}'), 'TikTok landing CTAs should expose the bounded promise version')
assert.ok(client.includes('copy_version: COPY_VERSION'), 'TikTok landing diagnostics should retain the bounded promise version')
assert.ok(client.includes('ct=surpass_coach_tiktok_landing&mt=8'), 'landing CTA should use its own App Store campaign')
assert.ok(sources['./tiktok/app-store/AppStoreRedirectClient.js'].includes('ct=surpass_coach_tiktok_direct&mt=8'), 'direct App Store test path should use a separate campaign')
assert.ok(sources['./tiktok/app-store/AppStoreRedirectClient.js'].includes("'app_store_outbound_clicked'"), 'direct App Store handoff should use the canonical outbound event')
assert.ok(sources['./tiktok/app-store/AppStoreRedirectClient.js'].includes('currentSessionIdentifier'), 'direct App Store handoff should carry the ephemeral web session key')
assert.ok(sources['./tiktok/app-store/AppStoreRedirectClient.js'].includes('WEB_ANALYTICS_SCHEMA_VERSION'), 'direct App Store handoff should carry the shared web analytics schema version')
assert.ok(sources['./tiktok/app-store/AppStoreRedirectClient.js'].includes('buildPageViewProperties'), 'direct App Store handoff should carry canonical page context and viewport attribution')
assert.ok(sources['./tiktok/app-store/AppStoreRedirectClient.js'].includes('captureAttribution'), 'direct App Store handoff should preserve the shared first/last-touch attribution boundary')
assert.ok(sources['./tiktok/app-store/AppStoreRedirectClient.js'].includes('referrer_domain'), 'direct App Store handoff should retain only the origin hostname for referrer diagnostics')
assert.ok(sources['./tiktok/app-store/AppStoreRedirectClient.js'].includes("copy_version: COPY_VERSION"), 'direct App Store handoff should carry a bounded promise version')
assert.ok(sources['./tiktok/app-store/AppStoreRedirectClient.js'].includes('data-experiment="tiktok_direct_handoff"'), 'direct App Store fallback should retain its bounded handoff marker')
assert.ok(sources['./tiktok/app-store/AppStoreRedirectClient.js'].includes("handoff_type: 'automatic'"), 'direct App Store handoff should identify its automatic handoff mode')
assert.ok(sources['./tiktok/app-store/AppStoreRedirectClient.js'].includes('const HANDOFF_SETTLE_MS = 300'), 'direct App Store handoff should use a short bounded analytics flush window')
assert.ok(sources['./tiktok/app-store/AppStoreRedirectClient.js'].includes('window.setTimeout(redirect, HANDOFF_SETTLE_MS)'), 'direct App Store handoff should have an unconditional redirect fallback')
assert.ok(sources['./tiktok/app-store/AppStoreRedirectClient.js'].includes('mixpanel.track(eventName, properties'), 'direct App Store handoff should attach the redirect to the final event callback')
assert.ok(sources['./tiktok/app-store/AppStoreRedirectClient.js'].includes('window.location.replace(APP_STORE_URL)'), 'direct App Store test path should hand off after the bounded flush window')
assert.ok(sources['./tiktok/app-store/AppStoreRedirectClient.js'].includes('Continue to the App Store'), 'direct App Store test path should have a no-redirect fallback')
assert.ok(styles.includes(':global(body:has(#jacked-tiktok-landing) > header)'), 'campaign route should remove generic site navigation')
assert.ok(styles.includes('.mobileDock'), 'campaign route should keep a mobile CTA in reach')
assert.ok(client.includes('new IntersectionObserver'), 'sticky mobile CTA should appear only after the hero CTA leaves view')
assert.ok(styles.includes('.mobileDockVisible'), 'sticky mobile CTA should have an explicit visible state')
assert.ok(sources['./tiktok/page.js'].includes('index: false'), 'campaign landing path should not compete with SEO pages')

for (const claim of ['iPhone only', 'iPhone-only', 'never seen before', 'guaranteed results']) {
  assert.ok(!all.toLowerCase().includes(claim.toLowerCase()), `TikTok landing path must not use unsupported positioning: ${claim}`)
}

console.log('TikTok landing tests passed')
