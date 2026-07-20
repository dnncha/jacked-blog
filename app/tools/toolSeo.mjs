import { toolMap } from './toolData.mjs'

const keywordRules = [
  {
    slug: 'fitnotes-csv-import-checker',
    weight: 12,
    terms: ['fitnotes', 'import', 'csv', 'export', 'migration', 'switching'],
  },
  {
    slug: 'hevy-import-checker',
    weight: 12,
    terms: ['hevy', 'import', 'csv', 'export', 'migration', 'switching'],
  },
  {
    slug: 'strong-csv-import-checker',
    weight: 12,
    terms: ['strong', 'strong app', 'import', 'csv', 'export', 'migration', 'switching'],
  },
  {
    slug: 'workout-csv-validator',
    weight: 11,
    terms: ['csv', 'validator', 'import', 'export', 'missing rows', 'mixed units', 'workout history'],
  },
  {
    slug: 'rest-time-calculator',
    weight: 10,
    terms: ['rest', 'rest time', 'between sets', 'timer', 'next set readiness'],
  },
  {
    slug: 'backoff-set-calculator',
    weight: 10,
    terms: ['backoff', 'back off', 'top set', 'drop set', 'fatigue drop', 'volume after top set'],
  },
  {
    slug: 'next-set-calculator',
    weight: 10,
    terms: ['progressive overload', 'progression', 'next set', 'add weight', 'rep range', 'plateau', 'auto-progression'],
  },
  {
    slug: 'rir-calculator',
    weight: 9,
    terms: ['rir', 'rpe', 'reps in reserve', 'autoregulation', 'failure', 'effort'],
  },
  {
    slug: 'weekly-volume-checker',
    weight: 9,
    terms: ['volume', 'weekly sets', 'hard sets', 'sets per muscle', 'training volume'],
  },
  {
    slug: 'deload-calculator',
    weight: 11,
    terms: ['deload', 'fatigue', 'recovery', 'soreness', 'missed targets', 'stress', 'sleep'],
  },
  {
    slug: 'smart-warm-up-calculator',
    weight: 8,
    terms: ['warm-up', 'warm up', 'ramp', 'primer', 'activation'],
  },
  {
    slug: 'one-rep-max-calculator',
    weight: 8,
    terms: ['1rm', 'one rep max', 'e1rm', 'max strength', 'percentage'],
  },
  {
    slug: 'strength-level-calculator',
    weight: 9,
    terms: ['strength level', 'strength standards', 'how strong', 'bodyweight ratio', 'relative strength', 'strength benchmark'],
  },
  {
    slug: 'plate-calculator',
    weight: 7,
    terms: ['plates', 'barbell', 'load the bar', 'kg', 'lb'],
  },
  {
    slug: 'workout-split-builder',
    weight: 8,
    terms: ['split', 'upper lower', 'ppl', 'full body', 'program', 'routine', 'training days'],
  },
  {
    slug: 'exercise-swap-finder',
    weight: 8,
    terms: ['exercise selection', 'alternative', 'swap', 'variation', 'machine taken', 'joint pain', 'equipment'],
  },
]

function includesTerm(haystack, term) {
  return haystack.includes(term)
}

