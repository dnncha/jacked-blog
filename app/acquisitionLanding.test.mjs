import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const paths = [
  './components/AcquisitionLanding.js',
  './workout-tracker/page.js',
  './progressive-overload/page.js',
  './sitemap.xml/route.js',
  './page.client.js',
  './layout.js',
]

const sources = Object.fromEntries(await Promise.all(paths.map(async path => [path, await readFile(new URL(path, import.meta.url), 'utf8')])))
const all = Object.values(sources).join('\n')

for (const route of ['/workout-tracker', '/progressive-overload']) {
  assert.ok(sources['./sitemap.xml/route.js'].includes(`staticUrl('${route}', 'weekly', '0.95')`), `${route} must be in the sitemap`)
  assert.ok(sources['./page.client.js'].includes(route), `${route} must be linked from the homepage`)
  assert.ok(sources['./layout.js'].includes(route), `${route} must be linked sitewide`)
}

for (const campaign of ['seo_workout_tracker', 'seo_progressive_overload']) {
  assert.ok(all.includes(`ct=${campaign}&mt=8`), `${campaign} must use an attributed App Store URL`)
}

assert.ok(all.match(/jacked-acquisition-social\.jpg/g)?.length >= 2, 'both landing pages should use the generated acquisition social image')
assert.ok(sources['./components/AcquisitionLanding.js'].includes("'@type': 'FAQPage'"), 'landing pages should expose page-level FAQ schema')
assert.ok(all.includes('Workout history is stored locally on your iPhone'), 'privacy copy should state local workout-history storage')
assert.ok(!all.includes('automatically change my program?\', answer: \'Yes'), 'public copy must not imply automatic program control')

console.log('acquisition landing tests passed')
