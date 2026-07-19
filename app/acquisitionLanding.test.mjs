import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const paths = [
  './components/AcquisitionLanding.js',
  './workout-tracker/page.js',
  './gym-workout-planner/page.js',
  './progressive-overload/page.js',
  './hevy-alternative/page.js',
  './strong-alternative/page.js',
  './fitnotes-alternative/page.js',
  './sitemap.xml/route.js',
  './page.client.js',
  './layout.js',
]

const sources = Object.fromEntries(await Promise.all(paths.map(async path => [path, await readFile(new URL(path, import.meta.url), 'utf8')])))
const all = Object.values(sources).join('\n')

const indexNowKey = '3edea32ea893663fe5c8685d97b9c7fa'
const indexNowKeyFile = await readFile(new URL(`../public/${indexNowKey}.txt`, import.meta.url), 'utf8')
const indexNowScript = await readFile(new URL('../scripts/submit-indexnow.mjs', import.meta.url), 'utf8')

assert.equal(indexNowKeyFile.trim(), indexNowKey, 'the IndexNow ownership file must contain the configured key')
assert.ok(indexNowScript.includes('url.origin !== `https://${host}`'), 'IndexNow submissions must be restricted to the canonical HTTPS origin')
assert.ok(indexNowScript.includes('https://api.indexnow.org/indexnow'), 'IndexNow must use the protocol endpoint')

for (const route of ['/workout-tracker', '/gym-workout-planner', '/progressive-overload', '/hevy-alternative', '/strong-alternative', '/fitnotes-alternative']) {
  assert.ok(sources['./sitemap.xml/route.js'].includes(`staticUrl('${route}', 'weekly', '0.95')`), `${route} must be in the sitemap`)
  assert.ok(sources['./page.client.js'].includes(route), `${route} must be linked from the homepage`)
}

for (const route of ['/workout-tracker', '/progressive-overload', '/hevy-alternative']) {
  assert.ok(sources['./layout.js'].includes(route), `${route} must be linked sitewide`)
}

for (const campaign of ['seo_workout_tracker', 'seo_gym_workout_planner', 'seo_progressive_overload', 'seo_hevy_alternative', 'seo_strong_alternative', 'seo_fitnotes_alternative']) {
  assert.ok(all.includes(`ct=${campaign}&mt=8`), `${campaign} must use an attributed App Store URL`)
}

assert.ok(all.match(/jacked-acquisition-social\.jpg/g)?.length >= 2, 'both landing pages should use the generated acquisition social image')
assert.ok(all.includes('/marketing/jacked-import-workouts.png'), 'the import landing page should use the verified Jacked import screen')
assert.ok(all.includes('/marketing/generated/jacked-import-social.png'), 'the import landing page should use its landscape social card')
assert.ok(all.includes('/marketing/generated/jacked-gym-planner-social.png'), 'the gym planner page should use its dedicated social card')
assert.ok(sources['./components/AcquisitionLanding.js'].includes("'@type': 'FAQPage'"), 'landing pages should expose page-level FAQ schema')
assert.ok(all.includes('Workout history is stored locally on your iPhone'), 'privacy copy should state local workout-history storage')
assert.ok(!all.includes('automatically change my program?\', answer: \'Yes'), 'public copy must not imply automatic program control')
assert.ok(sources['./hevy-alternative/page.js'].includes('Nothing is added until you inspect the file summary and choose to import it.'), 'import page should state the confirmation boundary')
assert.ok(sources['./hevy-alternative/page.js'].includes('does not request credentials for Hevy, Strong, or FitNotes'), 'import page should state the account-access boundary')
assert.ok(sources['./strong-alternative/page.js'].includes('Settings and choose Export Strong Data'), 'Strong page should use the documented iPhone export path')
assert.ok(sources['./strong-alternative/page.js'].includes('supports English Strong exports'), 'Strong page should state the supported export language')
assert.ok(sources['./fitnotes-alternative/page.js'].includes('workout-data CSV export'), 'FitNotes page should distinguish workout CSV from backups')
assert.ok(sources['./fitnotes-alternative/page.js'].includes('does not connect to FitNotes'), 'FitNotes page should state the account-access boundary')

const internalPlanningPhrases = [
  'adoption evidence',
  'ai slop',
  'big wins',
  'evidence-bounded',
  'next wins',
  'pilot conversations',
  'private feedback',
  'quote-approved',
]
for (const phrase of internalPlanningPhrases) {
  assert.ok(!all.toLowerCase().includes(phrase), `public acquisition copy must not contain internal phrase: ${phrase}`)
}

console.log('acquisition landing tests passed')
