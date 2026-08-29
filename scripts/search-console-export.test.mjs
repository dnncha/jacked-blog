import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const source = await readFile(new URL('./search-console-export.mjs', import.meta.url), 'utf8')

for (const term of [
  'surpass',
  'surpass app',
  'surpass strength',
  'surpass workout',
  'surpass coach',
  'jacked',
]) {
  assert.match(source, new RegExp(`'${term.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}'`), `${term} must remain a branded Search Console term`)
}

assert.match(source, /brand_class/, 'Search Console query exports must retain the bounded brand classification field')
console.log('Search Console export brand classification checks passed')
