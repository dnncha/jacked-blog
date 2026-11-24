import LegalPage from '../components/LegalPage'

const description = 'How Surpass handles your data: no account, workouts and photos stay on your iPhone, analytics is off unless you turn it on, and no ads or tracking. Every service that receives data is named.'

export const metadata = {
  title: 'Privacy Policy',
  description,
  alternates: {
    canonical: 'https://jacked.coach/privacy/',
  },
  openGraph: {
    title: 'Privacy Policy | Surpass',
    description,
    url: 'https://jacked.coach/privacy/',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Surpass privacy policy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy | Surpass',
    description: 'Workouts and photos stay on your iPhone. Analytics is off unless you turn it on. No ads or tracking.',
    images: ['/og-image.png'],
  },
}

const recipients = [
  {
    who: 'Apple',
    when: 'Always, for App Store purchases. Apple Health and iCloud Backup only if you use them.',
    what: 'Purchases and subscriptions, the body-weight entries Surpass saves to Apple Health, and your device backup if iCloud Backup is on.',
  },
  {
    who: 'RevenueCat',
    when: 'Whenever the app runs, so it can check whether you have Surpass Pro.',
    what: 'A random RevenueCat user ID, App Store transaction details, app version, device model, iOS version, storefront country, and IP address. No workouts, photos or health data.',
  },
  {
    who: 'Mixpanel (EU data residency)',
    when: 'Only if you turn on "Help improve Surpass" during setup or "Product analytics" in Settings.',
    what: 'Coarse usage events tied to a random install ID. Details below. No workouts, weights, notes, photos or health data.',
  },
  {
    who: 'Our web server (DigitalOcean)',
    when: 'When you visit jacked.coach or open a shared proof or plan link.',
    what: 'A standard access log: IP address, the full address you requested, browser type, and time. Deleted after 30 days.',
  },
]

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="Last updated: November 24, 2026"
      intro="Surpass is an iPhone gym log. You don't need an account, and your training history lives on your phone. This page sets out what the app keeps, what leaves your device, who receives it, and how to remove it."
    >
      <section className="static-note" aria-labelledby="short-version">
        <h2 id="short-version" style={{ marginTop: 0 }}>The short version</h2>
        <ul style={{ marginBottom: 0 }}>
          <li>No account. We never ask for your name, email address or phone number.</li>
          <li>Your workouts, measurements, progress photos and Frame Check results are stored on your iPhone. We run no server that stores them, and the app does not sync them to iCloud.</li>
          <li>App analytics is off unless you turn it on. When it is on, it never includes your workouts, weights, notes, photos or health data.</li>
          <li>Apple Health is optional. Surpass reads and writes body weight only, and that data is never sent to us.</li>
          <li>No ads, no data sales, and no tracking across other companies&apos; apps or websites.</li>
          <li>Settings &gt; Delete all data wipes everything Surpass keeps on your phone.</li>
        </ul>
      </section>

      <h2>Who we are</h2>
      <p>
        Surpass is made and published on the App Store by Donncha O&apos;Toole, an independent developer based in Ireland. Under EU and UK data-protection law, he is the controller of the limited personal data described here. Contact: <a href="mailto:support@jacked.coach">support@jacked.coach</a>.
      </p>

      <h2>What stays on your iPhone</h2>
      <p>Surpass stores the following in the app&apos;s private storage on your device:</p>
      <ul>
        <li><strong>Training</strong>: workouts, exercises, sets, reps, weights, effort (RIR), notes, rest timing, plans, routines, custom exercises and timestamps.</li>
        <li><strong>Your profile and preferences</strong>: experience level, goals, schedule, gym equipment, units and app settings.</li>
        <li><strong>Progress</strong>: personal records, estimated maxes, volume trends, next-set targets and the history behind them.</li>
        <li><strong>Body and recovery entries you add</strong>: body weight, body measurements, protein entries and recovery check-ins.</li>
        <li><strong>Progress photos and Frame Check captures</strong>: photos you take or import in the app. You can lock them behind Face ID. They are saved to Apple Photos only if you turn that on in Settings.</li>
        <li><strong>Target accuracy log</strong>: off by default. If you turn it on, the app keeps a record on your phone of how closely your set targets matched what you lifted.</li>
        <li><strong>Imports</strong>: when you import history from Hevy, Strong, FitNotes or another CSV export, Surpass reads the file you pick and adds it to your log on the phone. The file is not uploaded.</li>
      </ul>
      <p>
        Reminders, rest timers and the workout Live Activity on your Lock Screen are produced on the device. We do not send push notifications.
      </p>

      <h2>Frame Check</h2>
      <p>
        Frame Check uses Apple&apos;s on-device Vision framework to find body position and framing in the photos you take. The analysis runs on your iPhone. Photos, pose points and results are not sent to us or to any other company. If we ever offer optional cloud analysis, we will update this policy before it is available, name the company that processes the photos, say how long they are kept, and ask for your permission in the app first. Cloud analysis is not available in the app today.
      </p>

      <h2>What leaves your iPhone, and who receives it</h2>
      <p>This is the full list. We do not use any other third-party service that receives data from the app.</p>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '0.75rem 0 1.25rem', fontSize: '0.95rem' }}>
          <thead>
            <tr>
              {['Recipient', 'When', 'What it receives'].map((heading) => (
                <th key={heading} scope="col" style={{ textAlign: 'left', padding: '10px 12px', color: '#fffaf0', borderBottom: '1px solid rgba(245,241,232,0.22)' }}>{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recipients.map((row) => (
              <tr key={row.who}>
                <th scope="row" style={{ textAlign: 'left', verticalAlign: 'top', padding: '12px', color: '#fffaf0', borderBottom: '1px solid rgba(245,241,232,0.1)', minWidth: '9rem' }}>{row.who}</th>
                <td style={{ verticalAlign: 'top', padding: '12px', color: '#bcb6a8', lineHeight: 1.6, borderBottom: '1px solid rgba(245,241,232,0.1)' }}>{row.when}</td>
                <td style={{ verticalAlign: 'top', padding: '12px', color: '#bcb6a8', lineHeight: 1.6, borderBottom: '1px solid rgba(245,241,232,0.1)' }}>{row.what}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        RevenueCat, Mixpanel and DigitalOcean act as our processors under data-processing agreements. They may use the data only to provide their service to us.
      </p>

      <h2>App analytics (optional)</h2>
      <p>
        Analytics stays off until you turn on &quot;Help improve Surpass&quot; during setup or &quot;Product analytics&quot; in Settings &gt; Privacy. When it is on, the app sends usage events to Mixpanel&apos;s EU servers with IP collection turned off. Each event has a name, such as onboarding step completed, workout started or finished, or share card opened, plus coarse details: rounded counts (for example, &quot;10 to 20 sets&quot;), which screen or button was used, your weight unit, whether you have Pro, and the app version. Events carry a random install ID made by the app. That ID is not linked to your Apple ID, your device&apos;s advertising identifier, or anything else that names you.
      </p>
      <p>
        Analytics events never include exercise names, actual sets, reps or weights, notes, workout IDs, photos, imported files, health data, location or contact details. They are not used for advertising. Turn analytics off in Settings at any time. Delete all data also turns it off and resets the install ID.
      </p>

      <h2>Apple Health (optional)</h2>
      <p>
        Apple Health connects only when you choose Connect Apple Health in Settings. Surpass uses one type of Health data: <strong>body mass (body weight)</strong>.
      </p>
      <ul>
        <li><strong>Read</strong>: Surpass reads body-weight entries from Apple Health, including ones saved by other apps or smart scales, to show your weight trend and add your weight to progress-photo comparisons.</li>
        <li><strong>Write</strong>: when you log a weigh-in in Surpass, it saves that entry to Apple Health.</li>
        <li><strong>Delete</strong>: Delete all data asks Apple Health to remove the body-weight entries Surpass saved. Entries from other apps are left alone.</li>
      </ul>
      <p>
        Surpass does not read or write sleep, heart-rate, step, energy, body-fat or workout data in Apple Health. Health data stays on your device. It is not sent to us, not included in analytics, not used for advertising or marketing, and not sold or shared. You can change access at any time in the Health app or in iOS Settings &gt; Privacy &amp; Security &gt; Health &gt; Surpass.
      </p>

      <h2>Sharing proof cards and plans</h2>
      <p>
        When you share a proof card or a plan, the shared details (for example, a headline, the lifts and numbers on the card, or the exercises in the plan) are encoded into the link itself. Nothing is uploaded when you create the link. Anyone you send it to can read what it contains. When someone opens a link on jacked.coach, the full link reaches our web server and is kept in its access log for up to 30 days. Share only what you are happy for the recipients to see.
      </p>

      <h2>Subscriptions</h2>
      <p>
        Surpass is free to download. Surpass Pro is an optional subscription that Apple sells and bills through the App Store. We never see your payment card or Apple ID. We use RevenueCat to confirm which purchases are active, so Pro unlocks on your devices and Restore Purchases works. Manage or cancel in your Apple ID subscription settings. If you start a free trial, the app can schedule a reminder on your device before the trial ends.
      </p>

      <h2>No ads and no tracking</h2>
      <p>
        Surpass shows no ads and contains no advertising SDKs. It does not use your device&apos;s advertising identifier, does not sell or rent personal data, and does not track you across other companies&apos; apps or websites.
      </p>

      <h2>The jacked.coach website</h2>
      <ul>
        <li><strong>Server logs</strong>: our web server, hosted by DigitalOcean, logs each request (IP address, address requested, browser type, time) for security and troubleshooting. Logs are deleted after 30 days.</li>
        <li><strong>Analytics</strong>: the site sends a small set of events to Mixpanel&apos;s EU servers, such as page views, App Store button clicks, which calculator you used and coarse settings like units or goal, and rounded page-speed measurements. Mixpanel IP collection is off, the site sets no cookies, and the full page address and referrer are not sent. The numbers you type into a calculator are not sent.</li>
        <li><strong>Browser storage</strong>: the site keeps a random session ID in your browser&apos;s session storage, which is cleared when you close the tab. It also keeps a &quot;seen before&quot; flag and any campaign tag you arrived with (such as utm_source) in local storage. That lets us tell which campaigns bring visitors. You can clear both in your browser settings, and the site works the same without them.</li>
        <li><strong>Email</strong>: if you email us, we use your message and address only to reply and keep the conversation for as long as it is needed.</li>
      </ul>

      <h2>Why we process data (legal bases)</h2>
      <ul>
        <li><strong>Consent</strong>: app analytics and Apple Health. You can withdraw consent at any time in Settings or the Health app.</li>
        <li><strong>Contract</strong>: checking and restoring your Surpass Pro subscription through RevenueCat.</li>
        <li><strong>Legitimate interests</strong>: website server logs (security and keeping the site running), aggregate website analytics (understanding which pages help people), and replying to your emails.</li>
      </ul>

      <h2>How long data is kept</h2>
      <ul>
        <li>Data on your iPhone stays until you delete it, use Delete all data, or remove the app.</li>
        <li>Web server logs are kept for up to 30 days.</li>
        <li>Analytics events are kept in Mixpanel while we use them to improve Surpass. They are not linked to you, so we cannot pick out a single person&apos;s events.</li>
        <li>RevenueCat keeps subscription records for as long as we need them to provide Pro and to meet tax and accounting rules.</li>
      </ul>

      <h2>International transfers</h2>
      <p>
        Mixpanel stores our analytics in the EU. RevenueCat and DigitalOcean are US companies, so some data may be processed in the United States. Those transfers rely on the EU-U.S. Data Privacy Framework where the provider is certified, or on the European Commission&apos;s Standard Contractual Clauses.
      </p>

      <h2>Your control and your rights</h2>
      <ul>
        <li><strong>See it</strong>: everything Surpass stores about your training is visible in the app.</li>
        <li><strong>Export it</strong>: Settings &gt; Export data saves your history as JSON or CSV, with or without photos.</li>
        <li><strong>Delete it</strong>: Settings &gt; Delete all data permanently erases your workouts, plans, measurements, photos, recovery data and settings. It also turns analytics off, resets the install ID, cancels pending reminders, and asks Apple Health to remove the weigh-ins Surpass saved. Photos you saved to Apple Photos stay there. Removing the app also removes its data, apart from any copy in your own iCloud or computer backups.</li>
        <li><strong>Stop sharing</strong>: turn off Product analytics in Settings and disconnect Apple Health in the Health app at any time.</li>
      </ul>
      <p>
        If you are in the EU, UK or another region with similar laws, you have the right to access, correct, delete, restrict or object to processing of your personal data, the right to data portability, and the right to withdraw consent. Most of these you can exercise directly in the app because the data is on your phone. For anything else, email <a href="mailto:support@jacked.coach">support@jacked.coach</a> and we will reply within one month. You can also complain to the Irish Data Protection Commission (dataprotection.ie) or your local data-protection authority.
      </p>

      <h2>Security</h2>
      <p>
        Your data is protected by iOS app sandboxing and, when your iPhone is locked with a passcode, by iOS data protection encryption. You can add a Face ID lock to progress photos. Traffic to RevenueCat, Mixpanel and jacked.coach uses HTTPS.
      </p>

      <h2>Children</h2>
      <p>Surpass is not directed at children under 13, and we do not knowingly collect personal data from children.</p>

      <h2>Changes to this policy</h2>
      <p>
        If this policy changes, we will update this page and the date at the top. If a change affects what leaves your device, for example a new service or a new kind of data, we will tell you in the app before it takes effect and ask for permission where it is required.
      </p>

      <h2>Contact</h2>
      <p>
        Privacy questions and requests: <a href="mailto:support@jacked.coach">support@jacked.coach</a>.
      </p>
    </LegalPage>
  )
}
