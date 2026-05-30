const DEFAULT_INCREMENT = 2.5

function numeric(value, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export function roundToIncrement(value, increment = DEFAULT_INCREMENT) {
  const step = Math.max(numeric(increment, DEFAULT_INCREMENT), 0.01)
  return Number((Math.round(numeric(value) / step) * step).toFixed(2))
}

function roundDisplay(value) {
  return Number(numeric(value).toFixed(1).replace(/\.0$/, ''))
}

function epley(weight, repsToFailure) {
  return weight * (1 + repsToFailure / 30)
}

function brzycki(weight, repsToFailure) {
  if (repsToFailure >= 37) return null
  return weight * 36 / (37 - repsToFailure)
}

function lander(weight, repsToFailure) {
  const denominator = 101.3 - (2.67123 * repsToFailure)
  if (denominator <= 0) return null
  return (100 * weight) / denominator
}

function inverseEpley(e1rm, repsToFailure) {
  return e1rm / (1 + repsToFailure / 30)
}

function inverseBrzycki(e1rm, repsToFailure) {
  if (repsToFailure >= 37) return null
  return e1rm * (37 - repsToFailure) / 36
}

function confidenceFor(repsToFailure) {
  if (repsToFailure >= 4 && repsToFailure <= 12) {
    return {
      label: 'High confidence',
      text: 'Based on a recent set in the 4-12 rep range with clear effort data.',
    }
  }

  if (repsToFailure <= 15) {
    return {
      label: 'Medium confidence',
      text: 'Useful estimate, but cleaner data comes from moderately hard sets.',
    }
  }

  return {
    label: 'Lower confidence',
    text: 'High-rep estimates are noisier, so use this as a direction rather than a max.',
  }
}

export function estimateE1RM({ weight, reps, rir = 0, formula = 'jacked', increment = 1 }) {
  const load = Math.max(numeric(weight), 0)
  const completedReps = Math.max(numeric(reps), 1)
  const repsInReserve = Math.max(numeric(rir), 0)
  const repsToFailure = completedReps + repsInReserve
  const formulas = {
    epley: [epley(load, repsToFailure)],
    brzycki: [brzycki(load, repsToFailure)],
    lander: [lander(load, repsToFailure)],
    jacked: [epley(load, repsToFailure), brzycki(load, repsToFailure)].filter(Boolean),
  }
  const values = (formulas[formula] || formulas.jacked).filter(Boolean)
  const raw = values.reduce((sum, value) => sum + value, 0) / Math.max(values.length, 1)

  return {
    raw,
    rounded: roundToIncrement(raw, increment),
    repsToFailure,
    confidence: confidenceFor(repsToFailure),
  }
}

function targetLoadFromE1RM(e1rm, repsToFailure, increment) {
  const estimates = [inverseEpley(e1rm, repsToFailure), inverseBrzycki(e1rm, repsToFailure)].filter(Boolean)
  const raw = estimates.reduce((sum, value) => sum + value, 0) / Math.max(estimates.length, 1)
  return roundToIncrement(raw, increment)
}

export function calculateNextSet({
  weight,
  reps,
  rir = 2,
  minReps = 8,
  maxReps = 10,
  targetRir = 2,
  increment = DEFAULT_INCREMENT,
  units = 'kg',
}) {
  const load = numeric(weight)
  const completedReps = numeric(reps)
  const repsInReserve = numeric(rir)
  let repMin = numeric(minReps, 8)
  let repMax = numeric(maxReps, 10)
  if (repMin > repMax) {
    const originalMin = repMin
    repMin = repMax
    repMax = originalMin
  }
  const desiredRir = numeric(targetRir, 2)
  const step = numeric(increment, DEFAULT_INCREMENT)
  let targetWeight = load
  let targetRepText = `${repMin}-${repMax}`
  let reason = 'Hold load and build a cleaner signal next time.'
  let nextAction = 'Repeat the set and log reps plus RIR.'
  let conservativeWeight = load
  let conservativeRepText = `${Math.max(repMin, completedReps)}-${repMax}`

  if (completedReps >= repMax && repsInReserve >= desiredRir) {
    targetWeight = roundToIncrement(load + step, step)
    reason = `Increase load because you hit the top of the rep range with ${repsInReserve} RIR.`
    nextAction = `Try ${targetWeight} ${units} for ${repMin}-${repMax} reps at ${desiredRir} RIR.`
    conservativeWeight = load
    conservativeRepText = `${Math.max(repMin, repMax - 1)}-${repMax}`
  } else if (completedReps >= repMax && repsInReserve < desiredRir) {
    reason = 'Hold load because reps were high but effort was harder than the target RIR.'
    nextAction = `Repeat ${load} ${units} and aim to match reps with cleaner effort.`
  } else if (completedReps >= repMin && Math.abs(repsInReserve - desiredRir) <= 1) {
    reason = 'Hold load and add reps because you are inside the target range near the target RIR.'
    targetRepText = `${Math.min(completedReps + 1, repMax)}-${repMax}`
    conservativeRepText = `${completedReps}-${repMax}`
    nextAction = `Keep ${load} ${units} and aim for one more rep before adding weight.`
  } else if (completedReps < repMin && repsInReserve <= Math.max(desiredRir - 1, 0)) {
    targetWeight = roundToIncrement(Math.max(load - step, step), step)
    reason = 'Reduce load because reps were below range and effort was too close to failure.'
    targetRepText = `${repMin}-${repMax}`
    conservativeWeight = targetWeight
    conservativeRepText = `${repMin}-${repMax}`
    nextAction = `Use ${targetWeight} ${units} to get back into the planned rep range.`
  } else if (completedReps < repMin && repsInReserve >= desiredRir + 3) {
    reason = 'Recheck technique, range of motion, or logging before jumping load.'
    nextAction = 'The set looks easy but below range, which is usually a logging or execution signal.'
  } else {
    reason = 'Hold load because the set does not justify a load jump yet.'
    nextAction = `Repeat ${load} ${units} and aim for more reps at the same RIR.`
  }

  const e1rm = estimateE1RM({ weight: load, reps: completedReps, rir: repsInReserve })

  return {
    targetWeight,
    targetRepText,
    targetRir: desiredRir,
    reason,
    nextAction,
    conservative: {
      weight: conservativeWeight,
      repText: conservativeRepText,
      targetRir: desiredRir,
    },
    confidence: e1rm.confidence,
    e1rm: e1rm.rounded,
  }
}

export function calculateRirTarget({
  weight,
  reps,
  rir = 2,
  targetReps = 8,
  targetRir = 2,
  increment = DEFAULT_INCREMENT,
}) {
  const e1rm = estimateE1RM({ weight, reps, rir })
  const targetRepsToFailure = numeric(targetReps, 8) + numeric(targetRir, 2)
  const targetWeight = targetLoadFromE1RM(e1rm.raw, targetRepsToFailure, increment)

  return {
    estimated1RM: roundToIncrement(e1rm.raw, increment),
    targetWeight,
    targetReps: numeric(targetReps, 8),
    targetRir: numeric(targetRir, 2),
    rpe: 10 - numeric(targetRir, 2),
    confidence: e1rm.confidence,
    table: Array.from({ length: 15 }, (_, index) => {
      const repsValue = index + 1
      return {
        reps: repsValue,
        loads: Array.from({ length: 6 }, (_, tableRir) => ({
          rir: tableRir,
          weight: targetLoadFromE1RM(e1rm.raw, repsValue + tableRir, increment),
        })),
      }
    }),
  }
}

export function calculateOneRepMax({
  weight,
  reps,
  rir = 0,
  formula = 'jacked',
  increment = DEFAULT_INCREMENT,
}) {
  const e1rm = estimateE1RM({ weight, reps, rir, formula, increment })
  const repMaxes = [2, 3, 5, 8, 10, 12].map((repValue) => ({
    reps: repValue,
    weight: targetLoadFromE1RM(e1rm.raw, repValue, increment),
  }))
  const percentages = [60, 65, 70, 75, 80, 85, 90].map((percent) => ({
    percent,
    weight: roundToIncrement(e1rm.raw * (percent / 100), increment),
  }))
  const usefulTarget = calculateRirTarget({
    weight,
    reps,
    rir,
    targetReps: 8,
    targetRir: 2,
    increment,
  })

  return {
    estimated1RM: e1rm.rounded,
    confidence: e1rm.confidence,
    repMaxes,
    percentages,
    usefulTarget: {
      weight: usefulTarget.targetWeight,
      reps: 8,
      rir: 2,
    },
  }
}

const strengthLevelLabels = ['Beginner', 'Novice', 'Intermediate', 'Advanced', 'Elite']

const strengthStandardRatios = {
  male: {
    'bench press': [0.55, 0.85, 1.15, 1.5, 1.9],
    squat: [0.75, 1.1, 1.5, 2, 2.45],
    deadlift: [0.9, 1.3, 1.75, 2.25, 2.75],
    'overhead press': [0.35, 0.55, 0.75, 1, 1.25],
    'barbell row': [0.5, 0.8, 1.1, 1.4, 1.75],
    'incline dumbbell press': [0.3, 0.45, 0.62, 0.82, 1],
    'dumbbell bench press': [0.35, 0.55, 0.75, 1, 1.2],
    'romanian deadlift': [0.7, 1.05, 1.4, 1.8, 2.2],
    'leg press': [1.2, 1.8, 2.5, 3.3, 4.1],
    'lat pulldown': [0.45, 0.7, 0.95, 1.2, 1.5],
    'barbell curl': [0.2, 0.32, 0.45, 0.6, 0.75],
    'lateral raise': [0.07, 0.11, 0.16, 0.22, 0.3],
  },
  female: {
    'bench press': [0.3, 0.45, 0.65, 0.9, 1.15],
    squat: [0.5, 0.75, 1.05, 1.4, 1.8],
    deadlift: [0.6, 0.9, 1.25, 1.65, 2.05],
    'overhead press': [0.2, 0.32, 0.45, 0.62, 0.78],
    'barbell row': [0.35, 0.52, 0.75, 1, 1.25],
    'incline dumbbell press': [0.18, 0.28, 0.4, 0.55, 0.7],
    'dumbbell bench press': [0.22, 0.35, 0.5, 0.68, 0.85],
    'romanian deadlift': [0.45, 0.7, 1, 1.35, 1.7],
    'leg press': [0.9, 1.35, 1.9, 2.55, 3.25],
    'lat pulldown': [0.32, 0.5, 0.7, 0.92, 1.15],
    'barbell curl': [0.14, 0.22, 0.32, 0.43, 0.55],
    'lateral raise': [0.045, 0.075, 0.11, 0.16, 0.22],
  },
}

function normalizedExerciseName(exercise) {
  const value = String(exercise || '').trim().toLowerCase()
  if (value.includes('bench') && value.includes('dumbbell')) return 'dumbbell bench press'
  if (value.includes('incline')) return 'incline dumbbell press'
  if (value.includes('bench')) return 'bench press'
  if (value.includes('squat')) return 'squat'
  if (value.includes('romanian') || value === 'rdl') return 'romanian deadlift'
  if (value.includes('deadlift')) return 'deadlift'
  if (value.includes('overhead') || value.includes('shoulder press')) return 'overhead press'
  if (value.includes('row')) return 'barbell row'
  if (value.includes('leg press')) return 'leg press'
  if (value.includes('pulldown') || value.includes('pull down')) return 'lat pulldown'
  if (value.includes('curl')) return 'barbell curl'
  if (value.includes('lateral raise')) return 'lateral raise'
  return 'bench press'
}

function ageContext(age) {
  const years = numeric(age, 30)
  if (years < 18) return 'Teen lifters vary heavily by training age and growth. Use this as a loose reference.'
  if (years < 40) return 'Compared against adult practical standards.'
  if (years < 50) return 'Age can change recovery and peak strength. Treat the gap as a planning target, not a verdict.'
  if (years < 60) return 'For 50+ lifters, trend and joint tolerance matter more than chasing a table quickly.'
  return 'For 60+ lifters, use the level as context and prioritize repeatable training, recovery, and joint tolerance.'
}

export function calculateStrengthLevel({
  sex = 'male',
  age = 30,
  bodyweight,
  exercise = 'Bench press',
  liftWeight,
  reps = 1,
  rir = 0,
  units = 'kg',
  increment = DEFAULT_INCREMENT,
}) {
  const sexKey = String(sex).toLowerCase() === 'female' ? 'female' : 'male'
  const exerciseKey = normalizedExerciseName(exercise)
  const bodyMass = Math.max(numeric(bodyweight), 1)
  const e1rm = estimateE1RM({ weight: liftWeight, reps, rir, increment })
  const ratio = e1rm.raw / bodyMass
  const ratios = strengthStandardRatios[sexKey][exerciseKey] || strengthStandardRatios[sexKey]['bench press']
  const standards = ratios.map((standardRatio, index) => ({
    level: strengthLevelLabels[index],
    ratio: Number(standardRatio.toFixed(2)),
    target: roundToIncrement(bodyMass * standardRatio, increment),
  }))
  let levelIndex = 0

  for (let index = 0; index < ratios.length; index++) {
    if (ratio >= ratios[index]) levelIndex = index
  }

  const nextLevelIndex = Math.min(levelIndex + 1, standards.length - 1)
  const nextLevel = standards[nextLevelIndex]
  const isTopLevel = nextLevelIndex === levelIndex
  const gap = isTopLevel ? 0 : Math.max(roundToIncrement(nextLevel.target - e1rm.rounded, increment), 0)
  const liftName = exerciseKey.split(' ').map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`).join(' ')
  const actionTarget = isTopLevel
    ? `Keep building ${liftName.toLowerCase()} with repeatable sets and watch e1RM trend over several weeks.`
    : gap <= numeric(increment, DEFAULT_INCREMENT) * 2
      ? `Add ${gap} ${units} to reach ${nextLevel.level}, using small jumps and clean reps.`
      : `Build toward ${nextLevel.level} by closing a ${gap} ${units} e1RM gap with steady rep and load progression.`

  return {
    exercise: liftName,
    level: standards[levelIndex].level,
    nextLevel: isTopLevel ? 'Maintain Elite' : nextLevel.level,
    estimated1RM: e1rm.rounded,
    bodyweightRatio: Number(ratio.toFixed(2)),
    nextLevelTarget: nextLevel.target,
    gapToNextLevel: gap,
    standards,
    confidence: e1rm.confidence,
    nextAction: actionTarget,
    why: `${liftName} e1RM is ${roundDisplay(e1rm.rounded)} ${units}, which is ${Number(ratio.toFixed(2))}x bodyweight for a ${sexKey} lifter at ${roundDisplay(bodyMass)} ${units}.`,
    caveat: `These are transparent Jacked practical standards, not federation records or copied user-population data. ${ageContext(age)}`,
  }
}

export function calculatePlateLoad({
  targetWeight,
  barWeight = 20,
  collarsEach = 0,
  plates = [25, 20, 15, 10, 5, 2.5, 1.25],
  loadStyle = 'balanced',
}) {
  const target = numeric(targetWeight)
  const fixed = numeric(barWeight) + numeric(collarsEach) * 2
  let sideRemaining = Math.max((target - fixed) / 2, 0)
  const inventory = plates.map((plate) => numeric(plate)).filter((plate) => plate > 0).sort((a, b) => b - a)
  const loadingInventory = loadStyle === 'fewest'
    ? inventory
    : inventory.filter((plate) => !(sideRemaining < 40 && plate > 20))
  const eachSide = []

  for (const plate of loadingInventory.length ? loadingInventory : inventory) {
    while (sideRemaining + 0.0001 >= plate) {
      eachSide.push(plate)
      sideRemaining = Number((sideRemaining - plate).toFixed(4))
    }
  }

  const sideLoaded = eachSide.reduce((sum, plate) => sum + plate, 0)
  const actualWeight = roundDisplay(fixed + sideLoaded * 2)
  const nearest = nearestReachableLoads(target, fixed, inventory)

  return {
    eachSide,
    actualWeight,
    barWeight: numeric(barWeight),
    collarsTotal: numeric(collarsEach) * 2,
    remaining: roundDisplay(target - actualWeight),
    nearest,
  }
}

function nearestReachableLoads(target, fixed, inventory) {
  if (!inventory.length) return [roundDisplay(Math.max(fixed, 0))]

  const scale = 100
  const scaledPlates = [...new Set(inventory.map((plate) => Math.round(plate * scale)).filter((plate) => plate > 0))]
  const sideTarget = Math.max((numeric(target) - numeric(fixed)) / 2, 0)
  const maxPlate = Math.max(...scaledPlates)
  const sideLimit = Math.ceil(sideTarget * scale) + maxPlate
  const reachable = Array(sideLimit + 1).fill(false)
  reachable[0] = true

  for (const plate of scaledPlates) {
    for (let load = plate; load <= sideLimit; load++) {
      if (reachable[load - plate]) reachable[load] = true
    }
  }

  let lower = null
  let upper = null
  const targetScaled = Math.round(numeric(target) * scale)
  const fixedScaled = Math.round(numeric(fixed) * scale)

  for (let side = 0; side <= sideLimit; side++) {
    if (!reachable[side]) continue
    const total = fixedScaled + side * 2
    if (total <= targetScaled) lower = total
    if (total >= targetScaled) {
      upper = total
      break
    }
  }

  return [...new Set([lower, upper]
    .filter((value) => value !== null)
    .map((value) => roundDisplay(value / scale)))]
}

export function calculateWarmups({
  movementType = 'squat',
  targetWeight,
  targetReps = 8,
  increment = DEFAULT_INCREMENT,
  lastExposure = '1-3 days',
  status = 'normal',
  preference = 'standard',
}) {
  const target = numeric(targetWeight)
  const compound = ['squat', 'hinge', 'horizontal press', 'vertical press', 'row / pull'].includes(movementType)
  let percentages = compound ? [0.4, 0.6, 0.75] : [0.5]

  if (compound && (target >= 100 || preference === 'thorough')) percentages.push(0.9)
  if (movementType === 'isolation' && preference !== 'minimal' && target >= 30) percentages.push(0.7)
  if (preference === 'minimal') percentages = percentages.slice(0, Math.max(1, percentages.length - 1))
  if ((lastExposure === '8+ days' || status === 'sore' || status === 'cautious') && compound && !percentages.includes(0.9)) {
    percentages.push(0.85)
  }

  const repsFor = (percent) => {
    if (percent <= 0.5) return Math.min(8, numeric(targetReps, 8))
    if (percent <= 0.7) return 5
    if (percent <= 0.8) return 3
    return 1
  }

  const sets = percentages
    .sort((a, b) => a - b)
    .map((percent) => ({
      weight: roundToIncrement(target * percent, increment),
      reps: repsFor(percent),
      percent: Math.round(percent * 100),
    }))
    .filter((set, index, list) => set.weight > 0 && list.findIndex((candidate) => candidate.weight === set.weight) === index)

  const reasonBits = [
    `${sets.length} warm-ups because ${movementType} target is ${roundDisplay(target)}`,
    lastExposure === '8+ days' ? 'and your last heavy exposure was over a week ago' : '',
    status === 'sore' || status === 'cautious' ? `with a ${status} status` : '',
  ].filter(Boolean)

  return {
    sets,
    working: {
      weight: roundDisplay(target),
      reps: numeric(targetReps, 8),
    },
    reason: `${reasonBits.join(' ')}.`,
  }
}

const muscleLabels = {
  chest: 'Chest',
  back: 'Back',
  quads: 'Quads',
  hamstrings: 'Hamstrings',
  glutes: 'Glutes',
  sideDelts: 'Side delts',
  rearDelts: 'Rear delts',
  biceps: 'Biceps',
  triceps: 'Triceps',
  calves: 'Calves',
  abs: 'Abs',
}

function volumeRange(trainingAge, goal, recovery) {
  let low = 6
  let high = 16

  if (trainingAge === 'beginner') {
    low = 4
    high = 12
  } else if (trainingAge === 'advanced') {
    low = 8
    high = 20
  }

  if (goal === 'maintenance') {
    low = Math.max(2, low - 3)
    high -= 5
  } else if (goal === 'strength') {
    low = Math.max(3, low - 2)
    high -= 2
  }

  if (recovery === 'poor') high -= 3
  if (recovery === 'good') high += 2

  return { low, high: Math.max(low + 4, high) }
}

export function calculateVolume(values) {
  const range = volumeRange(values.trainingAge || 'intermediate', values.goal || 'hypertrophy', values.recovery || 'normal')
  const soreness = values.soreness || 'normal'
  const performanceTrend = values.performanceTrend || 'flat'
  const muscles = Object.entries(muscleLabels).map(([key, label]) => {
    const sets = Math.max(numeric(values[key]), 0)
    let status = 'Productive range'
    let note = 'Keep this stable while performance is moving.'

    if (sets < range.low) {
      status = 'Likely low'
      note = `Below the practical ${range.low}-${range.high} set range for this context.`
    } else if (sets > range.high + 4 || (sets > range.high && (soreness === 'high' || performanceTrend === 'down'))) {
      status = 'Hard to recover from'
      note = 'High volume plus recovery or performance signals suggests pulling back.'
    } else if (sets > range.high) {
      status = 'High but recoverable'
      note = 'Above the usual range, but not automatically wrong if performance is stable.'
    }

    return { key, label, sets, status, note }
  })

  const lowMuscle = muscles.find((muscle) => muscle.status === 'Likely low')
  const hardMuscle = muscles.find((muscle) => muscle.status === 'Hard to recover from')
  const highMuscle = muscles.find((muscle) => muscle.status === 'High but recoverable')
  const nextAction = hardMuscle
    ? `Reduce ${hardMuscle.label.toLowerCase()} by 2-4 hard sets before adding more work.`
    : lowMuscle
      ? `Add 1-2 ${lowMuscle.label.toLowerCase()} sets this week before adding more ${highMuscle?.label.toLowerCase() || 'already productive'} work.`
      : highMuscle
        ? `Hold ${highMuscle.label.toLowerCase()} steady and add volume only where performance is still improving.`
        : 'Keep volume stable and progress load, reps, or execution quality before adding sets.'

  const summary = hardMuscle
    ? 'Recovery signal is the limiter.'
    : lowMuscle
      ? 'Volume trend is clear.'
      : 'Volume is broadly productive.'

  return {
    range,
    muscles,
    summary,
    nextAction,
    caveat: 'This is a practical volume check, not a diagnosis. Your best volume depends on exercise selection, effort, recovery, and training history.',
  }
}

export function calculateDeload({
  weeksSinceDeload = 4,
  performance = 'flat',
  missedTargets = 'none',
  soreness = 'normal',
  jointDiscomfort = 'none',
  sleep = 'normal',
  motivation = 'normal',
  stress = 'normal',
}) {
  let score = 0
  const reasons = []
  const add = (points, reason) => {
    score += points
    if (reason) reasons.push(reason)
  }

  if (numeric(weeksSinceDeload) >= 8) add(2, `${weeksSinceDeload} weeks since your last deload`)
  else if (numeric(weeksSinceDeload) >= 5) add(1, `${weeksSinceDeload} weeks since your last deload`)

  if (performance === 'down') add(3, 'performance is down')
  else if (performance === 'flat') add(1, 'performance is flat')
  if (missedTargets === '2+ workouts') add(3, 'you missed targets in 2+ recent workouts')
  else if (missedTargets === '1 workout') add(1, 'you missed a recent target')
  if (soreness === 'high') add(2, 'soreness is high')
  if (jointDiscomfort === 'mild') add(1, 'joint discomfort is mild')
  if (jointDiscomfort === 'significant') add(4, 'joint discomfort is significant')
  if (sleep === 'poor') add(2, 'sleep is poor')
  if (motivation === 'low') add(1, 'motivation is low')
  if (stress === 'high') add(2, 'work/life stress is high')

  let recommendation = 'Train normally'
  let suggestedChange = 'Keep the plan, keep 1-3 RIR on most working sets, and watch the next two sessions.'

  if (score >= 10 || jointDiscomfort === 'significant') {
    recommendation = 'Deload this week'
    suggestedChange = 'Cut total volume by 40-50%, keep movement patterns, and stay around 3-4 RIR.'
  } else if (score >= 6) {
    recommendation = 'Reduce volume this week'
    suggestedChange = 'Keep main lifts, cut accessory volume by 30-40%, and keep 2-3 RIR.'
  } else if (score >= 3) {
    recommendation = 'Train, but cap fatigue'
    suggestedChange = 'Run the session, avoid failure, and stop accessories early if performance drops.'
  }

  return {
    recommendation,
    why: reasons.length ? `${reasons.join(', ')}.` : 'Your recent signals do not strongly point toward a deload.',
    suggestedChange,
    score,
    safety: 'This is training guidance, not medical advice. Pain, injury, or persistent symptoms should be handled with a qualified professional.',
  }
}

export function calculateWorkoutSplit({
  days = 4,
  goal = 'hypertrophy',
  sessionLength = '60',
  equipment = 'commercial gym',
  experience = 'intermediate',
  focus = 'chest',
}) {
  const dayCount = numeric(days, 4)
  const lengthCap = sessionLength === '75+' ? 75 : numeric(sessionLength, 60)
  const kit = exerciseKit(equipment)
  const repPlan = repsForGoal(goal)
  const setPlan = setsForExperience(experience)
  let name = '4-day Upper / Lower'
  let why = '4 days gives each major muscle 2 exposures per week without forcing long sessions.'
  let builders = [
    ['Mon Upper A', 'Horizontal press, row, chest bias', () => upperA(kit, repPlan, setPlan)],
    ['Tue Lower A', 'Squat pattern, hamstrings, calves', () => lowerA(kit, repPlan, setPlan)],
    ['Thu Upper B', 'Vertical pull, incline press, arms', () => upperB(kit, repPlan, setPlan)],
    ['Sat Lower B', 'Hinge pattern, quads, glutes', () => lowerB(kit, repPlan, setPlan)],
  ]

  if (dayCount <= 2) {
    name = '2-day Full Body'
    builders = [
      ['Mon Full Body A', 'Squat, press, row, arms', () => fullBodyA(kit, repPlan, setPlan)],
      ['Thu Full Body B', 'Hinge, pull, single-leg, delts', () => fullBodyB(kit, repPlan, setPlan)],
    ]
    why = '2 days works best when each session trains the whole body.'
  } else if (dayCount === 3) {
    name = '3-day Full Body'
    builders = [
      ['Mon Full Body A', 'Squat and horizontal press', () => fullBodyA(kit, repPlan, setPlan)],
      ['Wed Full Body B', 'Hinge and vertical pull', () => fullBodyB(kit, repPlan, setPlan)],
      ['Fri Full Body C', 'Quad volume, incline press, arms', () => fullBodyC(kit, repPlan, setPlan)],
    ]
    why = '3 days gives high-frequency practice with enough recovery between sessions.'
  } else if (dayCount === 5) {
    name = '5-day Hybrid Split'
    builders = [
      ['Mon Upper', 'Press and row', () => upperA(kit, repPlan, setPlan)],
      ['Tue Lower', 'Squat and hamstrings', () => lowerA(kit, repPlan, setPlan)],
      ['Wed Push', 'Chest, delts, triceps', () => push(kit, repPlan, setPlan)],
      ['Fri Pull', 'Back, rear delts, biceps', () => pull(kit, repPlan, setPlan)],
      ['Sat Legs', 'Quads, glutes, calves', () => legs(kit, repPlan, setPlan)],
    ]
    why = '5 days lets you bias a muscle while keeping sessions shorter.'
  } else if (dayCount >= 6) {
    name = '6-day Push / Pull / Legs'
    builders = [
      ['Mon Push A', 'Bench and delts', () => pushA(kit, repPlan, setPlan)],
      ['Tue Pull A', 'Rows and lats', () => pullA(kit, repPlan, setPlan)],
      ['Wed Legs A', 'Squat and hamstrings', () => lowerA(kit, repPlan, setPlan)],
      ['Thu Push B', 'Incline and triceps', () => pushB(kit, repPlan, setPlan)],
      ['Fri Pull B', 'Vertical pull and rear delts', () => pullB(kit, repPlan, setPlan)],
      ['Sat Legs B', 'Hinge and quads', () => lowerB(kit, repPlan, setPlan)],
    ]
    why = '6 days supports frequent hypertrophy work if recovery is good and sessions stay controlled.'
  }

  const week = builders.map(([dayName, dayFocus, build]) => {
    const exercises = fitSession(applyFocus(build(), focus, kit, repPlan, setPlan, dayName), lengthCap)
    return {
      name: dayName,
      focus: dayFocus,
      exercises,
      estimatedMinutes: estimateSessionMinutes(exercises, lengthCap),
    }
  })
  const weeklyVolume = volumeSummary(week)

  return {
    name,
    week,
    why: `${why} ${goal === 'strength' ? 'Strength goals need more practice on main lifts.' : 'Hypertrophy goals need repeatable hard sets.'}`,
    sampleWorkout: week[0]?.exercises.map((exercise) => exercise.name) || [],
    weeklyVolume,
    progression: progressionRules(goal, experience),
    constraints: `${sessionLength} minute sessions, ${equipment}, ${experience} lifter, ${focus} focus.`,
  }
}

function exercise(name, sets, reps, muscles, rest, note = '') {
  return { name, sets, reps, muscles, rest, note }
}

function exerciseKit(equipment) {
  const kits = {
    'commercial gym': {
      bench: 'Bench Press',
      inclinePress: 'Incline Dumbbell Press',
      chestPress: 'Machine Chest Press',
      fly: 'Cable Fly',
      row: 'Chest-Supported Row',
      cableRow: 'Seated Cable Row',
      verticalPull: 'Lat Pulldown',
      pullover: 'Cable Pullover',
      squat: 'Back Squat',
      quad: 'Leg Press',
      hinge: 'Romanian Deadlift',
      hamstring: 'Seated Leg Curl',
      glute: 'Hip Thrust',
      singleLeg: 'Bulgarian Split Squat',
      overhead: 'Dumbbell Shoulder Press',
      lateral: 'Cable Lateral Raise',
      rearDelt: 'Reverse Pec Deck',
      triceps: 'Triceps Pressdown',
      biceps: 'Incline Dumbbell Curl',
      calves: 'Standing Calf Raise',
      abs: 'Cable Crunch',
    },
    'home gym': {
      bench: 'Dumbbell Bench Press',
      inclinePress: 'Incline Dumbbell Press',
      chestPress: 'Push-up',
      fly: 'Dumbbell Fly',
      row: 'One-arm Dumbbell Row',
      cableRow: 'Barbell Row',
      verticalPull: 'Pull-up',
      pullover: 'Dumbbell Pullover',
      squat: 'Back Squat',
      quad: 'Front Squat',
      hinge: 'Romanian Deadlift',
      hamstring: 'Sliding Leg Curl',
      glute: 'Barbell Hip Thrust',
      singleLeg: 'Bulgarian Split Squat',
      overhead: 'Dumbbell Shoulder Press',
      lateral: 'Dumbbell Lateral Raise',
      rearDelt: 'Rear Delt Dumbbell Fly',
      triceps: 'Dumbbell Skull Crusher',
      biceps: 'Dumbbell Curl',
      calves: 'Single-leg Calf Raise',
      abs: 'Weighted Plank',
    },
    'dumbbells only': {
      bench: 'Dumbbell Bench Press',
      inclinePress: 'Incline Dumbbell Press',
      chestPress: 'Push-up',
      fly: 'Dumbbell Fly',
      row: 'One-arm Dumbbell Row',
      cableRow: 'Chest-supported Dumbbell Row',
      verticalPull: 'Dumbbell Pullover',
      pullover: 'Dumbbell Pullover',
      squat: 'Goblet Squat',
      quad: 'Bulgarian Split Squat',
      hinge: 'Dumbbell Romanian Deadlift',
      hamstring: 'Dumbbell Leg Curl',
      glute: 'Dumbbell Hip Thrust',
      singleLeg: 'Dumbbell Step-up',
      overhead: 'Seated Dumbbell Press',
      lateral: 'Dumbbell Lateral Raise',
      rearDelt: 'Rear Delt Dumbbell Fly',
      triceps: 'Dumbbell Overhead Triceps Extension',
      biceps: 'Dumbbell Curl',
      calves: 'Single-leg Dumbbell Calf Raise',
      abs: 'Weighted Dead Bug',
    },
    'barbell only': {
      bench: 'Bench Press',
      inclinePress: 'Close-grip Bench Press',
      chestPress: 'Floor Press',
      fly: 'Wide-grip Push-up',
      row: 'Barbell Row',
      cableRow: 'Pendlay Row',
      verticalPull: 'Barbell Pullover',
      pullover: 'Barbell Pullover',
      squat: 'Back Squat',
      quad: 'Front Squat',
      hinge: 'Romanian Deadlift',
      hamstring: 'Good Morning',
      glute: 'Barbell Hip Thrust',
      singleLeg: 'Barbell Reverse Lunge',
      overhead: 'Overhead Press',
      lateral: 'Wide-grip Upright Row',
      rearDelt: 'Rear Delt Barbell Row',
      triceps: 'Close-grip Bench Press',
      biceps: 'Barbell Curl',
      calves: 'Standing Barbell Calf Raise',
      abs: 'Barbell Rollout',
    },
  }
  return kits[equipment] || kits['commercial gym']
}

function repsForGoal(goal) {
  if (goal === 'strength') {
    return { main: '3-6', secondary: '5-8', accessory: '8-12', isolation: '10-15', mainRest: '3-4 min', accessoryRest: '90-120 sec' }
  }
  if (goal === 'strength + size') {
    return { main: '4-8', secondary: '6-10', accessory: '8-12', isolation: '10-15', mainRest: '2-3 min', accessoryRest: '75-120 sec' }
  }
  return { main: '6-10', secondary: '8-12', accessory: '10-15', isolation: '12-20', mainRest: '2-3 min', accessoryRest: '60-90 sec' }
}

function setsForExperience(experience) {
  if (experience === 'beginner') return { main: 3, secondary: 2, accessory: 2, focus: 2 }
  if (experience === 'advanced') return { main: 4, secondary: 3, accessory: 3, focus: 3 }
  return { main: 3, secondary: 3, accessory: 2, focus: 2 }
}

function upperA(kit, reps, sets) {
  return [
    exercise(kit.bench, sets.main, reps.main, ['Chest'], reps.mainRest, 'Stop with 1-3 reps in reserve.'),
    exercise(kit.row, sets.main, reps.secondary, ['Back'], reps.mainRest, 'Match press volume with a hard row.'),
    exercise(kit.inclinePress, sets.secondary, reps.secondary, ['Chest'], reps.mainRest),
    exercise(kit.verticalPull, sets.secondary, reps.accessory, ['Back'], reps.accessoryRest),
    exercise(kit.lateral, sets.accessory, reps.isolation, ['Delts'], reps.accessoryRest),
    exercise(kit.triceps, sets.accessory, reps.isolation, ['Triceps'], reps.accessoryRest),
    exercise(kit.biceps, sets.accessory, reps.isolation, ['Biceps'], reps.accessoryRest),
  ]
}

function upperB(kit, reps, sets) {
  return [
    exercise(kit.verticalPull, sets.main, reps.secondary, ['Back'], reps.mainRest),
    exercise(kit.inclinePress, sets.main, reps.main, ['Chest'], reps.mainRest),
    exercise(kit.cableRow, sets.secondary, reps.accessory, ['Back'], reps.mainRest),
    exercise(kit.chestPress, sets.secondary, reps.accessory, ['Chest'], reps.mainRest),
    exercise(kit.rearDelt, sets.accessory, reps.isolation, ['Delts'], reps.accessoryRest),
    exercise(kit.triceps, sets.accessory, reps.isolation, ['Triceps'], reps.accessoryRest),
    exercise(kit.biceps, sets.accessory, reps.isolation, ['Biceps'], reps.accessoryRest),
  ]
}

function lowerA(kit, reps, sets) {
  return [
    exercise(kit.squat, sets.main, reps.main, ['Quads'], reps.mainRest, 'Keep 1-2 reps in reserve on the top set.'),
    exercise(kit.hinge, sets.secondary, reps.secondary, ['Hamstrings'], reps.mainRest),
    exercise(kit.quad, sets.secondary, reps.accessory, ['Quads'], reps.mainRest),
    exercise(kit.hamstring, sets.accessory, reps.isolation, ['Hamstrings'], reps.accessoryRest),
    exercise(kit.calves, sets.accessory, reps.isolation, ['Calves'], reps.accessoryRest),
    exercise(kit.abs, sets.accessory, reps.isolation, ['Abs'], reps.accessoryRest),
  ]
}

function lowerB(kit, reps, sets) {
  return [
    exercise(kit.hinge, sets.main, reps.main, ['Hamstrings'], reps.mainRest),
    exercise(kit.singleLeg, sets.secondary, reps.accessory, ['Quads'], reps.mainRest),
    exercise(kit.glute, sets.secondary, reps.accessory, ['Glutes'], reps.mainRest),
    exercise(kit.quad, sets.accessory, reps.accessory, ['Quads'], reps.accessoryRest),
    exercise(kit.hamstring, sets.accessory, reps.isolation, ['Hamstrings'], reps.accessoryRest),
    exercise(kit.calves, sets.accessory, reps.isolation, ['Calves'], reps.accessoryRest),
  ]
}

function fullBodyA(kit, reps, sets) {
  return [
    exercise(kit.squat, sets.main, reps.main, ['Quads'], reps.mainRest),
    exercise(kit.bench, sets.main, reps.main, ['Chest'], reps.mainRest),
    exercise(kit.row, sets.secondary, reps.secondary, ['Back'], reps.mainRest),
    exercise(kit.hinge, sets.secondary, reps.accessory, ['Hamstrings'], reps.mainRest),
    exercise(kit.lateral, sets.accessory, reps.isolation, ['Delts'], reps.accessoryRest),
    exercise(kit.biceps, sets.accessory, reps.isolation, ['Biceps'], reps.accessoryRest),
  ]
}

function fullBodyB(kit, reps, sets) {
  return [
    exercise(kit.hinge, sets.main, reps.main, ['Hamstrings'], reps.mainRest),
    exercise(kit.verticalPull, sets.secondary, reps.secondary, ['Back'], reps.mainRest),
    exercise(kit.inclinePress, sets.secondary, reps.secondary, ['Chest'], reps.mainRest),
    exercise(kit.singleLeg, sets.secondary, reps.accessory, ['Quads'], reps.mainRest),
    exercise(kit.rearDelt, sets.accessory, reps.isolation, ['Delts'], reps.accessoryRest),
    exercise(kit.triceps, sets.accessory, reps.isolation, ['Triceps'], reps.accessoryRest),
  ]
}

function fullBodyC(kit, reps, sets) {
  return [
    exercise(kit.quad, sets.main, reps.accessory, ['Quads'], reps.mainRest),
    exercise(kit.chestPress, sets.secondary, reps.accessory, ['Chest'], reps.mainRest),
    exercise(kit.cableRow, sets.secondary, reps.accessory, ['Back'], reps.mainRest),
    exercise(kit.glute, sets.secondary, reps.accessory, ['Glutes'], reps.mainRest),
    exercise(kit.hamstring, sets.accessory, reps.isolation, ['Hamstrings'], reps.accessoryRest),
    exercise(kit.calves, sets.accessory, reps.isolation, ['Calves'], reps.accessoryRest),
  ]
}

function push(kit, reps, sets) {
  return [
    exercise(kit.inclinePress, sets.main, reps.main, ['Chest'], reps.mainRest),
    exercise(kit.chestPress, sets.secondary, reps.accessory, ['Chest'], reps.mainRest),
    exercise(kit.overhead, sets.secondary, reps.accessory, ['Delts'], reps.mainRest),
    exercise(kit.fly, sets.accessory, reps.isolation, ['Chest'], reps.accessoryRest),
    exercise(kit.lateral, sets.accessory, reps.isolation, ['Delts'], reps.accessoryRest),
    exercise(kit.triceps, sets.accessory, reps.isolation, ['Triceps'], reps.accessoryRest),
  ]
}

function pull(kit, reps, sets) {
  return [
    exercise(kit.row, sets.main, reps.secondary, ['Back'], reps.mainRest),
    exercise(kit.verticalPull, sets.secondary, reps.accessory, ['Back'], reps.mainRest),
    exercise(kit.pullover, sets.accessory, reps.isolation, ['Back'], reps.accessoryRest),
    exercise(kit.rearDelt, sets.accessory, reps.isolation, ['Delts'], reps.accessoryRest),
    exercise(kit.biceps, sets.accessory, reps.isolation, ['Biceps'], reps.accessoryRest),
  ]
}

function legs(kit, reps, sets) {
  return [
    exercise(kit.squat, sets.main, reps.main, ['Quads'], reps.mainRest),
    exercise(kit.hinge, sets.secondary, reps.secondary, ['Hamstrings'], reps.mainRest),
    exercise(kit.quad, sets.secondary, reps.accessory, ['Quads'], reps.mainRest),
    exercise(kit.glute, sets.accessory, reps.accessory, ['Glutes'], reps.accessoryRest),
    exercise(kit.calves, sets.accessory, reps.isolation, ['Calves'], reps.accessoryRest),
    exercise(kit.abs, sets.accessory, reps.isolation, ['Abs'], reps.accessoryRest),
  ]
}

function pushA(kit, reps, sets) {
  return [
    exercise(kit.bench, sets.main, reps.main, ['Chest'], reps.mainRest),
    exercise(kit.overhead, sets.secondary, reps.secondary, ['Delts'], reps.mainRest),
    exercise(kit.inclinePress, sets.secondary, reps.accessory, ['Chest'], reps.mainRest),
    exercise(kit.lateral, sets.accessory, reps.isolation, ['Delts'], reps.accessoryRest),
    exercise(kit.triceps, sets.accessory, reps.isolation, ['Triceps'], reps.accessoryRest),
  ]
}

function pushB(kit, reps, sets) {
  return [
    exercise(kit.inclinePress, sets.main, reps.main, ['Chest'], reps.mainRest),
    exercise(kit.chestPress, sets.secondary, reps.accessory, ['Chest'], reps.mainRest),
    exercise(kit.fly, sets.accessory, reps.isolation, ['Chest'], reps.accessoryRest),
    exercise(kit.lateral, sets.accessory, reps.isolation, ['Delts'], reps.accessoryRest),
    exercise(kit.triceps, sets.accessory, reps.isolation, ['Triceps'], reps.accessoryRest),
  ]
}

function pullA(kit, reps, sets) {
  return [
    exercise(kit.row, sets.main, reps.secondary, ['Back'], reps.mainRest),
    exercise(kit.verticalPull, sets.secondary, reps.accessory, ['Back'], reps.mainRest),
    exercise(kit.rearDelt, sets.accessory, reps.isolation, ['Delts'], reps.accessoryRest),
    exercise(kit.biceps, sets.accessory, reps.isolation, ['Biceps'], reps.accessoryRest),
  ]
}

function pullB(kit, reps, sets) {
  return [
    exercise(kit.verticalPull, sets.main, reps.secondary, ['Back'], reps.mainRest),
    exercise(kit.cableRow, sets.secondary, reps.accessory, ['Back'], reps.mainRest),
    exercise(kit.pullover, sets.accessory, reps.isolation, ['Back'], reps.accessoryRest),
    exercise(kit.rearDelt, sets.accessory, reps.isolation, ['Delts'], reps.accessoryRest),
    exercise(kit.biceps, sets.accessory, reps.isolation, ['Biceps'], reps.accessoryRest),
  ]
}

function applyFocus(exercises, focus, kit, reps, sets, dayName) {
  const focusMap = {
    chest: ['Chest', exercise(dayName.includes('A') || dayName === 'Mon Upper' ? kit.fly : kit.chestPress, sets.focus, reps.isolation, ['Chest'], reps.accessoryRest, 'Focus slot.')],
    back: ['Back', exercise(dayName.includes('A') ? kit.cableRow : kit.pullover, sets.focus, reps.accessory, ['Back'], reps.accessoryRest, 'Focus slot.')],
    quads: ['Quads', exercise(kit.quad, sets.focus, reps.accessory, ['Quads'], reps.accessoryRest, 'Focus slot.')],
    hamstrings: ['Hamstrings', exercise(kit.hamstring, sets.focus, reps.isolation, ['Hamstrings'], reps.accessoryRest, 'Focus slot.')],
    glutes: ['Glutes', exercise(kit.glute, sets.focus, reps.accessory, ['Glutes'], reps.accessoryRest, 'Focus slot.')],
    delts: ['Delts', exercise(kit.lateral, sets.focus, reps.isolation, ['Delts'], reps.accessoryRest, 'Focus slot.')],
    arms: ['Biceps', exercise(kit.biceps, sets.focus, reps.isolation, ['Biceps'], reps.accessoryRest, 'Focus slot.')],
  }
  const [muscle, focusExercise] = focusMap[focus] || focusMap.chest
  const hitsMuscle = exercises.some((item) => item.muscles.includes(muscle))
  const duplicate = exercises.some((item) => item.name === focusExercise.name)
  if (!hitsMuscle || duplicate) return exercises
  const insertAt = Math.min(exercises.length, 4)
  return [
    ...exercises.slice(0, insertAt),
    focusExercise,
    ...exercises.slice(insertAt),
  ]
}

function fitSession(exercises, lengthCap) {
  const maxExercises = lengthCap <= 30 ? 4 : lengthCap <= 45 ? 6 : lengthCap <= 60 ? 7 : 8
  return exercises.slice(0, maxExercises)
}

function estimateSessionMinutes(exercises, lengthCap) {
  const totalSets = exercises.reduce((sum, item) => sum + item.sets, 0)
  return Math.min(lengthCap, Math.ceil((totalSets * 1.8) + (exercises.length * 2) + 6))
}

function volumeSummary(week) {
  const totals = new Map()
  const days = new Map()
  for (const day of week) {
    const dayMuscles = new Set()
    for (const item of day.exercises) {
      for (const muscle of item.muscles) {
        totals.set(muscle, (totals.get(muscle) || 0) + item.sets)
        dayMuscles.add(muscle)
      }
    }
    for (const muscle of dayMuscles) {
      days.set(muscle, (days.get(muscle) || 0) + 1)
    }
  }
  return Array.from(totals.entries())
    .map(([muscle, sets]) => ({ muscle, sets, frequency: days.get(muscle) || 0 }))
    .sort((a, b) => b.sets - a.sets || a.muscle.localeCompare(b.muscle))
}

function progressionRules(goal, experience) {
  const effort = experience === 'beginner' ? '2-3 RIR on most sets' : '1-2 RIR on compounds and 0-2 RIR on isolations'
  const loadRule = goal === 'strength'
    ? 'When all work sets hit the top of the rep range with clean form, add load next week.'
    : 'When every set reaches the top of the rep range, add the smallest load jump and restart at the low end.'
  return [
    loadRule,
    `Use ${effort}; do not turn every set into a max-effort test.`,
    'If performance drops for two sessions in a row, remove one accessory set from that muscle for the week.',
  ]
}

const exerciseSwapLibrary = {
  'barbell back squat': [
    ['Leg press', 'similar quad stimulus with less axial fatigue', ['commercial gym', 'home gym']],
    ['Hack squat', 'strong quad match and easier failure proximity', ['commercial gym']],
    ['Heel-elevated goblet squat', 'home-gym option with lower loading ceiling', ['home gym', 'dumbbells only']],
    ['Front squat', 'similar squat pattern with more upright torso', ['commercial gym', 'barbell only', 'home gym']],
  ],
  'bench press': [
    ['Dumbbell bench press', 'same press pattern with more freedom at the shoulder', ['commercial gym', 'home gym', 'dumbbells only']],
    ['Machine chest press', 'same target muscle with easier setup and less skill demand', ['commercial gym']],
    ['Push-up', 'home option that keeps the horizontal press pattern', ['home gym', 'dumbbells only']],
  ],
  'deadlift': [
    ['Romanian deadlift', 'keeps hinge stimulus with lower systemic fatigue', ['commercial gym', 'home gym', 'barbell only']],
    ['Hip thrust', 'biases glutes with less back fatigue', ['commercial gym', 'home gym']],
    ['Back extension', 'lower loading and easier recovery', ['commercial gym']],
  ],
  'leg press': [
    ['Hack squat', 'similar quad-biased machine pattern with stable setup', ['commercial gym']],
    ['Belt squat', 'similar lower-body stimulus with less spinal loading', ['commercial gym']],
    ['Bulgarian split squat', 'single-leg quad stimulus when machines are unavailable', ['commercial gym', 'home gym', 'dumbbells only']],
    ['Front squat', 'free-weight squat pattern that keeps a strong quad bias', ['commercial gym', 'barbell only', 'home gym']],
  ],
  'lat pulldown': [
    ['Pull-up', 'same vertical pull pattern with bodyweight loading', ['commercial gym', 'home gym']],
    ['Assisted pull-up', 'same target with scalable loading', ['commercial gym']],
    ['One-arm cable pulldown', 'lat-biased pull with easy setup changes', ['commercial gym']],
  ],
  'lateral raise': [
    ['Cable lateral raise', 'constant tension and easy microloading', ['commercial gym']],
    ['Machine lateral raise', 'stable side-delt stimulus with less setup skill', ['commercial gym']],
    ['Lean-away dumbbell lateral raise', 'dumbbell option with a stronger lengthened challenge', ['commercial gym', 'home gym', 'dumbbells only']],
  ],
}

export function calculateExerciseSwaps({
  exercise = 'barbell back squat',
  reason = 'equipment unavailable',
  equipment = 'commercial gym',
  goal = 'same muscle',
}) {
  const key = String(exercise || '').trim().toLowerCase()
  const list = exerciseSwapLibrary[key] || exerciseSwapLibrary['barbell back squat']
  const options = list
    .filter(([, , availability]) => availability.includes(equipment) || equipment === 'commercial gym')
    .map(([name, baseReason], index) => {
      let score = 90 - index * 7
      if (goal === 'less fatigue' && /less|lower|stable|machine/i.test(baseReason)) score += 8
      if (reason === 'joint discomfort' && /freedom|machine|stable|scalable/i.test(baseReason)) score += 6
      if (reason === 'equipment unavailable' && equipment !== 'commercial gym') score += 4
      return {
        name,
        reason: `${baseReason.charAt(0).toUpperCase()}${baseReason.slice(1)}.`,
        score: Math.min(score, 98),
      }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  return {
    options,
    nextAction: `Use ${options[0]?.name || 'a close variation'} if the goal is ${goal} because the original issue is ${reason}.`,
    caveat: 'Swap the exercise, not the intent: keep target muscle, rep range, and effort close unless pain or equipment forces a bigger change.',
  }
}

function csvShape(csvText) {
  const rows = parseCsvRows(csvText)
  if (rows.length < 2) {
    return {
      rows,
      headers: [],
      dataRows: [],
      indexOf: () => -1,
    }
  }

  const headers = rows[0].map((header) => header.trim().toLowerCase())
  const indexOf = (candidates) => headers.findIndex((header) => candidates.some((candidate) => header.includes(candidate)))
  return {
    rows,
    headers,
    dataRows: rows.slice(1),
    indexOf,
  }
}

function csvImportStats(csvText) {
  const { dataRows, indexOf } = csvShape(csvText)
  const dateIndex = indexOf(['date', 'start time', 'created'])
  const workoutIndex = indexOf(['workout'])
  const exerciseIndex = indexOf(['exercise'])
  const setIndex = indexOf(['set'])
  const weightIndex = indexOf(['weight'])
  const repsIndex = indexOf(['reps'])
  const unitIndex = indexOf(['unit'])
  const rpeIndex = indexOf(['rpe', 'rir'])
  const noteIndex = indexOf(['notes'])
  const workouts = new Set()
  const exercises = new Set()
  let sets = 0
  let missingDates = 0
  let missingExercises = 0
  let missingLoads = 0
  let missingReps = 0
  let mixedUnits = false
  const units = new Set()

  for (const [index, row] of dataRows.entries()) {
    const date = dateIndex >= 0 ? row[dateIndex]?.trim() : ''
    const workoutName = workoutIndex >= 0 ? row[workoutIndex]?.trim() : ''
    const exercise = exerciseIndex >= 0 ? row[exerciseIndex]?.trim() : ''
    const weight = weightIndex >= 0 ? row[weightIndex]?.trim() : ''
    const reps = repsIndex >= 0 ? row[repsIndex]?.trim() : ''
    const unit = unitIndex >= 0 ? row[unitIndex]?.trim().toLowerCase() : ''

    if (!date) missingDates++
    if (!exercise) missingExercises++
    if (weightIndex >= 0 && !weight) missingLoads++
    if (repsIndex >= 0 && !reps) missingReps++
    if (unit) units.add(unit)
    if (exercise) exercises.add(exercise.toLowerCase())
    if (exercise || setIndex >= 0) sets++
    if (date || workoutName) workouts.add(`${date || `row-${index + 1}`}|${workoutName || 'workout'}`)
  }

  mixedUnits = units.size > 1

  return {
    dataRows,
    dateIndex,
    workoutIndex,
    exerciseIndex,
    setIndex,
    weightIndex,
    repsIndex,
    unitIndex,
    rpeIndex,
    noteIndex,
    workouts,
    exercises,
    sets,
    missingDates,
    missingExercises,
    missingLoads,
    missingReps,
    mixedUnits,
  }
}

export function calculateWorkoutCsvValidation(csvText) {
  const stats = csvImportStats(csvText)
  const issues = []

  if (stats.dataRows.length === 0) issues.push({ field: 'file', severity: 'blocker', message: 'No workout rows found.' })
  if (stats.dateIndex < 0) issues.push({ field: 'date', severity: 'blocker', message: 'Missing a date column.' })
  if (stats.exerciseIndex < 0) issues.push({ field: 'exercise', severity: 'blocker', message: 'Missing an exercise name column.' })
  if (stats.weightIndex < 0) issues.push({ field: 'weight', severity: 'warning', message: 'Missing a weight column. Timed or bodyweight rows may still work.' })
  if (stats.repsIndex < 0) issues.push({ field: 'reps', severity: 'warning', message: 'Missing a reps column.' })
  if (stats.missingDates) issues.push({ field: 'date', severity: 'blocker', message: `${stats.missingDates} rows have no date.` })
  if (stats.missingExercises) issues.push({ field: 'exercise', severity: 'blocker', message: `${stats.missingExercises} rows have no exercise name.` })
  if (stats.missingLoads) issues.push({ field: 'weight', severity: 'warning', message: `${stats.missingLoads} rows have no load.` })
  if (stats.mixedUnits) issues.push({ field: 'units', severity: 'review', message: 'Mixed units detected. Review kg/lb mapping before import.' })

  const blockers = issues.filter((issue) => issue.severity === 'blocker').length
  const status = blockers ? 'Fix before import' : issues.length ? 'Review before import' : 'Import-ready shape'
  const nextAction = blockers
    ? `Fix ${issues.find((issue) => issue.severity === 'blocker')?.field || 'the CSV'} before importing.`
    : issues.length
      ? 'Spot-check the warnings, then import a copy into Jacked.'
      : 'Keep the original export, then import into Jacked and check your main lifts first.'

  return {
    status,
    issues,
    rows: stats.dataRows.length,
    workouts: stats.workouts.size,
    sets: stats.sets,
    exercises: stats.exercises.size,
    nextAction,
    privacy: 'The CSV is parsed in your browser. Nothing is uploaded by this web tool.',
  }
}

export function calculateStrongImportPreview(csvText) {
  const validation = calculateWorkoutCsvValidation(csvText)
  const stats = csvImportStats(csvText)
  let matchConfidence = 62
  if (stats.dateIndex >= 0) matchConfidence += 8
  if (stats.workoutIndex >= 0) matchConfidence += 5
  if (stats.exerciseIndex >= 0) matchConfidence += 10
  if (stats.setIndex >= 0) matchConfidence += 5
  if (stats.weightIndex >= 0 && stats.repsIndex >= 0) matchConfidence += 7
  if (stats.rpeIndex >= 0) matchConfidence += 3
  if (stats.noteIndex >= 0) matchConfidence += 3
  if (validation.issues.some((issue) => issue.severity === 'blocker')) matchConfidence -= 25

  return {
    ...validation,
    matchConfidence: Math.max(0, Math.min(95, matchConfidence)),
    ready: validation.status !== 'Fix before import' && validation.sets > 0,
    nextAction: validation.status === 'Fix before import'
      ? validation.nextAction
      : 'Download Jacked, keep the original Strong export, then import and review your main lifts.',
  }
}

export function calculateRestTime({
  movementType = 'horizontal press',
  goal = 'hypertrophy',
  reps = 10,
  rir = 2,
  lastSetDifficulty = 'normal',
  nextSetPriority = 'same reps',
  timePressure = 'normal',
}) {
  const heavyCompound = ['squat', 'hinge'].includes(movementType)
  const compound = heavyCompound || ['horizontal press', 'vertical press', 'row / pull'].includes(movementType)
  let seconds = 120

  if (goal === 'strength') seconds = 180
  if (goal === 'strength + size') seconds = 180
  if (goal === 'endurance') seconds = 75
  if (heavyCompound) seconds += 60
  if (!compound) seconds -= 45
  if (numeric(reps, 10) <= 5) seconds += 30
  if (numeric(rir, 2) <= 1 && !heavyCompound) seconds += 30
  if (lastSetDifficulty === 'grindy' && !heavyCompound) seconds += 30
  if (lastSetDifficulty === 'easy') seconds -= 30
  if (nextSetPriority === 'load' && !heavyCompound) seconds += 30
  if (timePressure === 'short') seconds -= 45
  if (timePressure === 'plenty') seconds += 30

  seconds = Math.min(Math.max(Math.round(seconds / 15) * 15, 45), 300)
  const minutes = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
  const reason = heavyCompound
    ? 'Heavy compound sets need enough recovery to keep load and rep quality from dropping.'
    : compound
      ? 'Compound lifts usually need more rest than isolation work when performance matters.'
      : 'Isolation work can usually use shorter rest unless performance drops sharply.'

  return {
    seconds,
    label: minutes,
    reason,
    nextAction: `Rest ${minutes}, then start the next set if breathing, setup, and target muscle feel ready.`,
    caveat: 'If rushing rest cuts reps or changes technique, the rest was too short for that set.',
  }
}

export function calculateBackoffSets({
  units = 'kg',
  topSetWeight,
  topSetReps = 5,
  topSetRir = 1,
  goal = 'strength + size',
  backoffSets = 3,
  backoffReps = 8,
  fatigue = 'normal',
  readiness = 'normal',
  increment = DEFAULT_INCREMENT,
}) {
  const topLoad = numeric(topSetWeight)
  let drop = goal === 'strength' ? 0.08 : goal === 'hypertrophy' ? 0.18 : 0.15
  if (numeric(topSetRir, 1) <= 0) drop += 0.03
  if (numeric(topSetReps, 5) <= 3) drop += 0.02
  if (fatigue === 'high') drop += 0.04
  if (fatigue === 'low') drop -= 0.02
  if (readiness === 'poor') drop += 0.04
  if (readiness === 'good') drop -= 0.02
  drop = Math.min(Math.max(drop, 0.05), 0.28)

  const weight = roundToIncrement(topLoad * (1 - drop), increment)
  const setCount = Math.max(1, Math.min(Math.round(numeric(backoffSets, 3)), 6))
  const sets = Array.from({ length: setCount }, (_, index) => ({
    set: index + 1,
    weight,
    reps: numeric(backoffReps, 8),
    targetRir: index === setCount - 1 ? 1 : 2,
  }))

  return {
    sets,
    dropPercent: Math.round(drop * 100),
    reason: `Use a ${Math.round(drop * 100)}% drop from the top set to keep backoff volume hard but repeatable.`,
    nextAction: `Load ${weight} ${units} for ${setCount} backoff sets of ${numeric(backoffReps, 8)} reps.`,
    confidence: confidenceFor(numeric(topSetReps, 5) + numeric(topSetRir, 1)),
  }
}

function parseCsvRows(text) {
  const rows = []
  let row = []
  let cell = ''
  let quoted = false

  for (let index = 0; index < String(text || '').length; index++) {
    const char = text[index]
    const next = text[index + 1]
    if (char === '"' && quoted && next === '"') {
      cell += '"'
      index++
    } else if (char === '"') {
      quoted = !quoted
    } else if (char === ',' && !quoted) {
      row.push(cell)
      cell = ''
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && next === '\n') index++
      row.push(cell)
      if (row.some((value) => value.trim())) rows.push(row)
      row = []
      cell = ''
    } else {
      cell += char
    }
  }
  row.push(cell)
  if (row.some((value) => value.trim())) rows.push(row)
  return rows
}

export function calculateHevyImportPreview(csvText) {
  const rows = parseCsvRows(csvText)
  if (rows.length < 2) {
    return {
      workouts: 0,
      sets: 0,
      exercises: 0,
      measurements: 0,
      matchConfidence: 0,
      ready: false,
      privacy: 'The CSV is parsed in your browser. Nothing is uploaded.',
    }
  }

  const headers = rows[0].map((header) => header.trim().toLowerCase())
  const indexOf = (candidates) => headers.findIndex((header) => candidates.some((candidate) => header.includes(candidate)))
  const dateIndex = indexOf(['date', 'start time', 'created'])
  const exerciseIndex = indexOf(['exercise'])
  const setIndex = indexOf(['set'])
  const measurementIndex = indexOf(['measurement', 'body weight', 'weight unit'])
  const dataRows = rows.slice(1)
  const workouts = new Set()
  const exercises = new Set()
  let sets = 0
  let measurements = 0

  for (const row of dataRows) {
    const date = row[dateIndex] || ''
    const workoutKey = date.slice(0, 10) || `row-${workouts.size + 1}`
    if (dateIndex >= 0) workouts.add(workoutKey)
    const exercise = row[exerciseIndex] || ''
    if (exercise.trim()) exercises.add(exercise.trim().toLowerCase())
    if (setIndex >= 0 || exercise.trim()) sets++
    if (measurementIndex >= 0 && row[measurementIndex]) measurements++
  }

  let matchConfidence = 70
  if (dateIndex >= 0) matchConfidence += 7
  if (exerciseIndex >= 0) matchConfidence += 8
  if (setIndex >= 0) matchConfidence += 6
  if (dataRows.length >= 20) matchConfidence += 4
  matchConfidence = Math.min(matchConfidence, 95)

  return {
    workouts: workouts.size || Math.max(1, dataRows.length ? 1 : 0),
    sets,
    exercises: exercises.size,
    measurements,
    matchConfidence,
    ready: sets > 0 && exercises.size > 0,
    privacy: 'The CSV is parsed in your browser. Nothing is uploaded. No account required. No server storage.',
  }
}
