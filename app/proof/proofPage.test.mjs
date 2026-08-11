import assert from 'node:assert/strict'
import fs from 'node:fs'

const page = fs.readFileSync(new URL('./page.js', import.meta.url), 'utf8')
const client = fs.readFileSync(new URL('./proof.client.js', import.meta.url), 'utf8')

assert.ok(page.includes('robots:'), 'public proof pages must declare crawl policy')
assert.ok(page.includes('index: false'), 'personal proof links must not be indexed')
assert.ok(client.includes("crypto.subtle.digest('SHA-256'"), 'proof links must verify their checksum before rendering')
assert.ok(client.includes("candidate.v !== 1"), 'proof links must reject unsupported schemas')
assert.ok(client.includes("slice(0, 4)"), 'public proof must keep the evidence list bounded')
assert.ok(client.includes("data-app-store-campaign=\"proof_public\""), 'proof acquisition must retain its App Store campaign')
assert.ok(client.includes("track('proof_viewed'"), 'valid proof views must emit the canonical funnel event')
assert.ok(client.includes("track('proof_deep_link_opened'"), 'native proof opens must emit the canonical funnel event')
assert.ok(!client.includes('dangerouslySetInnerHTML'), 'proof payload content must render through escaped React text')
assert.ok(!client.match(/bodyweight|photo|notes|account identifier/i), 'the public proof view must not request private workout fields')

console.log('Proof page checks passed.')
