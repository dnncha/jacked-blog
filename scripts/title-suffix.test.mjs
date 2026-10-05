import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const root = new URL('..', import.meta.url)
const layout = await readFile(new URL('./app/layout.js', root), 'utf8')
assert.match(layout, /template:\s*'%s \| Surpass'/, 'the root title template should add the brand once')

async function filesUnder(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...await filesUnder(full))
    else if (entry.name.endsWith('.js') || entry.name.endsWith('.mjs')) files.push(full)
  }
  return files
}

function stripBlocks(source, key) {
  let result = ''
  const token = `${key}:`
  let index = 0
  while (index < source.length) {
    const at = source.indexOf(token, index)
    if (at < 0) {
      result += source.slice(index)
      break
    }
    result += source.slice(index, at)
    const brace = source.indexOf('{', at + token.length)
    if (brace < 0) {
      result += source.slice(at)
      break
    }
    let depth = 0
    let cursor = brace
    for (; cursor < source.length; cursor += 1) {
      const char = source[cursor]
      if (char === '{') depth += 1
      else if (char === '}') {
        depth -= 1
        if (depth === 0) {
          cursor += 1
          break
        }
      }
    }
    index = cursor
  }
  return result
}

function withoutAbsoluteTitles(source) {
  return source.replace(/title:\s*\{\s*absolute:\s*(['"`])[\s\S]*?\1\s*,?\s*\}/g, 'title: { absolute: true }')
}

const appDir = new URL('./app/', root)
const sources = await filesUnder(appDir.pathname)
const doubled = []

for (const file of sources) {
  const source = await readFile(file, 'utf8')
  const visible = withoutAbsoluteTitles(stripBlocks(stripBlocks(source, 'openGraph'), 'twitter'))
  for (const match of visible.matchAll(/title:\s*(['"])([^'"]*\| Surpass)\1/g)) {
    doubled.push(`${path.relative(appDir.pathname, file)}: ${match[2]}`)
  }
}

assert.deepEqual(doubled, [], 'metadata titles must not include "| Surpass" while the layout template also appends it')
console.log('title suffix test passed')
