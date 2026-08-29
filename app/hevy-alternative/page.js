import AcquisitionLanding from '../components/AcquisitionLanding'

const APP_STORE_URL = 'https://apps.apple.com/app/apple-store/id6757132605?pt=128406689&ct=seo_hevy_alternative&mt=8'

export const metadata = {
  title: 'Hevy Alternative for iPhone | Import Workout History',
  description: 'Import supported Hevy, Strong, or FitNotes workout history into Surpass, review the preview before saving, and continue training with next-lift and weekly muscle targets.',
  keywords: ['Hevy alternative iPhone', 'Strong alternative iPhone', 'import workout history', 'workout tracker CSV import', 'switch gym tracker'],
  alternates: { canonical: 'https://jacked.coach/hevy-alternative' },
  openGraph: {
    title: 'Bring Your Workout History to Surpass',
    description: 'Review a Hevy, Strong, or FitNotes CSV before importing workout history into Surpass on iPhone.',
    url: 'https://jacked.coach/hevy-alternative',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Bring your training history to Surpass from Hevy, Strong, or FitNotes' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bring Your Workout History to Surpass',
    description: 'Review a supported workout CSV before importing it into Surpass on iPhone.',
    images: ['/og-image.png'],
  },
}

const benefits = [
  { title: 'Check the file before anything is saved', copy: 'Surpass validates the CSV and shows a preview first. You choose whether to continue with the import.' },
  { title: 'Keep useful training context', copy: 'Bring sessions, exercises, sets, notes, and history that Surpass can use for lift stats, PRs, and weekly volume.' },
  { title: 'Continue without creating an account', copy: 'The import uses a file you select on your iPhone. Surpass does not need access to your Hevy, Strong, or FitNotes account.' },
]

const steps = [
  { title: 'Export your workout CSV', copy: 'Choose Hevy, Strong, or FitNotes in Surpass and follow the source-specific export instruction shown on screen.' },
  { title: 'Review and map the history', copy: 'Check the date range and workout counts, then review exercise matches. Unmatched exercises can remain custom.' },
  { title: 'Confirm the import', copy: 'Surpass adds the selected history only after confirmation. Imported data can be removed separately later.' },
]

const comparison = [
  ['Workout history', 'Re-enter old sessions and sets manually.', 'Import supported session, exercise, set, and note history from CSV.'],
  ['Exercise names', 'Rebuild every exercise before continuing.', 'Review matches and keep unmatched movements as custom exercises.'],
  ['Progress context', 'Begin with an empty training record.', 'Use imported history for lift stats, PRs, weekly volume, and next-lift context.'],
]

const faqs = [
  { question: 'Can Surpass import Hevy workout history?', answer: 'Yes. In Hevy, export the workout CSV from Settings, then select Hevy on the Surpass import screen. Surpass checks the file and shows a preview before saving anything.' },
  { question: 'Can Surpass import Strong or FitNotes?', answer: 'Yes. Surpass accepts supported Strong exports in English and FitNotes training-history CSV exports. Source-specific instructions appear before you select the file.' },
  { question: 'Does Surpass connect to my existing account?', answer: 'No. The import uses a CSV file you select on your iPhone. Surpass does not request credentials for Hevy, Strong, or FitNotes.' },
  { question: 'What happens to exercises Surpass does not recognize?', answer: 'You can review exercise matches before importing. Unmatched exercises can be imported as custom movements and mapped later.' },
  { question: 'Can I remove imported data?', answer: 'Yes. Surpass can remove imported sessions, templates, strength points, weekly volume, and imported measurements while leaving manually logged workouts untouched.' },
]

export default function HevyAlternativePage() {
  return <AcquisitionLanding
    eyebrow="Switch workout trackers without starting over"
    title="Bring your training history with you."
    intro="Surpass imports supported Hevy, Strong, and FitNotes workout CSVs on iPhone. Review the preview, confirm what is saved, then use that history for your next lift and weekly muscle targets."
    campaignUrl={APP_STORE_URL}
    campaignKey="seo_hevy_alternative"
    canonicalPath="/hevy-alternative"
    heroImage="/marketing/surpass-home.png"
    heroImageAlt="Surpass import screen showing Hevy, Strong, and FitNotes workout CSV sources"
    heroPresentation="screen"
    benefits={benefits}
    benefitsTitle="Switch trackers without rebuilding every workout."
    benefitsIntro="The import is file-based, reviewable, and separate from workouts you log manually in Surpass."
    steps={steps}
    flowTitle="Export, review, then confirm."
    flowIntro="Nothing is added until you inspect the file summary and choose to import it."
    comparison={comparison}
    comparisonTitle="Your old log can stay useful."
    comparisonIntro="Surpass turns supported CSV history into training context instead of an archive you have to search manually."
    comparisonLabel="Starting over and importing workout history comparison"
    faqs={faqs}
    faqTitle="Questions before moving workout history."
    related={[
      ['/import-workout-history', 'Import workout history guide'],
      ['/blog/import-hevy-to-surpass', 'Import Hevy to Surpass guide'],
      ['/strong-alternative', 'Strong alternative'],
      ['/fitnotes-alternative', 'FitNotes alternative'],
      ['/workout-tracker', 'Workout tracker for iPhone'],
      ['/progressive-overload', 'Progressive overload app'],
    ]}
    finalTitle="Keep the history. Change the training workflow."
    finalCopy="Start free on iPhone, review your supported workout CSV, and decide what to bring into your next training block."
  />
}
