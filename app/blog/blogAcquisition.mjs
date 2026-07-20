const APP_STORE_BASE = 'https://apps.apple.com/app/apple-store/id6757132605'
const APP_STORE_PROVIDER_TOKEN = '128406689'

const intents = [
  {
    key: 'workout_apps',
    pattern: /\b(apps?|tracker|tracking|workout log|logging|hevy|fitnotes|strong app|boostcamp|rp hypertrophy|import|alternative)\b/i,
    headline: 'Bring your workout history with you.',
    copy: 'Jacked imports compatible Hevy, Strong, and FitNotes history, then keeps the previous result and next target inside the workout.',
    label: 'Import and train with Jacked',
  },
  {
    key: 'nutrition',
    pattern: /\b(protein|creatine|supplement|nutrition|calorie|diet|caffeine|carbohydrate|meal|hydration)\b/i,
    headline: 'Log the training your nutrition supports.',
    copy: 'Keep working sets, RIR, rest timing, and progression history together in a focused iPhone workout log.',
    label: 'Log your next workout',
  },
  {
    key: 'recovery',
    pattern: /\b(recovery|sleep|fatigue|deload|soreness|stress|overtraining|rest day|injury|pain)\b/i,
    headline: 'Keep fatigue and training context together.',
    copy: 'Jacked keeps recent performance, RIR, rest timing, and weekly hard-set totals visible when you plan the next session.',
    label: 'Track training context',
  },
  {
    key: 'exercise',
    pattern: /\b(exercise|bench|squat|deadlift|curl|press|row|pulldown|pull-up|lunge|fly|raise|extension|machine|free weight|barbell|dumbbell|cable)\b/i,
    headline: 'Keep exercise changes inside the workout.',
    copy: 'Log the set, compare your previous result, and swap to a close alternative without rebuilding the whole session.',
    label: 'Run your workout in Jacked',
  },
  {
    key: 'progression',
    pattern: /\b(progressive|progression|double progression|rir|rpe|reps in reserve|one rep max|1rm|strength|load|plateau|personal record|rep range)\b/i,
    headline: 'Turn this idea into the next set.',
    copy: 'Jacked keeps your previous result, target load, rep range, RIR, and rest timer together while you train.',
    label: 'Track your next set',
  },
  {
    key: 'programming',
    pattern: /\b(volume|weekly sets?|split|program|programming|routine|workout plan|frequency|hypertrophy|muscle growth|periodization)\b/i,
    headline: 'See the week, then run the workout.',
    copy: 'Jacked connects weekly hard-set targets with the exercises, rep ranges, and next-set guidance in today’s session.',
    label: 'Track weekly targets',
  },
]

function searchableText(post) {
  return [
    post?.slug,
    post?.title,
    post?.excerpt,
    post?.category,
    ...(Array.isArray(post?.keywords) ? post.keywords : [post?.keywords]),
  ].filter(Boolean).join(' ')
}

export function blogAcquisitionForPost(post) {
  const match = intents.find(intent => intent.pattern.test(searchableText(post)))
  const intent = match || {
    key: 'training',
    headline: 'Apply this in your next workout.',
    copy: 'Jacked keeps working sets, recent performance, next targets, rest timing, and weekly muscle totals in one iPhone workout log.',
    label: 'Get Jacked for iPhone',
  }

  return {
    ...intent,
    campaign: `blog_${intent.key}`,
  }
}

export function blogAppStoreUrl(post) {
  const url = new URL(APP_STORE_BASE)
  url.search = new URLSearchParams({
    pt: APP_STORE_PROVIDER_TOKEN,
    ct: blogAcquisitionForPost(post).campaign,
    mt: '8',
  }).toString()
  return url.toString()
}

export const blogCampaigns = [
  ...intents.map(intent => `blog_${intent.key}`),
  'blog_training',
]
