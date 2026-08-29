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
const layoutSource = files.find(([path]) => path === './layout.js')[1]
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
  'Get bigger on <span className="gold-text">purpose.</span>',
  'Choose what you want to change, train the block, and use the evidence to decide what comes next.',
  'Visible-priority blocks',
  'Next-set targets',
  'No account required',
  'A body-building system, not a dashboard.',
  'Build the body people notice.',
  'Choose the outcome. Train the block. See what moved.',
  'Weekly muscle targets',
  'Double progression',
  'Your workout history stays on your iPhone. Import it when you&apos;re ready.',
  'https://apps.apple.com/app/apple-store/id6757132605?pt=128406689&ct=surpass_coach&mt=8',
  '/marketing/surpass-home.png',
  'Real Surpass interface · prepared session preview',
]) {
  assert.ok(publicCopy.includes(phrase), `current public conversion surfaces should contain: ${phrase}`)
}

for (const phrase of [
  'Make your <span className="gold-text">next set</span> obvious.',
  'Surpass turns your last result into today&apos;s load, reps, rest, and weekly target—so every session points forward.',
  'Less remembering. More progressing.',
]) {
  assert.ok(!publicCopy.includes(phrase), `homepage conversion surfaces must not regress to the retired promise: ${phrase}`)
}

assert.match(publicCopy, /<img[\s\S]*surpass-home\.png[\s\S]*alt=/, 'homepage should show a real Surpass app preview with descriptive alt text')
assert.match(layoutSource, /data-app-store-placement="header" data-copy-version="header_promise_v1">Start free<\/a>/, 'desktop header CTA should use the current free-start promise and a bounded copy marker')
assert.match(layoutSource, /data-app-store-placement="header_mobile" data-copy-version="header_promise_v1">Start free<\/a>/, 'mobile header CTA should carry the same bounded copy marker')
assert.match(layoutSource, /aria-label="Start free with Surpass on iPhone"/, 'header CTA should expose its destination to assistive technology')
assert.ok(!homepageClientSource.includes('<path d='), 'homepage icons should come from the shared icon library instead of handcrafted SVG paths')
assert.match(homepageClientSource, /\.hero-copy \{\s*align-self: start;/, 'desktop hero copy should keep the primary install CTA in the first viewport')
assert.match(homepageClientSource, /\.conversion-dock-copy \{ flex: 1 1 auto; min-width: 0; \}/, 'mobile conversion dock copy should retain usable width beside the CTA')
assert.match(homepageClientSource, /\.conversion-dock \.app-store-button \{ min-width: 0; width: auto;/, 'mobile conversion CTA should size to its label instead of forcing the copy to zero width')
assert.match(homepageClientSource, /setShowConversionDock\(!entry\.isIntersecting\)/, 'mobile conversion dock should wait until the hero CTA leaves the viewport')
assert.match(homepageClientSource, /conversion-dock-visible/, 'mobile conversion dock should have an explicit visible state')
assert.match(homepageClientSource, /aria-hidden=\{!showConversionDock\}/, 'hidden mobile conversion dock should stay out of the accessibility tree')
assert.match(homepageClientSource, /className="conversion-dock-copy"/, 'mobile conversion dock copy should be scoped away from the button label')
assert.match(homepageClientSource, /\.conversion-dock\[aria-hidden="true"\] \{ display: none; \}/, 'hidden mobile conversion dock should not overlay the hero before hydration')
assert.match(homepageClientSource, /\.conversion-dock-copy span \{ margin-top: 2px; color: #aaa294;/, 'mobile conversion support copy should retain its muted contrast')
assert.match(homepageClientSource, /\.conversion-dock \.app-store-button > span \{ display: block; color: #11100c;/, 'mobile conversion button label should retain strong contrast')
assert.match(homepageClientSource, /ariaLabel="Start free with Surpass on iPhone"/, 'mobile conversion CTA should expose its destination to assistive technology')
assert.match(homepageClientSource, /<link rel="preload" as="image" href="\/marketing\/generated\/surpass-hero-woman\.webp" fetchPriority="high" precedence="default" \/>/, 'homepage hero image should be explicitly preloaded for the first viewport')
assert.match(homepageClientSource, /HOMEPAGE_HERO_EXPERIMENT = Object\.freeze/, 'homepage hero CTA should have an explicit experiment contract')
assert.match(homepageClientSource, /name: 'homepage_hero_cta'/, 'homepage hero CTA should use the predeclared experiment name')
assert.match(homepageClientSource, /storageKey: 'surpass:experiment:homepage-hero-cta:v1'/, 'homepage hero assignment should use a bounded first-party storage key')
assert.match(homepageClientSource, /heroPresentation="photo"/, 'homepage hero CTA should record the proof presentation shown to the visitor')
assert.match(homepageClientSource, /'@type': 'FAQPage'/, 'homepage FAQs should expose page-level structured data')
assert.match(homepageClientSource, /acceptedAnswer: \{ '@type': 'Answer', text: answer \}/, 'homepage FAQ structured data should match the visible answers')
assert.match(homepageClientSource, /data-experiment-ready=\{experiment \? String\(experimentReady\) : undefined\}/, 'experiment CTA exposure should wait until its assignment is ready')
assert.match(homepageClientSource, /heroVariant\.label/, 'homepage hero copy should render the assigned variant')
assert.match(homepageClientSource, /heroVariant\.campaign/, 'homepage hero handoff should use the assigned campaign')

for (const [placement, campaign] of [
  ['hero', 'surpass_coach_home_hero_control'],
  ['download', 'surpass_coach_home_download'],
  ['final_cta', 'surpass_coach_home_final'],
]) {
  assert.ok(
    homepageClientSource.includes(`${placement}: '${campaign}'`),
    `homepage CTA should have its own attributed App Store campaign: ${campaign}`,
  )
}
for (const phrase of [
  "variant: 'control'",
  "variant: 'outcome_v1'",
  "campaign: 'surpass_coach_home_hero_outcome_v1'",
  'randomHomepageHeroVariant',
  'readHomepageHeroVariant',
]) {
  assert.ok(homepageClientSource.includes(phrase), `homepage hero experiment should include: ${phrase}`)
}
assert.ok(
  homepageClientSource.includes('return `${APP_STORE_URL_BASE}&ct=${campaign}&mt=8`'),
  'homepage App Store URL builder should send the selected campaign to Apple',
)
assert.equal(
  (homepageClientSource.match(/experiment="homepage_lower_cta"/g) || []).length,
  3,
  'homepage lower handoffs should share one measurable outcome variant',
)
for (const placement of ['homepage_download', 'homepage_final']) {
  assert.match(
    homepageClientSource,
    new RegExp(`content="${placement}"[\\s\\S]*?Start free on iPhone`),
    `${placement} should use the outcome-led copy`,
  )
}

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
