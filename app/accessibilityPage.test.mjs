import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const page = await readFile(new URL('./accessibility/page.js', import.meta.url), 'utf8')
const sitemap = await readFile(new URL('./sitemap.xml/route.js', import.meta.url), 'utf8')
const support = await readFile(new URL('./support/page.js', import.meta.url), 'utf8')

assert.ok(page.includes("canonical: 'https://jacked.coach/accessibility'"), 'accessibility page must use the canonical URL')
assert.ok(page.includes('App Store Connect lists Dark Interface as supported for both device families.'), 'verified support must be concrete')
assert.ok(page.includes('does not currently declare support'), 'unverified features must be clearly bounded')
assert.ok(page.includes('Do not rely on them for every common task'), 'the page must not imply broader support')
assert.ok(page.includes('ct=accessibility_page&mt=8'), 'the App Store link must use the accessibility campaign')
assert.ok(sitemap.includes("staticUrl('/accessibility', 'monthly', '0.6')"), 'accessibility page must be in the sitemap')
assert.ok(support.includes('href="/accessibility"'), 'support must link to accessibility information')

const forbiddenClaims = [
  'fully accessible',
  'supports voiceover',
  'supports larger text',
  'wcag compliant',
]
for (const claim of forbiddenClaims) {
  assert.ok(!page.toLowerCase().includes(claim), `accessibility page must not claim: ${claim}`)
}

console.log('accessibility page tests passed')