export function relatedToolsForArticle({ title = '', excerpt = '', category = '', slug = '' }, limit = 4) {
  const haystack = `${title} ${excerpt} ${category} ${slug}`.toLowerCase().replaceAll('-', ' ')
  const scored = keywordRules
    .map((rule) => {
      const matches = rule.terms.filter((term) => includesTerm(haystack, term))
      return {
        slug: rule.slug,
        score: matches.length ? rule.weight + matches.length * 2 : 0,
      }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)

  const selected = []
  for (const item of scored) {
    const tool = toolMap[item.slug]
    if (tool && !selected.some((existing) => existing.slug === tool.slug)) selected.push(tool)
  }

  for (const fallbackSlug of ['next-set-calculator', 'rir-calculator', 'weekly-volume-checker', 'smart-warm-up-calculator']) {
    const tool = toolMap[fallbackSlug]
    if (tool && selected.length < limit && !selected.some((existing) => existing.slug === tool.slug)) selected.push(tool)
  }

  return selected.slice(0, limit)
}

export function toolQualityNotes(tool) {
  const shared = {
    method: 'The calculator is server-rendered for crawlability, then hydrated so the result updates instantly in the browser.',
    assumptions: 'Results depend on consistent exercise execution, honest effort ratings, and recent training context.',
    privacy: 'Inputs are handled in the browser for the web tool experience. Jacked should only store lifting data when a user chooses to log it in the app.',
  }

  const byType = {
    'next-set': {
      method: 'Uses reps plus RIR to estimate effective reps to failure, then applies rep-range progression rules: add load, add reps, hold, or reduce.',
      assumptions: 'Best signal comes from recent sets in a stable rep range with consistent technique and a clear RIR estimate.',
    },
    rir: {
      method: 'Estimates e1RM from the logged set, then converts target reps plus target RIR into a rounded load recommendation.',
      assumptions: 'RIR works best when the set used clean reps and the lifter can honestly estimate reps left in reserve.',
    },
    'one-rm': {
      method: 'Combines common e1RM formulas where valid, then adds rep maxes, percentages, and a useful target instead of stopping at a max estimate.',
      assumptions: 'High-rep and sloppy sets are lower-confidence. Treat e1RM as a trend and targeting tool, not a guaranteed max.',
    },
    'strength-level': {
      method: 'Estimates 1RM from weight, reps, and RIR, divides it by bodyweight, then compares the ratio with transparent Jacked practical standards for the lift and sex.',
      assumptions: 'Use consistent range, equipment setup, and exercise execution. The tiers are practical benchmarks, not official rankings or copied population tables.',
    },
    plates: {
      method: 'Subtracts bar and collar weight, splits the remaining load per side, and loads available plates according to the selected style.',
      assumptions: 'Plate availability and bar weight must match the gym setup for exact loading.',
    },
    warmup: {
      method: 'Builds ramping sets from target load, movement type, recent heavy exposure, training status, and warm-up preference.',
      assumptions: 'Warm-ups should prepare the working set without turning into hard training sets.',
    },
    volume: {
      method: 'Compares weekly hard sets by muscle against practical ranges adjusted for training age, goal, recovery, soreness, and performance trend.',
      assumptions: 'This is a planning signal, not a diagnosis. Exercise selection, effort, sleep, and calories change what volume you can recover from.',
    },
    deload: {
      method: 'Scores fatigue signals from performance, missed targets, soreness, joints, sleep, motivation, stress, and time since deload.',
      assumptions: 'Training discomfort and injury are different problems. Pain or persistent symptoms belong with a qualified professional.',
    },
    split: {
      method: 'Chooses a split from days per week first, then adjusts for goal, session length, equipment, experience, and muscle focus.',
      assumptions: 'The best split is the one you can repeat and recover from; advanced-looking splits are not automatically better.',
    },
    swaps: {
      method: 'Ranks alternatives by target muscle, equipment, fatigue cost, movement similarity, and the reason for replacing the exercise.',
      assumptions: 'A good swap preserves the training intent unless pain or equipment forces a larger change.',
    },
    hevy: {
      method: 'Parses the CSV locally in your browser, counts dated workouts, set rows, exercise names, and measurement-like columns.',
      assumptions: 'CSV formats can vary, so the preview is a confidence check rather than a final import guarantee.',
      privacy: 'The CSV is parsed in your browser. Nothing is uploaded. No account required. No server storage.',
    },
    'strong-import': {
      method: 'Parses the Strong-style CSV locally in the browser and checks for workout dates, exercise names, set rows, loads, reps, notes, and effort fields.',
      assumptions: 'Strong exports and edited CSV files can vary. Treat this as a preview and keep the original export untouched.',
      privacy: 'The CSV is parsed in your browser. Nothing is uploaded. No account required. No server storage.',
    },
    'fitnotes-import': {
      method: 'Parses the FitNotes CSV locally in the browser and checks the required Date and Exercise columns plus supported lifting, cardio, and note fields.',
      assumptions: 'FitNotes exports and edited CSV files can vary. This is a file-shape check; verify dates, exercises, and set details in Jacked after import.',
      privacy: 'The CSV is parsed in your browser. Nothing is uploaded. No account required. No server storage.',
    },
    'csv-validator': {
      method: 'Checks common workout CSV headers and rows for missing dates, exercise names, loads, reps, mixed units, and likely import blockers.',
      assumptions: 'App-specific import formats can still require a dedicated importer. This catches common lifting-log issues first.',
      privacy: 'The CSV is parsed in your browser. Nothing is uploaded. No account required. No server storage.',
    },
    'rest-time': {
      method: 'Starts from goal and exercise type, then adjusts rest time for reps, RIR, last-set difficulty, next-set priority, and time pressure.',
      assumptions: 'The right rest is the shortest rest that preserves the next set target and technique standard.',
    },
    backoff: {
      method: 'Applies a top-set load drop based on goal, top-set effort, fatigue, readiness, and rounding increment.',
      assumptions: 'Backoffs work when the top set reflects today’s strength and the follow-up sets stay hard but repeatable.',
    },
  }

  return {
    ...shared,
    ...(byType[tool.type] || {}),
  }
}
