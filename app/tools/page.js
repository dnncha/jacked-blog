import Link from 'next/link'
import ToolStyles from './ToolStyles'
import { appStoreUrl, exerciseSpecificTools, plannedTools, toolGroups, toolMap, tools } from './toolData.mjs'

export const metadata = {
  title: 'Free Strength and Hypertrophy Training Tools',
  description: 'Free lifting calculators for strength levels, next-set targets, RIR, 1RM, plates, warm-ups, weekly volume, deloads, and workout splits.',
  alternates: {
    canonical: 'https://jacked.coach/tools',
  },
  openGraph: {
    title: 'Free Strength and Hypertrophy Training Tools',
    description: 'Compare strength levels, calculate your next set, estimate 1RM, plan warm-ups, load plates, and run the session inside Jacked.',
    url: 'https://jacked.coach/tools',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Jacked free strength and hypertrophy tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Strength and Hypertrophy Training Tools',
    description: 'Compare strength levels, calculate your next set, estimate 1RM, plan warm-ups, load plates, and run the session inside Jacked.',
    images: ['/og-image.png'],
  },
}

export default function ToolsHub() {
  const hubTools = tools.filter((tool) => !tool.exerciseSpecific)
  const exerciseClusters = [
    {
      title: 'Exercise-specific next set calculators',
      items: exerciseSpecificTools.filter((tool) => tool.type === 'next-set'),
    },
    {
      title: 'Exercise-specific warm-up and 1RM calculators',
      items: exerciseSpecificTools.filter((tool) => tool.type === 'warmup' || tool.type === 'one-rm'),
    },
    {
      title: 'Exercise-specific strength level calculators',
      items: exerciseSpecificTools.filter((tool) => tool.type === 'strength-level'),
    },
    {
      title: 'Exercise alternative pages',
      items: exerciseSpecificTools.filter((tool) => tool.type === 'swaps'),
    },
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Free Strength and Hypertrophy Training Tools',
        description: metadata.description,
        url: 'https://jacked.coach/tools',
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jacked.coach/' },
            { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://jacked.coach/tools' },
          ],
        },
      },
      {
        '@type': 'ItemList',
        name: 'Jacked training tools',
        itemListElement: tools.map((tool, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: tool.name,
          url: `https://jacked.coach/tools/${tool.slug}`,
        })),
      },
    ],
  }

  return (
    <div className="tools-page">
      <ToolStyles />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="tools-wrap tools-hero">
        <div>
          <h1>Free Strength and Hypertrophy Tools</h1>
          <p>
            Free lifting tools for serious training. Compare strength levels, calculate your next set, estimate 1RM, plan warm-ups, check plates, and make better workout decisions. Then run the whole session inside Jacked for iPhone.
          </p>
        </div>
        <div className="tools-signal">
          Quick inputs, visible assumptions, and a result you can use before the next set.
        </div>
      </section>

      <section className="tools-wrap tool-section">
        <h2>Start with the live workout tools</h2>
        <div className="tools-grid">
          {hubTools.map((tool) => (
            <Link
              key={tool.slug}
              className="tool-link-card"
              href={`/tools/${tool.slug}`}
              data-related-tool={tool.slug}
            >
              <div>
                <strong>{tool.name}</strong>
                <p>{tool.promise}</p>
              </div>
              <span>Use tool</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="tools-wrap tool-section">
        <h2>Exercise-specific tools</h2>
        <p style={{ color: '#a9a294', lineHeight: 1.7, maxWidth: '760px', marginTop: 0 }}>
          Pages for the lifts people actually search: bench, squat, deadlift, overhead press, leg press, pulldowns, and more.
        </p>
        {exerciseClusters.map((cluster) => (
          <div key={cluster.title} style={{ marginTop: '24px' }}>
            <h3 style={{ color: '#f7f2e8', margin: '0 0 12px', fontSize: '1rem', fontWeight: 720 }}>{cluster.title}</h3>
            <div className="related-tools">
              {cluster.items.map((tool) => (
                <Link key={tool.slug} href={`/tools/${tool.slug}`} data-related-tool={tool.slug}>{tool.name}</Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="tools-wrap tool-section">
        {toolGroups.map((group) => (
          <div key={group.title} style={{ marginBottom: '28px' }}>
            <h2>{group.title}</h2>
            <div className="related-tools">
              {group.items.map((slug) => (
                <Link key={slug} href={`/tools/${slug}`}>{toolMap[slug].name}</Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      {plannedTools.length > 0 && (
        <section className="tools-wrap tool-section">
          <h2>Next tools in the acquisition engine</h2>
          <div className="tools-grid">
            {plannedTools.map(([slug, name, promise]) => (
              <article key={slug} className="tool-link-card" style={{ opacity: 0.78 }}>
                <div>
                  <strong>{name}</strong>
                  <p>{promise}</p>
                </div>
                <span>Queued after the first five</span>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="tool-cta-band">
        <div className="tools-wrap">
          <h2>Want this inside the workout?</h2>
          <p>
            Jacked turns these tools into a live training runtime: next-set targets, RIR tracking, rest timing, PRs, warm-ups, and adaptive explanations. Open the app. Know your next set. Log the work.
          </p>
          <a className="tool-primary" href={appStoreUrl('tools_hub', 'final_cta')} target="_blank" rel="noopener noreferrer">
            Download Jacked for iPhone
          </a>
        </div>
      </section>
    </div>
  )
}
