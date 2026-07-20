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
assert.ok(!renderer.includes('ct=jacked_coach'), 'article CTAs must not collapse into the generic site campaign')
assert.match(indexClient, /ct=blog_hub/)

console.log('blog acquisition checks passed')
