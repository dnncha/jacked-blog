import Link from 'next/link'
import LegalPage from '../components/LegalPage'

export const metadata = {
  title: 'Accessibility',
  description: 'Accessibility information for Jacked on iPhone and iPad, including verified Dark Interface support and the current evaluation status of other features.',
  alternates: {
    canonical: 'https://jacked.coach/accessibility',
  },
  openGraph: {
    title: 'Accessibility | Jacked',
    description: 'Verified accessibility support and current evaluation status for Jacked on iPhone and iPad.',
    url: 'https://jacked.coach/accessibility',
  },
}

const evaluatedFeatures = [
  'VoiceOver',
  'Voice Control',
  'Larger Text',
  'Differentiate Without Color Alone',
  'Sufficient Contrast',
  'Reduced Motion',
]

export default function AccessibilityPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Jacked accessibility',
    description: 'Accessibility information for the Jacked workout tracker on iPhone and iPad.',
    url: 'https://jacked.coach/accessibility',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Jacked',
      url: 'https://jacked.coach',
    },
  }

  return (
    <LegalPage
      title="Accessibility"
      updated="Last reviewed: July 20, 2026"
      intro="This page describes the accessibility support Jacked has verified for its common workout-planning, logging, progress, settings, and first-launch tasks."
      links={false}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="static-note" style={{ marginTop: 0 }}>
        <h2 style={{ marginTop: 0 }}>Verified support</h2>
        <h3>Dark Interface</h3>
        <p>
          Jacked uses a dark interface throughout its common in-app tasks on iPhone and iPad. App Store Connect lists Dark Interface as supported for both device families.
        </p>
      </section>

      <section>
        <h2>Features still being evaluated</h2>
        <p>
          Jacked does not currently declare support for the following App Store accessibility features. Do not rely on them for every common task until the corresponding App Store label is published.
        </p>
        <ul>
          {evaluatedFeatures.map((feature) => <li key={feature}>{feature}</li>)}
        </ul>
        <p>
          Captions and Audio Descriptions are not declared because Jacked’s common training tasks do not depend on video or audio programming.
        </p>
      </section>

      <section>
        <h2>Apple system surfaces</h2>
        <p>
          Some actions open Apple-provided interfaces, including the share sheet, document picker, App Store review page, and permission prompts. Those surfaces follow the accessibility behavior of iOS or iPadOS rather than Jacked’s own interface.
        </p>
      </section>

      <section className="static-note">
        <h2 style={{ marginTop: 0 }}>Report an accessibility problem</h2>
        <p>
          Email <a href="mailto:support@jacked.coach">support@jacked.coach</a> with the task you were trying to complete, your device model, iOS or iPadOS version, Jacked version, and the accessibility setting or assistive technology in use.
        </p>
        <p style={{ marginBottom: 0 }}>
          You can also visit <Link href="/support">Jacked Support</Link> or view the current <a href="https://apps.apple.com/app/apple-store/id6757132605?pt=128406689&ct=accessibility_page&mt=8" target="_blank" rel="noopener noreferrer">App Store listing</a>.
        </p>
      </section>
    </LegalPage>
  )
}
