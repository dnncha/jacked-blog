import assert from 'node:assert/strict'
import { webcrypto } from 'node:crypto'
import catalog from '../../data/library/exercise-catalog.json' with { type: 'json' }
import { decodePlanPayload, MAX_PAYLOAD_BYTES } from '../plan/planContract.mjs'
import {
  alternativesFor,
  exerciseById,
  exercises,
  musclePages,
  programs,
} from './libraryData.mjs'

const catalogIds = new Set(catalog.map((entry) => entry.id))

// Every exercise page has a complete guide, so no page ships thin.
for (const exercise of exercises) {
  const guide = exercise.guide
  assert.ok(guide, `missing guide for ${exercise.id}`)
  assert.ok(guide.summary && guide.musclesNote && guide.progression, `incomplete guide text for ${exercise.id}`)
  assert.ok(guide.setup.length >= 3 && guide.execution.length >= 3, `too few steps for ${exercise.id}`)
  assert.equal(guide.mistakes.length, 3, `mistakes for ${exercise.id}`)
  assert.equal(guide.faq.length, 2, `faq for ${exercise.id}`)
  assert.match(exercise.slug, /^[a-z0-9]+(-[a-z0-9]+)*$/)
}

// Slugs are unique.
assert.equal(new Set(exercises.map((exercise) => exercise.slug)).size, exercises.length)

// Every exercise is reachable from the /exercises index: grouped under its first
// primary muscle's hub, or in the "Other" section when that muscle has no hub.
const indexSource = (await import('node:fs')).readFileSync(new URL('../exercises/page.js', import.meta.url), 'utf8')
assert.match(indexSource, /const unlisted = exercises\.filter\(\(exercise\) => !hubKeys\.has\(exercise\.primary\[0\]\)\)/)
assert.ok(musclePages.every((page) => page.primary.length >= 2), 'hub pages need at least two exercises')

// Alternatives always share a primary muscle.
for (const exercise of exercises) {
  for (const alternative of alternativesFor(exercise)) {
    assert.ok(alternative.primary.some((muscle) => exercise.primary.includes(muscle)), `${alternative.id} is not a fair swap for ${exercise.id}`)
  }
}

// Program links must import cleanly in the app: catalog-only ids, within bounds,
// and accepted by the same decoder the /plan page uses.
for (const program of programs) {
  assert.ok(program.days.length <= 6)
  for (const day of program.days) {
    assert.ok(day.exercises.length <= 12)
    for (const item of day.exercises) {
      assert.ok(catalogIds.has(item.exerciseId), `${program.id} uses ${item.exerciseId}, which the app catalog lacks`)
      assert.ok(exerciseById[item.exerciseId], `${program.id} links to hidden exercise ${item.exerciseId}`)
    }
  }
  assert.ok(program.payloadBytes <= MAX_PAYLOAD_BYTES, `${program.id} payload is ${program.payloadBytes} bytes`)

  const shareUrl = new URL(program.shareLink)
  assert.equal(shareUrl.origin + shareUrl.pathname, 'https://jacked.coach/plan/')
  const plan = await decodePlanPayload({ query: shareUrl.searchParams, href: program.shareLink, subtle: webcrypto.subtle })
  assert.equal(plan.t, program.name)
  assert.equal(plan.d.length, program.days.length)
  assert.ok(plan.d.every((day) => day.p.length === day.c && day.p.length > 0), `${program.id} is not importable`)
  assert.match(plan.i, /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/)

  const appUrl = new URL(program.appLink)
  assert.equal(appUrl.protocol, 'jacked:')
  assert.equal(appUrl.host, 'plan')
  assert.equal(appUrl.search, shareUrl.search)
}

// Program copy makes claims about its own numbers; keep them true.
const byKey = Object.fromEntries(programs.map((program) => [program.key, program]))
const lateralSets = byKey.physiquePlan.days
  .flatMap((day) => day.exercises)
  .filter((item) => ['lateral_raise', 'cable_lateral_raise', 'machine_lateral_raise'].includes(item.exerciseId))
  .reduce((total, item) => total + item.sets, 0)
assert.equal(lateralSets, 11, 'physique plan copy says 11 weekly lateral raise sets')
const broSessionSets = byKey.broSplit.days.map((day) => day.exercises.reduce((total, item) => total + item.sets, 0))
assert.deepEqual([Math.min(...broSessionSets), Math.max(...broSessionSets)], [17, 22], 'bro split copy says 17 to 22 sets per session')

console.log(`library: ${exercises.length} exercises, ${musclePages.length} muscle pages, ${programs.length} programs OK`)
