#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const blogDir = path.join(root, 'content', 'blog')
const apply = process.argv.includes('--apply')

const replacements = [
  [/\bon this point on this\b/gi, 'on this point'],
  [/\bimportant to track\b/gi, 'important'],
  [/\bthe only important for muscle growth\b/gi, 'the central principle for muscle growth'],
  [/\bthe important foundation\b/gi, 'the important foundation'],
  [/\ba important\b/gi, 'an important'],
  [/(^|[.!?]\s+)the evidence\b/g, (_, prefix) => `${prefix}The evidence`],
  [/\bsettles the debate once and for all\b/gi, 'adds to the evidence on the question'],
  [/\bthe science is unambiguous\b/gi, 'the evidence is not uniform'],
  [/\bthe science is clear\b/gi, 'the evidence is reasonably consistent on this point'],
  [/\ba landmark study\b/gi, 'a study'],
  [/\blandmark studies\b/gi, 'recent studies'],
  [/\bbombshell conclusion\b/gi, 'important result'],
  [/\bgame[- ]changer\b/gi, 'potentially useful finding'],
  [/\bsecret weapon\b/gi, 'optional tool'],
  [/\brevolutioni[sz](?:e|ing|es|ed)\b/gi, 'change'],
  [/\bkilling your gains\b/gi, 'interfering with progress'],
  [/\bkill your gains\b/gi, 'interfere with progress'],
  [/\bdramatically\b/gi, 'meaningfully'],
  [/\bthe exact strategy\b/gi, 'a practical strategy'],
  [/\bguarantees?\b/gi, 'can support'],
  [/\bnon-negotiable\b/gi, 'important to track'],
  [/\bevery time\b/gi, 'in many cases'],
]

function applyToBody(content) {
  const lines = String(content || '').split('\n')
  let inReferences = false
  return lines.map(line => {
    if (/^#{2,3}\s+(?:references?|sources?|further reading|citations?)\s*$/i.test(line.trim())) inReferences = true
    if (inReferences || line.trimStart().startsWith('>')) return line
    return replacements.reduce((value, [pattern, replacement]) => value.replace(pattern, replacement), line)
  }).join('\n')
}

async function main() {
  const files = (await fs.readdir(blogDir)).filter(file => file.endsWith('.md')).sort()
  let changed = 0
  let replacementsMade = 0

  for (const file of files) {
    const absolute = path.join(blogDir, file)
    const original = await fs.readFile(absolute, 'utf8')
    const parsed = matter(original)
    const content = applyToBody(parsed.content)
    if (content === parsed.content) continue
    const bodyStart = original.indexOf(parsed.content)
    const next = bodyStart === -1
      ? matter.stringify(content, parsed.data)
      : `${original.slice(0, bodyStart)}${content}${original.slice(bodyStart + parsed.content.length)}`
    changed++
    replacementsMade += [...original.matchAll(/\b(?:settles the debate once and for all|the science is unambiguous|the science is clear|landmark|bombshell conclusion|game[- ]changer|secret weapon|revolutioni[sz](?:e|ing|es|ed)|killing your gains|kill your gains|dramatically|the exact strategy|guarantees?|non-negotiable|every time)\b/gi)].length
    if (apply) await fs.writeFile(absolute, next)
  }

  console.log(JSON.stringify({ files: files.length, changed, replacementsMade, applied: apply }, null, 2))
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
