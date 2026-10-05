import LegalPage from '../components/LegalPage'

const faqs = [
  {
    question: 'How do I start a workout?',
    answer: 'Open Today and start the planned session, or go to Train to start or resume the current workout. The live workout stays focused on set logging, rest timing, exercise swaps, and the next set.',
  },
  {
    question: 'How do next-set targets work?',
    answer: 'Each set shows what you lifted last time with a target for today right beside it. When you finish a workout, Surpass sets your targets for next time from what you just lifted, so the next step is clear before you start.',
  },
  {
    question: 'How are personal records detected?',
    answer: 'Surpass compares each set against your all-time best for that exercise and shows a PR alert the moment you beat it. Your workout summary leads with any PRs you hit.',
  },
  {
    question: 'Can I import my workouts from Hevy, Strong or FitNotes?',
    answer: 'Yes. Export your workout history as a CSV file from the other app, then import that file into Surpass to keep your previous sets and personal bests.',
  },
  {
    question: 'How do I swap an exercise I do not have in my gym?',
    answer: 'In a live workout, use the swap control on the exercise card to replace a machine, cable, dumbbell, or barbell variant without rebuilding the whole session.',
  },
  {
    question: 'Do I need an account?',
    answer: 'No. Surpass works without an account. Your workout data is stored on your iPhone.',
  },
  {
    question: 'Where is my data stored?',
    answer: 'Workout data is stored locally on your device. Surpass does not run a user-account server for your workout history. See the privacy policy for the full data-handling summary.',
  },
  {
    question: 'Is Surpass free?',
    answer: 'Surpass is free to download and use for logging workouts, with no account required. Surpass Pro is an optional subscription purchased through the App Store; current prices are shown in the app before you subscribe.',
  },
  {
    question: 'How do I cancel or manage Surpass Pro?',
    answer: 'Subscriptions are managed by Apple. On your iPhone open Settings, tap your name, then Subscriptions, and choose Surpass. You can cancel there at any time; access continues until the end of the current billing period.',
  },
  {
    question: 'I changed phones. How do I get Pro back?',
    answer: 'Sign in with the same Apple ID and use Restore Purchases in Surpass. If it still does not unlock, email support with your iOS version and the date you subscribed.',
  },
  {
    question: 'Can I export my data?',
    answer: 'Yes. Use the export option in Settings to keep a copy of your workout history.',
  },
  {
    question: 'How do I delete my data?',
    answer: 'Your workout data lives on your device, so deleting Surpass removes it from that iPhone, subject to your Apple backup and sync settings. Export first if you want to keep a copy.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
}

export const metadata = {
  title: 'Support',
  description: 'Get help with Surpass for iPhone: next-set targets, PRs, importing from Hevy, Strong or FitNotes, subscriptions, privacy and data export.',
  alternates: {
    canonical: 'https://jacked.coach/support/',
  },
  openGraph: {
    title: 'Support | Surpass',
    description: 'Get help with Surpass for iPhone: next-set targets, PRs, importing from Hevy, Strong or FitNotes, subscriptions, privacy and data export.',
    url: 'https://jacked.coach/support/',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Surpass support' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Support | Surpass',
    description: 'Help with next-set targets, imports, subscriptions, and data export.',
    images: ['/og-image.png'],
  },
}

export default function SupportPage() {
  return (
    <LegalPage
      title="Support"
      intro="Help for Surpass on iPhone: logging workouts, next-set targets, personal records, importing from other apps, subscriptions, privacy, and data export."
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <section className="static-note" aria-labelledby="contact">
        <h2 id="contact" style={{ marginTop: 0 }}>Contact</h2>
        <p>For bugs, feature requests, subscription questions, or feedback, email:</p>
        <p><a href="mailto:support@jacked.coach">support@jacked.coach</a></p>
        <p>Please include your iPhone model, iOS version, Surpass version, and the screen where the issue happened.</p>
      </section>
      <section aria-labelledby="faq">
        <h2 id="faq">Frequently asked questions</h2>
        <div className="static-grid">
          {faqs.map((faq) => (
            <article className="static-card" key={faq.question}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="static-note">
        <h2 style={{ marginTop: 0 }}>App Store and policy links</h2>
        <p style={{ marginBottom: 0 }}>
          Read the <a href="/privacy/">Privacy Policy</a>, <a href="/terms/">Terms of Service</a> and <a href="/accessibility">accessibility information</a>, or open <a href="https://apps.apple.com/app/apple-store/id6757132605?pt=128406689&ct=support_page&mt=8" rel="noopener noreferrer">Surpass on the App Store</a>.
        </p>
      </section>
    </LegalPage>
  )
}
