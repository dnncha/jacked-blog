import LegalPage from '../components/LegalPage'

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Jacked, the iPhone hypertrophy workout logger and training coach.',
  alternates: {
    canonical: 'https://jacked.coach/privacy',
  },
}

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="Last updated: May 21, 2026"
      intro='Jacked is a strength training app designed to help you track workouts and progress. This policy explains what the iPhone app stores, how app data is handled, and how to contact support.'
    >
      <h2>Data the app stores</h2>
      <p>Jacked stores training data locally on your device, including:</p>
      <ul>
        <li><strong>Workout data</strong>: exercises, sets, reps, weight, RIR, notes, rest timing, and timestamps.</li>
        <li><strong>Training preferences</strong>: your plan, experience level, preferred units, equipment choices, and training schedule.</li>
        <li><strong>Progress data</strong>: personal records, volume trends, measurements, and progression history.</li>
        <li><strong>Progress photos</strong>: photos you choose to capture for visual progress tracking.</li>
      </ul>

      <h2>Data storage</h2>
      <p>
        Workout history, preferences, and progress evidence are stored on your device. If an Apple system feature such as iCloud or HealthKit is enabled, that data is handled through your Apple account and Apple settings.
      </p>

      <h2>HealthKit</h2>
      <p>
        Jacked may request access to Apple HealthKit to read or write workout-related data. HealthKit access requires your explicit permission and can be changed in iOS Settings.
      </p>

      <h2>Payments</h2>
      <p>
        If Jacked offers paid features, payment processing is handled by Apple. Jacked does not receive your full payment card details.
      </p>

      <h2>Website analytics</h2>
      <p>
        Jacked.coach may use privacy-conscious product analytics to understand aggregate page performance and navigation. The app support and policy pages should still be usable without creating an account.
      </p>

      <h2>Your control</h2>
      <ul>
        <li><strong>Access</strong>: your workout data is visible inside the app.</li>
        <li><strong>Delete</strong>: removing the app removes local app data from the device, subject to Apple backup and sync settings.</li>
        <li><strong>Export</strong>: use the export option in the app to keep a copy of workout history.</li>
      </ul>

      <h2>Contact</h2>
      <p>
        Questions about privacy can be sent to <a href="mailto:support@jacked.coach">support@jacked.coach</a>.
      </p>
    </LegalPage>
  )
}
