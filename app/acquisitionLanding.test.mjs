import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const paths = [
  './components/AcquisitionLanding.js',
  './workout-tracker/page.js',
  './progressive-overload/page.js',
  './hevy-alternative/page.js',
  './sitemap.xml/route.js',
  './page.client.js',
  './layout.js',
]

const sources = Object.fromEntries(await Promise.all(paths.map(async path => [path, await readFile(new URL(path, import.meta.url), 'utf8')])))
const all = Object.values(sources).join('\n')

for (const route of ['/workout-tracker', '/progressive-overload', '/hevy-alternative']) {
  assert.ok(sources['./sitemap.xml/route.js'].includes(`staticUrl('${route}', 'weekly', '0.95')`), `${route} must be in the sitemap`)
  assert.ok(sources['./page.client.js'].includes(route), `${route} must be linked from the homepage`)
  assert.ok(sources['./layout.js'].includes(route), `${route} must be linked sitewide`)
}

for (const campaign of ['seo_workout_tracker', 'seo_progressive_overload', 'seo_hevy_alternative']) {
  assert.ok(all.includes(`ct=${campaign}&mt=8`), `${campaign} must use an attributed App Store URL`)
}

assert.ok(all.match(/jacked-acquisition-social\.jpg/g)?.length >= 2, 'both landing pages should use the generated acquisition social image')
assert.ok(all.includes('/marketing/jacked-import-workouts.png'), 'the import landing page should use the verified Jacked import screen')
assert.ok(all.includes('/marketing/generated/jacked-import-social.png'), 'the import landing page should use its landscape social card')
assert.ok(sources['./components/AcquisitionLanding.js'].includes("'@type': 'FAQPage'"), 'landing pages should expose page-level FAQ schema')
assert.ok(all.includes('Workout history is stored locally on your iPhone'), 'privacy copy should state local workout-history storage')
assert.ok(!all.includes('automatically change my program?\', answer: \'Yes'), 'public copy must not imply automatic program control')
assert.ok(sources['./hevy-alternative/page.js'].includes('Nothing is added until you inspect the file summary and choose to import it.'), 'import page should state the confirmation boundary')
assert.ok(sources['./hevy-alternative/page.js'].includes('does not request credentials for Hevy, Strong, or FitNotes'), 'import page should state the account-access boundary')

console.log('acquisition landing tests passed')
