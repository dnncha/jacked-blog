#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'

const root = process.cwd()
const blogDir = path.join(root, 'content', 'blog')
const reportPath = path.join(root, 'reports', 'seo', 'scientific-claim-audit.md')
const postsSource = await fs.readFile(path.join(root, 'app', 'blog', 'posts.js'), 'utf8')
const legacyBlogSlugs = Object.fromEntries([...postsSource.matchAll(/^\s*'([^']+)'\s*:\s*'([^']+)'\s*,?\s*$/gm)].map(match => [match[1], match[2]]))

const rules = [
  ['unsupported certainty', /\b(?:groundbreaking|definitive|conclusive|unambiguous|proven to|guarantee(?:s|d)?|will definitely|works every time|magic bullet|miracle|secret|kills your gains|all you need)\b/i],
  ['unbounded comparison', /\b(?:outperform(?:s|ed)?|beats|better than anything|most potent|best ever|strongest|optimal(?:ly)?|superior)\b/i],
  ['exact outcome claim', /\b\d+(?:\.\d+)?\s*(?:%|percent|kg|lb|lbs|g|mg|IU|hours?|minutes?|days?|weeks?|months?)\b/i],
  ['specific study claim', /\b(?:\d{4}|20\d{2})\s+(?:study|trial|meta-analysis|review)\b/i],
  ['medical or hormonal promise', /\b(?:treats?|cures?|heals?|prevents?|reverses?|boosts?\s+(?:testosterone|growth hormone|HGH)|reduces?\s+(?:injury|pain|inflammation))\b/i],
]

const cautionPattern = /\b(?:not|no|never|without|does not|doesn't|cannot|can't|unproven|uncertain|limited|mixed|lack(?:s)?|insufficient|not established|not a|do not|avoid|not automatically|not universal|not directly)\b/i
const cautionaryLabels = new Set(['unsupported certainty', 'unbounded comparison', 'medical or hormonal promise'])

const files = (await fs.readdir(blogDir)).filter(file => file.endsWith('.md')).sort()
const findings = []
const canonicalFiles = []
const legacyRedirects = []
for (const file of files) {
  const slug = file.replace(/\.md$/, '')
  if (legacyBlogSlugs[slug]) {
    legacyRedirects.push({ file, canonical: legacyBlogSlugs[slug] })
    continue
  }
  canonicalFiles.push(file)
  const raw = await fs.readFile(path.join(blogDir, file), 'utf8')
  const parsed = matter(raw)
  const lines = parsed.content.split('\n')
  lines.forEach((line, index) => {
    if (!line.trim() || /^\s*[-|`]/.test(line) || /https?:\/\//.test(line) || /^\s*#{1,6}\s/.test(line)) return
    const cautionary = cautionPattern.test(line)
    for (const [label, pattern] of rules) {
      if (cautionary && cautionaryLabels.has(label)) continue
      if (!pattern.test(line)) continue
      const context = lines.slice(Math.max(0, index - 2), Math.min(lines.length, index + 3)).join(' ')
      findings.push({ file, line: index + 1, label, text: line.trim(), nearbyUrl: /https?:\/\//.test(context) })
    }
  })
}

const grouped = new Map()
for (const finding of findings) {
  if (!grouped.has(finding.file)) grouped.set(finding.file, [])
  grouped.get(finding.file).push(finding)
}

const markdown = `# Scientific claim audit\n\nGenerated: ${new Date().toISOString()}\n\nThis is an editorial triage report. It flags language that needs a direct citation, narrower wording, or an explicit limitation. A source list at the end of an article is not treated as proof that every nearby sentence is supported. Legacy or merged source files are excluded from the findings because the site maps them to canonical articles.\n\n- Files checked: ${files.length}\n- Canonical articles checked: ${canonicalFiles.length}\n- Legacy redirect files excluded: ${legacyRedirects.length}\n- Canonical articles with findings: ${grouped.size}\n- Findings: ${findings.length}\n- Findings with a nearby URL: ${findings.filter(f => f.nearbyUrl).length}\n\n## Findings\n\n${[...grouped.entries()].map(([file, rows]) => `### ${file}\n\n${rows.slice(0, 20).map(row => `- Line ${row.line} (${row.label}${row.nearbyUrl ? ', nearby URL' : ''}): ${row.text}`).join('\n')}`).join('\n\n')}\n`

await fs.mkdir(path.dirname(reportPath), { recursive: true })
await fs.writeFile(reportPath, markdown)
console.log(JSON.stringify({ articlesChecked: files.length, canonicalArticlesChecked: canonicalFiles.length, legacyRedirects: legacyRedirects.length, articlesWithFindings: grouped.size, findings: findings.length, report: 'reports/seo/scientific-claim-audit.md' }, null, 2))
