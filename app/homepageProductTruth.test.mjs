import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'

const files = await Promise.all([
  './page.client.js',
  './page.js',
  './layout.js',
  './support/page.js',
].map(async (path) => [path, await readFile(new URL(path, import.meta.url), 'utf8')]))

const publicCopy = files.map(([, contents]) => contents).join('\n')
const homepageClientSource = files.find(([path]) => path === './page.client.js')[1]
const forbiddenClaims = [
  'progress photos',
  'body metrics',
  'subscription terms',
  'before you subscribe',
  'Where do I see current pricing?',
  "['Today', 'Log', 'Progress', 'Library', 'More']",
  'Hit your <span className="gold-text">weekly targets.</span> Progress every lift.',
  'For iPhone lifters who have outgrown plain workout logs and spreadsheet upkeep.',
]

for (const phrase of forbiddenClaims) {
  assert.ok(!publicCopy.includes(phrase), `current public conversion surfaces must not contain stale claim: ${phrase}`)
}

for (const phrase of [
  'Get bigger <span className="gold-text">on purpose.</span>',
  'Know the next lift. Hit the right weekly work. Leave with the next move already decided.',
  'Weekly muscle targets',
  'Double progression',
  'No account required. Import from Hevy, Strong, or FitNotes.',
  'Know the lift',
  'Hit the weekly work',
  'Progress the next session',
  'https://apps.apple.com/app/apple-store/id6757132605?pt=128406689&ct=jacked_coach&mt=8',
  '/marketing/jacked-app-preview-480.mp4',
  'Real Jacked interface · seeded demo workout',
  "window.matchMedia('(prefers-reduced-motion: reduce)')",
  'Pause preview',
  'Play preview',
]) {
  assert.ok(publicCopy.includes(phrase), `current public conversion surfaces should contain: ${phrase}`)
}

assert.match(publicCopy, /<video[\s\S]*muted[\s\S]*loop[\s\S]*playsInline/, 'homepage should show the real app preview as a muted inline loop')
assert.match(publicCopy, /<button[\s\S]*app-preview-toggle[\s\S]*togglePlayback/, 'homepage should let visitors pause or resume the app preview')
assert.ok(!homepageClientSource.includes('<path d='), 'homepage icons should come from the shared icon library instead of handcrafted SVG paths')

for (const [placement, campaign] of [
  ['hero', 'jacked_coach_home_hero'],
  ['download', 'jacked_coach_home_download'],
  ['final_cta', 'jacked_coach_home_final'],
]) {
  assert.ok(
    homepageClientSource.includes(`${placement}: '${campaign}'`),
    `homepage CTA should have its own attributed App Store campaign: ${campaign}`,
  )
}
assert.ok(
  homepageClientSource.includes('return `${APP_STORE_URL_BASE}&ct=${campaign}&mt=8`'),
  'homepage App Store URL builder should send the selected campaign to Apple',
)

const internalPlanningLanguage = [
  'adoption evidence',
  'adoption trust',
  'ai slop',
  'big wins',
  'evidence-bounded',
  'industry exposure',
  'massive industry impact',
  'next wins',
  'pilot conversations',
  'private feedback',
  'quote-approved',
  'turning private evaluation into public adoption evidence',
  'without turning private feedback into public evidence',
]

async function publicSourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(entries.map(async entry => {
    const path = `${directory}/${entry.name}`
    if (entry.isDirectory()) return publicSourceFiles(path)
    if (entry.name.includes('.test.') || entry.name === 'posts.generated.json') return []
    return /\.(?:js|jsx|mjs|md|json|txt|xml)$/.test(entry.name) ? [path] : []
  }))
  return nested.flat()
}

const sourcePaths = (await Promise.all(['app', 'content', 'public'].map(publicSourceFiles))).flat()
const publicFacingCopy = (await Promise.all(sourcePaths.map(path => readFile(path, 'utf8')))).join('\n').toLowerCase()

for (const phrase of internalPlanningLanguage) {
  assert.ok(!publicFacingCopy.includes(phrase), `public-facing source must not expose internal planning language: ${phrase}`)
}

for (const phrase of ['iphone only', 'iphone-only', 'never seen before', 'guaranteed results']) {
  assert.ok(!publicFacingCopy.includes(phrase), `public-facing source must not use unsupported positioning: ${phrase}`)
}

console.log('homepage product truth tests passed')
