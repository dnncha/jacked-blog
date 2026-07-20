import assert from 'node:assert/strict'

import {
  APP_STORE_BASE,
  APP_STORE_PROVIDER_TOKEN,
  appStoreUrl,
  exerciseSpecificTools,
  toolMap,
  tools,
} from './toolData.mjs'

assert.equal(APP_STORE_BASE, 'https://apps.apple.com/app/apple-store/id6757132605')
assert.equal(APP_STORE_PROVIDER_TOKEN, '128406689')
assert.equal(
  appStoreUrl('next_set_calculator', 'result_cta'),
  'https://apps.apple.com/app/apple-store/id6757132605?pt=128406689&ct=next_set_calculator&mt=8',
)

const newCoreTools = [
  ['strong-csv-import-checker', 'strong-import'],
  ['fitnotes-csv-import-checker', 'fitnotes-import'],
  ['workout-csv-validator', 'csv-validator'],
  ['rest-time-calculator', 'rest-time'],
  ['backoff-set-calculator', 'backoff'],
]

for (const [slug, type] of newCoreTools) {
  const tool = toolMap[slug]
  assert.ok(tool, `${slug} should be registered`)
  assert.equal(tool.type, type)
  assert.equal(tool.exerciseSpecific, undefined)
  assert.match(tool.title, /Calculator|Checker|Validator/)
  assert.ok(tool.related.length >= 3)
  assert.ok(tool.related.every((relatedSlug) => toolMap[relatedSlug]), `${slug} should not link to missing related tools`)
}

const strengthLevelSlugs = [
  'bench-press-strength-level-calculator',
  'squat-strength-level-calculator',
  'deadlift-strength-level-calculator',
  'overhead-press-strength-level-calculator',
  'leg-press-strength-level-calculator',
  'lat-pulldown-strength-level-calculator',
]

for (const slug of strengthLevelSlugs) {
  const tool = toolMap[slug]
  assert.ok(tool, `${slug} should be registered`)
  assert.equal(tool.type, 'strength-level')
  assert.equal(tool.exerciseSpecific, true)
  assert.match(tool.title, /Strength Level Calculator/)
  assert.match(tool.metaDescription, /bodyweight/i)
  assert.ok(tool.related.includes('strength-level-calculator'))
  assert.ok(tool.related.some((relatedSlug) => relatedSlug.endsWith('next-set-calculator')))
  assert.ok(tool.related.every((relatedSlug) => toolMap[relatedSlug]), `${slug} should not link to missing related tools`)
}

const exerciseStrengthTools = exerciseSpecificTools.filter((tool) => tool.type === 'strength-level')
assert.ok(exerciseStrengthTools.length >= strengthLevelSlugs.length)
assert.equal(new Set(tools.map((tool) => tool.slug)).size, tools.length)

const toolCampaignUrls = tools.map((tool) => appStoreUrl(tool.campaign))
assert.equal(new Set(toolCampaignUrls).size, tools.length, 'every tool should have a distinct App Store campaign URL')
for (const tool of tools) {
  const campaignUrl = new URL(appStoreUrl(tool.campaign))
  assert.equal(campaignUrl.searchParams.get('pt'), APP_STORE_PROVIDER_TOKEN)
  assert.equal(campaignUrl.searchParams.get('ct'), tool.campaign)
  assert.equal(campaignUrl.searchParams.get('mt'), '8')
}

console.log('tool data tests passed')
