import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { flightRowProblems } from './flight-rows.mjs'

const text = 'hello'
const length = Buffer.byteLength(text, 'utf8').toString(16)
const valid = `1:T${length},${text}\n2:["$","div",null,{"children":"$L1"}]`
assert.deepEqual(flightRowProblems(valid), [])

const swallowed = `0:["$","html",null,{"children":"$L6"}]\nc:T${length},${text}6:["$","script",null,{}]`
const swallowedProblems = flightRowProblems(swallowed)
assert.ok(
  swallowedProblems.some((problem) => problem.includes('swallowed the following row')),
  'a short text row must fail when its declared length runs into the next row',
)
assert.ok(
  swallowedProblems.some((problem) => problem.includes('$L6')),
  'a reference to a swallowed row must be reported as undefined',
)

const oldHtmlPath = '/tmp/old-index.html'
try {
  const html = await readFile(oldHtmlPath, 'utf8')
  const prefix = 'self.__next_f.push([1,'
  const start = html.indexOf(prefix)
  assert.ok(start >= 0, 'the unfixed homepage should contain a flight push')
  const scriptEnd = html.indexOf('</script>', start)
  const body = html.slice(start + prefix.length, scriptEnd)
  const close = body.lastIndexOf('])')
  const chunks = []
  let cursor = 0
  const source = html
  while (cursor < source.length) {
    const push = source.indexOf(prefix, cursor)
    if (push < 0) break
    const end = source.indexOf('</script>', push)
    const payload = source.slice(push + prefix.length, end)
    const endJson = payload.lastIndexOf('])')
    chunks.push(JSON.parse(payload.slice(0, endJson)))
    cursor = end + '</script>'.length
  }
  const problems = flightRowProblems(chunks.join(''))
  assert.ok(problems.length > 0, 'the unfixed gh-pages homepage must fail the flight row contract')
  assert.ok(
    problems.some((problem) => problem.includes('$L6') || problem.includes('swallowed')),
    `unfixed homepage should report the missing $L6 row, got: ${problems.slice(0, 3).join(' | ')}`,
  )
} catch (error) {
  if (error.code === 'ENOENT') {
    console.log('flight row tests passed without the historical homepage fixture')
  } else {
    throw error
  }
}

console.log('flight row tests passed')
