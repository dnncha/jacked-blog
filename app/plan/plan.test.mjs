import assert from 'node:assert/strict'
import { webcrypto } from 'node:crypto'
import { readFile } from 'node:fs/promises'

const page = await readFile(new URL('./page.js', import.meta.url), 'utf8')
const client = await readFile(new URL('./PlanClient.js', import.meta.url), 'utf8')
const contract = await import('./planContract.mjs')
const associationRoute = await import('../.well-known/apple-app-site-association/route.js')

assert.match(page, /<Suspense fallback=\{<LoadingPlan \/>\}>/)
assert.match(page, /title: \{ absolute: 'Shared plan \| Surpass' \}/)
assert.match(client, /decodePlanPayload/)
assert.match(await readFile(new URL('./planContract.mjs', import.meta.url), 'utf8'), /MAX_URL_BYTES = 12_000/)
assert.match(await readFile(new URL('./planContract.mjs', import.meta.url), 'utf8'), /MAX_ENCODED_PAYLOAD_BYTES = 8_000/)
assert.match(await readFile(new URL('./planContract.mjs', import.meta.url), 'utf8'), /MAX_PAYLOAD_BYTES = 6_000/)
assert.match(await readFile(new URL('./planContract.mjs', import.meta.url), 'utf8'), /MAX_EXERCISE_ID_LENGTH = 96/)
assert.match(client, /This preview includes plan prescriptions only/)
assert.match(client, /plan_share_web_opened/)
assert.match(client, /\.shared-plan-button \{[\s\S]*box-sizing: border-box;/, 'shared-plan CTAs must stay within the mobile shell')

const associationResponse = associationRoute.GET()
assert.equal(associationResponse.headers.get('cache-control'), 'public, max-age=300')
const association = await associationResponse.json()
assert.deepEqual(association.applinks.apps, [])
assert.deepEqual(association.applinks.details[0].appIDs, ['952M2MVR9R.com.jacked.app'])
assert.equal(association.applinks.details[0].components[0]['/'], '/plan/*')

const plan = {
  v: 1,
  i: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
  t: 'Upper A',
  d: [{
    n: 'Upper',
    c: 1,
    s: 3,
    r: '8–12 reps',
    q: '2 RIR',
    x: ['Incline press · dumbbells — 3 sets'],
    p: [{ i: 'incline_dumbbell_press', s: 3, a: 8, b: 12, r: 2, t: 120 }],
  }],
}
const bytes = new TextEncoder().encode(JSON.stringify(plan))
const digest = await webcrypto.subtle.digest('SHA-256', bytes)
const checksum = Array.from(new Uint8Array(digest).slice(0, 8))
  .map((byte) => byte.toString(16).padStart(2, '0'))
  .join('')
const encoded = Buffer.from(bytes).toString('base64url')
const query = new URLSearchParams({ p: encoded, c: checksum })

assert.deepEqual(
  await contract.decodePlanPayload({ query, href: `https://jacked.coach/plan?${query}`, subtle: webcrypto.subtle }),
  plan,
)
await assert.rejects(
  contract.decodePlanPayload({ query: new URLSearchParams({ p: encoded, c: '0000000000000000' }), href: 'https://jacked.coach/plan', subtle: webcrypto.subtle }),
  /checksum mismatch/,
)
assert.equal(contract.isValidPlan({ ...plan, t: 'bad\nvalue' }), false)
assert.equal(contract.isValidPlan({
  ...plan,
  d: [{ ...plan.d[0], p: [{ i: 'custom exercise', s: 3, a: 8, b: 12, r: 2, t: 120 }] }],
}), false)

console.log('shared plan route contract passed')
