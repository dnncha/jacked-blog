import AcquisitionLanding from '../components/AcquisitionLanding'

const APP_STORE_URL = 'https://apps.apple.com/app/apple-store/id6757132605?pt=128406689&ct=seo_surpass_vs_fitbod&mt=8'

export const metadata = {
  title: 'Surpass vs Fitbod (2026): You Pick the Muscle, or the Algorithm Does | Surpass',
  description: 'Fitbod’s algorithm picks each workout from your history and recovery. Surpass lets you pick the muscle you want people to notice, plans the week around it, and keeps private photos that show it. An honest comparison, with prices.',
  keywords: ['Surpass vs Fitbod', 'Fitbod alternative', 'Fitbod vs', 'Fitbod comparison', 'cheaper Fitbod alternative', 'physique workout app'],
  alternates: { canonical: 'https://jacked.coach/surpass-vs-fitbod/' },
  openGraph: {
    title: 'Surpass vs Fitbod: you pick the muscle, or the algorithm does',
    description: 'An honest comparison of Surpass and Fitbod for lifters who want to look bigger.',
    url: 'https://jacked.coach/surpass-vs-fitbod/',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Surpass compared with Fitbod' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Surpass vs Fitbod: you pick the muscle, or the algorithm does',
    description: 'An honest comparison of Surpass and Fitbod, with prices.',
    images: ['/og-image.png'],
  },
}

const benefits = [
  { title: 'You decide what grows', copy: 'Tell Surpass what you want people to notice first. The block gives that muscle its own weekly set target instead of spreading work by recovery alone.' },
  { title: 'You can see why a set is there', copy: 'Today shows the week on a front and back body map and how many sets each priority muscle still needs. The plan stays the same week to week, so loads can climb.' },
  { title: 'You can see it working', copy: 'Frame Check takes matched front, side and back photos, keeps them on your phone, and ranks your next priority from what you mark. No score.' },
]

const steps = [
  { title: 'Pick one visible priority', copy: 'Bigger arms, wider shoulders, more chest, a wider back, your whole frame, legs or strength. Then set your days, session length and equipment.' },
  { title: 'Train the same block for weeks', copy: 'Anchor lifts stay put so the weight and rep targets can move up. Every set shows its target beside your last result.' },
  { title: 'Check it, then pick the next change', copy: 'Take a Frame Check when the block ends, mark what you see, and Surpass ranks what to build next.' },
]

const comparison = [
  ['Who decides the workout', 'An algorithm recommends muscles and exercises each session from your training history and recovery.', 'You choose the muscle you want people to notice; the block gives it extra weekly sets.'],
  ['Week to week', 'Workouts update as the algorithm learns, so sessions can change often.', 'A block of weeks with the same anchor lifts, so loads can progress.'],
  ['Seeing progress', 'Your logged workouts and lift history.', 'A body map of this week’s sets, plus matched Frame Check photos compared only with your own past.'],
  ['Price (US)', '$15.99 a month or $95.99 a year, with a 7-day free trial. Duo and Family plans are also offered.', 'Free logging and import. Pro is $12.99 a month or $59.99 a year, with a 7-day trial on annual.'],
]

const sources = [
  ['https://fitbod.me/', 'Fitbod homepage'],
  ['https://fitbod.me/blog/fitbods-new-family-plan-offering/', 'Fitbod Duo and Family plans'],
  ['https://www.sensai.fit/blog/fitbod-review-2026', 'Fitbod review 2026 (pricing)'],
  ['https://apps.apple.com/us/app/fitbod-gym-fitness-planner/id1041517543', 'Fitbod on the App Store'],
]

const faqs = [
  { question: 'Is Surpass better than Fitbod?', answer: 'It depends on what you want to hand over. Fitbod is a strong choice if you want an algorithm to plan every session for you. Surpass is for lifters who already know which muscle they want to grow and want a plan, and proof, aimed at it.' },
  { question: 'Is Surpass cheaper than Fitbod?', answer: 'Yes, in the US. Surpass Pro is $12.99 a month or $59.99 a year, against Fitbod’s $15.99 a month or $95.99 a year. Surpass’s 7-day trial is on the annual plan; Fitbod also offers a 7-day trial. Surpass logging, history and import are free without a subscription.' },
  { question: 'Does Surpass explain why I am doing each set?', answer: 'The plan is built around your priority, so the reason is visible: Today shows how many sets each priority muscle still needs this week on a body map, and each set shows its weight and rep target beside your last result.' },
  { question: 'Can I move my Fitbod history to Surpass?', answer: 'Not yet. Surpass imports Hevy, Strong and FitNotes CSV files today. You can start fresh in Surpass and your first block will set targets from the weights you log.' },
  { question: 'Does Surpass rate my physique from photos?', answer: 'No. Frame Check keeps matched photos on your phone and asks you to mark what you see. There is no score and no comparison with anyone else.' },
]

export default function SurpassVsFitbodPage() {
  return <AcquisitionLanding
    eyebrow="Surpass vs Fitbod"
    title="Fitbod picks the workout. You pick the muscle."
    intro="Fitbod’s algorithm recommends each session from your history and recovery. Surpass starts with what you want people to notice first, gives that muscle a block of weeks to grow, and keeps private photos that show whether it is working."
    campaignUrl={APP_STORE_URL}
    campaignKey="seo_surpass_vs_fitbod"
    canonicalPath="/surpass-vs-fitbod"
    heroImage="/marketing/priority/surpass-priority-shoulders.webp"
    heroImageAlt="The Wider shoulders card from the Surpass first screen, with the shoulders lit"
    heroPresentation="screen"
    benefits={benefits}
    benefitsTitle="Priority, block, proof."
    benefitsIntro="Surpass is built as one loop: choose the change, train for it, and see it showing."
    steps={steps}
    flowTitle="How a Surpass block runs."
    flowIntro="One priority, the same anchor lifts for the whole block, and a photo check at the end."
    comparison={comparison}
    comparisonTitle="Surpass and Fitbod, side by side."
    comparisonIntro="Fitbod is one of the most popular planning apps on iPhone. This table shows where the two apps take different routes."
    comparisonLabel="Surpass and Fitbod comparison"
    comparisonMomentLabel="Moment"
    comparisonLeftLabel="Fitbod"
    sources={sources}
    sourcesNote="Fitbod details and prices were checked on 29 September 2026 and may have changed since."
    faqs={faqs}
    faqTitle="Questions before choosing between Surpass and Fitbod."
    related={[
      ['/surpass-vs-hevy', 'Surpass vs Hevy'],
      ['/best-physique-tracker-apps', 'Best physique tracker apps'],
      ['/alpha-progression-alternative', 'Alpha Progression comparison'],
      ['/bigger-arms', 'Bigger arms'],
      ['/wider-back', 'Wider back'],
      ['/whole-frame', 'Better whole frame'],
    ]}
    finalTitle="Pick the muscle. Let the block do the rest."
    finalCopy="Start free on iPhone. The first screen asks what you want people to notice first, and your first workout follows your answer."
    dockTitle="Get bigger on purpose."
  />
}
