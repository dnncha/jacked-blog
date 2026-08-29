import assert from 'node:assert/strict'
import { summarizeBrandCrawl } from './public-brand-crawl.mjs'

const ready = summarizeBrandCrawl({
  sitemapHttpStatus: 200,
  urls: ['https://jacked.coach/'],
  pages: [{ status: 'pass', http_status: 200, stale_brand_visible: false }],
})
assert.equal(ready.status, 'ready')
assert.equal(ready.failure_count, 0)

const blocked = summarizeBrandCrawl({
  sitemapHttpStatus: 200,
  urls: ['https://jacked.coach/tools/one-rep-max-calculator'],
  pages: [{
    status: 'fail',
    http_status: 200,
    stale_brand_visible: true,
    failures: ['stale visible Jacked brand'],
  }],
})
assert.equal(blocked.status, 'blocked')
assert.equal(blocked.stale_visible_count, 1)
assert.equal(blocked.failure_count, 1)

console.log('public brand crawl tests passed')
