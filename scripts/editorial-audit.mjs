#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const blogDir = path.join(root, 'content', 'blog')
const reportDir = path.join(root, 'reports', 'seo')
const shouldWrite = process.argv.includes('--write')
const postsSource = await fs.readFile(path.join(root, 'app', 'blog', 'posts.js'), 'utf8')
const legacyBlogSlugs = Object.fromEntries([...postsSource.matchAll(/^\s*'([^']+)'\s*:\s*'([^']+)'\s*,?\s*$/gm)].map(match => [match[1], match[2]]))

function canonicalBlogSlug(slug) {
  return legacyBlogSlugs[slug] || slug
}

const topicRules = [
  ['product', /\b(?:workout app|fitness app|tracker|hevy|strong|fitnotes|surpass|jacked|workout log|app alternative)\b/i],
  ['supplement', /\b(?:supplement|creatine|caffeine|ashwagandha|vitamin|magnesium|omega|taurine|hmb|ecdysterone|peptide|nitrate|citrulline|betaine|carnitine|glycine|melatonin|spermidine|urolithin|coq10|nac|pqq)\b/i],
  ['health', /\b(?:blood pressure|blood glucose|biomarker|hormone|testosterone|estrogen|igf|myostatin|injury|pain|arthritis|medical|glp-1|mental health|depression|sleep|sick|pollution)\b/i],
  ['nutrition', /\b(?:protein|carbohydrate|calorie|diet|keto|fasted|fed|meal|hydration|electrolyte|glycogen|meat|pork)\b/i],
  ['programming', /\b(?:volume|frequency|periodization|split|progressive overload|autoregulation|rir|rpe|rep range|rest|failure|deload|exercise order|training)\b/i],
]

const severeRules = [
  ['unsupported-guarantee', /\b(?:auto-progression\s+guarantees?|will definitely|works every time|break through plateaus faster|no matter what)\b/i],
  ['absolute-evidence-claim', /\b(?:the science is unambiguous|settles the debate once and for all|the evidence is conclusive|proven to maximize)\b/i],
  ['malformed-markdown', /(?:Cost\d|\bof\s+the\s+the\b|\bto\s+the\s+the\b)/i],
  ['legacy-brand-cta', /\b(?:download now|download jacked|let jacked)\b/i],
]

const sourceHeadingPattern = /^#{2,3}\s+(?:references?|sources?|further reading|citations?)\s*$/im
const practicalHeadingPattern = /^#{2,3}\s+(?:practical|how to|takeaway|recommendations?|application|what to do|bottom line|applying)\b/im
const limitationPattern = /\b(?:limitations?|limits of the evidence|evidence is mixed|not medical advice|individual response|group averages|does not prove|doesn't prove)\b/i

function csv(value) {
  const string = String(value ?? '')
  return /[",\n\r]/.test(string) ? `"${string.replaceAll('"', '""')}"` : string
}

function words(value) {
  return String(value || '').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length
}

function metaDescription(value) {
  const text = String(value || '').replace(/\s+/g, ' ').trim()
  if (text.length <= 160) return text
  const candidate = text.slice(0, 155).trim()
  const sentenceEnd = candidate.lastIndexOf('. ')
  if (sentenceEnd >= 100) return candidate.slice(0, sentenceEnd + 1)
  return `${candidate.slice(0, candidate.lastIndexOf(' ')).trim()}…`
}

function seoTitle(value) {
  const text = String(value || '').replace(/\s+/g, ' ').trim()
  if (text.length <= 70) return text
  const shortened = text
    .replace(/^The definitive guide to\s+/i, 'Guide to ')
    .replace(/^The complete guide to\s+/i, 'Guide to ')
    .replace(/^Everything you need to know about\s+/i, '')
    .replace(/\s+in 20\d{2}$/i, '')
    .replace(/:\s+the complete guide$/i, '')
  if (shortened.length <= 70) return shortened
  const colon = shortened.indexOf(': ')
  if (colon >= 35 && colon <= 70) return shortened.slice(0, colon)
  return shortened.slice(0, 67).replace(/\s+\S*$/, '').trim()
}

function topicFor(value) {
  return topicRules.find(([, pattern]) => pattern.test(value))?.[0] || 'general'
}

function sourceSignals(content) {
  const numbered = (content.match(/(?:\[\d+\]|\[\^[^\]]+\])/g) || []).length
  const urls = (content.match(/https?:\/\/[^\s)]+/gi) || []).length
  const heading = sourceHeadingPattern.test(content)
  return { numbered, urls, heading, present: numbered > 0 || urls > 0 || heading }
}

