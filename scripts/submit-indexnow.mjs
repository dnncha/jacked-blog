import {readFile} from 'node:fs/promises'

const host = 'jacked.coach'
const key = '3edea32ea893663fe5c8685d97b9c7fa'
const keyLocation = `https://${host}/${key}.txt`
const requestedUrls = process.argv.slice(2)

if (requestedUrls.length === 0) {
  throw new Error('Pass one or more published https://jacked.coach URLs to submit.')
}

const urls = [...new Set(requestedUrls)].map(value => {
  const url = new URL(value)
  if (url.origin !== `https://${host}`) {
    throw new Error(`IndexNow URL must use https://${host}: ${value}`)
  }
  return url.toString()
})

if (urls.length > 10_000) {
  throw new Error('IndexNow accepts at most 10,000 URLs per request.')
}

const hostedKey = (await readFile(new URL(`../public/${key}.txt`, import.meta.url), 'utf8')).trim()
if (hostedKey !== key) throw new Error('The hosted IndexNow key file does not match the submission key.')

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: {'Content-Type': 'application/json; charset=utf-8'},
  body: JSON.stringify({host, key, keyLocation, urlList: urls}),
})

if (!response.ok) {
  throw new Error(`IndexNow submission failed with HTTP ${response.status}: ${await response.text()}`)
}

console.log(`IndexNow accepted ${urls.length} URL${urls.length === 1 ? '' : 's'} with HTTP ${response.status}.`)
