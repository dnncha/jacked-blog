import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const paths = [
  './components/AcquisitionLanding.js',
  './workout-tracker/page.js',
  './gym-workout-planner/page.js',
  './progressive-overload/page.js',
  './hypertrophy-app/page.js',
  './alpha-progression-alternative/page.js',
  './hevy-alternative/page.js',
  './strong-alternative/page.js',
  './fitnotes-alternative/page.js',
  './import-workout-history/page.js',
  './accessibility/page.js',
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

for (const route of ['/workout-tracker', '/gym-workout-planner', '/progressive-overload', '/hypertrophy-app', '/alpha-progression-alternative', '/hevy-alternative', '/strong-alternative', '/fitnotes-alternative', '/import-workout-history']) {
  assert.ok(sources['./sitemap.xml/route.js'].includes(`staticUrl('${route}', 'weekly', '0.95')`), `${route} must be in the sitemap`)
  assert.ok(sources['./page.client.js'].includes(route), `${route} must be linked from the homepage`)
}

assert.ok(sources['./sitemap.xml/route.js'].includes("staticUrl('/accessibility', 'monthly', '0.6')"), 'accessibility page must be in the sitemap')

for (const route of ['/workout-tracker', '/progressive-overload', '/hypertrophy-app', '/hevy-alternative']) {
  assert.ok(sources['./layout.js'].includes(route), `${route} must be linked sitewide`)
}

for (const campaign of ['seo_workout_tracker', 'seo_gym_workout_planner', 'seo_progressive_overload', 'seo_hypertrophy_app', 'seo_alpha_progression_alternative', 'seo_hevy_alternative', 'seo_strong_alternative', 'seo_fitnotes_alternative', 'seo_import_workout_history']) {
  assert.ok(all.includes(`ct=${campaign}&mt=8`), `${campaign} must use an attributed App Store URL`)
}

assert.ok(all.match(/\/og-image\.png/g)?.length >= 4, 'acquisition pages should use the current Surpass social image')
assert.ok(all.includes('/marketing/surpass-home.png'), 'the acquisition pages should use the verified Surpass app screen')
assert.ok(sources['./components/AcquisitionLanding.js'].includes("'@type': 'FAQPage'"), 'landing pages should expose page-level FAQ schema')
assert.ok(sources['./components/AcquisitionLanding.js'].includes("'@type': 'WebPage'"), 'landing pages should expose page-level WebPage schema')
assert.ok(sources['./components/AcquisitionLanding.js'].includes("'@type': 'BreadcrumbList'"), 'landing pages should expose breadcrumb schema')
assert.ok(sources['./components/AcquisitionLanding.js'].includes('<link rel="preload" as="image" href={heroImage} fetchPriority="high" precedence="default"'), 'landing heroes should preload their primary proof image')
assert.ok(sources['./components/AcquisitionLanding.js'].includes('data-app-store-placement={placement}'), 'landing CTAs must expose their placement to analytics')
assert.ok(sources['./components/AcquisitionLanding.js'].includes('data-app-store-campaign={campaignFromHref(href)}'), 'landing CTAs must expose their resolved App Store campaign')
assert.ok(sources['./components/AcquisitionLanding.js'].includes("children = 'Start free on iPhone'"), 'landing CTAs should use an outcome-oriented default promise')
assert.ok(sources['./components/AcquisitionLanding.js'].includes('experimentName="acquisition_hero_cta"'), 'landing hero CTAs must identify the shared experiment')
assert.ok(sources['./components/AcquisitionLanding.js'].includes('experimentVariant="outcome_v1"'), 'landing hero CTAs must identify the current CTA variant')
assert.ok(sources['./components/AcquisitionLanding.js'].includes('data-experiment={experimentName || undefined}'), 'landing CTAs must expose experiment names to analytics')
assert.ok(sources['./components/AcquisitionLanding.js'].includes('data-hero-presentation={heroPresentation || undefined}'), 'landing hero CTAs must expose the bounded hero presentation')
assert.ok(sources['./components/AcquisitionLanding.js'].includes('data-copy-version={copyVersion || undefined}'), 'landing CTAs must expose the bounded copy version')
assert.ok(sources['./components/AcquisitionLanding.js'].includes("const copyVersion = 'acquisition_promise_v2'"), 'landing CTAs must use the current shared promise version')
assert.ok(sources['./components/AcquisitionLanding.js'].includes('acquisition-mobile-dock'), 'landing pages should retain a mobile conversion recovery dock')
assert.ok(sources['./components/AcquisitionLanding.js'].includes('heroActionsRef'), 'landing mobile recovery should observe the hero action boundary')
assert.ok(sources['./components/AcquisitionLanding.js'].includes('setShowMobileDock(!entry.isIntersecting)'), 'landing mobile recovery should wait until the hero CTA leaves view')
assert.ok(sources['./components/AcquisitionLanding.js'].includes('acquisition-mobile-dock-visible'), 'landing mobile recovery should have an explicit visible state')
assert.ok(sources['./components/AcquisitionLanding.js'].includes('aria-hidden={!showMobileDock}'), 'hidden landing recovery CTA should stay out of the accessibility tree')
assert.ok(sources['./components/AcquisitionLanding.js'].includes('.acquisition-mobile-dock[aria-hidden="true"] { display: none; }'), 'hidden landing recovery CTA should not overlay the first viewport before hydration')
assert.ok(sources['./components/AcquisitionLanding.js'].includes('color: #11100c;'), 'landing recovery CTA label should retain high contrast on the gold button')
assert.ok(sources['./components/AcquisitionLanding.js'].includes("from 'lucide-react'"), 'landing CTA icons should use the shared icon library')
assert.ok(sources['./components/AcquisitionLanding.js'].includes('placement={`${campaignKey}_mobile_dock`}'), 'mobile conversion dock should retain a campaign-specific placement')
assert.ok(sources['./components/AcquisitionLanding.js'].includes('experimentName="acquisition_mobile_cta"'), 'mobile conversion dock should identify its controlled experiment')
assert.ok(sources['./components/AcquisitionLanding.js'].includes('experimentVariant="sticky_outcome_v1"'), 'mobile conversion dock should identify its bounded variant')
assert.ok(sources['./components/AcquisitionLanding.js'].includes('ariaLabel="Start free with Surpass on iPhone"'), 'mobile conversion dock should expose an accessible App Store label')
for (const page of [
  './workout-tracker/page.js',
  './gym-workout-planner/page.js',
  './progressive-overload/page.js',
  './hypertrophy-app/page.js',
  './alpha-progression-alternative/page.js',
  './hevy-alternative/page.js',
  './strong-alternative/page.js',
  './fitnotes-alternative/page.js',
  './import-workout-history/page.js',
]) {
  assert.ok(!sources[page].includes('Download Surpass on iPhone'), `${page} should align its final copy with the outcome-led CTA`)
  assert.ok(sources[page].includes('Start free on iPhone'), `${page} should use the outcome-led final handoff copy`)
}
assert.ok(sources['./workout-tracker/page.js'].includes('heroPresentation="screen"'), 'workout tracker should use product-screen hero proof')
assert.ok(sources['./workout-tracker/page.js'].includes('/marketing/surpass-build-home.png'), 'workout tracker should use the verified planning screen')
assert.ok(sources['./progressive-overload/page.js'].includes('heroPresentation="screen"'), 'progressive overload should use product-screen hero proof')
assert.ok(sources['./progressive-overload/page.js'].includes('/marketing/surpass-progress.png'), 'progressive overload should use the verified progress screen')
assert.ok(sources['./components/AcquisitionLanding.js'].includes('center calc(100% - 18px) / auto 35% no-repeat'), 'mobile product-screen heroes should keep the proof image below the trust note')
for (const [path, canonicalPath] of [
  ['./workout-tracker/page.js', '/workout-tracker'],
  ['./gym-workout-planner/page.js', '/gym-workout-planner'],
  ['./progressive-overload/page.js', '/progressive-overload'],
  ['./hypertrophy-app/page.js', '/hypertrophy-app'],
  ['./alpha-progression-alternative/page.js', '/alpha-progression-alternative'],
  ['./hevy-alternative/page.js', '/hevy-alternative'],
  ['./strong-alternative/page.js', '/strong-alternative'],
  ['./fitnotes-alternative/page.js', '/fitnotes-alternative'],
  ['./import-workout-history/page.js', '/import-workout-history'],
]) {
  assert.ok(sources[path].includes(`canonicalPath="${canonicalPath}"`), `${path} should provide its canonical schema path`)
}
assert.ok(all.includes('Workout history is stored locally on your iPhone'), 'privacy copy should state local workout-history storage')
assert.ok(!all.includes('automatically change my program?\', answer: \'Yes'), 'public copy must not imply automatic program control')
assert.ok(sources['./hevy-alternative/page.js'].includes('Nothing is added until you inspect the file summary and choose to import it.'), 'import page should state the confirmation boundary')
assert.ok(sources['./hevy-alternative/page.js'].includes('does not request credentials for Hevy, Strong, or FitNotes'), 'import page should state the account-access boundary')
assert.ok(sources['./strong-alternative/page.js'].includes('Settings and choose Export Strong Data'), 'Strong page should use the documented iPhone export path')
assert.ok(sources['./strong-alternative/page.js'].includes('supports English Strong exports'), 'Strong page should state the supported export language')
assert.ok(sources['./fitnotes-alternative/page.js'].includes('workout-data CSV export'), 'FitNotes page should distinguish workout CSV from backups')
assert.ok(sources['./fitnotes-alternative/page.js'].includes('does not connect to FitNotes'), 'FitNotes page should state the account-access boundary')
assert.ok(sources['./import-workout-history/page.js'].includes('25 MB'), 'central import guide should state the current file-size limit')
assert.ok(sources['./import-workout-history/page.js'].includes('does not request credentials for Hevy, Strong, or FitNotes'), 'central import guide should state the account-access boundary')
assert.ok(sources['./import-workout-history/page.js'].includes('seo_import_workout_history'), 'central import guide should use a dedicated App Store campaign')
assert.ok(sources['./alpha-progression-alternative/page.js'].includes('This comparison is intentionally honest.'), 'Alpha comparison page should use balanced switching guidance')
assert.ok(sources['./alpha-progression-alternative/page.js'].includes('comparisonLeftLabel="Alpha Progression"'), 'Alpha comparison table should name the compared product explicitly')
assert.ok(sources['./components/AcquisitionLanding.js'].includes('comparisonLeftLabel = \'Basic log\''), 'generic acquisition pages should retain their basic-log comparison label')
assert.ok(sources['./alpha-progression-alternative/page.js'].includes('does not automatically change my program') || sources['./alpha-progression-alternative/page.js'].includes('Does Surpass automatically change my program?'), 'Alpha comparison page should explain plan-control boundaries')

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
