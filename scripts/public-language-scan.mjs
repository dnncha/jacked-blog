#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const scanRoots = ['app', 'content/blog', 'docs', 'README.md', 'README.mdx']
const forbidden = [
  'adoption evidence',
  'adoption trust',
  'ai slop',
  'big wins',
  'evidence-bounded',
  'industry exposure',
  'massive industry impact',
  'next wins',
  'pilot conversations',
  'private feedback',
  'quote-approved',
  'turning private evaluation into public adoption evidence',
  'without turning private feedback into public evidence',
  'dogfooding',
  'internal feedback loop',
]

async function filesAt(target) {
  const absolute = path.join(root, target)
  try {
    const stat = await fs.stat(absolute)
    if (stat.isFile()) return [absolute]
  } catch {
    return []
  }
  const entries = await fs.readdir(absolute, { withFileTypes: true })
  const nested = await Promise.all(entries
    .filter(entry => !entry.name.startsWith('.') && entry.name !== 'node_modules' && entry.name !== '.next')
    .map(entry => filesAt(path.join(target, entry.name))))
  return nested.flat()
}

const files = (await Promise.all(scanRoots.map(filesAt))).flat()
const findings = []
for (const file of files) {
  if (/\.test\.(?:mjs|js)$/.test(file)) continue
  const text = await fs.readFile(file, 'utf8')
  for (const phrase of forbidden) {
    if (text.toLowerCase().includes(phrase)) findings.push(`${path.relative(root, file)}: ${phrase}`)
  }
}

if (findings.length) {
  console.error('Public-language scan failed:')
  console.error(findings.join('\n'))
  process.exitCode = 1
} else {
  console.log(`Public-language scan passed (${files.length} files checked).`)
}
