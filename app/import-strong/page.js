import AcquisitionLanding from '../components/AcquisitionLanding'

const APP_STORE_URL = 'https://apps.apple.com/app/apple-store/id6757132605?pt=128406689&ct=seo_import_strong&mt=8'

export const metadata = {
  title: { absolute: 'Import Strong Workouts into Surpass' },
  description: 'On iPhone, open Strong Settings and choose Export Strong Data. Review the English CSV in Surpass before saving.',
  keywords: ['import Strong CSV', 'Export Strong Data', 'Strong alternative', 'Strong to Surpass'],
  alternates: { canonical: 'https://jacked.coach/import-strong/' },
  openGraph: {
    title: 'Import Strong workouts into Surpass',
    description: 'Export Strong Data as an English CSV, then review it in Surpass before anything is saved.',
    url: 'https://jacked.coach/import-strong/',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Import a Strong workout CSV into Surpass' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Import Strong workouts into Surpass',
    description: 'Settings, Export Strong Data, then a reviewable import on iPhone.',
    images: ['/og-image.png'],
  },
}

const benefits = [
  { title: 'Use Strong’s standard export', copy: 'In Strong on iPhone, open Settings and choose Export Strong Data. Keep the original English CSV unchanged.' },
  { title: 'English exports are the supported path', copy: 'Surpass supports English Strong exports. Other languages are not described as supported here.' },
  { title: 'No Strong login', copy: 'Surpass reads the file you select. It does not request credentials for Hevy, Strong, or FitNotes.' },
]

const steps = [
  { title: 'Export Strong Data', copy: 'Open Strong, go to Settings, choose Export Strong Data, and save the English CSV to Files.' },
  { title: 'Choose Strong in Surpass', copy: 'Open Import Workout History, select Strong, and choose the untouched CSV. Files over 25 MB are outside the documented limit.' },
  { title: 'Check the preview and confirm', copy: 'Review the date range, workout count, and exercise matches. Surpass saves the import only after you confirm.' },
]

const comparison = [
  ['Existing workouts', 'Re-enter dates, exercises, sets, and notes.', 'Import supported Strong history from the exported CSV.'],
  ['Exercise names', 'Rebuild movements before the first session.', 'Review matches and retain unmatched exercises as custom movements.'],
  ['Next workout', 'Start with an empty record.', 'Use imported results as the last-time context for the next-set target.'],
]

const faqs = [
  { question: 'How do I export workouts from Strong on iPhone?', answer: 'Open Strong, go to Settings, and select Export Strong Data. Save the spreadsheet-friendly CSV to Files, then choose Strong on the Surpass import screen.' },
  { question: 'Does Surpass support every Strong export language?', answer: 'Surpass currently supports English Strong exports. Keep the original export unchanged so its headers and dates can be checked correctly.' },
  { question: 'Does Surpass need my Strong login?', answer: 'No. Surpass imports the CSV file you select on your iPhone and does not request credentials for Hevy, Strong, or FitNotes.' },
  { question: 'What is the file-size limit?', answer: 'The Surpass import path documents a 25 MB limit. Keep the original English CSV under that size.' },
]

export default function ImportStrongPage() {
  return <AcquisitionLanding
    eyebrow="Strong CSV to Surpass"
    title="Export Strong Data, then review it before you save."
    intro="Strong’s iPhone export is Settings, then Export Strong Data. Surpass reads that English CSV on device and waits for you to confirm."
    campaignUrl={APP_STORE_URL}
    campaignKey="seo_import_strong"
    canonicalPath="/import-strong/"
    heroImage="/marketing/screens/surpass-01-480.webp"
    heroImageAlt="Surpass screenshot with a next-set target beside what you lifted last time"
    heroPresentation="screen"
    benefits={benefits}
    benefitsTitle="Use the export Strong already provides."
    benefitsIntro="The transfer stays file-based. Surpass does not need a Strong account connection."
    steps={steps}
    flowTitle="Strong export to Surpass in three steps."
    flowIntro="Keep the original file, inspect the summary, and confirm only when the workout counts and exercise matches look right."
    comparison={comparison}
    comparisonTitle="Switch the app, not the training record."
    comparisonIntro="A useful migration preserves the details you rely on before your next working set."
    comparisonLabel="Starting over and importing Strong workout history comparison"
    comparisonLeftLabel="Start over"
    faqs={faqs}
    faqTitle="Questions about moving from Strong."
    sources={[
      ['https://www.strong.app/', 'Strong, including CSV export, checked 5 October 2026'],
      ['https://apps.apple.com/app/id6757132605', 'Surpass on the App Store, checked 5 October 2026'],
    ]}
    sourcesNote="The iPhone path is Settings and Export Strong Data. Strong’s site, checked 5 October 2026, also says you can export your data and lists CSV export."
    related={[
      ['/strong-alternative', 'Strong alternative'],
      ['/import-hevy', 'Import Hevy workouts'],
      ['/import-workout-history', 'Import workout history'],
      ['/tools/strong-csv-import-checker', 'Strong CSV import checker'],
      ['/hevy-vs-strong', 'Hevy vs Strong'],
    ]}
    finalTitle="Keep your Strong history useful."
    finalCopy="Start free on iPhone, review the English Strong CSV, and continue with a target on the next set."
  />
}
