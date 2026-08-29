import assert from 'node:assert/strict'
import fs from 'node:fs'
import { blogAcquisitionForPost, blogAppStoreUrl, blogCampaigns } from './blog/blogAcquisition.mjs'

const cases = [
  ['workout_apps', { title: 'Best Hevy alternatives for iPhone' }],
  ['nutrition', { title: 'How much protein supports muscle growth?' }],
  ['recovery', { title: 'Sleep and recovery after hard training' }],
  ['exercise', { title: 'Barbell bench press exercise guide' }],
  ['progression', { title: 'RIR and progressive overload explained' }],
  ['programming', { title: 'Weekly volume and workout split design' }],
  ['training', { title: 'A practical guide for consistent lifters' }],
]

for (const [intent, post] of cases) {
  const acquisition = blogAcquisitionForPost(post)
  const url = new URL(blogAppStoreUrl(post))
  assert.equal(acquisition.key, intent)
  assert.equal(url.searchParams.get('pt'), '128406689')
  assert.equal(url.searchParams.get('ct'), `blog_${intent}`)
  assert.equal(url.searchParams.get('mt'), '8')
}

assert.equal(new Set(blogCampaigns).size, blogCampaigns.length)
for (const campaign of blogCampaigns) {
  assert.match(campaign, /^[A-Za-z0-9_]+$/)
  assert.ok(campaign.length <= 30, `${campaign} must fit Apple's campaign-token limit`)
}

const renderer = fs.readFileSync(new URL('./blog/[slug]/page.js', import.meta.url), 'utf8')
const indexClient = fs.readFileSync(new URL('./blog/page.client.js', import.meta.url), 'utf8')
assert.match(renderer, /blogAppStoreUrl\(post\)/)
assert.match(renderer, /blogAcquisitionForPost\(post\)/)
assert.match(renderer, /\$\{acquisition\.label\}/)
assert.match(renderer, /\$\{acquisition\.headline\}/)
assert.match(renderer, /\$\{acquisition\.copy\}/)
assert.match(renderer, /Start free on iPhone/)
assert.match(renderer, /data-app-store-placement=\{`\$\{acquisition\.campaign\}_final`\}/)
assert.match(renderer, /surpass-inline-cta/)
assert.match(renderer, /data-global-cta="\$\{acquisition\.campaign\}_inline"/)
assert.match(renderer, /data-experiment="article_inline_cta"/)
assert.match(renderer, /data-experiment-variant="outcome_v1"/)
assert.match(renderer, /data-copy-version="\$\{ARTICLE_COPY_VERSION\}"/)
assert.match(renderer, /data-copy-version=\{ARTICLE_COPY_VERSION\}/)
assert.match(renderer, /const ARTICLE_COPY_VERSION = 'article_intent_promise_v1'/)
assert.ok(!renderer.includes('ct=surpass_coach'), 'article CTAs must not collapse into the generic site campaign')
assert.match(indexClient, /ct=blog_hub/)
assert.match(indexClient, /data-global-cta="blog_hub_hero"/)
assert.match(indexClient, /data-app-store-placement="blog_hub_hero"/)
assert.match(indexClient, /data-global-cta="blog_hub_mid"/)
assert.match(indexClient, /data-app-store-placement="blog_hub_mid"/)
assert.equal((indexClient.match(/data-experiment="blog_hub_cta"/g) || []).length, 2)
assert.match(indexClient, /const BLOG_HUB_COPY_VERSION = 'blog_hub_promise_v2'/)
assert.equal((indexClient.match(/data-copy-version=\{BLOG_HUB_COPY_VERSION\}/g) || []).length, 2)
assert.equal((indexClient.match(/Start free on iPhone/g) || []).length, 2)

console.log('blog acquisition checks passed')
