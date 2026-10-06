import { createHash } from 'node:crypto'
import catalog from '../../data/library/exercise-catalog.json' with { type: 'json' }
import programSource from '../../data/library/programs-source.json' with { type: 'json' }
import guideBatch0 from '../../data/library/guides/batch_00.json' with { type: 'json' }
import guideBatch1 from '../../data/library/guides/batch_01.json' with { type: 'json' }
import guideBatch2 from '../../data/library/guides/batch_02.json' with { type: 'json' }
import guideBatch3 from '../../data/library/guides/batch_03.json' with { type: 'json' }
import { programContent } from './programContent.mjs'

export const SITE = 'https://jacked.coach'
const APP_STORE_BASE = 'https://apps.apple.com/app/apple-store/id6757132605'

export function libraryAppStoreUrl(campaign) {
  const params = new URLSearchParams({ pt: '128406689', ct: campaign, mt: '8' })
  return `${APP_STORE_BASE}?${params.toString()}`
}

// Duplicate catalog rows that would produce near-identical pages.
const HIDDEN_EXERCISE_IDS = new Set(['barbell_shrug', 'wrist_curl_db'])

const DISPLAY_NAME_OVERRIDES = {
  hammer_strength_plate_loaded_seated_standing_shrug: 'Plate-Loaded Shrug Machine',
  pull_ups: 'Pull-Up',
  push_ups: 'Push-Up',
  shrugs: 'Barbell Shrug',
  wrist_curl: 'Dumbbell Wrist Curl',
  hip_thrust_bw: 'Glute Bridge',
}

export const muscleGroups = {
  chest: { slug: 'chest', name: 'Chest', plural: 'chest exercises' },
  back: { slug: 'back', name: 'Back', plural: 'back exercises' },
  deltsFront: { slug: 'front-delts', name: 'Front Delts', plural: 'front delt exercises' },
  deltsSide: { slug: 'side-delts', name: 'Side Delts', plural: 'side delt exercises' },
  deltsRear: { slug: 'rear-delts', name: 'Rear Delts', plural: 'rear delt exercises' },
  traps: { slug: 'traps', name: 'Traps', plural: 'trap exercises' },
  biceps: { slug: 'biceps', name: 'Biceps', plural: 'biceps exercises' },
  triceps: { slug: 'triceps', name: 'Triceps', plural: 'triceps exercises' },
  forearms: { slug: 'forearms', name: 'Forearms', plural: 'forearm exercises' },
  abs: { slug: 'abs', name: 'Abs', plural: 'ab exercises' },
  quads: { slug: 'quads', name: 'Quads', plural: 'quad exercises' },
  hamstrings: { slug: 'hamstrings', name: 'Hamstrings', plural: 'hamstring exercises' },
  glutes: { slug: 'glutes', name: 'Glutes', plural: 'glute exercises' },
  adductors: { slug: 'adductors', name: 'Adductors', plural: 'adductor exercises' },
  calves: { slug: 'calves', name: 'Calves', plural: 'calf exercises' },
}

const EQUIPMENT_LABELS = {
  barbell: 'Barbell',
  bench: 'Bench',
  dumbbell: 'Dumbbells',
  machine: 'Machine',
  cable: 'Cable',
  plateLoaded: 'Plate-loaded machine',
  bodyweight: 'Bodyweight',
  rack: 'Rack',
  smithMachine: 'Smith machine',
  pullUpBar: 'Pull-up bar',
  ezBar: 'EZ bar',
  legPressMachine: 'Leg press',
  dipStation: 'Dip station',
  bands: 'Resistance band',
}

const PATTERN_LABELS = {
  horizontalPush: 'Horizontal push',
  horizontalPull: 'Horizontal pull',
  verticalPush: 'Vertical push',
  verticalPull: 'Vertical pull',
  squat: 'Squat',
  hinge: 'Hinge',
  lunge: 'Lunge',
  isolation: 'Isolation',
}

export const equipmentLabel = (key) => EQUIPMENT_LABELS[key] || key
export const patternLabel = (key) => PATTERN_LABELS[key] || key
export const muscleName = (key) => muscleGroups[key]?.name || key

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[()]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const guides = { ...guideBatch0, ...guideBatch1, ...guideBatch2, ...guideBatch3 }

export const exercises = catalog
  .filter((entry) => !HIDDEN_EXERCISE_IDS.has(entry.id))
  .map((entry) => {
    const name = DISPLAY_NAME_OVERRIDES[entry.id] || entry.name
    return {
      id: entry.id,
      name,
      slug: slugify(name),
      equipment: entry.equipmentTypes,
      pattern: entry.movementPattern,
      primary: entry.primaryMuscles,
      secondary: entry.secondaryMuscles,
      repMin: entry.defaultRepRangeMin,
      repMax: entry.defaultRepRangeMax,
      rir: entry.defaultTargetRIR,
      incrementType: entry.incrementType,
      increment: entry.incrementValue,
      isCompound: entry.movementPattern !== 'isolation',
      instructions: entry.instructions,
      guide: guides[entry.id] || null,
    }
  })
  .sort((a, b) => a.name.localeCompare(b.name))

export const exerciseById = Object.fromEntries(exercises.map((exercise) => [exercise.id, exercise]))
export const exerciseBySlug = Object.fromEntries(exercises.map((exercise) => [exercise.slug, exercise]))

