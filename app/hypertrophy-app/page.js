import AcquisitionLanding from '../components/AcquisitionLanding'

const APP_STORE_URL = 'https://apps.apple.com/app/apple-store/id6757132605?pt=128406689&ct=seo_hypertrophy_app&mt=8'

export const metadata = {
  title: 'Hypertrophy App for iPhone | Surpass',
  description: 'Plan hypertrophy training, track hard sets by muscle, keep RIR and recent performance in view, and make a clearer next-set decision with Surpass for iPhone.',
  keywords: ['hypertrophy app iPhone', 'muscle building app', 'hypertrophy tracker', 'muscle gain workout tracker', 'volume tracking app'],
  alternates: { canonical: 'https://jacked.coach/hypertrophy-app' },
  openGraph: {
    title: 'Hypertrophy App for iPhone | Surpass',
    description: 'Keep weekly muscle targets, recent performance, rep ranges, and effort context close to the next working set.',
    url: 'https://jacked.coach/hypertrophy-app',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Surpass hypertrophy training app for iPhone' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hypertrophy App for iPhone | Surpass',
    description: 'Keep weekly muscle targets, recent performance, rep ranges, and effort context close to the next working set.',
    images: ['/og-image.png'],
  },
}

const benefits = [
  { title: 'Track the work each muscle receives', copy: 'See completed hard sets and sets left against the weekly muscle targets you choose instead of relying on a single workout total.' },
  { title: 'Keep effort beside the result', copy: 'Record reps, load, rep range, and RIR together so a difficult set is not reduced to one number when you choose what to do next.' },
  { title: 'Carry useful context into the next session', copy: 'Recent lift history, rest timing, personal records, and the last workout stay available before you start repeating or changing the work.' },
]

const steps = [
  { title: 'Set the training context', copy: 'Choose your days, exercises, working sets, rep ranges, rest targets, and weekly muscle priorities.' },
  { title: 'Log the working sets', copy: 'Record each set inside the workout while the previous result and current target remain close to the input.' },
  { title: 'Review what changed', copy: 'Use the workout receipt, lift history, and weekly coverage to decide whether the next session should repeat, add reps, add load, or hold steady.' },
]

const comparison = [
  ['Weekly volume', 'Count sets in a separate spreadsheet or memory.', 'See completed hard sets and remaining weekly targets by muscle.'],
  ['Set decisions', 'Treat every result as a number without effort context.', 'Keep reps, load, rep range, recent performance, and RIR together.'],
  ['Progress review', 'Scan a long workout history after the session.', 'Use the receipt and lift history to identify the next comparison that matters.'],
]

const faqs = [
  { question: 'What does a hypertrophy app do?', answer: 'A useful hypertrophy app helps you plan and record resistance training while keeping the variables that affect a next decision visible: exercises, sets, rep ranges, effort, recent performance, and weekly muscle coverage.' },
  { question: 'Does Surpass automatically write my program?', answer: 'No. You control the routine, exercise selection, targets, and training days. Surpass keeps the relevant history and weekly target context beside the workout.' },
  { question: 'Can I track weekly sets by muscle?', answer: 'Yes. Surpass reports completed hard sets and sets left against the weekly muscle targets recorded in the app.' },
  { question: 'Can I use Surpass for strength as well as hypertrophy?', answer: 'Yes. Surpass supports strength-training routines with rep ranges, load, effort, rest, personal records, and lift history. The app does not require one training style.' },
  { question: 'Is Surpass free and does it require an account?', answer: 'Surpass is currently free to download and use on iPhone, and you can start without creating an account. The App Store listing and privacy policy are the current sources for availability and data details.' },
]

export default function HypertrophyAppPage() {
  return <AcquisitionLanding
    eyebrow="Hypertrophy app for iPhone"
    title="Build muscle with a clearer next set."
    intro="Surpass keeps weekly muscle targets, rep ranges, recent performance, and effort context close to the workout so hypertrophy training is easier to run and review."
    campaignUrl={APP_STORE_URL}
    campaignKey="seo_hypertrophy_app"
    canonicalPath="/hypertrophy-app"
    heroImage="/marketing/surpass-progress.png"
    heroImageAlt="Surpass progress screen showing lift history and weekly muscle coverage"
    heroPresentation="screen"
    benefits={benefits}
    benefitsTitle="More useful context before the next working set."
    benefitsIntro="Muscle-building training is not only a list of exercises. The result, effort, and weekly context should still be available when the next decision arrives."
    steps={steps}
    flowTitle="Plan, log, and review the training signal."
    flowIntro="Surpass keeps the loop close to the session without promising that an app can replace your judgement or a coach."
    comparison={comparison}
    comparisonTitle="A hypertrophy tracker should help you interpret the work."
    comparisonIntro="Storing sets is useful. Keeping the context that changes the next set is more useful."
    comparisonLabel="Generic workout log and Surpass hypertrophy workflow comparison"
    faqs={faqs}
    faqTitle="Questions about using Surpass for hypertrophy training."
    related={[
      ['/progressive-overload', 'Progressive overload app'],
      ['/workout-tracker', 'Workout tracker for iPhone'],
      ['/methodology', 'Training calculator methodology'],
      ['/blog/best-hypertrophy-app-ios-review', 'Best hypertrophy app for iOS'],
    ]}
    finalTitle="Make the next muscle-building session easier to run."
    finalCopy="Start free on iPhone and keep weekly targets, set history, effort context, and the next training decision in one place."
  />
}
