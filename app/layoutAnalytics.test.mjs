import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const source = await readFile(new URL('./layout.js', import.meta.url), 'utf8')

assert.ok(source.includes('mixpanel.init'), 'layout should initialize Mixpanel')
assert.ok(source.includes('track_pageview:false'), 'Mixpanel should not add an automatic pageview stream outside the canonical event contract')
assert.ok(source.includes('disable_persistence:true'), 'Mixpanel should not persist an anonymous browser identity')
assert.ok(source.includes('disable_cookie:true'), 'Mixpanel should not set analytics cookies')
assert.ok(source.includes('ip:false'), 'Mixpanel should not enrich events from the client IP')
assert.ok(source.includes('property_blacklist:[\'$current_url\',\'$referrer\',\'$referring_domain\''), 'Mixpanel should exclude raw URL and referrer properties')
assert.ok(!source.includes('match(/^\\/\\//)'), 'inline analytics loader should avoid regex escaping that breaks rendered HTML')
assert.ok(source.includes('name="apple-itunes-app"'), 'layout should expose the native Safari Smart App Banner')
assert.ok(source.includes('app-id=6757132605'), 'Smart App Banner should target the Surpass App Store listing')
assert.ok(source.includes('pt=128406689&ct=smart_banner&mt=8'), 'Smart App Banner should use an attributable Apple campaign')
assert.ok(source.includes('site-header-mobile-actions'), 'mobile navigation should have a dedicated compact action row')
assert.ok(source.includes('site-header-menu-panel'), 'mobile navigation should keep the full site navigation reachable')
assert.ok(source.includes('ct=surpass_coach_mobile'), 'mobile header CTA should have a distinct Apple campaign')
for (const section of ['how_it_works', 'tools', 'training_library', 'about', 'support']) {
  assert.ok(source.includes(`data-nav-section="${section}"`), `header navigation should measure ${section} clicks`)
}

console.log('layout analytics tests passed')