export function exercisesForMuscle(muscleKey) {
  const primary = exercises.filter((exercise) => exercise.primary.includes(muscleKey))
  const secondary = exercises.filter((exercise) => !exercise.primary.includes(muscleKey) && exercise.secondary.includes(muscleKey))
  return { primary, secondary }
}

export const musclePages = Object.entries(muscleGroups)
  .map(([key, group]) => ({ key, ...group, ...exercisesForMuscle(key) }))
  .filter((page) => page.primary.length >= 2)

export const musclePageBySlug = Object.fromEntries(musclePages.map((page) => [page.slug, page]))

// Swaps should train the same thing: same primary muscle first, then the same
// movement pattern, preferring different equipment so a busy gym still has an option.
export function alternativesFor(exercise, limit = 6) {
  return exercises
    .filter((candidate) => candidate.id !== exercise.id)
    .map((candidate) => {
      const sharedPrimary = candidate.primary.filter((muscle) => exercise.primary.includes(muscle)).length
      if (!sharedPrimary) return null
      let score = sharedPrimary * 4
      if (candidate.pattern === exercise.pattern) score += 3
      score += candidate.secondary.filter((muscle) => exercise.secondary.includes(muscle)).length
      if (!candidate.equipment.some((item) => exercise.equipment.includes(item))) score += 1
      return { candidate, score }
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.candidate.name.localeCompare(b.candidate.name))
    .slice(0, limit)
    .map(({ candidate }) => candidate)
}

function formatRest(seconds) {
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return rest ? `${minutes}:${String(rest).padStart(2, '0')}` : `${minutes} min`
}

export { formatRest }

function formatRir(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1)
}

export { formatRir }

function deterministicUuid(seed) {
  const hex = createHash('sha256').update(`surpass-web-program:${seed}`).digest('hex')
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    `4${hex.slice(13, 16)}`,
    `${((parseInt(hex[16], 16) & 0x3) | 0x8).toString(16)}${hex.slice(17, 20)}`,
    hex.slice(20, 32),
  ].join('-').toUpperCase()
}

function rangeSummary(values, suffix) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  return min === max ? `${min} ${suffix}` : `${min}–${max} ${suffix}`
}

// Mirrors ShareablePlan (Jacked/Models/Proof/ShareableProof.swift) and
// app/plan/planContract.mjs so the app can copy the plan into an editable template.
export function sharePayloadFor(program) {
  return {
    v: 1,
    i: deterministicUuid(program.id),
    t: program.shareTitle,
    d: program.days.map((day) => ({
      n: day.name,
      c: day.exercises.length,
      s: day.exercises.reduce((total, item) => total + item.sets, 0),
      r: rangeSummary(day.exercises.flatMap((item) => [item.repMin, item.repMax]), 'reps'),
      q: rangeSummary(day.exercises.map((item) => item.rir), 'RIR'),
      x: day.exercises.map((item) => `${item.label} · ${item.sets} × ${item.repMin}–${item.repMax}`),
      p: day.exercises.map((item) => ({
        i: item.exerciseId,
        s: item.sets,
        a: item.repMin,
        b: item.repMax,
        r: item.rir,
        t: item.rest,
      })),
    })),
  }
}

export function encodePlanLink(payload, base) {
  const bytes = Buffer.from(JSON.stringify(payload), 'utf8')
  const encoded = bytes.toString('base64url')
  const checksum = createHash('sha256').update(bytes).digest().subarray(0, 8).toString('hex')
  return { url: `${base}?p=${encoded}&c=${checksum}`, bytes: bytes.byteLength, encodedLength: encoded.length }
}

export const programs = programSource.map((source) => {
  const content = programContent[source.key]
  if (!content) throw new Error(`Missing web copy for program ${source.key}`)
  const days = source.days.map((day) => ({
    ...day,
    exercises: day.exercises.map((item) => ({ ...item, exercise: exerciseById[item.exerciseId] || null })),
  }))
  const program = {
    ...source,
    ...content,
    shareTitle: source.name,
    days,
    totalSets: days.reduce((total, day) => total + day.exercises.reduce((sum, item) => sum + item.sets, 0), 0),
  }
  const payload = sharePayloadFor(program)
  program.appLink = encodePlanLink(payload, 'jacked://plan').url
  program.shareLink = encodePlanLink(payload, `${SITE}/plan/`).url
  program.payloadBytes = encodePlanLink(payload, `${SITE}/plan/`).bytes
  return program
})

export const programBySlug = Object.fromEntries(programs.map((program) => [program.slug, program]))

export function programsUsingExercise(exerciseId) {
  return programs.filter((program) => program.days.some((day) => day.exercises.some((item) => item.exerciseId === exerciseId)))
}

export function weeklySetsByMuscle(program) {
  const totals = {}
  for (const day of program.days) {
    for (const item of day.exercises) {
      for (const muscle of item.exercise?.primary || []) {
        totals[muscle] = (totals[muscle] || 0) + item.sets
      }
    }
  }
  return Object.entries(totals)
    .map(([muscle, sets]) => ({ muscle, name: muscleName(muscle), sets }))
    .sort((a, b) => b.sets - a.sets)
}
