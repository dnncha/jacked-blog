import assert from 'node:assert/strict'

import {
  calculateDeload,
  calculateExerciseSwaps,
  calculateFitNotesImportPreview,
  calculateStrongImportPreview,
  calculateWorkoutCsvValidation,
  calculateRestTime,
  calculateBackoffSets,
  calculateHevyImportPreview,
  calculateNextSet,
  calculateOneRepMax,
  calculatePlateLoad,
  calculateRirTarget,
  calculateStrengthLevel,
  calculateVolume,
  calculateWarmups,
  calculateWorkoutSplit,
  estimateE1RM,
} from './calculators.mjs'
import { tools } from './toolData.mjs'

const nextSet = calculateNextSet({
  weight: 80,
  reps: 10,
  rir: 2,
  minReps: 8,
  maxReps: 10,
  targetRir: 2,
  increment: 2.5,
  units: 'kg',
})

assert.equal(nextSet.targetWeight, 82.5)
assert.equal(nextSet.targetRepText, '8-10')
assert.match(nextSet.reason, /top of the rep range/i)
assert.equal(nextSet.confidence.label, 'High confidence')

const reversedRange = calculateNextSet({
  weight: 80,
  reps: 7,
  rir: 2,
  minReps: 12,
  maxReps: 8,
  targetRir: 2,
  increment: 2.5,
  units: 'kg',
})
assert.equal(reversedRange.targetRepText, '8-12')
assert.equal(reversedRange.conservative.repText, '8-12')

const e1rm = estimateE1RM({ weight: 80, reps: 10, rir: 2 })
assert.equal(e1rm.rounded, 114)
assert.equal(e1rm.confidence.label, 'High confidence')

const rirTarget = calculateRirTarget({
  weight: 100,
  reps: 5,
  rir: 1,
  targetReps: 8,
  targetRir: 2,
  increment: 2.5,
})
assert.equal(rirTarget.targetWeight, 87.5)
assert.equal(rirTarget.rpe, 8)

const max = calculateOneRepMax({
  weight: 100,
  reps: 5,
  rir: 1,
  formula: 'jacked',
  increment: 2.5,
})
assert.equal(max.estimated1RM, 117.5)
assert.equal(max.repMaxes.find((item) => item.reps === 5).weight, 102.5)
assert.equal(max.usefulTarget.weight, 87.5)

const plates = calculatePlateLoad({
  targetWeight: 82.5,
  barWeight: 20,
  collarsEach: 0,
  plates: [25, 20, 15, 10, 5, 2.5, 1.25],
})
assert.deepEqual(plates.eachSide, [20, 10, 1.25])
assert.equal(plates.actualWeight, 82.5)

const inexactPlates = calculatePlateLoad({
  targetWeight: 83,
  barWeight: 20,
  collarsEach: 0,
  plates: [20, 10, 5, 2.5],
})
assert.equal(inexactPlates.actualWeight, 80)
assert.deepEqual(inexactPlates.nearest, [80, 85])
assert.equal(inexactPlates.remaining, 3)

const warmups = calculateWarmups({
  movementType: 'squat',
  targetWeight: 125,
  targetReps: 8,
  increment: 2.5,
  lastExposure: '8+ days',
  status: 'normal',
  preference: 'standard',
})
assert.deepEqual(warmups.sets.map((set) => set.weight), [50, 75, 95, 112.5])
assert.match(warmups.reason, /4 warm-ups/i)

const volume = calculateVolume({
  chest: 16,
  back: 20,
  quads: 8,
  hamstrings: 4,
  glutes: 6,
  sideDelts: 10,
  rearDelts: 6,
  biceps: 8,
  triceps: 8,
  calves: 2,
  abs: 4,
  trainingAge: 'intermediate',
  goal: 'hypertrophy',
  recovery: 'normal',
  performanceTrend: 'up',
  soreness: 'normal',
})
assert.equal(volume.muscles.find((item) => item.key === 'chest').status, 'Productive range')
assert.equal(volume.muscles.find((item) => item.key === 'hamstrings').status, 'Likely low')
assert.match(volume.nextAction, /hamstring/i)

const deload = calculateDeload({
  weeksSinceDeload: 9,
  performance: 'down',
  missedTargets: '2+ workouts',
  soreness: 'high',
  jointDiscomfort: 'mild',
  sleep: 'poor',
  motivation: 'low',
  stress: 'high',
})
assert.equal(deload.recommendation, 'Deload this week')
assert.match(deload.suggestedChange, /40-50%/)

