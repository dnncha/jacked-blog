import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const source = await readFile(new URL('./layout.js', import.meta.url), 'utf8')

assert.ok(source.includes('mixpanel.init'), 'layout should initialize Mixpanel')
assert.ok(!source.includes('match(/^\\/\\//)'), 'inline analytics loader should avoid regex escaping that breaks rendered HTML')

console.log('layout analytics tests passed')
