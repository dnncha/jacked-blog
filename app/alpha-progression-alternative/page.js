import AcquisitionLanding from '../components/AcquisitionLanding'

const APP_STORE_URL = 'https://apps.apple.com/app/apple-store/id6757132605?pt=128406689&ct=seo_alpha_progression_alternative&mt=8'

export const metadata = {
  title: 'Alpha Progression Alternative for iPhone | Surpass',
  description: 'Compare Surpass and Alpha Progression by training workflow, progression guidance, exercise reference, and plan control before choosing your iPhone workout app.',
  keywords: ['Alpha Progression alternative', 'Alpha Progression alternative iPhone', 'gym workout app comparison', 'hypertrophy app alternative', 'workout planner iPhone'],
  alternates: { canonical: 'https://jacked.coach/alpha-progression-alternative' },
  openGraph: {
    title: 'Alpha Progression Alternative for iPhone | Surpass',
    description: 'A balanced comparison of Surpass and Alpha Progression for lifters choosing an iPhone training workflow.',
    url: 'https://jacked.coach/alpha-progression-alternative',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Surpass workout planner and progress view for iPhone' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alpha Progression Alternative for iPhone | Surpass',
    description: 'Compare the training workflow before choosing an iPhone workout app.',
    images: ['/og-image.png'],
  },
}

const benefits = [
  { title: 'Start with one visible priority', copy: 'Surpass turns the outcome you care about into a bounded training block, so the next workout has a reason instead of another settings maze.' },
  { title: 'Keep the next decision explainable', copy: 'Targets use rep range, effort, and recent performance context. A weekly review recommends changes, but you decide what gets applied.' },
  { title: 'Keep workout history under your control', copy: 'The product is local-first on iPhone, with reviewable imports and explicit plan-copy boundaries instead of an opaque social feed.' },
]

const steps = [
  { title: 'Choose what you want to improve', copy: 'Set a visible priority and choose a bounded 4, 6, 8, 10, or 12-week block.' },
  { title: 'Train with the reason in view', copy: 'Log the planned work with clear targets, effort guidance, setup cues, and the active phase explained in the workout.' },
  { title: 'Review before changing the plan', copy: 'Use completed-week volume, recovery markers, and the saved receipt to decide what to keep, reduce, or change next.' },
]

const comparison = [
  ['Planning', 'A broad custom plan generator built around goals, equipment, schedule, and exercise selection.', 'A focused priority block with a user-selected 4–12 week horizon and a visible reason for the next session.'],
  ['Progression', 'Precise per-set weight, rep, and intensity recommendations are the centre of the workflow.', 'Next-set targets combine rep range, effort, recent performance, and an explainable saved receipt.'],
  ['Exercise reference', 'A large exercise catalogue with video demonstrations is a strong fit when video coverage is your priority.', 'Source-backed setup and form guidance are available in the active workout; a dedicated exercise-video library is not yet part of Surpass.'],
  ['Plan changes', 'Plans can be customised and shared as part of the Alpha workflow.', 'Weekly Review proposes bounded changes for you to apply, and complete built-in plans can be copied with an explicit confirmation.'],
]

const faqs = [
  { question: 'Is Surpass the same kind of app as Alpha Progression?', answer: 'Both are iPhone workout apps for structured training and progression. Alpha Progression is a strong fit for lifters who want a broad plan generator and a large exercise-video catalogue. Surpass is designed for lifters who want a focused priority block, visible next decisions, and a local-first workflow.' },
  { question: 'Does Surpass automatically change my program?', answer: 'No. Weekly Review can recommend a bounded volume, exercise, or recovery change, but you choose whether to apply it. That keeps a useful recommendation separate from an invisible plan mutation.' },
  { question: 'Does Surpass have exercise videos?', answer: 'Not as a dedicated catalogue yet. The active workout can provide source-backed setup and form guidance where it is available. If a large video library is your deciding factor, Alpha Progression may be the better fit today.' },
  { question: 'Can I choose a shorter or longer training block?', answer: 'Yes. Surpass supports bounded 4, 6, 8, 10, and 12-week Build horizons. The Plan, Home, Train, and Weekly Review paths use the same active horizon.' },
  { question: 'Can I try Surpass without giving up control of my data?', answer: 'Yes. Workout history is stored locally on your iPhone, supported imports are reviewable before saving, and shared-plan copies require an explicit confirmation.' },
]

export default function AlphaProgressionAlternativePage() {
  return <AcquisitionLanding
    eyebrow="A balanced Alpha Progression alternative for iPhone"
    title="Choose the training workflow that fits you."
    intro="Alpha Progression is a capable option for plan generation, per-set progression recommendations, and exercise videos. Surpass takes a more focused route: choose one visible priority, train through a bounded block, and keep the next decision explainable."
    campaignUrl={APP_STORE_URL}
    campaignKey="seo_alpha_progression_alternative"
    canonicalPath="/alpha-progression-alternative"
    heroImage="/marketing/surpass-build-home.png"
    heroImageAlt="Surpass Build Home screen showing a focused training block and next workout"
    heroPresentation="screen"
    benefits={benefits}
    benefitsTitle="Where Surpass takes a different route."
    benefitsIntro="The right app depends on whether you want maximum configuration or a clearer path from priority to next workout."
    steps={steps}
    flowTitle="From priority to next session."
    flowIntro="Surpass keeps the product decision visible: choose the block, run the work, review the evidence, and apply changes deliberately."
    comparison={comparison}
    comparisonTitle="Surpass and Alpha Progression, side by side."
    comparisonIntro="This comparison is intentionally honest. Alpha Progression may be the better fit for some lifters; Surpass is built around a different training loop."
    comparisonLabel="Surpass and Alpha Progression workflow comparison"
    comparisonLeftLabel="Alpha Progression"
    faqs={faqs}
    faqTitle="Questions before you switch or try both."
    related={[
      ['/hypertrophy-app', 'Hypertrophy app for iPhone'],
      ['/progressive-overload', 'Progressive overload app'],
      ['/gym-workout-planner', 'Gym workout planner'],
      ['/workout-tracker', 'Workout tracker'],
      ['/methodology', 'Training methodology'],
      ['/blog/best-hypertrophy-app-ios-review', 'Best hypertrophy app for iOS'],
    ]}
    finalTitle="Try the more focused training loop."
    finalCopy="Start free on iPhone, choose a visible priority, and see whether Surpass makes your next workout easier to act on."
  />
}
