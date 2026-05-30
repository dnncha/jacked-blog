import LegalPage from '../components/LegalPage'

export const metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Jacked, the iPhone hypertrophy workout logger and training coach.',
  alternates: {
    canonical: 'https://jacked.coach/terms',
  },
}

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="Last updated: May 21, 2026"
      intro="By downloading, installing, or using Jacked, you agree to these terms. If you do not agree, do not use the app."
    >
      <h2>Description of service</h2>
      <p>
        Jacked is a strength and hypertrophy training app that helps you plan workouts, log sets, track progression, review progress, and manage training volume.
      </p>

      <h2>Use of the app</h2>
      <p>
        You agree to use Jacked for personal fitness tracking and training support. You must be at least 13 years old to use the app.
      </p>

      <h2>Health disclaimer</h2>
      <p>
        Jacked is a fitness tracking tool, not a medical device. Training suggestions are algorithmically generated from logged data and should not be treated as medical advice.
      </p>
      <ul>
        <li>Consult a qualified healthcare professional before starting a new exercise program.</li>
        <li>Stop exercising if you experience pain, dizziness, or unusual discomfort.</li>
        <li>You are responsible for your training decisions, exercise technique, and loading choices.</li>
      </ul>

      <h2>Your data</h2>
      <p>
        You own your workout data. See the Privacy Policy for details on local storage, HealthKit, exports, and data handling.
      </p>

      <h2>In-app purchases</h2>
      <p>
        Jacked may offer optional paid features through Apple's In-App Purchase system. Purchases and subscriptions are processed by Apple and subject to Apple's terms.
      </p>

      <h2>Intellectual property</h2>
      <p>
        The app, site, design, code, algorithms, and written content are protected by copyright and other intellectual property laws. You may not copy, modify, distribute, or reverse engineer any part of the app except where permitted by law.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, Jacked and its developers are not liable for indirect, incidental, special, consequential, or punitive damages arising from use of the app.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of Ireland. Any disputes arising from these terms shall be resolved in the courts of Ireland.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms can be sent to <a href="mailto:support@jacked.coach">support@jacked.coach</a>.
      </p>
    </LegalPage>
  )
}
