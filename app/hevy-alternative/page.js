import AcquisitionLanding from '../components/AcquisitionLanding'

const APP_STORE_URL = 'https://apps.apple.com/app/apple-store/id6757132605?pt=128406689&ct=seo_hevy_alternative&mt=8'

export const metadata = {
  title: 'Hevy Alternative for iPhone | Import Workout History',
  description: 'Import supported Hevy, Strong, or FitNotes workout history into Jacked, review the preview before saving, and continue training with next-lift and weekly muscle targets.',
  keywords: ['Hevy alternative iPhone', 'Strong alternative iPhone', 'import workout history', 'workout tracker CSV import', 'switch gym tracker'],
  alternates: { canonical: 'https://jacked.coach/hevy-alternative' },
  openGraph: {
    title: 'Bring Your Workout History to Jacked',
    description: 'Review a Hevy, Strong, or FitNotes CSV before importing workout history into Jacked on iPhone.',
    url: 'https://jacked.coach/hevy-alternative',
    images: [{ url: '/marketing/generated/jacked-import-social.png', width: 1200, height: 630, alt: 'Bring your training history to Jacked from Hevy, Strong, or FitNotes' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bring Your Workout History to Jacked',
    description: 'Review a supported workout CSV before importing it into Jacked on iPhone.',
    images: ['/marketing/generated/jacked-import-social.png'],
  },
}

const benefits = [
  { title: 'Check the file before anything is saved', copy: 'Jacked validates the CSV and shows a preview first. You choose whether to continue with the import.' },
  { title: 'Keep useful training context', copy: 'Bring sessions, exercises, sets, notes, and history that Jacked can use for lift stats, PRs, and weekly volume.' },
  { title: 'Continue without creating an account', copy: 'The import uses a file you select on your iPhone. Jacked does not need access to your Hevy, Strong, or FitNotes account.' },
]

const steps = [
  { title: 'Export your workout CSV', copy: 'Choose Hevy, Strong, or FitNotes in Jacked and follow the source-specific export instruction shown on screen.' },
  { title: 'Review and map the history', copy: 'Check the date range and workout counts, then review exercise matches. Unmatched exercises can remain custom.' },
  { title: 'Confirm the import', copy: 'Jacked adds the selected history only after confirmation. Imported data can be removed separately later.' },
]

const comparison = [
  ['Workout history', 'Re-enter old sessions and sets manually.', 'Import supported session, exercise, set, and note history from CSV.'],
  ['Exercise names', 'Rebuild every exercise before continuing.', 'Review matches and keep unmatched movements as custom exercises.'],
  ['Progress context', 'Begin with an empty training record.', 'Use imported history for lift stats, PRs, weekly volume, and next-lift context.'],
]

const faqs = [
  { question: 'Can Jacked import Hevy workout history?', answer: 'Yes. In Hevy, export the workout CSV from Settings, then select Hevy on the Jacked import screen. Jacked checks the file and shows a preview before saving anything.' },
  { question: 'Can Jacked import Strong or FitNotes?', answer: 'Yes. Jacked accepts supported Strong exports in English and FitNotes training-history CSV exports. Source-specific instructions appear before you select the file.' },
  { question: 'Does Jacked connect to my existing account?', answer: 'No. The import uses a CSV file you select on your iPhone. Jacked does not request credentials for Hevy, Strong, or FitNotes.' },
  { question: 'What happens to exercises Jacked does not recognize?', answer: 'You can review exercise matches before importing. Unmatched exercises can be imported as custom movements and mapped later.' },
  { question: 'Can I remove imported data?', answer: 'Yes. Jacked can remove imported sessions, templates, strength points, weekly volume, and imported measurements while leaving manually logged workouts untouched.' },
]

export default function HevyAlternativePage() {
  return <AcquisitionLanding
    eyebrow="Switch workout trackers without starting over"
    title="Bring your training history with you."
    intro="Jacked imports supported Hevy, Strong, and FitNotes workout CSVs on iPhone. Review the preview, confirm what is saved, then use that history for your next lift and weekly muscle targets."
    campaignUrl={APP_STORE_URL}
    campaignKey="seo_hevy_alternative"
    heroImage="/marketing/jacked-import-workouts.png"
    heroImageAlt="Jacked import screen showing Hevy, Strong, and FitNotes workout CSV sources"
    heroPresentation="screen"
    benefits={benefits}
    benefitsTitle="Switch trackers without rebuilding every workout."
    benefitsIntro="The import is file-based, reviewable, and separate from workouts you log manually in Jacked."
    steps={steps}
    flowTitle="Export, review, then confirm."
    flowIntro="Nothing is added until you inspect the file summary and choose to import it."
    comparison={comparison}
    comparisonTitle="Your old log can stay useful."
    comparisonIntro="Jacked turns supported CSV history into training context instead of an archive you have to search manually."
    comparisonLabel="Starting over and importing workout history comparison"
    faqs={faqs}
    faqTitle="Questions before moving workout history."
    related={[
      ['/blog/import-hevy-to-jacked', 'Import Hevy to Jacked guide'],
      ['/strong-alternative', 'Strong alternative'],
      ['/fitnotes-alternative', 'FitNotes alternative'],
      ['/workout-tracker', 'Workout tracker for iPhone'],
      ['/progressive-overload', 'Progressive overload app'],
    ]}
    finalTitle="Keep the history. Change the training workflow."
    finalCopy="Download Jacked on iPhone, review your supported workout CSV, and decide what to bring into your next training block."
  />
}
