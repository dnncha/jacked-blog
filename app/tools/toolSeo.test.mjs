import assert from 'node:assert/strict'

import { tools } from './toolData.mjs'
import { relatedToolsForArticle, toolQualityNotes } from './toolSeo.mjs'
import { toolSocialImageUrl, toolSocialTitleSize, toolTypeLabel } from './toolSocial.mjs'

const progressionTools = relatedToolsForArticle({
  title: 'How to Progress in the Gym Without Guessing',
  excerpt: 'Use progressive overload, RIR, rep ranges, and next set targets.',
  category: 'Training',
  slug: 'how-to-progress-gym-framework',
})

assert.equal(progressionTools[0].slug, 'next-set-calculator')
assert.ok(progressionTools.some((tool) => tool.slug === 'rir-calculator'))

const deloadTools = relatedToolsForArticle({
  title: 'Deload Weeks and Recovery for Muscle Growth',
  excerpt: 'When fatigue, soreness, and missed targets stack up, reduce volume.',
  category: 'Recovery',
  slug: 'deload-weeks-muscle-science',
})

assert.equal(deloadTools[0].slug, 'deload-calculator')
assert.ok(deloadTools.some((tool) => tool.slug === 'weekly-volume-checker'))

const hevyTools = relatedToolsForArticle({
  title: 'Hevy Import Guide',
  excerpt: 'Export Hevy CSV workout history and move to a better workout app.',
  category: 'Apps',
  slug: 'hevy-import-guide',
})

assert.equal(hevyTools[0].slug, 'hevy-import-checker')

const notes = toolQualityNotes({ type: 'hevy', name: 'Hevy Import Checker' })
assert.match(notes.method, /browser/i)
assert.match(notes.privacy, /Nothing is uploaded/i)

const socialUrls = tools.map((tool) => toolSocialImageUrl(tool.slug))
assert.equal(new Set(socialUrls).size, tools.length, 'every tool should have a distinct social image')
for (const [index, tool] of tools.entries()) {
  assert.equal(socialUrls[index], `https://jacked.coach/tools/${tool.slug}/social.png`)
  assert.notEqual(toolTypeLabel(tool.type), 'TRAINING TOOL', `missing social label for ${tool.type}`)
  assert.ok(toolSocialTitleSize(tool.name) >= 52)
  assert.ok(toolSocialTitleSize(tool.name) <= 76)
}

console.log('tool SEO tests passed')
