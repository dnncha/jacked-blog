#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import { tools } from '../app/tools/toolData.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const contentDir = path.join(root, 'content', 'blog')
const reportDir = path.join(root, 'reports', 'seo')

const clusterRules = [
  ['workout_apps_migration', /\b(hevy|strong|fitnotes|workout app|workout tracker|workout log|logging|import|alternative)\b/i],
  ['progression_and_effort', /\b(progressive overload|double progression|auto.?progression|next set|rir|rpe|rep range|one.?rep max|1rm|plateau|add (?:weight|load)|progression)\b/i],
  ['volume_and_programming', /\b(volume|sets|training split|frequency|program|programming|routine|periodization)\b/i],
  ['nutrition_and_supplements', /\b(protein|creatine|supplement|nutrition|caffeine|hydration|electrolyte|vitamin|omega|carbohydrate|calorie|diet)\b/i],
  ['recovery_and_health', /\b(sleep|recovery|fatigue|deload|soreness|injury|pain|hormone|biomarker|mental health|therapy|peptide)\b/i],
  ['exercise_selection', /\b(exercise|bench|squat|deadlift|curl|press|row|pulldown|lunge|raise|extension|machine|barbell|dumbbell)\b/i],
]

const healthSignals = /\b(injury|pain|arthritis|hormone|testosterone|igf|peptide|biomarker|blood glucose|mental health|depression|therapy|medical|cgm|myostatin|bpc-157|glp-1)\b/i
const productSignals = /\b(jacked|workout app|tracker|logging|progressive overload|next set|rir|hevy|strong|fitnotes|import|weekly volume)\b/i