function scoreArticle({ title, excerpt, content, topic }) {
  const bodyWords = words(content)
  const h2 = (content.match(/^## /gm) || []).length
  const internalLinks = (content.match(/\]\(\/blog\//g) || []).length + (content.match(/\]\(\/tools\//g) || []).length
  const sources = sourceSignals(content)
  const severe = severeRules.filter(([, pattern]) => pattern.test(`${title}\n${excerpt}\n${content}`)).map(([label]) => label)
  const flags = []
  let score = 0

  const searchTitle = seoTitle(title)
  const searchDescription = metaDescription(excerpt)

  if (searchTitle.length >= 35 && searchTitle.length <= 70) score += 10
  else flags.push(searchTitle.length < 35 ? 'title-too-short' : 'title-too-long')

  if (searchDescription.length >= 110 && searchDescription.length <= 160) score += 10
  else flags.push(searchDescription.length < 110 ? 'description-too-short' : 'description-too-long')

  if (bodyWords >= 900) score += 15
  else if (bodyWords >= 700) score += 10
  else if (bodyWords >= 500) score += 5
  else flags.push('thin-content')

  if (h2 >= 4) score += 10
  else flags.push('shallow-outline')

  if (internalLinks >= 2) score += 10
  else flags.push('needs-internal-links')

  if (sources.present) score += 15
  else if (topic === 'product') score += 5
  else flags.push('needs-source-review')

  if (practicalHeadingPattern.test(content)) score += 10
  else flags.push('needs-practical-application')

  if (limitationPattern.test(content)) score += 10
  else flags.push('needs-limitations')

  if (severe.length === 0) score += 10
  else flags.push(...severe)

  const status = score >= 80 && severe.length === 0 && !flags.includes('needs-source-review')
    ? 'ready'
    : score >= 60 && severe.length === 0
      ? 'improve'
      : 'hold-for-editorial-review'

  return {
    score,
    status,
    word_count: bodyWords,
    h2_count: h2,
    internal_link_count: internalLinks,
    source_signal_count: sources.numbered + sources.urls + (sources.heading ? 1 : 0),
    source_heading: sources.heading ? 'yes' : 'no',
    topic,
    flags: [...new Set(flags)].join('|'),
  }
}

async function main() {
  const files = (await fs.readdir(blogDir)).filter(file => file.endsWith('.md')).sort()
  const rows = []

  for (const file of files) {
    const parsed = matter(await fs.readFile(path.join(blogDir, file), 'utf8'))
    const slug = file.replace(/\.md$/, '')
    const title = String(parsed.data.title || '')
    const excerpt = String(parsed.data.excerpt || '')
    const descriptor = `${file} ${title} ${excerpt}`
    const topic = topicFor(descriptor) !== 'general'
      ? topicFor(descriptor)
      : topicFor(parsed.content)
    const audit = canonicalBlogSlug(slug) !== slug
      ? {
          score: 100,
          status: 'legacy-redirect',
          word_count: words(parsed.content),
          h2_count: (parsed.content.match(/^## /gm) || []).length,
          internal_link_count: (parsed.content.match(/\]\(\/blog\//g) || []).length,
          source_signal_count: sourceSignals(parsed.content).numbered + sourceSignals(parsed.content).urls + (sourceSignals(parsed.content).heading ? 1 : 0),
          source_heading: sourceSignals(parsed.content).heading ? 'yes' : 'no',
          topic,
          flags: `legacy-redirect -> ${canonicalBlogSlug(slug)}`,
        }
      : scoreArticle({ title, excerpt, content: parsed.content, topic })
    rows.push({
      url: `/blog/${file.replace(/\.md$/, '')}`,
      slug: file.replace(/\.md$/, ''),
      title,
      ...audit,
    })
  }

  const columns = ['url', 'slug', 'title', 'topic', 'status', 'score', 'word_count', 'h2_count', 'internal_link_count', 'source_signal_count', 'source_heading', 'flags']
  const csvReport = `${columns.join(',')}\n${rows.map(row => columns.map(column => csv(row[column])).join(',')).join('\n')}\n`
  const byStatus = Object.fromEntries(['ready', 'improve', 'hold-for-editorial-review', 'legacy-redirect'].map(status => [status, rows.filter(row => row.status === status).length]))
  const byFlag = new Map()
  for (const row of rows) {
    for (const flag of row.flags.split('|').filter(Boolean)) byFlag.set(flag, (byFlag.get(flag) || 0) + 1)
  }
  const markdownReport = `# Editorial quality audit\n\nGenerated: ${new Date().toISOString()}\n\nThis is a source-controlled editorial triage, not a claim that every page has been independently fact-checked. It evaluates the published source files for search intent, completeness, practical value, sourcing signals, internal linking, limitations, and high-risk language. A page marked ready still needs an owner-controlled factual review before expert or clinical authority is claimed.\n\n## Summary\n\n- Files checked: ${rows.length}\n- Canonical articles checked: ${rows.filter(row => row.status !== 'legacy-redirect').length}\n- Ready for final human review: ${byStatus.ready}\n- Improve before final review: ${byStatus.improve}\n- Hold for editorial review: ${byStatus['hold-for-editorial-review']}\n- Legacy redirect files excluded from article scoring: ${byStatus['legacy-redirect']}\n\n## Flags\n\n${[...byFlag.entries()].sort((a, b) => b[1] - a[1]).map(([flag, count]) => `- ${flag}: ${count}`).join('\n')}\n\n## Status definitions\n\n- **Ready:** passes the mechanical gate and has a source signal; it is not a substitute for a named author, qualified reviewer, or primary-source check.\n- **Improve:** useful material exists, but the page needs a specific editorial improvement before final review.\n- **Hold for editorial review:** thin, overclaiming, malformed, or missing evidence for a research/health claim.\n- **Legacy redirect:** an old or merged URL that routes to a canonical article and should not compete with it in discovery surfaces.\n\n## Review order\n\n1. Correct severe claim and rendering defects.\n2. Review health, supplement, and research pages against primary sources and add only sources that support the visible claim.\n3. Add or verify a real author; add a reviewer only after substantive review by a real qualified person.\n4. Remove, merge, or noindex pages only after Search Console, internal-link, backlink, canonical, and user-value evidence is checked.\n\n## Per-page results\n\n| Status | Score | Words | Sources | Links | URL | Flags |\n| --- | ---: | ---: | ---: | ---: | --- | --- |\n${rows.sort((a, b) => a.score - b.score || a.title.localeCompare(b.title)).map(row => `| ${row.status} | ${row.score} | ${row.word_count} | ${row.source_signal_count} | ${row.internal_link_count} | ${row.url} | ${row.flags || '—'} |`).join('\n')}\n`

  if (shouldWrite) {
    await fs.mkdir(reportDir, { recursive: true })
    await fs.writeFile(path.join(reportDir, 'editorial-audit.csv'), csvReport)
    await fs.writeFile(path.join(reportDir, 'editorial-audit.md'), markdownReport)
  }

  console.log(JSON.stringify({
    articles: rows.length,
    status: byStatus,
    topFlags: [...byFlag.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([flag, count]) => ({ flag, count })),
    reportWritten: shouldWrite,
  }, null, 2))
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
