import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const source = await readFile(new URL('./layout.js', import.meta.url), 'utf8')

assert.ok(source.includes('mixpanel.init'), 'layout should initialize Mixpanel')
assert.ok(!source.includes('match(/^\\/\\//)'), 'inline analytics loader should avoid regex escaping that breaks rendered HTML')
assert.ok(source.includes('name="apple-itunes-app"'), 'layout should expose the native Safari Smart App Banner')
assert.ok(source.includes('app-id=6757132605'), 'Smart App Banner should target the Jacked App Store listing')
assert.ok(source.includes('pt=128406689&ct=smart_banner&mt=8'), 'Smart App Banner should use an attributable Apple campaign')

console.log('layout analytics tests passed')
