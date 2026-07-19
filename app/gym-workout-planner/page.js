import AcquisitionLanding from '../components/AcquisitionLanding'

const APP_STORE_URL = 'https://apps.apple.com/app/apple-store/id6757132605?pt=128406689&ct=seo_gym_workout_planner&mt=8'

export const metadata = {
  title: 'Gym Workout Planner for iPhone with Next-Set Targets',
  description: 'Plan your training split, set rep ranges and weekly muscle targets, log each workout, and use recent performance to guide the next set with Jacked for iPhone.',
  keywords: ['gym workout planner', 'workout planner iPhone', 'weight lifting planner', 'gym routine planner', 'strength training planner'],
  alternates: { canonical: 'https://jacked.coach/gym-workout-planner' },
  openGraph: {
    title: 'Gym Workout Planner for iPhone with Next-Set Targets',
    description: 'Plan the workout, log the result, and carry recent performance into the next load and rep target.',
    url: 'https://jacked.coach/gym-workout-planner',
    images: [{ url: '/marketing/generated/jacked-gym-planner-social.png', width: 1200, height: 630, alt: 'Jacked gym workout planner showing the next workout, target load, rep range, and previous result' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gym Workout Planner for iPhone with Next-Set Targets',
    description: 'Plan the workout, log the result, and carry recent performance into the next load and rep target.',
    images: ['/marketing/generated/jacked-gym-planner-social.png'],
  },
}

const benefits = [
  { title: 'Build the routine you actually run', copy: 'Organize training days, exercises, working sets, rep ranges, rest targets, and RIR without giving up control of your program.' },
  { title: 'Plan volume by muscle, not just by day', copy: 'Weekly hard-set targets show how the workouts in your split add up across chest, back, shoulders, arms, and legs.' },
  { title: 'Connect the plan to recent performance', copy: 'The active workout keeps the previous result beside the next load and rep target instead of leaving the plan as a static checklist.' },
]

const steps = [
  { title: 'Shape the training week', copy: 'Choose your days, exercises, working sets, rep ranges, rest targets, and effort targets.' },
  { title: 'Run the planned workout', copy: 'Open the next session, log weight and reps quickly, and keep the rest timer inside the workout.' },
  { title: 'Adjust from real results', copy: 'Use lift history and weekly hard-set totals to repeat, add reps, add load, or revise the next session.' },
]

const comparison = [
  ['Before the week', 'List exercises under each training day.', 'See the split together with weekly hard-set targets by muscle.'],
  ['Before the set', 'Read the planned weight and rep range.', 'See the plan, previous result, and next target in one view.'],
  ['After the workout', 'Mark the session complete and reuse the same numbers.', 'Carry the logged result into lift history and the next progression decision.'],
]

const faqs = [
  { question: 'Can I create my own gym routine?', answer: 'Yes. You control the training days, exercises, working sets, rep ranges, rest targets, and effort targets in your plan.' },
  { question: 'Can I start a workout without building a full plan?', answer: 'Yes. Jacked supports starting a freestyle workout, so you can log the session first and organize a repeatable plan when it is useful.' },
  { question: 'Does the planner track weekly sets by muscle?', answer: 'Yes. Jacked shows completed hard sets and sets left against weekly muscle targets, using the workouts recorded in the app.' },
  { question: 'Does Jacked automatically replace my program?', answer: 'No. You remain in control of the routine and every exercise. Jacked keeps recent results and target context visible so you can make a clearer progression decision.' },
]

export default function GymWorkoutPlannerPage() {
  return <AcquisitionLanding
    eyebrow="Gym workout planner for iPhone"
    title="Plan the workout. Know the next set."
    intro="Jacked connects your training split, weekly muscle targets, rep ranges, and recent lift history to the workout you are about to run."
    campaignUrl={APP_STORE_URL}
    campaignKey="seo_gym_workout_planner"
    heroImage="/marketing/jacked-app-preview-poster.png"
    heroImageAlt="Jacked showing a planned Push A workout with target load, rep range, RIR, and previous result"
    heroPresentation="screen"
    benefits={benefits}
    steps={steps}
    comparison={comparison}
    faqs={faqs}
    related={[
      ['/workout-tracker', 'Workout tracker for iPhone'],
      ['/progressive-overload', 'Progressive overload app'],
      ['/tools/workout-split-builder', 'Workout split builder'],
      ['/tools/weekly-volume-checker', 'Weekly volume checker'],
    ]}
    benefitsTitle="A plan that stays connected to the work."
    benefitsIntro="Jacked keeps program structure, weekly muscle targets, and recent performance close enough to guide the next session."
    flowTitle="Plan, train, and adjust in one loop."
    flowIntro="The routine becomes more useful when the result of each workout is available before the next one starts."
    comparisonTitle="Move beyond a static exercise checklist."
    comparisonIntro="A useful gym planner should connect the week you intended to the sets you actually completed."
    comparisonLabel="Static gym planner and Jacked comparison"
    faqTitle="Questions about planning workouts in Jacked."
    finalTitle="Build the week. Run the next set."
    finalCopy="Download Jacked on iPhone to plan training days, log working sets, track weekly muscle targets, and use recent performance in the next workout."
  />
}