const split = calculateWorkoutSplit({
  days: 4,
  goal: 'hypertrophy',
  sessionLength: '60',
  equipment: 'commercial gym',
  experience: 'intermediate',
  focus: 'chest',
})
assert.equal(split.name, '4-day Upper / Lower')
assert.deepEqual(split.week.map((day) => day.name), ['Mon Upper A', 'Tue Lower A', 'Thu Upper B', 'Sat Lower B'])
assert.ok(split.week.every((day) => day.exercises.length >= 5))
assert.deepEqual(split.week[0].exercises.slice(0, 3).map((exercise) => exercise.name), ['Bench Press', 'Chest-Supported Row', 'Incline Dumbbell Press'])
assert.equal(split.week[0].exercises[0].sets, 3)
assert.equal(split.week[0].exercises[0].reps, '6-10')
assert.match(split.week[0].exercises[0].rest, /2-3 min/)
assert.ok(split.week[0].exercises.some((exercise) => exercise.name === 'Cable Fly'))
assert.ok(split.week[2].exercises.some((exercise) => exercise.name === 'Machine Chest Press'))
assert.ok(split.week[1].exercises.some((exercise) => exercise.name === 'Leg Press'))
assert.ok(split.week[3].exercises.some((exercise) => exercise.name === 'Seated Leg Curl'))
assert.ok(split.week.every((day) => day.estimatedMinutes <= 60))
assert.ok(split.weeklyVolume.find((item) => item.muscle === 'Chest' && item.sets >= 14 && item.frequency === 2))
assert.ok(split.progression.some((rule) => /rep range/i.test(rule)))

const dumbbellSplit = calculateWorkoutSplit({
  days: 3,
  goal: 'strength + size',
  sessionLength: '45',
  equipment: 'dumbbells only',
  experience: 'beginner',
  focus: 'quads',
})
assert.equal(dumbbellSplit.name, '3-day Full Body')
assert.equal(dumbbellSplit.week.length, 3)
assert.ok(dumbbellSplit.week.every((day) => day.exercises.length <= 6))
assert.ok(dumbbellSplit.week.flatMap((day) => day.exercises).every((exercise) => !/Cable|Machine|Barbell|Pulldown|Leg Press/i.test(exercise.name)))
assert.ok(dumbbellSplit.week.flatMap((day) => day.exercises).some((exercise) => /Goblet Squat|Bulgarian Split Squat/i.test(exercise.name)))
assert.ok(dumbbellSplit.weeklyVolume.find((item) => item.muscle === 'Quads' && item.sets >= 8))

const swaps = calculateExerciseSwaps({
  exercise: 'barbell back squat',
  reason: 'too much fatigue',
  equipment: 'commercial gym',
  goal: 'less fatigue',
})
assert.equal(swaps.options[0].name, 'Leg press')
assert.match(swaps.options[0].reason, /less axial fatigue/i)

const legPressSwaps = calculateExerciseSwaps({
  exercise: 'leg press',
  reason: 'machine taken',
  equipment: 'commercial gym',
  goal: 'similar movement',
})
assert.ok(legPressSwaps.options.some((option) => option.name === 'Hack squat'))
assert.ok(!legPressSwaps.options.some((option) => option.name === 'Leg press'))
assert.ok(!legPressSwaps.options.some((option) => option.name === 'Romanian deadlift'))

const hevy = calculateHevyImportPreview(`Date,Exercise Name,Set Order,Weight,Reps,Distance,Duration,Notes
2026-01-01,Bench Press,1,80,10,,,
2026-01-01,Bench Press,2,80,8,,,
2026-01-03,Squat,1,120,5,,,
`)
assert.equal(hevy.workouts, 2)
assert.equal(hevy.sets, 3)
assert.equal(hevy.exercises, 2)
assert.equal(hevy.matchConfidence, 91)

const strongImport = calculateStrongImportPreview(`Date,Workout Name,Exercise Name,Set Order,Weight,Reps,Distance,Seconds,Notes
2026-01-01,Upper,Bench Press,1,80,10,,,
2026-01-01,Upper,Bench Press,2,80,8,,,
2026-01-02,Lower,Leg Press,1,200,12,,,
`)
assert.equal(strongImport.ready, true)
assert.equal(strongImport.workouts, 2)
assert.equal(strongImport.sets, 3)
assert.equal(strongImport.exercises, 2)
assert.match(strongImport.nextAction, /Jacked/i)

const fitNotesImport = calculateFitNotesImportPreview(`Date,Exercise,Category,Weight (kg),Weight (lbs),Reps,Distance,Distance Unit,Time,Notes,Kind
2026-01-06,Bench Press,Chest,100,,5,,,,Paused reps,wr
2026-01-06,Bench Press,Chest,90,,8,,,,Backoff,wr
2026-01-07,Treadmill,Cardio,,,,5,km,30:00,Zone 2,dt
`)
assert.equal(fitNotesImport.ready, true)
assert.equal(fitNotesImport.status, 'FitNotes shape looks ready')
assert.equal(fitNotesImport.workouts, 2)
assert.equal(fitNotesImport.sets, 3)
assert.equal(fitNotesImport.strengthRows, 2)
assert.equal(fitNotesImport.cardioRows, 1)

