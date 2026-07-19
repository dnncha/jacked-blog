import AcquisitionLanding from '../components/AcquisitionLanding'

const APP_STORE_URL = 'https://apps.apple.com/app/apple-store/id6757132605?pt=128406689&ct=seo_workout_tracker&mt=8'

export const metadata = {
  title: 'Workout Tracker for iPhone That Guides Your Next Set',
  description: 'Log sets fast, see your previous result and next target, run rest timers, track weekly hard sets, and import compatible Hevy history with Jacked for iPhone.',
  keywords: ['workout tracker iPhone', 'weight lifting tracker', 'gym workout log', 'workout log app', 'strength training tracker'],
  alternates: { canonical: 'https://jacked.coach/workout-tracker' },
  openGraph: {
    title: 'Workout Tracker for iPhone That Guides Your Next Set',
    description: 'Fast set logging, next-lift targets, rest timers, weekly muscle targets, and compatible Hevy import.',
    url: 'https://jacked.coach/workout-tracker',
    images: [{ url: '/marketing/generated/jacked-acquisition-social.jpg', width: 1200, height: 630, alt: 'Lifter using Jacked between sets in a strength gym' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Workout Tracker for iPhone That Guides Your Next Set',
    description: 'Fast set logging, next-lift targets, rest timers, weekly muscle targets, and compatible Hevy import.',
    images: ['/marketing/generated/jacked-acquisition-social.jpg'],
  },
}

const benefits = [
  { title: 'Log weight and reps from one screen', copy: 'Your previous result, current target, and active rest timer stay close to the set you are recording.' },
  { title: 'See what each muscle still needs', copy: 'Weekly hard-set totals show completed sets and sets left for each muscle across your training split.' },
  { title: 'Keep your existing training context', copy: 'Import compatible Hevy workouts, routines, notes, and set history instead of rebuilding your log from zero.' },
]

const steps = [
  { title: 'Open today’s workout', copy: 'Exercises, rep ranges, previous sets, and targets are ready before the first working set.' },
  { title: 'Record the work', copy: 'Log weight and reps, time your rest, correct a set quickly, and continue without leaving the session.' },
  { title: 'Carry the result forward', copy: 'Lift history, PRs, and weekly hard-set totals give the next workout useful context.' },
]

const comparison = [
  ['Before the set', 'Search workout history for the last result.', 'See the previous result, target load, and rep range together.'],
  ['Between sets', 'Track rest separately or estimate it.', 'Keep the rest timer inside the active workout.'],
  ['After the workout', 'Review a list of sets without muscle-level context.', 'See lift history, PRs, and weekly hard sets by muscle.'],
]

const faqs = [
  { question: 'Is Jacked a free workout tracker?', answer: 'Yes. Jacked is currently free to download and use on iPhone. The App Store listing is the source for current availability.' },
  { question: 'Can I use my own workout routine?', answer: 'Yes. You keep control of your routine, exercise selection, set targets, and rep ranges. Jacked helps you run and record the session.' },
  { question: 'Can I import workouts from Hevy?', answer: 'Jacked includes a compatible Hevy import path for workouts, routines, exercise notes, and set history.' },
  { question: 'Where is my workout data stored?', answer: 'Workout history is stored locally on your iPhone. You do not need to create an account to start training.' },
]

export default function WorkoutTrackerPage() {
  return <AcquisitionLanding
    eyebrow="Workout tracker for iPhone"
    title="Log the set. Know what comes next."
    intro="Jacked is a focused weight-lifting tracker for lifters who want fast logging, visible training history, rest timing, and a clear next target inside the workout."
    campaignUrl={APP_STORE_URL}
    campaignKey="seo_workout_tracker"
    heroImage="/marketing/generated/jacked-workout-flow.webp"
    heroImageAlt="Lifter reviewing an iPhone beside a barbell in a strength gym"
    benefits={benefits}
    steps={steps}
    comparison={comparison}
    faqs={faqs}
    related={[
      ['/progressive-overload', 'Progressive overload app'],
      ['/tools/next-set-calculator', 'Next-set calculator'],
      ['/blog/import-hevy-to-jacked', 'Import Hevy to Jacked'],
    ]}
    finalTitle="Make the workout log useful before your next set."
    finalCopy="Download Jacked on iPhone and run your next session with history, targets, rest, and weekly muscle totals in one place."
  />
}
