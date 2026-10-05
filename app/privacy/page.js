import LegalPage from '../components/LegalPage'

export const metadata = {
  title: 'Privacy Policy',
  description: 'How Surpass, the no-account iPhone strength-training app, handles your data: workouts stay on your device, analytics is opt-in, and no ads or tracking.',
  alternates: {
    canonical: 'https://jacked.coach/privacy/',
  },
  openGraph: {
    title: 'Privacy Policy | Surpass',
    description: 'How Surpass, the no-account iPhone strength-training app, handles your data: workouts stay on your device, analytics is opt-in, and no ads or tracking.',
    url: 'https://jacked.coach/privacy/',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Surpass privacy policy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy | Surpass',
    description: 'Workouts stay on your device. Analytics is opt-in. No ads or tracking.',
    images: ['/og-image.png'],
  },
}

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="Last updated: October 5, 2026"
      intro="Surpass is an iPhone strength-training app that helps you log workouts and progress. You can use it without creating an account. This policy explains what the app stores, how app data is handled, and how to contact us."
    >
      <h2>Who we are</h2>
      <p>
        Surpass is published on the App Store by Donncha O&apos;Toole, an independent developer based in Ireland. Questions about this policy can be sent to <a href="mailto:support@jacked.coach">support@jacked.coach</a>.
      </p>

      <h2>Data the app stores</h2>
      <p>Surpass stores training data locally on your device, including:</p>
      <ul>
        <li><strong>Workout data</strong>: exercises, sets, reps, weight, RIR, notes, rest timing, and timestamps.</li>
        <li><strong>Training preferences</strong>: your plan, experience level, preferred units, equipment choices, and training schedule.</li>
        <li><strong>Progress data</strong>: personal records, volume trends, measurements, and progression history.</li>
        <li><strong>Check-in photos</strong>: photos you choose to take in the app. They are stored on your device only, are not uploaded, and are not scored or compared with anyone else.</li>
      </ul>

      <h2>No account required</h2>
      <p>Surpass does not ask you to create an account or give us your name, email address, or phone number to use the app.</p>

      <h2>Data storage</h2>
      <p>
        Workout history, preferences, progress data and check-in photos are stored on your device. Surpass does not operate servers that store that personal workout data. If an Apple system feature such as iCloud or HealthKit is enabled, that data is handled through your Apple account and Apple settings.
      </p>

      <h2>Importing workouts</h2>
      <p>
        If you import workout history exported from another app (for example a CSV file), the file you choose is read by Surpass to add that history to your on-device log.
      </p>

      <h2>App analytics</h2>
      <p>
        Analytics is off unless you choose &quot;Share usage&quot; during setup or turn it on in Settings. If you do, Surpass sends limited product-usage events to Mixpanel. These events use a random app-scoped installation identifier and aggregate milestones such as app launches, onboarding steps, workout starts and completions, receipt views, and share actions. They do not include exercise names, sets, weights, notes, workout IDs, photos, files, health data, location, or contact details. Mixpanel processes them on our behalf, and they are not used for advertising or cross-app tracking. You can turn Analytics off in Settings at any time.
      </p>

      <h2>HealthKit</h2>
      <p>
        Surpass may request access to Apple HealthKit to read or write workout-related data. HealthKit access requires your explicit permission and can be changed in iOS Settings. HealthKit data is not used for advertising and is not sold.
      </p>

      <h2>Payments</h2>
      <p>
        Surpass is free to download. Optional Surpass Pro subscriptions are purchased and processed by Apple through the App Store. Surpass does not receive your payment card details. You can manage or cancel a subscription in your Apple ID subscription settings.
      </p>

      <h2>Tracking and advertising</h2>
      <p>Surpass does not show ads, does not sell personal data, and does not track you across other companies&apos; apps or websites.</p>

      <h2>Website analytics</h2>
      <p>
        The Surpass website uses limited, EU-hosted product analytics to understand aggregate page performance, campaign handoffs, and navigation. Automatic pageview tracking and click capture are disabled; analytics cookies, persistent browser identity, client-IP enrichment, and raw current-page or referrer URLs are disabled. The site uses a random session-only identifier and sanitized campaign markers, and does not require an account. The app support and policy pages remain usable without creating one.
      </p>

      <h2>Your control</h2>
      <ul>
        <li><strong>Access</strong>: your workout data is visible inside the app.</li>
        <li><strong>Export</strong>: use the export option in the app to keep a copy of your workout history.</li>
        <li><strong>Delete</strong>: removing the app removes local app data from the device, subject to your Apple backup and sync settings.</li>
        <li><strong>Analytics</strong>: turn usage sharing off in Settings at any time.</li>
      </ul>
      <p>
        If you are in the EU or UK you have rights under data-protection law, including access, correction and deletion. Because workout data stays on your device, you can exercise most of these rights directly in the app. For anything else, email <a href="mailto:support@jacked.coach">support@jacked.coach</a>.
      </p>

      <h2>Children</h2>
      <p>Surpass is not directed at children under 13 and we do not knowingly collect personal data from children.</p>

      <h2>Changes to this policy</h2>
      <p>If this policy changes, we will update this page and the date at the top.</p>

      <h2>Contact</h2>
      <p>
        Questions about privacy can be sent to <a href="mailto:support@jacked.coach">support@jacked.coach</a>.
      </p>
    </LegalPage>
  )
}
