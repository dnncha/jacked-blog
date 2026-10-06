import Link from 'next/link'
import { notFound } from 'next/navigation'
import LibraryStyles from '../../library/LibraryStyles'
import {
  SITE,
  equipmentLabel,
  formatRir,
  libraryAppStoreUrl,
  musclePageBySlug,
  musclePages,
  muscleName,
  programs,
  weeklySetsByMuscle,
} from '../../library/libraryData.mjs'

export function generateStaticParams() {
  return musclePages.map((page) => ({ slug: page.slug }))
}

function titleFor(page) {
  return `${page.primary.length} Best ${page.name} Exercises (With Form Tips)`
}

function descriptionFor(page) {
  const names = page.primary.slice(0, 3).map((exercise) => exercise.name.toLowerCase()).join(', ')
  return `The best ${page.plural} for size and strength, including ${names}. How to do each one, rep ranges, and how many weekly sets to aim for.`
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const page = musclePageBySlug[slug]
  if (!page) return {}
  const url = `${SITE}/muscles/${page.slug}/`
  return {
    title: titleFor(page),
    description: descriptionFor(page),
    alternates: { canonical: url },
    openGraph: { title: titleFor(page), description: descriptionFor(page), url },
  }
}

// Compounds first: they let you load the muscle heaviest, then isolations.
function ordered(list) {
  return [...list].sort((a, b) => Number(b.isCompound) - Number(a.isCompound) || a.name.localeCompare(b.name))
}

export default async function MusclePage({ params }) {
  const { slug } = await params
  const page = musclePageBySlug[slug]
  if (!page) notFound()

  const url = `${SITE}/muscles/${page.slug}/`
  const primary = ordered(page.primary)
  const programVolume = programs
    .map((program) => ({ program, sets: weeklySetsByMuscle(program).find((row) => row.muscle === page.key)?.sets || 0 }))
    .filter((row) => row.sets > 0)
    .sort((a, b) => b.sets - a.sets)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Exercises', item: `${SITE}/exercises/` },
          { '@type': 'ListItem', position: 3, name: `${page.name} exercises`, item: url },
        ],
      },
      {
        '@type': 'ItemList',
        name: titleFor(page),
        itemListElement: primary.map((exercise, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `${SITE}/exercises/${exercise.slug}/`,
          name: exercise.name,
        })),
      },
    ],
  }

  return (
    <div className="lib-page">
      <LibraryStyles />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="lib-wrap lib-crumbs" aria-label="Breadcrumb">
        <Link href="/exercises">Exercises</Link>
      </nav>

      <section className="lib-wrap lib-hero">
        <div>
          <p className="lib-eyebrow">{page.name}</p>
          <h1>Best {page.plural}</h1>
          <p>
            {primary.length} exercises that train the {page.name.toLowerCase()} directly, compound lifts first. Pick one or two that
            suit your gym and train them hard and consistently. Steady progress on a few lifts beats rotating through all of them.
          </p>
        </div>
        <div className="lib-cta">
          <strong>Program it, then beat it</strong>
          <p>Surpass gives every set a target based on last time, so you know when to add weight.</p>
          <div className="lib-actions">
            <a
              className="lib-button lib-button-primary"
              href={libraryAppStoreUrl(`muscle_${page.key}`)}
              target="_blank"
              rel="noopener noreferrer"
              data-global-cta={`muscle_${page.key}`}
              data-app-store-placement="muscle_hero"
            >
              Start free on iPhone
            </a>
          </div>
        </div>
      </section>

      <section className="lib-wrap lib-section">
        {primary.map((exercise, index) => (
          <article key={exercise.id} className="lib-day">
            <div className="lib-day-head">
              <h3><Link href={`/exercises/${exercise.slug}`} style={{ color: 'inherit' }}>{index + 1}. {exercise.name}</Link></h3>
              <span>{exercise.equipment.map(equipmentLabel).join(', ')} · {exercise.repMin}–{exercise.repMax} reps @ {formatRir(exercise.rir)} RIR</span>
            </div>
            <p>{exercise.guide?.summary || exercise.instructions}</p>
          </article>
        ))}
      </section>

      {page.secondary.length > 0 && (
        <section className="lib-wrap lib-section">
          <h2>Also trains the {page.name.toLowerCase()}</h2>
          <p>These exercises work the {page.name.toLowerCase()} as a secondary muscle, which counts toward your weekly work but not as much as a direct set.</p>
          <div className="lib-grid">
            {page.secondary.map((exercise) => (
              <Link key={exercise.id} className="lib-link-card" href={`/exercises/${exercise.slug}`}>
                <strong>{exercise.name}</strong>
                <span>Mainly {exercise.primary.map(muscleName).join(', ').toLowerCase()}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {programVolume.length > 0 && (
        <section className="lib-wrap lib-section">
          <h2>How much {page.name.toLowerCase()} work do the programs include?</h2>
          <p>Direct weekly sets for the {page.name.toLowerCase()} in each free program. Secondary work is not counted.</p>
          <div className="lib-bars">
            {programVolume.map(({ program, sets }) => (
              <div className="lib-bar" key={program.slug}>
                <Link href={`/programs/${program.slug}`} style={{ color: '#d9d2c4' }}>{program.h1.replace(/ \(.*\)$/, '')}</Link>
                <div className="lib-bar-track"><div className="lib-bar-fill" style={{ width: `${Math.min(100, (sets / programVolume[0].sets) * 100)}%` }} /></div>
                <span>{sets}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="lib-wrap lib-section">
        <h2>Other muscle groups</h2>
        <ul className="lib-chips">
          {musclePages.filter((other) => other.slug !== page.slug).map((other) => (
            <li key={other.slug}><Link href={`/muscles/${other.slug}`}>{other.name}</Link></li>
          ))}
        </ul>
      </section>
    </div>
  )
}
