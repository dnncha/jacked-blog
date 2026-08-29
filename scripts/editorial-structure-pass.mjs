#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const blogDir = path.join(root, 'content', 'blog')
const today = '2026-08-15'

const stopWords = new Set([
  'about', 'after', 'again', 'also', 'because', 'before', 'between', 'could', 'does', 'from',
  'have', 'into', 'more', 'most', 'over', 'same', 'should', 'than', 'that', 'their', 'there',
  'these', 'they', 'this', 'through', 'training', 'what', 'when', 'which', 'with', 'your',
])

const fallbackByTopic = {
  health: ['blood-pressure-resistance-training-lifting', 'testosterone-muscle-building-science-2026'],
  supplement: ['best-supplements-strength-athletes', 'protein-muscle-growth-guide'],
  nutrition: ['protein-muscle-growth-guide', 'carbohydrates-muscle-growth-science'],
  programming: ['training-fundamentals-muscle-growth', 'rest-periods-hypertrophy-science'],
  product: ['best-workout-app-hypertrophy-2026', 'auto-progression-feature-muscle-growth'],
  general: ['complete-guide-muscle-building-2026', 'training-fundamentals-muscle-growth'],
}

function tokens(value) {
  return new Set(String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 3 && !stopWords.has(token)))
}

function topicFor(post) {
  const descriptor = `${post.slug} ${post.title} ${post.excerpt}`.toLowerCase()
  if (/\b(?:blood pressure|testosterone|hormone|injury|pain|arthritis|medical|glp 1|mental health|sleep|thyroid|myostatin)\b/.test(descriptor)) return 'health'
  if (/\b(?:supplement|creatine|caffeine|ashwagandha|vitamin|magnesium|omega|taurine|hmb|ecdysterone|citrulline|carnitine|glycine|melatonin|nac|coq10)\b/.test(descriptor)) return 'supplement'
  if (/\b(?:protein|carbohydrate|calorie|diet|keto|fasted|fed|meal|hydration|electrolyte|glycogen|meat|pork)\b/.test(descriptor)) return 'nutrition'
  if (/\b(?:volume|frequency|periodization|split|progressive overload|autoregulation|rir|rpe|rep range|rest|failure|deload|exercise order|training|hypertrophy)\b/.test(descriptor)) return 'programming'
  if (/\b(?:app|tracker|hevy|strong|fitnotes|surpass|jacked|workout log|import|alternative)\b/.test(descriptor)) return 'product'
  return 'general'
}

function hasHeading(content, pattern) {
  return pattern.test(content)
}

function practicalBlock(topic) {
  const copy = {
    health: `Use the claims here as a starting point for a conversation with a qualified professional, not as a diagnosis. If you test a training or recovery change, change one variable at a time and record symptoms, performance, sleep, and any relevant clinical advice.`,
    supplement: `Treat this as a decision aid rather than a shopping list. Check the dose, product quality, interactions, and the outcome you actually care about; test one change at a time and stop if it causes unwanted symptoms.`,
    nutrition: `Apply the idea by changing one nutrition variable at a time and tracking intake, training performance, body-mass trend, hunger, and recovery for several weeks. A sustainable plan is more informative than a short experiment built around a single headline number.`,
    programming: `Apply the idea to one training block rather than changing the whole program at once. Keep the exercise setup and effort reasonably consistent, record the work, and review the trend before adding volume, load, or complexity.`,
    product: `Use the article to choose a workflow, then judge it by your own record: how quickly you can log the session, see the next decision, and review progress. Product features and availability can change, so verify the current app experience before relying on a specific detail.`,
    general: `Use the article as a framework for a small, reversible decision. Keep the rest of your routine stable, record the outcome you care about, and review the trend rather than treating one session or one study as a verdict.`,
  }
  return `## Applying this article\n\n${copy[topic]}`
}

function limitationsBlock(topic) {
  const copy = {
    health: `Health and exercise studies often use selected groups, short follow-up periods, and outcomes that do not map perfectly to symptoms or clinical decisions. Do not change medication, treatment, or rehabilitation based on this article alone.`,
    supplement: `Supplement findings depend on the ingredient, dose, product quality, population, and outcome measured. A change in a short-term marker is not the same as a meaningful change in muscle, strength, health, or performance.`,
    nutrition: `Nutrition studies vary in diet quality, energy intake, training status, and adherence. Group averages are useful for planning, but they cannot predict the exact response of one person or replace advice for a medical condition.`,
    programming: `Training studies differ in exercises, loads, effort, duration, and participant experience. The recommendations here are starting points; individual response, pain, recovery, and the quality of the comparison still matter.`,
    product: `Product comparisons describe a workflow at the time of writing, not a permanent guarantee of feature availability or results. Check the current product and make sure its data handling and capabilities fit your needs.`,
    general: `The evidence may combine mechanistic work, observational studies, trials, and expert interpretation. Those sources can inform a decision, but they do not establish an exact outcome for every reader.`,
  }
  return `## Limits of the evidence\n\n${copy[topic]}`
}

