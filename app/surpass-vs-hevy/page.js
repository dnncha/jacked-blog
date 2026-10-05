import AcquisitionLanding from '../components/AcquisitionLanding'

const APP_STORE_URL = 'https://apps.apple.com/app/apple-store/id6757132605?pt=128406689&ct=seo_surpass_vs_hevy&mt=8'

export const metadata = {
  title: { absolute: 'Surpass vs Hevy (2026): Physique Plan or Workout Log? | Surpass' },
  description: 'Hevy is a free, social workout log. Surpass starts with the muscle you want people to notice, builds a training block for it, and keeps private photos that show it. An honest comparison, with prices.',
  keywords: ['Surpass vs Hevy', 'Hevy alternative', 'Hevy vs', 'Hevy comparison', 'physique workout app', 'Hevy progress photos'],
  alternates: { canonical: 'https://jacked.coach/surpass-vs-hevy/' },
  openGraph: {
    title: 'Surpass vs Hevy: physique plan or workout log?',
    description: 'An honest comparison of Surpass and Hevy for lifters who want to look bigger, not just log more.',
    url: 'https://jacked.coach/surpass-vs-hevy/',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Surpass compared with Hevy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Surpass vs Hevy: physique plan or workout log?',
    description: 'An honest comparison of Surpass and Hevy, with prices.',
    images: ['/og-image.png'],
  },
}

const benefits = [
  { title: 'It starts with what you want people to notice', copy: 'Bigger arms, wider shoulders, more chest, a wider back or your whole frame. That one answer decides where your extra sets go all block.' },
  { title: 'The week is on your body, not in a list', copy: 'Today shows your block and a front and back body map. Priority muscles fill in as you close on this week’s set target.' },
  { title: 'Proof stays private', copy: 'Frame Check takes matched front, side and back photos and keeps them on your phone. No score, no feed, no comparison with anyone else.' },
]

const steps = [
  { title: 'Bring your Hevy history', copy: 'Export your workout CSV from Hevy, select it in Surpass, and review the preview before anything is saved.' },
  { title: 'Pick one visible priority', copy: 'Answer “What do you want people to notice first?” and Surpass builds a block with anchor lifts and a weekly set target for it.' },
  { title: 'Train it, then check it', copy: 'Every set has a weight and rep target beside your last result. Take a Frame Check to see whether the priority is showing.' },
]

const comparison = [
  ['First question', 'Start a workout, pick a routine, or generate a program with Hevy Trainer.', 'What do you want people to notice first? Your answer shapes the block and your first workout.'],
  ['Your week', 'Routines you build or generate, and your workout history.', 'A block with anchor lifts and a weekly hard-set target for your priority, shown on a front and back body map.'],
  ['Each set', 'Your previous weights and reps to beat.', 'A weight and rep target beside your last result.'],
  ['Photos', 'Progress photos, free.', 'Frame Check: matched front, side and back photos. You mark what you see and get your next priority ranked.'],
  ['Social', 'A feed with followers, likes and comments.', 'No feed. Share a result only when you choose.'],
  ['Price (US)', 'Free, with Hevy Pro at $23.99 a year or $74.99 lifetime.', 'Free logging and import. Pro is $12.99 a month or $59.99 a year, with a 7-day trial on annual.'],
]

const sources = [
  ['https://www.hevyapp.com/', 'Hevy homepage'],
  ['https://www.hevyapp.com/announcing-hevy-trainer/', 'Hevy Trainer launch'],
  ['https://www.hevyapp.com/features/progress-photos/', 'Hevy progress photos'],
  ['https://apps.apple.com/us/app/hevy-workout-tracker-gym-log/id1458862350', 'Hevy on the App Store'],
]

const faqs = [
  { question: 'Is Surpass better than Hevy?', answer: 'For a different job. Hevy is a great free workout log with a large community and a social feed. Surpass is for lifters who want to change how they look: it plans the week around one visible priority and keeps private photos that show whether it is working.' },
  { question: 'Can I import my Hevy workouts into Surpass?', answer: 'Yes. Export your workout CSV from Hevy, choose Hevy on the Surpass import screen, and check the preview. Nothing is saved until you confirm, and Surpass never asks for your Hevy login.' },
  { question: 'Hevy has free progress photos. Why pay for Surpass?', answer: 'Photos on their own do not tell you what to train. Surpass links them to a block: you pick the muscle, the plan gives it the sets, and Frame Check shows whether it is coming through. Logging, import and your first Frame Check read stay free.' },
  { question: 'Does Surpass rate my physique?', answer: 'No. There is no score and no comparison with other people, only with your own past check-ins. Your photos stay on your phone.' },
  { question: 'When should I stay with Hevy?', answer: 'If you want free logging with friends, a social feed, or a very large exercise library with videos, Hevy is a strong choice. You can also use both: keep Hevy for its community and import your history into Surpass whenever you want to try a block.' },
]

export default function SurpassVsHevyPage() {
  return <AcquisitionLanding
    eyebrow="Surpass vs Hevy"
    title="Hevy logs it. Surpass builds it."
    intro="Hevy is a free, social workout log used by millions of lifters. Surpass asks what you want people to notice first, builds a training block around that muscle, and keeps private photos that show whether it is working. Here is how they differ."
    campaignUrl={APP_STORE_URL}
    campaignKey="seo_surpass_vs_hevy"
    canonicalPath="/surpass-vs-hevy"
    heroImage="/marketing/priority/surpass-priority-whole-frame.webp"
    heroImageAlt="The Better whole frame card from the Surpass first screen, showing a lifter in a black T-shirt"
    heroPresentation="screen"
    benefits={benefits}
    benefitsTitle="Priority, block, proof."
    benefitsIntro="Surpass is built as one loop: choose the change, train for it, and see it showing."
    steps={steps}
    flowTitle="Switching from Hevy takes three steps."
    flowIntro="Your history comes with you, so your first block starts from real weights instead of a blank log."
    comparison={comparison}
    comparisonTitle="Surpass and Hevy, side by side."
    comparisonIntro="Hevy is excellent at what it sets out to do. This table shows where the two apps take different routes."
    comparisonLabel="Surpass and Hevy comparison"
    comparisonMomentLabel="Moment"
    comparisonLeftLabel="Hevy"
    sources={sources}
    sourcesNote="Hevy details and prices were checked on 29 September 2026 and may have changed since."
    faqs={faqs}
    faqTitle="Questions before choosing between Surpass and Hevy."
    related={[
      ['/hevy-alternative', 'Import your Hevy history'],
      ['/surpass-vs-fitbod', 'Surpass vs Fitbod'],
      ['/best-physique-tracker-apps', 'Best physique tracker apps'],
      ['/bigger-arms', 'Bigger arms'],
      ['/wider-shoulders', 'Wider shoulders'],
      ['/whole-frame', 'Better whole frame'],
    ]}
    finalTitle="Keep the history. Pick what you want to build."
    finalCopy="Start free on iPhone, import your Hevy CSV, and let your first block aim at the muscle you want people to notice."
    dockTitle="Get bigger on purpose."
  />
}
