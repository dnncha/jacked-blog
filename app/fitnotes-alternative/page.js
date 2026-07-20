import AcquisitionLanding from '../components/AcquisitionLanding'

const APP_STORE_URL = 'https://apps.apple.com/app/apple-store/id6757132605?pt=128406689&ct=seo_fitnotes_alternative&mt=8'

export const metadata = {
  title: 'FitNotes Alternative for iPhone | Import Workout CSV',
  description: 'Export FitNotes workout history as CSV, review it in Jacked before saving, and continue training on iPhone with your historical lifts and weekly muscle targets.',
  keywords: ['FitNotes alternative iPhone', 'import FitNotes CSV', 'FitNotes workout export', 'switch from FitNotes', 'workout history iPhone'],
  alternates: { canonical: 'https://jacked.coach/fitnotes-alternative' },
  openGraph: {
    title: 'Bring FitNotes Workout History to Jacked',
    description: 'Use a FitNotes workout CSV to move supported historical logs into Jacked on iPhone.',
    url: 'https://jacked.coach/fitnotes-alternative',
    images: [{ url: '/marketing/generated/jacked-import-social.png', width: 1200, height: 630, alt: 'Import FitNotes workout history into Jacked on iPhone' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bring FitNotes Workout History to Jacked',
    description: 'Review a FitNotes workout CSV before importing it into Jacked.',
    images: ['/marketing/generated/jacked-import-social.png'],
  },
}

const benefits = [
  { title: 'Choose the workout CSV', copy: 'Export completed workout data from FitNotes as CSV. Use the workout export rather than a database or full-app backup.' },
  { title: 'Inspect the history first', copy: 'Jacked checks the file for workout dates and exercise rows, then shows a preview before saving.' },
  { title: 'Preserve historical lifts', copy: 'Supported exercise names, weights, reps, distance, duration, and notes become useful context for progress and weekly volume.' },
]

const steps = [
  { title: 'Export completed workouts', copy: 'In FitNotes, choose the workout or spreadsheet CSV export and save or share the file to Files.' },
  { title: 'Choose FitNotes in Jacked', copy: 'Open Import Workout History, select FitNotes, and choose the workout CSV—not a backup database.' },
  { title: 'Review and confirm', copy: 'Check the imported date range, workout count, and exercise matches before Jacked adds the history.' },
]

const comparison = [
  ['Historical logs', 'Keep opening the old app to check previous sets.', 'Import supported FitNotes workout rows into one iPhone training history.'],
  ['Custom exercises', 'Rename every movement before continuing.', 'Keep unmatched exercise names as custom movements and map them later.'],
  ['Weekly context', 'Begin with no historical volume.', 'Use imported working sets to rebuild lift progress and muscle-level context.'],
]

const faqs = [
  { question: 'Which FitNotes file should I export?', answer: 'Choose the completed-workout or workout-data CSV export. Do not select a FitNotes backup database or full-app backup for the Jacked CSV importer.' },
  { question: 'Where can I save the FitNotes CSV on iPhone?', answer: 'FitNotes can export workout CSV data to iCloud Drive or share it as an attachment. Save the file somewhere available in the iPhone Files picker.' },
  { question: 'What FitNotes data can Jacked import?', answer: 'Jacked supports workout dates, exercise names, weights in kilograms or pounds, reps, distance, duration, and notes when those columns are present.' },
  { question: 'Does Jacked change or delete my FitNotes data?', answer: 'No. Jacked reads the CSV copy you select. It does not connect to FitNotes or modify the original app data.' },
  { question: 'Can I remove a FitNotes import later?', answer: 'Yes. Imported sessions and their derived history can be removed separately while workouts logged manually in Jacked remain untouched.' },
]

export default function FitNotesAlternativePage() {
  return <AcquisitionLanding
    eyebrow="A FitNotes alternative for iPhone"
    title="Bring the log. Get a clearer next target."
    intro="Export your FitNotes workout CSV, review it in Jacked, then use supported historical lifts for progress views, weekly muscle context, and the next set."
    campaignUrl={APP_STORE_URL}
    campaignKey="seo_fitnotes_alternative"
    heroImage="/marketing/jacked-import-workouts.png"
    heroImageAlt="Jacked import screen showing Hevy, Strong, and FitNotes workout CSV sources"
    heroPresentation="screen"
    benefits={benefits}
    benefitsTitle="Your FitNotes history can move with you."
    benefitsIntro="Jacked uses the workout CSV you select on your iPhone. The original FitNotes data stays where it is."
    steps={steps}
    flowTitle="FitNotes CSV to Jacked in three steps."
    flowIntro="Choose the workout export, check the preview, and confirm only after the history looks right."
    comparison={comparison}
    comparisonTitle="Turn an old log into current training context."
    comparisonIntro="Imported history is useful when it helps you understand the next working set, not only the last one."
    comparisonLabel="Starting over and importing FitNotes workout history comparison"
    faqs={faqs}
    faqTitle="Questions about moving from FitNotes."
    related={[
      ['/tools/fitnotes-csv-import-checker', 'Check a FitNotes CSV'],
      ['/hevy-alternative', 'Hevy alternative'],
      ['/strong-alternative', 'Strong alternative'],
      ['/workout-tracker', 'Workout tracker for iPhone'],
      ['/progressive-overload', 'Progressive overload app'],
    ]}
    finalTitle="Keep the history. Improve the next decision."
    finalCopy="Download Jacked on iPhone, inspect your FitNotes workout CSV, and decide what to bring into your next training block."
  />
}
