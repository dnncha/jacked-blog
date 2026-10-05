import AcquisitionLanding from '../components/AcquisitionLanding'

const APP_STORE_URL = 'https://apps.apple.com/app/apple-store/id6757132605?pt=128406689&ct=seo_import_hevy&mt=8'

export const metadata = {
  title: 'Import Hevy Workouts into Surpass',
  description: 'Export a Hevy workout CSV from Settings, then review and import it into Surpass on iPhone. No Hevy login is required.',
  keywords: ['import Hevy CSV', 'Hevy export workouts', 'switch from Hevy', 'Hevy to Surpass'],
  alternates: { canonical: 'https://jacked.coach/import-hevy/' },
  openGraph: {
    title: 'Import Hevy workouts into Surpass',
    description: 'Export the Hevy workout CSV, review the file in Surpass, and confirm before anything is saved.',
    url: 'https://jacked.coach/import-hevy/',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Import a Hevy workout CSV into Surpass' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Import Hevy workouts into Surpass',
    description: 'A file you choose on the iPhone. Surpass does not sign into Hevy.',
    images: ['/og-image.png'],
  },
}

const benefits = [
  { title: 'Use the CSV Hevy already exports', copy: 'In Hevy, open Settings and export the workout CSV. Keep that file unchanged so the headers stay readable.' },
  { title: 'Review before anything is saved', copy: 'Nothing is added until you inspect the file summary and choose to import it.' },
  { title: 'No Hevy password', copy: 'Surpass reads the file you select. It does not request credentials for Hevy, Strong, or FitNotes.' },
]

const steps = [
  { title: 'Export the workout CSV in Hevy', copy: 'Open Hevy, go to Settings, and export your workout history as CSV. Save it to Files. Hevy’s public help center returned HTTP 403 on 5 October 2026, so this page uses the in-app Settings export rather than a help-article URL.' },
  { title: 'Choose Hevy in Surpass', copy: 'Open Import Workout History, select Hevy, and pick the untouched CSV. The import screen states a 25 MB file limit.' },
  { title: 'Confirm the preview', copy: 'Check the date range, workout count, and exercise matches. Surpass saves the import only after you confirm.' },
]

const comparison = [
  ['Existing workouts', 'Re-enter dates, exercises, sets, and notes.', 'Import supported Hevy history from the exported CSV.'],
  ['Account access', 'Connect the two apps.', 'Surpass never asks for a Hevy login.'],
  ['Next workout', 'Start with an empty record.', 'Imported sets become the last-time context for the next target.'],
]

const faqs = [
  { question: 'Where is the Hevy export?', answer: 'Open Hevy and use the workout CSV export in Settings, then save the file to Files. On 5 October 2026, Hevy’s public help center did not return an article body (HTTP 403), so this guide does not link a help URL.' },
  { question: 'Does Surpass need my Hevy account?', answer: 'No. Surpass imports the CSV file you select on your iPhone and does not request credentials for Hevy, Strong, or FitNotes.' },
  { question: 'What gets checked before saving?', answer: 'Nothing is added until you inspect the file summary and choose to import it. You can review dates, workout counts, and exercise matches first.' },
  { question: 'Can I remove a Hevy import later?', answer: 'Yes. Imported sessions can be removed separately without deleting workouts you logged manually in Surpass.' },
]

export default function ImportHevyPage() {
  return <AcquisitionLanding
    eyebrow="Hevy CSV to Surpass"
    title="Bring the Hevy log. Leave the account behind."
    intro="Export a Hevy workout CSV, review it in Surpass, and confirm before a single session is saved. The next set can then show a target beside what you lifted last time."
    campaignUrl={APP_STORE_URL}
    campaignKey="seo_import_hevy"
    canonicalPath="/import-hevy/"
    heroImage="/marketing/screens/surpass-01-480.webp"
    heroImageAlt="Surpass screenshot with a next-set target beside what you lifted last time"
    heroPresentation="screen"
    benefits={benefits}
    benefitsTitle="The transfer stays a file on your iPhone."
    benefitsIntro="Surpass does not connect to Hevy. You choose the CSV, you read the summary, and you confirm."
    steps={steps}
    flowTitle="Hevy export to Surpass in three steps."
    flowIntro="Keep the original file, inspect the summary, and confirm only when the workout counts look right."
    comparison={comparison}
    comparisonTitle="Switch the app, not the training record."
    comparisonIntro="A useful migration preserves the sets you already logged."
    comparisonLabel="Starting over and importing Hevy workout history comparison"
    comparisonLeftLabel="Start over"
    faqs={faqs}
    faqTitle="Questions about importing Hevy."
    sources={[
      ['https://apps.apple.com/app/id6757132605', 'Surpass on the App Store, checked 5 October 2026'],
      ['/hevy-alternative', 'Surpass Hevy alternative'],
    ]}
    sourcesNote="Hevy’s public help center returned HTTP 403 on 5 October 2026, so the export steps follow the Settings path already documented for Surpass’s Hevy import."
    related={[
      ['/hevy-alternative', 'Hevy alternative'],
      ['/import-strong', 'Import Strong workouts'],
      ['/import-workout-history', 'Import workout history'],
      ['/tools/hevy-import-checker', 'Hevy CSV import checker'],
      ['/hevy-vs-strong', 'Hevy vs Strong'],
    ]}
    finalTitle="Keep the Hevy history useful."
    finalCopy="Start free on iPhone, review the Hevy CSV, and decide what to bring into the next session."
  />
}
