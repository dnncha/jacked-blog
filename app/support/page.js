import Link from 'next/link'
import LegalPage from '../components/LegalPage'

export const metadata = {
  title: 'Support',
  description: 'Get help with Jacked for iPhone, including workout logging, weekly muscle targets, exercise swaps, imports, privacy, and data export.',
  alternates: {
    canonical: 'https://jacked.coach/support',
  },
  openGraph: {
    title: 'Support | Jacked',
    description: 'Support for Jacked, the iPhone hypertrophy workout logger and training coach.',
    url: 'https://jacked.coach/support',
  },
}

const faqs = [
  {
    question: 'How do I start a workout?',
    answer: 'Open Today and start the planned session, or go to Train to start or resume the current workout. Jacked keeps the live workout focused on set logging, rest timing, exercise swaps, and the next useful set.',
  },
  {
    question: 'How do weekly muscle targets work?',
    answer: 'Jacked counts hard sets for each muscle across the week and shows how many sets remain for your target. The view updates as you log workouts, so volume stays visible across your training split.',
  },
  {
    question: 'How do I swap an exercise I do not have in my gym?',
    answer: 'In a live workout, use the swap control on the exercise card. Jacked shows close alternatives first so you can replace a machine, cable, dumbbell, or barbell variant without rebuilding the whole session.',
  },
  {
    question: 'How does progression work?',
    answer: 'Jacked uses double progression: build reps within the target range, then add load when you reach the top. Your recent load, reps, and next target stay together so the next step is clear.',
  },
  {
    question: 'Can I import from Hevy?',
    answer: 'Yes. Jacked includes a compatible Hevy import path for workouts, routines, exercise notes, and set history so you can keep useful training context.',
  },
  {
    question: 'Where is my data stored?',
    answer: 'Workout data is stored locally on your device. Jacked does not run a user-account server for your workout history. See the privacy policy for the full data handling summary.',
  },
  {
    question: 'Is Jacked free?',
    answer: 'Yes. Jacked is currently free to download and use on iPhone, with no account required.',
  },
  {
    question: 'Can I export my data?',
    answer: 'Yes. Use the export option in Settings to keep a copy of your workout history.',
  },
]

export default function SupportPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <LegalPage
      title="Support"
      intro="Help for Jacked on iPhone: training setup, live workout logging, weekly muscle targets, exercise swaps, imports, privacy, and data export."
      links={false}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="static-note" style={{ marginTop: 0 }}>
        <h2 style={{ marginTop: 0 }}>Contact</h2>
        <p style={{ margin: '0 0 10px' }}>For bugs, feature requests, account questions, or release feedback:</p>
        <a href="mailto:support@jacked.coach">support@jacked.coach</a>
        <p style={{ margin: '16px 0 0', fontSize: '0.95rem' }}>
          Include your iPhone model, iOS version, Jacked version, and the screen where the issue happened when you can.
        </p>
      </section>

      <section>
        <h2>Frequently Asked Questions</h2>
        <div className="static-grid">
          {faqs.map((faq) => (
            <article key={faq.question} className="static-card">
              <h3>{faq.question}</h3>
              <p style={{ margin: 0 }}>{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="static-note">
        <h2 style={{ marginTop: 0 }}>App Store and policy links</h2>
        <p>
          Read Jacked’s <Link href="/accessibility">accessibility information</Link>, <Link href="/privacy">Privacy Policy</Link>, and <Link href="/terms">Terms of Service</Link>, or open the current <a href="https://apps.apple.com/app/apple-store/id6757132605?pt=128406689&ct=jacked_coach&mt=8" target="_blank" rel="noopener noreferrer">App Store listing</a>.
        </p>
      </section>
    </LegalPage>
  )
}
