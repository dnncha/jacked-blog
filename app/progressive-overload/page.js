import AcquisitionLanding from '../components/AcquisitionLanding'

const APP_STORE_URL = 'https://apps.apple.com/app/apple-store/id6757132605?pt=128406689&ct=seo_progressive_overload&mt=8'

export const metadata = {
  title: 'Progressive Overload App for iPhone',
  description: 'Use double progression, rep ranges, recent set history, RIR context, and weekly muscle targets to guide your next workout with Jacked for iPhone.',
  keywords: ['progressive overload app', 'double progression app', 'hypertrophy tracker', 'RIR workout tracker', 'strength progression app'],
  alternates: { canonical: 'https://jacked.coach/progressive-overload' },
  openGraph: {
    title: 'Progressive Overload App for iPhone',
    description: 'Turn rep ranges and recent performance into a clearer repeat, add-reps, or add-load decision.',
    url: 'https://jacked.coach/progressive-overload',
    images: [{ url: '/marketing/generated/jacked-acquisition-social.jpg', width: 1200, height: 630, alt: 'Lifter using Jacked between sets in a strength gym' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Progressive Overload App for iPhone',
    description: 'Turn rep ranges and recent performance into a clearer repeat, add-reps, or add-load decision.',
    images: ['/marketing/generated/jacked-acquisition-social.jpg'],
  },
}

const benefits = [
  { title: 'Use double progression without a spreadsheet', copy: 'Keep the target rep range and recent result visible so adding reps or load is a deliberate decision.' },
  { title: 'Keep effort in context', copy: 'RIR and set history help you distinguish a productive result from a number that should not automatically increase.' },
  { title: 'Balance progression with weekly volume', copy: 'See hard sets completed and sets left for each muscle instead of judging progress from load alone.' },
]

const steps = [
  { title: 'Set the range', copy: 'Choose the exercise and rep range that fit your program. You remain in control of the plan.' },
  { title: 'Log the actual result', copy: 'Record weight, reps, and effort while the set is fresh, with the previous result still visible.' },
  { title: 'Choose the next progression move', copy: 'Use recent performance to repeat the load, add reps, add load, or hold steady.' },
]

const comparison = [
  ['Rep target reached', 'Increase weight from a fixed rule.', 'Review the range, result, and recent effort before adding load.'],
  ['Performance dips', 'Treat one session as a failed progression.', 'Keep the result in history and decide whether to repeat or back off.'],
  ['Weekly planning', 'Progress each exercise in isolation.', 'Pair lift history with weekly hard-set totals by muscle.'],
]

const faqs = [
  { question: 'What is double progression?', answer: 'Double progression increases reps within a target range before increasing load. For example, you may build from 6 to 10 reps at one weight, then add load and return to the lower end of the range.' },
  { question: 'Does Jacked automatically change my program?', answer: 'No. You control the routine, exercises, rep ranges, and targets. Jacked keeps the recent results and progression context visible so you can make the next decision.' },
  { question: 'Can I track RIR?', answer: 'Yes. Jacked supports RIR context alongside weight, reps, rep ranges, and recent performance.' },
  { question: 'Is progressive overload only about adding weight?', answer: 'No. Adding reps, improving execution within the same target, and managing weekly training volume can all be part of a progression plan.' },
]

export default function ProgressiveOverloadPage() {
  return <AcquisitionLanding
    eyebrow="Progressive overload app for iPhone"
    title="Progress every lift without guessing."
    intro="Jacked keeps your rep range, recent result, effort, and weekly hard-set targets close to the workout so the next progression move is easier to judge."
    campaignUrl={APP_STORE_URL}
    campaignKey="seo_progressive_overload"
    heroImage="/marketing/generated/jacked-hero-lifter.webp"
    heroImageAlt="Lifter checking an iPhone between sets in a strength gym"
    benefits={benefits}
    steps={steps}
    comparison={comparison}
    faqs={faqs}
    related={[
      ['/workout-tracker', 'Workout tracker for iPhone'],
      ['/tools/next-set-calculator', 'Next-set calculator'],
      ['/blog/progressive-overload-app-works', 'How progressive overload apps work'],
    ]}
    finalTitle="Turn the last set into a clearer next target."
    finalCopy="Download Jacked on iPhone for double progression, RIR context, lift history, rest timing, and weekly muscle targets."
  />
}
