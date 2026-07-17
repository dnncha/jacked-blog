import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const files = await Promise.all([
  './page.client.js',
  './page.js',
  './layout.js',
  './support/page.js',
].map(async (path) => [path, await readFile(new URL(path, import.meta.url), 'utf8')]))

const publicCopy = files.map(([, contents]) => contents).join('\n')
const forbiddenClaims = [
  'progress photos',
  'body metrics',
  'subscription terms',
  'before you subscribe',
  'Where do I see current pricing?',
  "['Today', 'Log', 'Progress', 'Library', 'More']",
]

for (const phrase of forbiddenClaims) {
  assert.ok(!publicCopy.includes(phrase), `current public conversion surfaces must not contain stale claim: ${phrase}`)
}

for (const phrase of [
  'Hit your <span className="gold-text">weekly targets.</span> Progress every lift.',
  'Weekly muscle targets',
  'Double progression',
  'Free to download. No account required.',
  "['Today', 'Train', 'Progress', 'Plan', 'Settings']",
  'https://apps.apple.com/app/id6757132605',
]) {
  assert.ok(publicCopy.includes(phrase), `current public conversion surfaces should contain: ${phrase}`)
}

const internalPlanningLanguage = [
  'adoption evidence',
  'big wins',
  'next wins',
  'pilot conversations',
  'private feedback',
]

for (const phrase of internalPlanningLanguage) {
  assert.ok(!publicCopy.toLowerCase().includes(phrase), `public conversion copy must not expose internal planning language: ${phrase}`)
}

console.log('homepage product truth tests passed')
