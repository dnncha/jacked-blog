import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const page = fs.readFileSync(path.join(here, 'press/page.js'), 'utf8')
const sitemap = fs.readFileSync(path.join(here, 'sitemap.xml/route.js'), 'utf8')
const apiSitemap = fs.readFileSync(path.join(here, 'api/sitemap/route.js'), 'utf8')

assert.match(page, /canonical: 'https:\/\/jacked\.coach\/press'/)
assert.match(page, /ct=press_kit/)
assert.match(page, /No account required/)
assert.match(page, /stored locally on the iPhone/)
assert.match(page, /prepared demo data/)
assert.match(page, /does not provide form coaching from video or guarantee strength or muscle gain/)
assert.match(page, /Start free on iPhone/)
assert.match(page, /data-app-store-placement="press_kit_hero"/)
assert.match(page, /data-copy-version="press_promise_v1"/)
assert.match(sitemap, /staticUrl\('\/press'/)
assert.match(apiSitemap, /<loc>https:\/\/jacked\.coach\/press<\/loc>/)

const requiredAssets = [
  'marketing/surpass-build-home.png',
  'marketing/surpass-visible-priority.png',
  'marketing/surpass-progress.png',
]

for (const asset of requiredAssets) {
  assert.match(page, new RegExp(asset.replaceAll('.', '\\.')))
  assert.ok(fs.statSync(path.join(root, 'public', asset)).size > 10_000, `${asset} must be a non-empty media asset`)
}

const forbidden = [
  'adoption evidence',
  'big wins',
  'evidence-bounded',
  'next wins',
  'pilot conversations',
  'private feedback',
]

for (const phrase of forbidden) {
  assert.ok(!page.toLowerCase().includes(phrase), `press copy must not contain internal phrase: ${phrase}`)
}

console.log('Press kit checks passed')
