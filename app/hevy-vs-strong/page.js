import AcquisitionLanding from '../components/AcquisitionLanding'

const APP_STORE_URL = 'https://apps.apple.com/app/apple-store/id6757132605?pt=128406689&ct=seo_hevy_vs_strong&mt=8'

export const metadata = {
  title: 'Hevy vs Strong: A Fair Comparison | Surpass',
  description: 'Hevy and Strong compared on 5 October 2026: price, free limits, accounts, Apple Watch, and where a no-account gym log with next-set targets fits.',
  keywords: ['Hevy vs Strong', 'Strong vs Hevy', 'Hevy alternative', 'Strong alternative', 'next set targets'],
  alternates: { canonical: 'https://jacked.coach/hevy-vs-strong/' },
  openGraph: {
    title: 'Hevy vs Strong, checked 5 October 2026',
    description: 'A dated comparison of Hevy and Strong, plus where Surpass fits if you want next-set targets without an account.',
    url: 'https://jacked.coach/hevy-vs-strong/',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Hevy vs Strong comparison for iPhone lifters' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hevy vs Strong, checked 5 October 2026',
    description: 'Price, accounts, Apple Watch, and next-set targets, with the sources dated.',
    images: ['/og-image.png'],
  },
}

const benefits = [
  { title: 'Strong asks for an account', copy: 'On 5 October 2026, Strong’s product required an account. Surpass does not. Workout history stays on the iPhone.' },
  { title: 'Free routine limits differ', copy: 'Strong’s free tier listed unlimited workouts and 3 custom routines. Hevy’s public pricing page did not expose a free routine count that day, so this page does not state one.' },
  { title: 'Both have a Watch. Surpass does not.', copy: 'Hevy and Strong both ship Apple Watch apps. Surpass stays on the iPhone, with a Lock Screen rest timer and next-set targets on the phone.' },
]

const steps = [
  { title: 'Check the job you want the log to do', copy: 'Social feed and Watch complications point toward Hevy or Strong. A target beside last time, with no account, points toward Surpass.' },
  { title: 'Read the price on your storefront', copy: 'US prices below were listed on 5 October 2026. Apple shows the local price before a purchase.' },
  { title: 'Move the CSV if you switch', copy: 'Surpass can import a Hevy or Strong workout CSV after you review it. The import does not sign into either account.' },
]

const comparison = [
  ['Account', 'Hevy and Strong both center on an account. Strong requires one.', 'No account. The log stays on the iPhone.'],
  ['Free routines', 'Strong free: unlimited workouts, 3 custom routines.', 'Routines are free and uncapped. Hevy’s free routine cap was not verified on 5 October 2026.'],
  ['Pro price, US', 'Hevy Pro $2.99–$3.99/month, $23.99/year, $74.99 lifetime. Strong Pro $4.99/month, $29.99/year, $99.99 lifetime.', 'Surpass Pro $59.99/year or $12.99/month, with a 7-day trial. Logging stays free.'],
  ['Apple Watch', 'Both Hevy and Strong have a Watch app.', 'No Apple Watch app.'],
  ['Next set', 'History is in the log.', 'Each set shows a target beside what you lifted last time.'],
]

const faqs = [
  { question: 'Is this comparison current?', answer: 'The prices, Strong’s 3-routine free tier, Strong’s account requirement, and the Watch point were checked on 5 October 2026. Storefront prices change. Confirm them in the App Store before you subscribe.' },
  { question: 'How many free routines does Hevy allow?', answer: 'This page does not state a number. Hevy’s pricing page was client-rendered and did not show a free routine count on 5 October 2026.' },
  { question: 'Does Surpass replace Hevy’s social features or Strong’s Watch app?', answer: 'No. Surpass does not include a social feed or an Apple Watch app. It is a no-account iPhone log with next-set targets, live PR alerts, and CSV import.' },
  { question: 'Can I bring a Hevy or Strong log into Surpass?', answer: 'Yes. Export a workout CSV, then review it in Surpass before anything is saved. Surpass does not request your Hevy or Strong password.' },
]

export default function HevyVsStrongPage() {
  return <AcquisitionLanding
    eyebrow="Checked 5 October 2026"
    title="Hevy vs Strong, and the log that puts a target on the set."
    intro="Hevy and Strong are mature workout logs with Apple Watch apps and broader language support. Surpass is the iPhone log for lifters who want a next-set target beside last time, without an account."
    campaignUrl={APP_STORE_URL}
    campaignKey="seo_hevy_vs_strong"
    canonicalPath="/hevy-vs-strong/"
    heroImage="/marketing/screens/surpass-01-480.webp"
    heroImageAlt="Surpass screenshot with a next-set target beside what you lifted last time"
    heroPresentation="screen"
    benefits={benefits}
    benefitsTitle="Where each log is actually stronger."
    benefitsIntro="A fair switch starts with the feature you will miss, not a claim that one app wins every row."
    steps={steps}
    flowTitle="Use the dated facts, then decide."
    flowIntro="Prices and free limits below are tied to 5 October 2026. They are not a promise about next month’s App Store sheet."
    comparison={comparison}
    comparisonTitle="Hevy, Strong, and Surpass on the points that change a switch."
    comparisonIntro="Watch, social, languages, and a lower Pro price favor the incumbents. The next-set target and the missing account favor Surpass."
    comparisonLabel="Hevy, Strong, and Surpass comparison"
    comparisonLeftLabel="Hevy and Strong"
    comparisonRightLabel="Surpass"
    faqs={faqs}
    faqTitle="Questions about Hevy vs Strong."
    sources={[
      ['https://www.hevyapp.com/', 'Hevy, checked 5 October 2026'],
      ['https://www.strong.app/', 'Strong, checked 5 October 2026'],
      ['https://apps.apple.com/app/id6757132605', 'Surpass on the App Store, checked 5 October 2026'],
    ]}
    sourcesNote="US prices and the Strong free-tier routine limit are from public product pages on 5 October 2026. Hevy’s free routine count is omitted because the pricing page did not render it."
    related={[
      ['/hevy-alternative', 'Switch from Hevy'],
      ['/strong-alternative', 'Switch from Strong'],
      ['/import-hevy', 'Import Hevy workouts'],
      ['/import-strong', 'Import Strong workouts'],
      ['/progressive-overload', 'Progressive overload app'],
    ]}
    finalTitle="Keep the history. Put a target on the next set."
    finalCopy="Start free on iPhone. Logging, routines, personal records, and CSV import do not require an account."
  />
}
