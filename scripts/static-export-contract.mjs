import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

const exportDirectory = path.resolve(
  process.argv[2] || process.env.JACKED_STATIC_EXPORT_DIR || 'out',
)
const flightPushPrefix = 'self.__next_f.push([1,'
const nextAssetPattern = /\/_next\/static\/[^"'\s<>]+/g

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(...await walk(absolutePath))
    } else {
      files.push(absolutePath)
    }
  }

  return files
}

function relativePath(absolutePath) {
  return path.relative(exportDirectory, absolutePath).split(path.sep).join('/')
}

function isNotFoundDocument(filePath) {
  return filePath === '404.html'
    || filePath === '404/index.html'
    || filePath === '_not-found/index.html'
}

function flightPayloads(html, filePath) {
  const payloads = []
  let cursor = 0

  while (true) {
    const start = html.indexOf(flightPushPrefix, cursor)
    if (start < 0) break

    const scriptEnd = html.indexOf('</script>', start)
    if (scriptEnd < 0) {
      throw new Error(`${filePath}: unterminated React Flight script`)
    }

    const body = html.slice(start + flightPushPrefix.length, scriptEnd)
    const close = body.lastIndexOf('])')
    if (close < 0) {
      throw new Error(`${filePath}: malformed React Flight script`)
    }

    try {
      payloads.push(JSON.parse(body.slice(0, close)))
    } catch (error) {
      throw new Error(`${filePath}: invalid React Flight JSON (${error.message})`)
    }

    cursor = scriptEnd + '</script>'.length
  }

  return payloads.join('')
}

function nextAssetReferences(content) {
  return new Set([...content.matchAll(nextAssetPattern)].map(([reference]) => reference))
}

const absoluteFiles = await walk(exportDirectory).catch((error) => {
  if (error.code === 'ENOENT') {
    throw new Error(`Static export directory does not exist: ${exportDirectory}`)
  }
  throw error
})
const files = new Set(absoluteFiles.map(relativePath))
const failures = []
const assetReferences = new Set()
const htmlFiles = absoluteFiles.filter((file) => file.endsWith('.html'))
const textFiles = absoluteFiles.filter((file) => file.endsWith('.txt'))

for (const absolutePath of [...htmlFiles, ...textFiles]) {
  const filePath = relativePath(absolutePath)
  const content = await readFile(absolutePath, 'utf8')

  for (const rawReference of nextAssetReferences(content)) {
    // React Flight JSON escapes the quote after a URL as `\\"`; that escape
    // is part of the payload, not part of the asset path.
    const reference = rawReference.replace(/\\+$/, '')
    assetReferences.add(reference)
    const assetPath = reference.split(/[?#]/, 1)[0].slice(1)
    if (!files.has(assetPath)) {
      failures.push(`${filePath}: missing referenced asset ${reference}`)
    }
  }

  if (!absolutePath.endsWith('.html') || isNotFoundDocument(filePath)) continue

  const flight = flightPayloads(content, filePath)
  if (!flight) {
    failures.push(`${filePath}: no React Flight payload found`)
    continue
  }

  const flightPath = filePath.slice(0, -'.html'.length) + '.txt'
  if (!files.has(flightPath)) {
    failures.push(`${filePath}: missing matching Flight payload ${flightPath}`)
    continue
  }

  const externalFlight = await readFile(path.join(exportDirectory, flightPath), 'utf8')
  if (flight !== externalFlight) {
    failures.push(`${filePath}: inline Flight payload differs from ${flightPath}`)
  }
}

if (failures.length) {
  console.error(`static export contract failed (${failures.length} issue${failures.length === 1 ? '' : 's'})`)
  for (const failure of failures.slice(0, 40)) console.error(`- ${failure}`)
  if (failures.length > 40) console.error(`- ...and ${failures.length - 40} more`)
  process.exitCode = 1
} else {
  console.log(
    `static export contract passed: ${htmlFiles.length} HTML files, `
      + `${textFiles.length} text payloads, ${assetReferences.size} referenced Next assets`,
  )
}
