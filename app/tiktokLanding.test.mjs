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
  'Build the body you came for.',
  'Built for iPhone',
  'Stop guessing between sets.',
  'Free to download',
  'No account required',
  'Requires iOS 17 or later',
  'Real Jacked interface. Seeded demo workout.',
]) {
  assert.ok(all.includes(phrase), `TikTok landing path should contain: ${phrase}`)
}

assert.match(client, /<video[\s\S]*autoPlay[\s\S]*muted[\s\S]*loop[\s\S]*playsInline/, 'TikTok landing path should show the real app in motion')
assert.ok(client.includes('/marketing/jacked-app-preview-480.mp4'), 'TikTok landing path should use the verified app preview')
assert.ok(client.includes('tiktok_landing_view'), 'TikTok landing path should measure visits')
assert.ok(client.includes('tiktok_landing_cta'), 'TikTok landing path should measure App Store intent')
assert.ok(client.includes("creative: params.get('creative')"), 'TikTok landing path should preserve creative-level attribution')
assert.ok(client.includes('ct=jacked_coach_tiktok_landing&mt=8'), 'landing CTA should use its own App Store campaign')
assert.ok(sources['./tiktok/app-store/AppStoreRedirectClient.js'].includes('ct=jacked_coach_tiktok_direct&mt=8'), 'direct App Store test path should use a separate campaign')
assert.ok(sources['./tiktok/app-store/AppStoreRedirectClient.js'].includes('window.location.replace(APP_STORE_URL)'), 'direct App Store test path should hand off immediately on a static host')
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