const brokenFitNotesImport = calculateFitNotesImportPreview(`Date,Movement,Weight (kg),Reps
2026-01-06,Bench Press,100,5
`)
assert.equal(brokenFitNotesImport.ready, false)
assert.ok(brokenFitNotesImport.issues.some((issue) => issue.field === 'exercise' && issue.severity === 'blocker'))

const csvValidation = calculateWorkoutCsvValidation(`Date,Workout Name,Exercise Name,Set Order,Weight,Reps
2026-01-01,Upper,Bench Press,1,80,10
2026-01-01,Upper,,2,80,8
`)
assert.equal(csvValidation.status, 'Fix before import')
assert.ok(csvValidation.issues.some((issue) => issue.field === 'exercise'))
assert.match(csvValidation.nextAction, /exercise/i)

const restTime = calculateRestTime({
  movementType: 'squat',
  goal: 'strength + size',
  reps: 6,
  rir: 1,
  lastSetDifficulty: 'grindy',
  nextSetPriority: 'load',
  timePressure: 'normal',
})
assert.equal(restTime.seconds, 240)
assert.match(restTime.nextAction, /4:00/)
assert.match(restTime.reason, /heavy/i)

const backoff = calculateBackoffSets({
  units: 'kg',
  topSetWeight: 120,
  topSetReps: 5,
  topSetRir: 1,
  goal: 'strength + size',
  backoffSets: 3,
  backoffReps: 8,
  fatigue: 'normal',
  readiness: 'normal',
  increment: 2.5,
})
assert.equal(backoff.sets.length, 3)
assert.equal(backoff.sets[0].weight, 102.5)
assert.match(backoff.reason, /drop/i)

const strengthLevel = calculateStrengthLevel({
  sex: 'male',
  age: 29,
  bodyweight: 82,
  exercise: 'Bench press',
  liftWeight: 100,
  reps: 5,
  rir: 1,
  units: 'kg',
  increment: 2.5,
})
assert.equal(strengthLevel.estimated1RM, 117.5)
assert.equal(strengthLevel.level, 'Intermediate')
assert.equal(strengthLevel.nextLevel, 'Advanced')
assert.equal(strengthLevel.nextLevelTarget, 122.5)
assert.equal(strengthLevel.gapToNextLevel, 5)
assert.match(strengthLevel.nextAction, /add 5 kg/i)
assert.equal(strengthLevel.standards.find((item) => item.level === 'Advanced').target, 122.5)
assert.equal(strengthLevel.confidence.label, 'High confidence')

function calculateDefaultForTool(tool) {
  const values = tool.defaults
  if (tool.type === 'next-set') return calculateNextSet(values)
  if (tool.type === 'rir') return calculateRirTarget(values)
  if (tool.type === 'one-rm') return calculateOneRepMax(values)
  if (tool.type === 'strength-level') return calculateStrengthLevel(values)
  if (tool.type === 'plates') {
    return calculatePlateLoad({
      ...values,
      plates: String(values.plates || '')
        .split(',')
        .map((plate) => Number(plate.trim()))
        .filter((plate) => Number.isFinite(plate) && plate > 0),
    })
  }
  if (tool.type === 'warmup') return calculateWarmups(values)
  if (tool.type === 'volume') return calculateVolume(values)
  if (tool.type === 'deload') return calculateDeload(values)
  if (tool.type === 'split') return calculateWorkoutSplit(values)
  if (tool.type === 'swaps') return calculateExerciseSwaps(values)
  if (tool.type === 'strong-import') return calculateStrongImportPreview(values.csvText)
  if (tool.type === 'fitnotes-import') return calculateFitNotesImportPreview(values.csvText)
  if (tool.type === 'csv-validator') return calculateWorkoutCsvValidation(values.csvText)
  if (tool.type === 'rest-time') return calculateRestTime(values)
  if (tool.type === 'backoff') return calculateBackoffSets(values)
  if (tool.type === 'hevy') return calculateHevyImportPreview(values.csvText)
  throw new Error(`Unsupported tool type: ${tool.type}`)
}

for (const tool of tools) {
  const result = calculateDefaultForTool(tool)
  assert.equal(typeof result, 'object', `${tool.slug} should return an object`)
  if (tool.type === 'split') assert.ok(result.week.every((day) => day.exercises?.length), `${tool.slug} should return day exercises`)
  if (tool.type === 'swaps') assert.ok(result.options.length > 0, `${tool.slug} should return swap options`)
  if (tool.type === 'warmup') assert.ok(result.sets.length > 0, `${tool.slug} should return warm-up sets`)
}

console.log('calculator tests passed')