function csv(value) {
  const string = String(value ?? '')
  return /[",\n\r]/.test(string) ? `"${string.replaceAll('"', '""')}"` : string
}

function words(value) {
  return String(value || '').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length
}

function clusterFor(value) {
  return clusterRules.find(([, pattern]) => pattern.test(value))?.[0] || 'general_training'
}

function relevanceFor(value) {
  const matches = String(value).match(productSignals)
  if (!matches) return 'low'
  return String(value).length > 300 && /\b(jacked|workout app|tracker|import|progressive overload)\b/i.test(value) ? 'high' : 'medium'
}

function actionFor({ relevance, sensitive, metadataComplete, isCore }) {
  if (isCore) return metadataComplete ? 'KEEP' : 'KEEP_AND_IMPROVE'
  if (sensitive && relevance === 'low') return 'NOINDEX_OR_EXPERT_REVIEW'
  if (relevance === 'high') return metadataComplete ? 'KEEP' : 'KEEP_AND_IMPROVE'
  return 'REVIEW_AFTER_SEARCH_CONSOLE'
}

function destinationFor(cluster) {
  if (cluster === 'workout_apps_migration') return '/hevy-alternative'
  if (cluster === 'progression_and_effort') return '/progressive-overload'
  if (cluster === 'volume_and_programming') return '/tools/weekly-volume-checker'
  if (cluster === 'nutrition_and_supplements' || cluster === 'recovery_and_health') return '/blog'
  return '/blog'
}

async function main() {
  await fs.mkdir(reportDir, { recursive: true })
  const files = (await fs.readdir(contentDir)).filter(file => file.endsWith('.md')).sort()
  const rows = []

  for (const file of files) {
    const raw = await fs.readFile(path.join(contentDir, file), 'utf8')
    const parsed = matter(raw)
    const slug = file.replace(/\.md$/, '')
    const value = `${parsed.data.title || ''} ${parsed.data.excerpt || ''} ${parsed.content}`
    const intentValue = `${slug} ${parsed.data.title || ''} ${parsed.data.excerpt || ''}`
    const cluster = clusterFor(intentValue)
    const sensitive = healthSignals.test(value)
    const relevance = relevanceFor(intentValue)
    const metadataFields = ['author', 'reviewer', 'publishedAt', 'updatedAt', 'sources', 'methodology', 'disclosure']
    const present = Object.fromEntries(metadataFields.map(field => [field, parsed.data[field] !== undefined && parsed.data[field] !== '']))
    const metadataComplete = Boolean(present.author && present.publishedAt && present.updatedAt && present.sources && present.methodology && present.disclosure)
    const isCore = /(?:hevy|strong|fitnotes|progressive-overload|workout-app|hypertrophy-app|workout-tracker|next-set|weekly-volume|rir)/i.test(slug)
    rows.push({
      url: `/blog/${slug}`,
      slug,
      title: parsed.data.title || '',
      category: parsed.data.category || '',
      published_date: parsed.data.date || '',
      word_count: words(parsed.content),
      intent_cluster: cluster,
      product_relevance: relevance,
      health_sensitive: sensitive ? 'yes' : 'no',
      author_present: present.author ? 'yes' : 'no',
      reviewer_present: present.reviewer ? 'yes' : 'no',
      published_at_present: present.publishedAt ? 'yes' : 'no',
      updated_at_present: present.updatedAt ? 'yes' : 'no',
      sources_present: present.sources ? 'yes' : 'no',
      methodology_present: present.methodology ? 'yes' : 'no',
      disclosure_present: present.disclosure ? 'yes' : 'no',
      search_console_status: 'unknown',
      backlink_status: 'unknown',
      provisional_action: actionFor({ relevance, sensitive, metadataComplete, isCore }),
      provisional_destination: destinationFor(cluster),
      cannibalisation_signal: '',
      notes: sensitive ? 'Health-sensitive topic requires source and review audit before acquisition use.' : 'Source-only inventory; demand and links not yet checked.',
    })
  }

  const coreRows = [
    ['/workout-tracker', 'workout tracker', 'workout_apps_migration', 'KEEP_AND_MEASURE'],
    ['/gym-workout-planner', 'gym workout planner', 'volume_and_programming', 'KEEP_AND_MEASURE'],
    ['/progressive-overload', 'progressive overload', 'progression_and_effort', 'KEEP_AND_MEASURE'],
    ['/hevy-alternative', 'Hevy alternative', 'workout_apps_migration', 'KEEP_AND_MEASURE'],
    ['/strong-alternative', 'Strong alternative', 'workout_apps_migration', 'KEEP_AND_MEASURE'],
    ['/fitnotes-alternative', 'FitNotes alternative', 'workout_apps_migration', 'KEEP_AND_MEASURE'],
    ...tools.map(tool => [`/tools/${tool.slug}`, tool.name, clusterFor(`${tool.name} ${tool.slug}`), 'KEEP_OR_REVIEW_WITH_SEARCH_CONSOLE']),
  ].map(([url, title, cluster, action]) => ({
    url,
    slug: url.split('/').filter(Boolean).at(-1),
    title,
    category: 'acquisition/tool',
    published_date: '',
    word_count: '',
    intent_cluster: cluster,
    product_relevance: 'high',
    health_sensitive: 'no',
    author_present: 'not_applicable',
    reviewer_present: 'not_applicable',
    published_at_present: 'not_applicable',
    updated_at_present: 'not_applicable',
    sources_present: 'review_required',
    methodology_present: 'review_required',
    disclosure_present: 'review_required',
    search_console_status: 'unknown',
    backlink_status: 'unknown',
    provisional_action: action,
    provisional_destination: url,
    cannibalisation_signal: '',
    notes: 'Core acquisition hypothesis; retain only after URL, demand, and product-evidence checks.',
  }))
  rows.push(...coreRows)

  const clusterGroups = new Map()
  for (const row of rows) {
    if (!clusterGroups.has(row.intent_cluster)) clusterGroups.set(row.intent_cluster, [])
    clusterGroups.get(row.intent_cluster).push(row)
  }
  for (const [cluster, group] of clusterGroups) {
    if (group.length < 2) continue
    const signal = `shared source-only cluster: ${cluster} (${group.length} URLs)`
    for (const row of group) row.cannibalisation_signal = signal
  }

  const columns = [
    'url', 'slug', 'title', 'category', 'published_date', 'word_count', 'intent_cluster', 'product_relevance', 'health_sensitive',
    'author_present', 'reviewer_present', 'published_at_present', 'updated_at_present', 'sources_present', 'methodology_present', 'disclosure_present',
    'search_console_status', 'backlink_status', 'provisional_action', 'provisional_destination', 'cannibalisation_signal', 'notes',
  ]
  await fs.writeFile(path.join(reportDir, 'content-inventory.csv'), `${columns.join(',')}\n${rows.map(row => columns.map(column => csv(row[column])).join(',')).join('\n')}\n`)

  const clusters = [...clusterGroups.entries()].sort((a, b) => b[1].length - a[1].length)
  const sensitiveCount = rows.filter(row => row.health_sensitive === 'yes').length
  const noMetadataCount = rows.filter(row => row.author_present === 'no').length
  const plan = `# Content consolidation plan

Generated: ${new Date().toISOString()}

## Evidence boundary

This is a source-only inventory of ${rows.length} blog and core acquisition/tool URLs. Search Console demand, backlinks, referring domains, conversion, and external review evidence were not available in this run. The actions below are provisional and must not be translated into redirects, removals, or noindex changes until those evidence layers are checked.

## Immediate rules

1. Freeze creation of new indexable exercise, keyword, location, comparison, or generic fitness URLs until the measurement baseline and URL inventory are complete.
2. Preserve every existing URL while its impressions, clicks, links, internal links, canonical state, and relevant redirect destination are checked.
3. Keep the product-owned acquisition set focused on workout tracking, migration, next-set decisions, RIR, weekly volume, and progressive overload.
4. Require a real author, reviewer where appropriate, substantive updated date, sources, methodology, and disclosure before a factual article is treated as an authority asset.
5. Treat health-sensitive pages as a review queue, not as automatic removal candidates.

## Source inventory summary

- URLs inventoried: ${rows.length}
- Health-sensitive flags: ${sensitiveCount}
- Blog posts without a named author field: ${noMetadataCount}
- Search Console status: unknown for every row in this source-only run
- Backlink status: unknown for every row in this source-only run

## Intent clusters

${clusters.map(([cluster, group]) => `### ${cluster} (${group.length} URLs)\n\n- Candidate hub: ${destinationFor(cluster)}\n- Candidate action: ${group.some(row => row.provisional_action.includes('KEEP')) ? 'Keep/improve the strongest page, then measure' : 'Review after Search Console and link checks'}\n- URLs: ${group.slice(0, 12).map(row => row.url).join(', ')}${group.length > 12 ? ', …' : ''}`).join('\n\n')}

## Consolidation sequence

1. Complete Search Console export and technical URL inventory.
2. Add query/page impressions, clicks, average position, backlinks, internal links, and canonical status to the inventory.
3. Select one canonical page per intent cluster. Merge only genuinely useful material; preserve claims and sources during any edit.
4. Update internal links and sitemap membership before a 301 is reviewed.
5. Recheck the destination, redirect chain, analytics campaign, and representative mobile journey.

No redirect or removal was performed by this report.
`
  await fs.writeFile(path.join(reportDir, 'content-consolidation-plan.md'), plan)

  const cannibalRows = clusters.filter(([, group]) => group.length > 1).map(([cluster, group]) => ({
    intent_cluster: cluster,
    page_count: group.length,
    candidate_hub: destinationFor(cluster),
    urls: group.map(row => row.url).join('|'),
    overlap_signal: 'Shared source-only topic terms; query overlap not proven',
    recommended_action: 'Compare Search Console query/page rows and links before choosing a canonical',
  }))
  await fs.writeFile(path.join(reportDir, 'cannibalization-map.csv'), `intent_cluster,page_count,candidate_hub,urls,overlap_signal,recommended_action\n${cannibalRows.map(row => Object.values(row).map(csv).join(',')).join('\n')}${cannibalRows.length ? '\n' : ''}`)

  const removal = `# Content removal and redirect review

## Status

No URL was deleted, redirected, or noindexed. This document records review gates only.

## Candidates requiring evidence

The source inventory flags ${sensitiveCount} health-sensitive URLs and ${rows.filter(row => row.product_relevance === 'low').length} low product-relevance URLs. Neither flag is a removal decision. For each candidate, check:

- Search Console impressions, clicks, queries, and search appearance;
- referring domains and important backlinks;
- internal inbound links and existing canonical/redirect state;
- whether a genuinely useful, factually reviewed destination exists;
- whether the page serves a distinct user need independent of search traffic;
- whether a 301, noindex, or 410 would create a worse user or crawl path.

Only after those checks should a page be assigned Keep, Improve, Merge and 301, Noindex temporarily, Remove with redirect, or Remove with 410. Record the destination and the before/after evidence with the change.
`
  await fs.writeFile(path.join(reportDir, 'content-removals.md'), removal)

  console.log(JSON.stringify({ rows: rows.length, clusters: clusters.length, sensitive: sensitiveCount }, null, 2))
}

main().catch(error => {
  console.error(error?.stack || error)
  process.exitCode = 1
})