function selectRelated(post, posts) {
  const currentTokens = tokens(`${post.slug} ${post.title} ${post.excerpt}`)
  const topic = topicFor(post)
  const ranked = posts
    .filter(candidate => candidate.slug !== post.slug)
    .map(candidate => {
      const candidateTokens = tokens(`${candidate.slug} ${candidate.title} ${candidate.excerpt}`)
      let score = topicFor(candidate) === topic ? 3 : 0
      for (const token of currentTokens) if (candidateTokens.has(token)) score += 1
      return { candidate, score }
    })
    .sort((a, b) => b.score - a.score || a.candidate.title.localeCompare(b.candidate.title))

  const selected = []
  for (const { candidate } of ranked) {
    if (selected.some(item => item.slug === candidate.slug)) continue
    selected.push(candidate)
    if (selected.length === 2) break
  }

  for (const slug of fallbackByTopic[topic] || fallbackByTopic.general) {
    if (selected.length === 2) break
    const fallback = posts.find(candidate => candidate.slug === slug && candidate.slug !== post.slug)
    if (fallback && !selected.some(item => item.slug === fallback.slug)) selected.push(fallback)
  }

  return selected
}

function splitSource(source) {
  const match = source.match(/^(---\n[\s\S]*?\n---\n?)([\s\S]*)$/)
  return match ? { frontmatter: match[1], body: match[2] } : { frontmatter: '', body: source }
}

async function main() {
  const files = (await fs.readdir(blogDir)).filter(file => file.endsWith('.md')).sort()
  const posts = []
  for (const file of files) {
    const source = await fs.readFile(path.join(blogDir, file), 'utf8')
    const parsed = matter(source)
    posts.push({
      file,
      slug: file.replace(/\.md$/, ''),
      title: String(parsed.data.title || ''),
      excerpt: String(parsed.data.excerpt || ''),
      content: parsed.content,
    })
  }

  let changedFiles = 0
  let relatedBlocks = 0
  let practicalBlocks = 0
  let limitationsBlocks = 0

  for (const post of posts) {
    const topic = topicFor(post)
    let body = post.content.trim()
    const additions = []

    if ((body.match(/\]\(\/blog\//g) || []).length < 2) {
      const related = selectRelated(post, posts)
      if (related.length > 0) {
        additions.push(`## Related reading\n\n${related.map(item => `- [${item.title}](/blog/${item.slug})`).join('\n')}`)
        relatedBlocks += 1
      }
    }

    if (!hasHeading(body, /^#{2,3}\s+(?:practical|how to|takeaway|recommendations?|application|what to do|bottom line|applying)\b/im)) {
      additions.push(practicalBlock(topic))
      practicalBlocks += 1
    }

    if (!hasHeading(body, /^#{2,3}\s+(?:limits? of the evidence|limitations?|evidence limits?)\b/im) && !/\b(?:not medical advice|individual response|group averages|does not prove|doesn't prove|evidence is mixed)\b/i.test(body)) {
      additions.push(limitationsBlock(topic))
      limitationsBlocks += 1
    }

    if (additions.length === 0) continue
    const ctaMatch = body.match(/\n*\{\{surpass-inline-cta\}\}\s*$/)
    const cta = ctaMatch ? '\n\n{{surpass-inline-cta}}' : ''
    if (ctaMatch) body = body.slice(0, ctaMatch.index).trimEnd()
    body = `${body}\n\n${additions.join('\n\n')}\n${cta}\n`

    const source = await fs.readFile(path.join(blogDir, post.file), 'utf8')
    const { frontmatter } = splitSource(source)
    const data = matter(source).data
    let nextFrontmatter = frontmatter
    if (!Object.prototype.hasOwnProperty.call(data, 'updatedAt')) {
      nextFrontmatter = nextFrontmatter.replace(/^---\n/, `---\nupdatedAt: "${today}"\n`)
    }
    await fs.writeFile(path.join(blogDir, post.file), `${nextFrontmatter}${body}`)
    changedFiles += 1
  }

  console.log(JSON.stringify({
    articles: posts.length,
    changedFiles,
    relatedBlocks,
    practicalBlocks,
    limitationsBlocks,
  }, null, 2))
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
