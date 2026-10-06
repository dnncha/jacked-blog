import Link from 'next/link'
import LibraryStyles from '../library/LibraryStyles'
import { SITE, equipmentLabel, exercises, musclePages, muscleName, programs } from '../library/libraryData.mjs'

const title = 'Exercise Library: How to Do 110+ Gym Exercises'
const description = 'Free gym exercise library with form cues, common mistakes, muscles worked, rep ranges, and alternatives for over 110 barbell, dumbbell, cable, and machine exercises.'

export const metadata = {
  title,
  description,
  alternates: { canonical: `${SITE}/exercises/` },
  openGraph: { title, description, url: `${SITE}/exercises/` },
}

const hubKeys = new Set(musclePages.map((page) => page.key))
// Muscles with too few exercises for their own hub page still need a route in.
const unlisted = exercises.filter((exercise) => !hubKeys.has(exercise.primary[0]))

export default function ExercisesIndex() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    url: `${SITE}/exercises/`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: exercises.length,
      itemListElement: exercises.map((exercise, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE}/exercises/${exercise.slug}/`,
        name: exercise.name,
      })),
    },
  }

  return (
    <div className="lib-page">
      <LibraryStyles />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="lib-wrap lib-hero">
        <div>
          <p className="lib-eyebrow">Exercise library</p>
          <h1>Every exercise, explained.</h1>
          <p>
            How to set up and perform {exercises.length} gym exercises, the muscles they work, the mistakes that cost progress,
            and what to swap in when the machine is taken. Every exercise here is also in the Surpass exercise list.
          </p>
        </div>
        <div className="lib-cta">
          <strong>Looking for a full plan?</strong>
          <p>{programs.length} free programs with sets, reps, and rest for every day.</p>
          <div className="lib-actions">
            <Link className="lib-button lib-button-secondary" href="/programs">Browse programs</Link>
          </div>
        </div>
      </section>

      <section className="lib-wrap lib-section">
        <h2>Browse by muscle</h2>
        <ul className="lib-chips">
          {musclePages.map((page) => (
            <li key={page.slug}><Link href={`/muscles/${page.slug}`}>{page.name} ({page.primary.length})</Link></li>
          ))}
        </ul>
      </section>

      {musclePages.map((page) => (
        <section className="lib-wrap lib-section" key={page.slug} id={page.slug}>
          <h2><Link href={`/muscles/${page.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>{page.name}</Link></h2>
          <div className="lib-grid">
            {page.primary.filter((exercise) => exercise.primary[0] === page.key).map((exercise) => (
              <Link key={exercise.id} className="lib-link-card" href={`/exercises/${exercise.slug}`}>
                <strong>{exercise.name}</strong>
                <span>
                  {exercise.equipment.map(equipmentLabel).join(', ')}
                  {exercise.secondary.length > 0 && ` · also ${exercise.secondary.map(muscleName).join(', ').toLowerCase()}`}
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {unlisted.length > 0 && (
        <section className="lib-wrap lib-section" id="other">
          <h2>Other</h2>
          <div className="lib-grid">
            {unlisted.map((exercise) => (
              <Link key={exercise.id} className="lib-link-card" href={`/exercises/${exercise.slug}`}>
                <strong>{exercise.name}</strong>
                <span>{exercise.primary.map(muscleName).join(', ')} · {exercise.equipment.map(equipmentLabel).join(', ')}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
