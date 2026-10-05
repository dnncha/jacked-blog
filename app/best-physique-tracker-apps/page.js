import AcquisitionLanding from '../components/AcquisitionLanding'

const APP_STORE_URL = 'https://apps.apple.com/app/apple-store/id6757132605?pt=128406689&ct=seo_best_physique_tracker_apps&mt=8'

export const metadata = {
  title: 'Best Physique Tracker Apps 2026: Scores, Scans and Plans Compared | Surpass',
  description: 'Physique tracker apps compared: Surpass, HyperBody, GainFrame, Rate My Physique, PhysiqueAI, ZOZOFIT, Hevy and RP Hypertrophy. What each one gives you, where it stops, and how to pick.',
  keywords: ['best physique tracker app', 'physique tracker', 'physique app', 'rate my physique app', 'body progress photo app', 'muscle growth tracker app'],
  alternates: { canonical: 'https://jacked.coach/best-physique-tracker-apps/' },
  openGraph: {
    title: 'Best physique tracker apps in 2026',
    description: 'Scores, scans and plans compared: what each physique app gives you and where it stops.',
    url: 'https://jacked.coach/best-physique-tracker-apps/',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Physique tracker apps compared' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best physique tracker apps in 2026',
    description: 'Scores, scans and plans compared.',
    images: ['/og-image.png'],
  },
}

const benefits = [
  { title: 'A plan, not only a number', copy: 'A score tells you where you are. It does not tell you what to train on Monday. The useful apps turn the change you want into weekly sets.' },
  { title: 'Photos you can compare fairly', copy: 'Same light, distance, pose and time of day. Matched angles taken weeks apart show more than any single estimate.' },
  { title: 'Private, and only against yourself', copy: 'Physique photos are personal. Check where they are stored and whether the app ranks you against other people.' },
]

const steps = [
  { title: 'Same spot, same light', copy: 'Stand in the same place with light in front of you, the phone at chest height and the same distance away every time.' },
  { title: 'Same state', copy: 'Take them in the morning, before food and before training, so a pump or a big meal does not fake a change.' },
  { title: 'Front, side and back, at the end of a block', copy: 'Muscle grows slowly. Check every few weeks when a training block ends, not every day in the gym mirror.' },
]

const comparison = [
  ['Surpass (our app)', 'Pick the muscle you want people to notice, get a training block for it with a weight and rep target on every set, and check it with matched private photos.', 'No body-fat estimate or physique score, by design. Available on iPhone, not Android.'],
  ['HyperBody', 'Upload 5 photos; it maps muscle groups, scores weak points and builds a plan that updates weekly, with a re-scan every 30 days. First scan free.', 'The plan starts from a photo score, and photo scores can shift with light, pump and pose.'],
  ['GainFrame', 'Side-by-side check-ins with body-fat estimates, scores for 12 muscle groups, FFMI trends and “Future You” projections. Connects to Hevy and Apple Health.', 'Built around scores and estimates; your workouts are logged in another app.'],
  ['Rate My Physique', 'An estimated body-fat percentage and physique rating from a photo, plus an AI image of your “future physique”.', 'A rating and a picture, not a training plan.'],
  ['PhysiqueAI', 'Estimates body fat, muscle mass and progress from a photo. $12.99 a month or $59.99 a year.', 'Estimates from a photo, not a training plan.'],
  ['ZOZOFIT', 'A 3D body scan with the iPhone camera: measurements at 16 locations, body-fat estimate and posture points.', 'Measures your body; it does not plan your training.'],
  ['Hevy', 'A free workout log with free progress photos, a social feed and a program generator.', 'Photos sit beside your log; nothing ties them to a muscle you are trying to build.'],
  ['RP Hypertrophy', 'Coach-designed hypertrophy plans; Meso Builder lets you pick muscles to emphasise.', '$299.99 a year, with no free trial.'],
]

