import Link from 'next/link'
import { notFound } from 'next/navigation'
import LibraryStyles from '../../library/LibraryStyles'
import CopyPlanLink from '../CopyPlanLink'
import {
  SITE,
  formatRest,
  formatRir,
  libraryAppStoreUrl,
  programBySlug,
  programs,
  weeklySetsByMuscle,
} from '../../library/libraryData.mjs'

export function generateStaticParams() {
  return programs.map((program) => ({ slug: program.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const program = programBySlug[slug]
  if (!program) return {}
  const url = `${SITE}/programs/${program.slug}/`
  return {
    title: program.title,
    description: program.metaDescription,
    alternates: { canonical: url },
    openGraph: { title: program.title, description: program.metaDescription, url, type: 'article' },
  }
}

const DIFFICULTY = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' }

function AddToSurpass({ program, placement }) {
  return (
    <div className="lib-actions">
      <a
        className="lib-button lib-button-primary"
        href={program.appLink}
        data-program-open={program.id}
        data-app-store-placement={`program_open_${placement}`}
      >
        Add to Surpass
      </a>
      <a
        className="lib-button lib-button-secondary"
        href={libraryAppStoreUrl(`program_${program.id}`)}
        target="_blank"
        rel="noopener noreferrer"
        data-global-cta={`program_${program.id}_${placement}`}
        data-app-store-placement={`program_${placement}`}
      >
        Get Surpass free
      </a>
    </div>
  )
}

export default async function ProgramPage({ params }) {
  const { slug } = await params
  const program = programBySlug[slug]
  if (!program) notFound()

  const url = `${SITE}/programs/${program.slug}/`
  const volume = weeklySetsByMuscle(program)
  const others = programs.filter((other) => other.slug !== program.slug)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Programs', item: `${SITE}/programs/` },
          { '@type': 'ListItem', position: 3, name: program.h1, item: url },
        ],
      },
      {
        '@type': 'ExercisePlan',
        name: program.h1,
        description: program.metaDescription,
        url,
        exerciseType: 'Strength training',
        activityFrequency: `${program.daysPerWeek} days per week`,
        ...(program.weeks ? { activityDuration: `P${program.weeks}W` } : {}),
      },
      {
        '@type': 'FAQPage',
        mainEntity: program.faqs.map(([question, answer]) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      },
    ],
  }

  return (
    <div className="lib-page">
      <LibraryStyles />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="lib-wrap lib-crumbs" aria-label="Breadcrumb">
        <Link href="/programs">Programs</Link>
      </nav>

      <section className="lib-wrap lib-hero">
        <div>
          <p className="lib-eyebrow">Free program · {DIFFICULTY[program.difficulty]}</p>
          <h1>{program.h1}</h1>
          <p>{program.intro}</p>
        </div>
        <dl className="lib-facts">
          <div><dt>Days per week</dt><dd>{program.daysPerWeek}</dd></div>
          <div><dt>Frequency</dt><dd>{program.frequency}</dd></div>
          <div><dt>Session length</dt><dd>~{program.minutes} min</dd></div>
          <div><dt>Weekly working sets</dt><dd>{program.totalSets}</dd></div>
          {program.weeks && <div><dt>Length</dt><dd>{program.weeks} weeks</dd></div>}
          <div><dt>Level</dt><dd>{DIFFICULTY[program.difficulty]}</dd></div>
        </dl>
      </section>

      <section className="lib-wrap" style={{ paddingBottom: 30 }}>
        <div className="lib-cta">
          <strong>Run this program in Surpass</strong>
          <p>
            On your iPhone with Surpass installed, tap <em>Add to Surpass</em> to copy every day, exercise, rep range, RIR target, and rest time
            into an editable plan. Each set then shows what you lifted last time and a target to beat.
          </p>
          <AddToSurpass program={program} placement="top" />
        </div>
      </section>

      <section className="lib-wrap lib-section">
        <h2>The workouts</h2>
        <p className="lib-small">RIR means reps in reserve: how many more clean reps you could have done. Start each lift at the bottom of its rep range.</p>
        {program.days.map((day, index) => (
          <article className="lib-day" key={`${day.name}-${index}`}>
            <div className="lib-day-head">
              <h3>Day {index + 1}: {day.name}</h3>
              <span>{day.focus}</span>
            </div>
            <div className="lib-table-wrap">
              <table className="lib-table">
                <thead>
                  <tr><th>Exercise</th><th>Sets</th><th>Reps</th><th>RIR</th><th>Rest</th></tr>
                </thead>
                <tbody>
                  {day.exercises.map((item, itemIndex) => (
                    <tr key={`${item.exerciseId}-${itemIndex}`}>
                      <td>
                        {item.exercise ? <Link href={`/exercises/${item.exercise.slug}`}>{item.label}</Link> : item.label}
                        {item.notes && <span className="lib-note">{item.notes}</span>}
                      </td>
                      <td>{item.sets}</td>
                      <td>{item.repMin}–{item.repMax}</td>
                      <td>{formatRir(item.rir)}</td>
                      <td>{formatRest(item.rest)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        ))}
      </section>

      <section className="lib-wrap lib-section">
        <div className="lib-two">
          <div>
            <h2>Who it is for</h2>
            <ul className="lib-steps">
              {program.whoFor.map((line) => <li key={line}>{line}</li>)}
            </ul>
            <h2 style={{ marginTop: 28 }}>Weekly schedule</h2>
            <p>{program.schedule}</p>
            <h2 style={{ marginTop: 28 }}>How to progress</h2>
            <p>{program.progression}</p>
          </div>
          <div>
            <h2>Direct sets per muscle each week</h2>
            <div className="lib-bars">
              {volume.map((row) => (
                <div className="lib-bar" key={row.muscle}>
                  <span>{row.name}</span>
                  <div className="lib-bar-track"><div className="lib-bar-fill" style={{ width: `${(row.sets / volume[0].sets) * 100}%` }} /></div>
                  <span>{row.sets}</span>
                </div>
              ))}
            </div>
            <p className="lib-small" style={{ marginTop: 12 }}>Counts sets where the muscle is a primary mover. Compound lifts also train secondary muscles.</p>
          </div>
        </div>
      </section>

      <section className="lib-wrap lib-section lib-faq">
        <h2>Questions</h2>
        {program.faqs.map(([question, answer]) => (
          <article key={question}>
            <h3>{question}</h3>
            <p>{answer}</p>
          </article>
        ))}
      </section>

      <section className="lib-wrap lib-section">
        <div className="lib-cta">
          <h2>Share it with a training partner</h2>
          <p>The link opens this exact plan. Anyone with Surpass can copy it into their own plan, and anyone without it can still read it.</p>
          <div className="lib-actions">
            <CopyPlanLink url={program.shareLink} programId={program.id} />
            <a className="lib-button lib-button-primary" href={program.appLink} data-program-open={program.id} data-app-store-placement="program_open_bottom">Add to Surpass</a>
          </div>
        </div>
      </section>

      <section className="lib-wrap lib-section">
        <h2>Other free programs</h2>
        <div className="lib-grid">
          {others.map((other) => (
            <Link key={other.slug} className="lib-link-card" href={`/programs/${other.slug}`}>
              <strong>{other.h1}</strong>
              <span>{other.daysPerWeek} days a week · {DIFFICULTY[other.difficulty]}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
