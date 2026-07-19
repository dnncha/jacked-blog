import assert from 'node:assert/strict'

import { sharedToolUrl } from './toolShare.mjs'

const url = new URL(sharedToolUrl('https://jacked.coach', 'next-set-calculator'))

assert.equal(url.origin, 'https://jacked.coach')
assert.equal(url.pathname, '/tools/next-set-calculator')
assert.equal(url.searchParams.get('utm_source'), 'tool_share')
assert.equal(url.searchParams.get('utm_medium'), 'referral')
assert.equal(url.searchParams.get('utm_campaign'), 'next-set-calculator')
assert.equal(url.searchParams.has('weight'), false)
assert.equal(url.searchParams.has('reps'), false)
assert.equal(url.searchParams.has('rir'), false)
assert.equal(url.searchParams.has('bodyweight'), false)
assert.equal(url.searchParams.has('csvText'), false)

console.log('tool share tests passed')
