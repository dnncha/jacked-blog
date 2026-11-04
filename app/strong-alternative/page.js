import AcquisitionLanding from '../components/AcquisitionLanding'

const APP_STORE_URL = 'https://apps.apple.com/app/apple-store/id6757132605?pt=128406689&ct=seo_strong_alternative&mt=8'

export const metadata = {
  title: 'Strong Alternative for iPhone | Import Strong CSV',
  description: 'Export Strong workout data as CSV, review it in Surpass before saving, and continue on iPhone with workout history, lift progress, and next-set targets.',
  keywords: ['Strong alternative iPhone', 'import Strong CSV', 'Strong workout data export', 'switch from Strong app', 'workout tracker CSV import'],
  alternates: { canonical: 'https://jacked.coach/strong-alternative/' },
  openGraph: {
    title: 'Move Your Strong Workout History to Surpass',
    description: 'Import a supported English Strong CSV into Surpass without rebuilding every workout.',
    url: 'https://jacked.coach/strong-alternative/',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Import Strong workout history into Surpass on iPhone' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Move Your Strong Workout History to Surpass',
    description: 'Review a supported English Strong CSV before importing it into Surpass.',
    images: ['/og-image.png'],
  },
}

const benefits = [
  { title: 'Use Strong’s standard export', copy: 'In Strong on iPhone, open Settings and choose Export Strong Data. Keep the original English CSV unchanged.' },
  { title: 'Review the file before saving', copy: 'Surpass checks the workout and exercise fields, then shows a summary before anything is added.' },
  { title: 'Keep useful set context', copy: 'Supported dates, workout and exercise names, weights, reps, RPE, distance, duration, and notes remain available for your training history.' },
]

const steps = [
  { title: 'Export Strong Data', copy: 'Open Strong, go to Settings, choose Export Strong Data, and save the English CSV to Files.' },
  { title: 'Choose Strong in Surpass', copy: 'Open Import Workout History, select Strong, and choose the untouched CSV from Files.' },
  { title: 'Check the preview and confirm', copy: 'Review the date range, workout count, and exercise matches. Surpass saves the import only after you confirm.' },
]

const comparison = [
  ['Existing workouts', 'Re-enter dates, exercises, sets, and notes.', 'Import supported Strong history from the exported CSV.'],
  ['Exercise names', 'Rebuild movements before the first session.', 'Review matches and retain unmatched exercises as custom movements.'],
  ['Next workout', 'Start with an empty record.', 'Use imported results as context for lift history and next-set targets.'],
]

const faqs = [
  { question: 'How do I export workouts from Strong on iPhone?', answer: 'Open Strong, go to Settings, and select Export Strong Data. Save the spreadsheet-friendly CSV to Files, then choose Strong on the Surpass import screen.' },
  { question: 'Does Surpass support every Strong export language?', answer: 'Surpass currently supports English Strong exports. Keep the original export unchanged so its headers and dates can be checked correctly.' },
  { question: 'What Strong data can Surpass read?', answer: 'Supported fields include workout dates and names, exercise names, set order, weight and units, reps, RPE, distance, duration, and notes when those fields are present.' },
  { question: 'Does Surpass need my Strong login?', answer: 'No. Surpass imports the CSV file you select on your iPhone and does not request access to your Strong account.' },
  { question: 'Can I undo a Strong import?', answer: 'Yes. Imported sessions and their derived history can be removed separately without deleting workouts you logged manually in Surpass.' },
  { question: 'Is Surpass on Android?', answer: 'No. Surpass runs on iPhone. There is no Android version.' },
]

export default function StrongAlternativePage() {
  return <AcquisitionLanding
    eyebrow="A Strong alternative that keeps your workout log"
    title="Leave Strong without leaving your history behind."
    intro="Export Strong Data, review the supported CSV in Surpass, then continue training with your workout history available for lift progress and next-set targets."
    campaignUrl={APP_STORE_URL}
    campaignKey="seo_strong_alternative"
    canonicalPath="/strong-alternative"
    heroImage="/marketing/screens/surpass-01-480.webp"
    heroImageAlt="Surpass screenshot with a next-set target beside what you lifted last time"
    heroPresentation="screen"
    benefits={benefits}
    benefitsTitle="Use the export Strong already provides."
    benefitsIntro="The transfer stays file-based and reviewable. Surpass does not need account access or a cloud connection to Strong."
    steps={steps}
    flowTitle="Strong export to Surpass in three steps."
    flowIntro="Keep the original file, inspect the summary, and confirm only when the workout counts and exercise matches look right."
    comparison={comparison}
    comparisonTitle="Switch the app, not the training record."
    comparisonIntro="A useful migration preserves the details you rely on before your next working set."
    comparisonLabel="Starting over and importing Strong workout history comparison"
    verdict={{"summary": "Strong is one of the simplest, fastest logs there is. Keep it if logging is all you want. Try Surpass if you want the app to plan your week around one body part.", "checked": "3 November 2026", "sections": [{"title": "Where Strong is better", "items": ["Simpler and faster to log. Strong’s whole pitch is “think less, lift more”, and it delivers.", "Android support. Surpass runs on iPhone. There is no Android version.", "A lifetime PRO option ($99.99 Forever on the US App Store, or $4.99 a month, $29.99 a year). Surpass has no lifetime plan.", "A long track record and a huge review base (4.9 from 125K reviews, Strong’s figures)."]}, {"title": "Who should pick Strong", "copy": "Lifters who already know their program and just want to write it down quickly, on any phone."}, {"title": "Who should pick Surpass", "copy": "iPhone lifters who want the plan made for them, aimed at one muscle, with private photos to check progress."}]}}
    faqs={faqs}
    faqTitle="Questions about moving from Strong."
    related={[
      ['/import-workout-history', 'Import workout history guide'],
      ['/hevy-alternative', 'Hevy alternative'],
      ['/fitnotes-alternative', 'FitNotes alternative'],
      ['/tools/strong-csv-import-checker', 'Strong CSV import checker'],
      ['/progressive-overload', 'Progressive overload app'],
    ]}
    finalTitle="Keep your Strong history useful."
    finalCopy="Start free on iPhone, review your Strong CSV, and bring supported workout context into your next training block."
  />
}
