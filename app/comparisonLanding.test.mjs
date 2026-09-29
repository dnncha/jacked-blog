import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const read = path => readFile(new URL(path, import.meta.url), 'utf8')

const comparisonPages = {
  '/surpass-vs-hevy': { file: './surpass-vs-hevy/page.js', campaign: 'seo_surpass_vs_hevy', rival: 'Hevy' },
  '/surpass-vs-fitbod': { file: './surpass-vs-fitbod/page.js', campaign: 'seo_surpass_vs_fitbod', rival: 'Fitbod' },
  '/best-physique-tracker-apps': { file: './best-physique-tracker-apps/page.js', campaign: 'seo_best_physique_tracker_apps', rival: 'HyperBody' },
}

// The eyebrow on each muscle page must repeat the app's first-screen label
// (OnboardingView.buildPriorityTitle) so ad, page and app say the same thing.
const priorityPages = {
  'bigger-arms': { choice: 'Bigger arms', campaign: 'seo_priority_bigger_arms' },
  'wider-shoulders': { choice: 'Wider shoulders', campaign: 'seo_priority_wider_shoulders' },
  'bigger-chest': { choice: 'More chest', campaign: 'seo_priority_more_chest' },
  'wider-back': { choice: 'Wider back', campaign: 'seo_priority_wider_back' },
  'whole-frame': { choice: 'Better whole frame', campaign: 'seo_priority_whole_frame' },
}

const sitemap = await read('./sitemap.xml/route.js')
const homepage = await read('./page.client.js')
const layout = await read('./layout.js')
const priorityModule = await read('./components/PriorityLanding.js')
const landing = await read('./components/AcquisitionLanding.js')

const comparisonSources = {}
for (const [route, page] of Object.entries(comparisonPages)) {
  const source = await read(page.file)
  comparisonSources[route] = source
  assert.ok(sitemap.includes(`staticUrl('${route}', 'weekly', '0.95')`), `${route} must be in the sitemap`)
  assert.ok(homepage.includes(`'${route}'`), `${route} must be linked from the homepage`)
  assert.ok(layout.includes(`href="${route}"`), `${route} must be linked sitewide`)
  assert.ok(source.includes(`ct=${page.campaign}&mt=8`), `${route} must use an attributed App Store URL`)
  assert.ok(source.includes(`canonicalPath="${route}"`), `${route} must set its canonical schema path`)
  assert.ok(source.includes(`canonical: 'https://jacked.coach${route}'`), `${route} must set its canonical URL`)
  assert.ok(source.includes('sources={sources}'), `${route} must cite where competitor facts came from`)
  assert.ok(source.includes('checked on 29 September 2026'), `${route} must date its competitor facts`)
  assert.ok(source.includes(page.rival), `${route} must name the compared product`)
  assert.ok(source.includes('$59.99 a year'), `${route} must state the current annual price`)
}

for (const [slug, page] of Object.entries(priorityPages)) {
  const route = `/${slug}`
  const source = await read(`./${slug}/page.js`)
  assert.ok(source.includes(`priorityMetadata('${slug}')`) && source.includes(`slug="${slug}"`), `${route} must render its own priority entry`)
  assert.ok(priorityModule.includes(`'${slug}': {\n    choice: '${page.choice}',`), `${route} must use the onboarding label "${page.choice}"`)
  assert.ok(priorityModule.includes(`campaign: '${page.campaign}'`), `${route} must use its own App Store campaign`)
  assert.ok(sitemap.includes(`staticUrl('${route}', 'weekly', '0.95')`), `${route} must be in the sitemap`)
  assert.ok(homepage.includes(`'${route}'`), `${route} must be linked from the homepage`)
}
assert.ok(priorityModule.includes('eyebrow={page.choice}'), 'muscle pages must lead with the onboarding label')
assert.ok(priorityModule.includes('`${APP_STORE_BASE}&ct=${page.campaign}&mt=8`'), 'muscle pages must use attributed App Store URLs')

const allCopy = [...Object.values(comparisonSources), priorityModule].join('\n')
assert.ok(allCopy.includes('7-day trial on annual') || allCopy.includes('7-day free trial on the annual plan'), 'the trial must be described as annual-only')
assert.ok(!/free trial on (?:every|all|both) plan/i.test(allCopy), 'the trial must not be offered on the monthly plan')
for (const phrase of ['analyzes your photo', 'analyses your photo', 'AI analysis', 'automatic analysis', 'automatically analy', 'Surpass scores', 'your physique score', 'guaranteed']) {
  assert.ok(!allCopy.includes(phrase), `Frame Check copy must not claim automatic photo analysis or outcomes: ${phrase}`)
}
assert.ok(allCopy.includes('photos stay on your phone') || allCopy.includes('Photos stay on your phone') || allCopy.includes('keeps them on your phone'), 'photo privacy must be stated')
for (const phrase of ['crush your goals', 'fitness journey', 'best self', 'trust the process', "you've got this", 'next set obvious']) {
  assert.ok(!allCopy.toLowerCase().includes(phrase), `banned brand copy must not appear: ${phrase}`)
}

assert.ok(landing.includes("comparisonRightLabel = 'Surpass'"), 'existing pages keep Surpass as the right-hand comparison column')
assert.ok(landing.includes("dockTitle = 'Keep your next set clear.'"), 'existing pages keep their mobile dock title')
assert.ok(landing.includes('data-label={comparisonLeftLabel}'), 'narrow comparison rows must name the column each cell belongs to')

console.log('comparison and priority landing tests passed')
