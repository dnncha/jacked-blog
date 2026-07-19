import Link from 'next/link'
import { notFound } from 'next/navigation'
import ToolCalculator from '../ToolCalculator'
import ToolStyles from '../ToolStyles'
import { appStoreUrl, toolMap, tools } from '../toolData.mjs'
import { toolQualityNotes } from '../toolSeo.mjs'
import { toolSocialImageUrl } from '../toolSocial.mjs'

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const tool = toolMap[slug]
  if (!tool) return {}

  return {
    title: tool.title,
    description: tool.metaDescription,
    alternates: {
      canonical: `https://jacked.coach/tools/${tool.slug}`,
    },
    openGraph: {
      title: tool.title,
      description: tool.metaDescription,
      url: `https://jacked.coach/tools/${tool.slug}`,
      images: [
        {
          url: toolSocialImageUrl(tool.slug),
          width: 1200,
          height: 630,
          alt: `${tool.name} | Jacked`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: tool.title,
      description: tool.metaDescription,
      images: [toolSocialImageUrl(tool.slug)],
    },
  }
}

export default async function ToolPage({ params }) {
  const { slug } = await params
  const tool = toolMap[slug]
  if (!tool) notFound()

  const related = tool.related.map((relatedSlug) => toolMap[relatedSlug]).filter(Boolean)
  const qualityNotes = toolQualityNotes(tool)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: tool.title,
        description: tool.metaDescription,
        url: `https://jacked.coach/tools/${tool.slug}`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jacked.coach/' },
            { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://jacked.coach/tools' },
            { '@type': 'ListItem', position: 3, name: tool.name, item: `https://jacked.coach/tools/${tool.slug}` },
          ],
        },
      },
      {
        '@type': 'WebApplication',
        name: tool.name,
        description: tool.metaDescription,
        applicationCategory: 'HealthApplication',
        operatingSystem: 'Web',
        url: `https://jacked.coach/tools/${tool.slug}`,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
    ],
  }

  return (
    <div className="tools-page">
      <ToolStyles />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="tools-wrap tools-hero">
        <div>
          <h1>{tool.h1}</h1>
          <p><strong>{tool.promise}</strong> {tool.intro}</p>
        </div>
        <div className="tools-signal">
          Log the set in Jacked and the next target stays with the workout.
        </div>
      </section>

      <section className="tools-wrap">
        <ToolCalculator tool={tool} />
      </section>

      <section className="tools-wrap tool-section">
        <div className="copy-blocks">
          <div className="copy-list">
            <article>
              <h2>How to read the result</h2>
              <p>{tool.promise} The notes below show the assumptions behind that recommendation.</p>
            </article>

            {tool.sections.map(([title, copy]) => (
              <article key={title}>
                <h2>{title}</h2>
                <p>{copy}</p>
              </article>
            ))}
          </div>

          <aside>
            <h2>Examples</h2>
            <ul>
              {tool.examples.map((example) => <li key={example}>{example}</li>)}
            </ul>

            <h2 style={{ marginTop: '28px' }}>Related tools</h2>
            <div className="related-tools">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/tools/${item.slug}`}
                  data-related-tool={item.slug}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="tools-wrap tool-section">
        <div className="copy-blocks">
          <div>
            <h2>Short answers</h2>
            {tool.faqs.map(([question, answer]) => (
              <article key={question} style={{ marginBottom: '18px' }}>
                <h3>{question}</h3>
                <p>{answer}</p>
              </article>
            ))}
          </div>
          <div className="tools-signal">
            Jacked turns your training history into next-set targets, RIR tracking, rest timing, smart warm-ups, PRs, and progress feedback.
          </div>
        </div>
      </section>

      <section className="tools-wrap tool-section">
        <div className="copy-blocks">
          <div>
            <h2>Method, assumptions, and privacy</h2>
            <article style={{ marginBottom: '18px' }}>
              <h3>Method</h3>
              <p>{qualityNotes.method}</p>
            </article>
            <article style={{ marginBottom: '18px' }}>
              <h3>Assumptions</h3>
              <p>{qualityNotes.assumptions}</p>
            </article>
            <article>
              <h3>Privacy</h3>
              <p>{qualityNotes.privacy}</p>
            </article>
          </div>
          <div className="tools-signal">
            Check the method before you trust the number. Bad inputs still produce tidy-looking outputs.
          </div>
        </div>
      </section>

      <section className="tool-cta-band">
        <div className="tools-wrap">
          <h2>This is one set.</h2>
          <p>
            Jacked does it for your whole workout: next-set targets, RIR, rest timing, warm-ups, PRs, and progress feedback.
          </p>
          <a className="tool-primary" href={appStoreUrl(tool.campaign, 'final_cta')} target="_blank" rel="noopener noreferrer" data-global-cta={`tools_${tool.slug}`}>
            Download Jacked for iPhone
          </a>
        </div>
      </section>
    </div>
  )
}
