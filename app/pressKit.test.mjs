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
assert.match(page, /seeded demo data/)
assert.match(page, /does not provide form coaching from video or guarantee strength or muscle gain/)
assert.match(sitemap, /staticUrl\('\/press'/)
assert.match(apiSitemap, /<loc>https:\/\/jacked\.coach\/press<\/loc>/)

const requiredAssets = [
  'marketing/jacked-app-preview-480.mp4',
  'marketing/jacked-app-preview-poster.png',
  'press/creator-next-lift.mp4',
  'press/creator-next-lift-thumbnail.png',
  'press/creator-log-fast.mp4',
  'press/creator-log-fast-thumbnail.png',
  'press/creator-weekly-targets.mp4',
  'press/creator-weekly-targets-thumbnail.png',
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
