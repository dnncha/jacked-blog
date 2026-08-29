#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const blogDir = path.join(root, 'content', 'blog')
const reportPath = path.join(root, 'reports', 'seo', 'pubmed-source-candidates.csv')
const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds))

const stopWords = new Set([
  'about', 'after', 'actually', 'against', 'behind', 'build', 'building', 'can', 'complete',
  'does', 'everything', 'explained', 'guide', 'guides', 'how', 'impact', 'latest', 'muscle',
  'research', 'science', 'says', 'should', 'strength', 'the', 'training', 'what', 'works',
])

function tokens(value) {
  return new Set(String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 3 && !stopWords.has(token)))
}

function csv(value) {
  const text = String(value ?? '')
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}

function hasSourceSignal(content) {
  return /(?:\[\d+\]|https?:\/\/|^#{2,3}\s+(?:references?|sources?|further reading|citations?)\s*$)/im.test(content)
}

function pubmedQuery(title) {
  const terms = [...tokens(title)].slice(0, 8)
  return terms.length ? terms.map(term => `${term}[Title/Abstract]`).join(' AND ') : title
}

function overlapScore(pageTokens, candidateTitle) {
  const candidateTokens = tokens(candidateTitle)
  if (!pageTokens.size || !candidateTokens.size) return 0
  let overlap = 0
  for (const token of pageTokens) if (candidateTokens.has(token)) overlap += 1
  return overlap / Math.min(pageTokens.size, candidateTokens.size)
}

async function searchPubMed(title) {
  const params = new URLSearchParams({
    db: 'pubmed',
    term: pubmedQuery(title),
    retmode: 'json',
    retmax: '5',
    sort: 'relevance',
  })
  const searchResponse = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?${params}`)
  if (!searchResponse.ok) throw new Error(`esearch ${searchResponse.status}`)
  const search = await searchResponse.json()
  const ids = search?.esearchresult?.idlist || []
  if (!ids.length) return []

  const summaryParams = new URLSearchParams({ db: 'pubmed', id: ids.join(','), retmode: 'json' })
  const summaryResponse = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?${summaryParams}`)
  if (!summaryResponse.ok) throw new Error(`esummary ${summaryResponse.status}`)
  const summary = await summaryResponse.json()
  return ids.map(id => {
    const item = summary?.result?.[id]
    return item && {
      pmid: id,
      title: item.title || '',
      journal: item.fulljournalname || item.source || '',
      year: item.pubdate || '',
      url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
    }
  }).filter(Boolean)
}

async function main() {
  const files = (await fs.readdir(blogDir)).filter(file => file.endsWith('.md')).sort()
  const rows = []
  let skipped = 0

  for (const file of files) {
    const parsed = matter(await fs.readFile(path.join(blogDir, file), 'utf8'))
    if (hasSourceSignal(parsed.content)) continue
    const title = String(parsed.data.title || file.replace(/\.md$/, ''))
    const pageTokens = tokens(`${title} ${parsed.data.excerpt || ''}`)
    try {
      const candidates = (await searchPubMed(title))
        .map(candidate => ({ ...candidate, score: overlapScore(pageTokens, candidate.title) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
      if (!candidates.length) rows.push({ slug: file.replace(/\.md$/, ''), title, status: 'no-pubmed-result' })
      else candidates.forEach((candidate, index) => rows.push({
        slug: file.replace(/\.md$/, ''),
        title,
        rank: index + 1,
        match: candidate.score.toFixed(2),
        pmid: candidate.pmid,
        candidate_title: candidate.title,
        journal: candidate.journal,
        year: candidate.year,
        url: candidate.url,
        status: candidate.score >= 0.6 ? 'candidate-review' : 'weak-match-review',
      }))
    } catch (error) {
      rows.push({ slug: file.replace(/\.md$/, ''), title, status: `lookup-error: ${error.message}` })
      skipped += 1
    }
    await sleep(350)
  }

  const columns = ['slug', 'title', 'rank', 'match', 'pmid', 'candidate_title', 'journal', 'year', 'url', 'status']
  await fs.mkdir(path.dirname(reportPath), { recursive: true })
  await fs.writeFile(reportPath, `${columns.join(',')}\n${rows.map(row => columns.map(column => csv(row[column] || '')).join(',')).join('\n')}\n`)
  console.log(JSON.stringify({ pagesReviewed: new Set(rows.map(row => row.slug)).size, candidates: rows.length, lookupErrors: skipped, report: path.relative(root, reportPath) }, null, 2))
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
