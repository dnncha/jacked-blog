import assert from 'node:assert/strict'

import { relatedToolsForArticle, toolQualityNotes } from './toolSeo.mjs'

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

console.log('tool SEO tests passed')
