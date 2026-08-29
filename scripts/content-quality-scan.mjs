#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const blogDir = path.join(root, 'content', 'blog')

const rules = [
  {
    label: 'non-English script in published blog content',
    pattern: /[\p{Script=Han}\p{Script=Cyrillic}]/u,
  },
  {
    label: 'stale product trial promise',
    pattern: /\b(?:free 7-day trial|7-day free trial|free for 7 days?|after the trial|trial today)\b/i,
  },
  {
    label: 'legacy untracked article download CTA',
    pattern: /^\*[^*\n]*\b(?:download now|download surpass)\b[^*\n]*\*$/im,
  },
  {
    label: 'guaranteed auto-progression outcome',
    pattern: /\bauto-progression guarantees\b/i,
  },
  {
    label: 'unsupported auto-progression statistic',
    pattern: /\bprogressive overload beats random training by 20[-–]30%\b/i,
  },
  {
    label: 'absolute evidence claim',
    pattern: /\bthe science is unambiguous\b/i,
  },
]

const files = (await fs.readdir(blogDir, { withFileTypes: true }))
  .filter(entry => entry.isFile() && entry.name.endsWith('.md'))
  .map(entry => path.join(blogDir, entry.name))
  .sort()

const findings = []
const editorialWarnings = []
for (const file of files) {
  const contents = await fs.readFile(file, 'utf8')
  const parsed = matter(contents)
  const title = String(parsed.data.title || '').trim()
  const excerpt = String(parsed.data.excerpt || '').trim()
  if (!title) editorialWarnings.push(`${path.relative(root, file)}: missing title`)
  if (!excerpt) editorialWarnings.push(`${path.relative(root, file)}: missing excerpt`)
  const sourceSignal = /(?:\[\d+\]|https?:\/\/|^#{2,3}\s+(?:references?|sources?|further reading|citations?)\s*$)/im.test(parsed.content)
  const productPage = /\b(?:app|tracker|surpass|jacked|hevy|strong|fitnotes|import|alternative)\b/i.test(`${file} ${title} ${excerpt}`)
  if (!sourceSignal && !productPage) editorialWarnings.push(`${path.relative(root, file)}: source review required before authoritative publication`)
  for (const rule of rules) {
    const match = contents.match(rule.pattern)
    if (!match) continue
    const line = contents.slice(0, match.index).split('\n').length
    findings.push(`${path.relative(root, file)}:${line}: ${rule.label}`)
  }
}

if (findings.length) {
  console.error('Content-quality scan failed:')
  console.error(findings.join('\n'))
  process.exitCode = 1
} else {
  console.log(`Content-quality scan passed (${files.length} published articles checked).`)
  if (editorialWarnings.length) {
    console.log(`Editorial follow-up warnings: ${editorialWarnings.length}`)
    console.log('The scan does not treat missing source signals as a release failure; review reports/seo/editorial-audit.md before claiming independent fact-checking.')
  }
}