const sources = [
  ['https://hyperbody.fit/', 'HyperBody'],
  ['https://apps.apple.com/app/id6759252082', 'GainFrame on the App Store'],
  ['https://apps.apple.com/us/app/rate-my-physique-body-scans/id6739761800', 'Rate My Physique on the App Store'],
  ['https://apps.apple.com/us/app/physiqueai/id6756671414', 'PhysiqueAI on the App Store'],
  ['https://apps.apple.com/us/app/zozofit-3d-body-scanner/id1636398776', 'ZOZOFIT on the App Store'],
  ['https://www.hevyapp.com/features/progress-photos/', 'Hevy progress photos'],
  ['https://rpstrength.com/pages/hypertrophy-app', 'RP Hypertrophy'],
  ['https://developer.apple.com/app-store/review/guidelines/', 'App Review Guidelines 1.4.1'],
  ['https://www.sciencedirect.com/science/article/abs/pii/S2352464225002834', 'Lancet Child & Adolescent Health, February 2026'],
]

const faqs = [
  { question: 'What is a physique tracker app?', answer: 'An app that helps you see how your body is changing, usually with photos, scans or measurements. Some add a score or body-fat estimate; a few also plan the training that is meant to cause the change.' },
  { question: 'Are AI physique scores accurate?', answer: 'Most apps do not publish how their scores were validated, and an estimate from one photo can move with light, pump and pose. Apple’s App Review Guidelines (1.4.1) ask apps that make health measurements to show their accuracy. Treat a score as a rough guide, and trust photos you took the same way over time.' },
  { question: 'Which physique tracker is best for building muscle?', answer: 'One that connects the photo to the training. If you want an app to tell you which muscle to grow and plan the weekly sets for it, pick one with a plan. If you only want measurements, a scanner such as ZOZOFIT does that well.' },
  { question: 'Is rating your physique bad for you?', answer: 'Researchers have raised concerns that constant rating can feed body-image worries, especially in young men. If scores make training feel worse, choose an app that does not give them. Surpass compares you only with your own past check-ins.' },
  { question: 'What does Surpass cost?', answer: 'Logging, history, import and your first Frame Check read are free. Surpass Pro is $12.99 a month or $59.99 a year in the US, with a 7-day free trial on the annual plan.' },
]

export default function BestPhysiqueTrackerAppsPage() {
  return <AcquisitionLanding
    eyebrow="Best physique tracker apps, 2026"
    title="A score is not a plan."
    intro="We compared eight apps people use to track their physique. Scanners and raters tell you where you are. Loggers record the work. Surpass is built to join the two: pick the muscle you want people to notice, train a block for it, and check it with private photos."
    campaignUrl={APP_STORE_URL}
    campaignKey="seo_best_physique_tracker_apps"
    canonicalPath="/best-physique-tracker-apps"
    heroImage="/marketing/priority/surpass-priority-back.webp"
    heroImageAlt="The Wider back card from the Surpass first screen, with the upper back lit"
    heroPresentation="screen"
    benefits={benefits}
    benefitsTitle="What to look for in a physique tracker."
    benefitsIntro="Three questions separate an app that helps you grow from one that only reports."
    steps={steps}
    flowTitle="How to take photos that show real change."
    flowIntro="Whatever app you use, the photo routine decides whether a comparison means anything."
    comparison={comparison}
    comparisonTitle="Eight physique apps, compared."
    comparisonIntro="Surpass is our app, so it is listed first. Every other row describes what that app says it does."
    comparisonLabel="Physique tracker apps comparison"
    comparisonMomentLabel="App"
    comparisonLeftLabel="What it gives you"
    comparisonRightLabel="Where it stops"
    sources={sources}
    sourcesNote="App details and prices were checked on 29 September 2026 and may have changed since."
    faqs={faqs}
    faqTitle="Questions about physique tracker apps."
    related={[
      ['/surpass-vs-hevy', 'Surpass vs Hevy'],
      ['/surpass-vs-fitbod', 'Surpass vs Fitbod'],
      ['/bigger-arms', 'Bigger arms'],
      ['/wider-shoulders', 'Wider shoulders'],
      ['/bigger-chest', 'More chest'],
      ['/wider-back', 'Wider back'],
      ['/whole-frame', 'Better whole frame'],
    ]}
    finalTitle="Not a score. A plan for the muscle you want people to notice."
    finalCopy="Start free on iPhone. Pick your priority on the first screen and keep private photos that prove it."
    dockTitle="Get bigger on purpose."
  />
}
