const typeLabels = {
  backoff: 'BACKOFF SETS',
  'csv-validator': 'CSV CHECKER',
  deload: 'DELOAD',
  hevy: 'HEVY IMPORT',
  'next-set': 'NEXT SET',
  'one-rm': 'ESTIMATED 1RM',
  plates: 'PLATE LOADING',
  'rest-time': 'REST TIME',
  rir: 'RIR TARGET',
  split: 'WORKOUT SPLIT',
  'strength-level': 'STRENGTH LEVEL',
  'strong-import': 'STRONG IMPORT',
  swaps: 'EXERCISE SWAPS',
  volume: 'WEEKLY VOLUME',
  warmup: 'WARM-UP SETS',
}

export function toolSocialImageUrl(slug) {
  return `https://jacked.coach/tools/${slug}/social.png`
}

export function toolTypeLabel(type) {
  return typeLabels[type] || 'TRAINING TOOL'
}

export function toolSocialTitleSize(name) {
  if (name.length > 40) return 52
  if (name.length > 32) return 60
  return 76
}
