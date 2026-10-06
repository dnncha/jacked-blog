import Link from 'next/link'
import LibraryStyles from '../library/LibraryStyles'
import { SITE, programs } from '../library/libraryData.mjs'

const title = 'Free Workout Programs: PPL, Upper/Lower, Full Body & More'
const description = 'Free gym workout programs with every set, rep range, RIR target, and rest time listed. Push/pull/legs, upper/lower, full body, Arnold split, bro split, and a 12-week physique plan.'

export const metadata = {
  title,
  description,
  alternates: { canonical: `${SITE}/programs/` },
  openGraph: { title, description, url: `${SITE}/programs/` },
}

const DIFFICULTY = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' }
const ORDER = { beginner: 0, intermediate: 1, advanced: 2 }

export default function ProgramsIndex() {
  const sorted = [...programs].sort((a, b) => ORDER[a.difficulty] - ORDER[b.difficulty] || a.daysPerWeek - b.daysPerWeek)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    url: `${SITE}/programs/`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: sorted.map((program, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE}/programs/${program.slug}/`,
        name: program.h1,
      })),
    },
  }

  return (
    <div className="lib-page">
      <LibraryStyles />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="lib-wrap lib-hero">
        <div>
          <p className="lib-eyebrow">Free programs</p>
          <h1>Pick a plan. Then beat it every week.</h1>
          <p>
            Complete gym programs with every exercise, set, rep range, effort target, and rest time written out. Read them here, or open
            one in Surpass on your iPhone and start logging today.
          </p>
        </div>
        <div className="lib-cta">
          <strong>Not sure which to pick?</strong>
          <p>Training 3 days a week: Full Body. 4 days: Upper/Lower. 5–6 days: PPL or a hybrid.</p>
        </div>
      </section>

      <section className="lib-wrap lib-section">
        <div className="lib-table-wrap">
          <table className="lib-table">
            <thead>
              <tr><th>Program</th><th>Days</th><th>Level</th><th>Frequency</th><th>Session</th></tr>
            </thead>
            <tbody>
              {sorted.map((program) => (
                <tr key={program.slug}>
                  <td><Link href={`/programs/${program.slug}`}>{program.h1}</Link></td>
                  <td>{program.daysPerWeek}</td>
                  <td>{DIFFICULTY[program.difficulty]}</td>
                  <td>{program.frequency}</td>
                  <td>~{program.minutes} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="lib-wrap lib-section">
        <div className="lib-grid">
          {sorted.map((program) => (
            <Link key={program.slug} className="lib-link-card" href={`/programs/${program.slug}`}>
              <strong>{program.h1}</strong>
              <span>{program.intro}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="lib-wrap lib-section">
        <h2>Need exercise help?</h2>
        <p>Every exercise in these programs links to a guide with setup, cues, common mistakes, and alternatives.</p>
        <Link className="lib-button lib-button-secondary" href="/exercises">Open the exercise library</Link>
      </section>
    </div>
  )
}
