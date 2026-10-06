import Link from 'next/link'
import { notFound } from 'next/navigation'
import LibraryStyles from '../../library/LibraryStyles'
import {
  SITE,
  alternativesFor,
  equipmentLabel,
  exerciseBySlug,
  exercises,
  formatRir,
  libraryAppStoreUrl,
  muscleGroups,
  musclePageBySlug,
  muscleName,
  patternLabel,
  programsUsingExercise,
} from '../../library/libraryData.mjs'
import { tools } from '../../tools/toolData.mjs'

// Exercise ids that already have lift-specific calculators under /tools.
const TOOL_SEEDS = {
  barbell_bench_press: 'bench-press',
  barbell_squat: 'squat',
  deadlift: 'deadlift',
  overhead_press: 'overhead-press',
  leg_press: 'leg-press',
  incline_dumbbell_press: 'incline-dumbbell-press',
  lat_pulldown: 'lat-pulldown',
  barbell_row: 'barbell-row',
  romanian_deadlift: 'romanian-deadlift',
  lateral_raise: 'lateral-raise',
}

const GENERAL_TOOLS = ['one-rep-max-calculator', 'next-set-calculator', 'plate-calculator']

export function generateStaticParams() {
  return exercises.map((exercise) => ({ slug: exercise.slug }))
}

function pageTitle(exercise) {
  return `${exercise.name}: How to Do It, Muscles Worked & Alternatives`
}

function pageDescription(exercise) {
  const primary = exercise.primary.map(muscleName).join(' and ').toLowerCase()
  return `How to do the ${exercise.name.toLowerCase()} with good form: setup, cues, common mistakes, the muscles it works (${primary}), sets and reps, and the best alternatives.`
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const exercise = exerciseBySlug[slug]
  if (!exercise) return {}
  const url = `${SITE}/exercises/${exercise.slug}/`
  return {
    title: pageTitle(exercise),
    description: pageDescription(exercise),
    alternates: { canonical: url },
    robots: exercise.guide ? undefined : { index: false, follow: true },
    openGraph: { title: pageTitle(exercise), description: pageDescription(exercise), url, type: 'article' },
  }
}

function muscleLink(key) {
  const group = muscleGroups[key]
  if (group && musclePageBySlug[group.slug]) {
    return <Link key={key} href={`/muscles/${group.slug}`}>{group.name}</Link>
  }
  return <span key={key}>{muscleName(key)}</span>
}

export default async function ExercisePage({ params }) {
  const { slug } = await params
  const exercise = exerciseBySlug[slug]
  if (!exercise) notFound()

  const guide = exercise.guide
  const alternatives = alternativesFor(exercise)
  const usedIn = programsUsingExercise(exercise.id)
  const seed = TOOL_SEEDS[exercise.id]
  const liftTools = seed ? tools.filter((tool) => tool.slug.startsWith(`${seed}-`)) : []
  const generalTools = GENERAL_TOOLS.map((toolSlug) => tools.find((tool) => tool.slug === toolSlug)).filter(Boolean)
  const relatedTools = [...liftTools, ...generalTools].slice(0, 5)
  const primaryHub = muscleGroups[exercise.primary[0]]
  const url = `${SITE}/exercises/${exercise.slug}/`
  const campaign = `exercise_${exercise.id}`.slice(0, 60)
  const incrementText = !exercise.increment
    ? 'Add reps, then difficulty'
    : exercise.incrementType === 'machineSteps'
      ? `${exercise.increment} kg / one stack step`
      : `${exercise.increment} kg jumps`

  const graph = [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: 'Exercises', item: `${SITE}/exercises/` },
        { '@type': 'ListItem', position: 3, name: exercise.name, item: url },
      ],
    },
  ]
  if (guide) {
    graph.push({
      '@type': 'HowTo',
      name: `How to do the ${exercise.name.toLowerCase()}`,
      description: guide.summary,
      tool: exercise.equipment.map((item) => ({ '@type': 'HowToTool', name: equipmentLabel(item) })),
      step: [...guide.setup, ...guide.execution].map((text, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        text,
      })),
    })
    graph.push({
      '@type': 'FAQPage',
      mainEntity: guide.faq.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    })
  }

  return (
    <div className="lib-page">
      <LibraryStyles />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }) }} />

      <nav className="lib-wrap lib-crumbs" aria-label="Breadcrumb">
        <Link href="/exercises">Exercises</Link>
        {primaryHub && musclePageBySlug[primaryHub.slug] && (
          <>
            <span aria-hidden="true">/</span>
            <Link href={`/muscles/${primaryHub.slug}`}>{primaryHub.name}</Link>
          </>
        )}
      </nav>

      <section className="lib-wrap lib-hero">
        <div>
          <p className="lib-eyebrow">{patternLabel(exercise.pattern)} · {exercise.equipment.map(equipmentLabel).join(', ')}</p>
          <h1>{exercise.name}</h1>
          <p>{guide ? guide.summary : exercise.instructions}</p>
        </div>
        <dl className="lib-facts">
          <div><dt>Primary</dt><dd>{exercise.primary.map(muscleName).join(', ')}</dd></div>
          {exercise.secondary.length > 0 && <div><dt>Secondary</dt><dd>{exercise.secondary.map(muscleName).join(', ')}</dd></div>}
          <div><dt>Starting rep range</dt><dd>{exercise.repMin}–{exercise.repMax} reps</dd></div>
          <div><dt>Target effort</dt><dd>{formatRir(exercise.rir)} reps in reserve</dd></div>
          <div><dt>Progression</dt><dd>{incrementText}</dd></div>
        </dl>
      </section>

      {guide && (
        <section className="lib-wrap lib-section">
          <h2>Muscles worked</h2>
          <ul className="lib-chips" style={{ marginBottom: 14 }}>
            {[...exercise.primary, ...exercise.secondary].map((key) => <li key={key}>{muscleLink(key)}</li>)}
          </ul>
          <p>{guide.musclesNote}</p>
        </section>
      )}

      {guide && (
        <section className="lib-wrap lib-section">
          <div className="lib-two">
            <div>
              <h2>How to set up</h2>
              <ol className="lib-steps">
                {guide.setup.map((step) => <li key={step}>{step}</li>)}
              </ol>
            </div>
            <div>
              <h2>How to do each rep</h2>
              <ol className="lib-steps">
                {guide.execution.map((step) => <li key={step}>{step}</li>)}
              </ol>
            </div>
          </div>
        </section>
      )}

      {guide && (
        <section className="lib-wrap lib-section">
          <h2>Common {exercise.name.toLowerCase()} mistakes</h2>
          <div className="lib-mistakes">
            {guide.mistakes.map((item) => (
              <article className="lib-card" key={item.mistake}>
                <h3>{item.mistake}</h3>
                <p>{item.fix}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="lib-wrap lib-section">
        <div className="lib-two">
          <div>
            <h2>Sets, reps, and progression</h2>
            <p>
              Surpass starts the {exercise.name.toLowerCase()} at {exercise.repMin}–{exercise.repMax} reps with about {formatRir(exercise.rir)} reps in reserve.
              {exercise.isCompound ? ' As a compound lift it usually belongs early in the session, when you are fresh.' : ' As an isolation exercise it fits well after your main compound lifts.'}
            </p>
            {guide && <p>{guide.progression}</p>}
          </div>
          <div className="lib-cta">
            <strong>Know what to lift next time</strong>
            <p>Surpass shows what you lifted last time beside a target for this set, and adjusts it from your reps and RIR. Free on iPhone, no account needed.</p>
            <div className="lib-actions">
              <a
                className="lib-button lib-button-primary"
                href={libraryAppStoreUrl(campaign)}
                target="_blank"
                rel="noopener noreferrer"
                data-global-cta={`exercise_${exercise.id}`}
                data-app-store-placement="exercise_progression"
              >
                Track it free in Surpass
              </a>
            </div>
          </div>
        </div>
      </section>

      {alternatives.length > 0 && (
        <section className="lib-wrap lib-section">
          <h2>{exercise.name} alternatives</h2>
          <p>These train the same main muscles. Swap when the equipment is busy, something hurts, or progress has stalled for several weeks.</p>
          <div className="lib-grid">
            {alternatives.map((item) => (
              <Link key={item.id} className="lib-link-card" href={`/exercises/${item.slug}`}>
                <strong>{item.name}</strong>
                <span>{item.primary.map(muscleName).join(', ')} · {item.equipment.map(equipmentLabel).join(', ')}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {(usedIn.length > 0 || relatedTools.length > 0) && (
        <section className="lib-wrap lib-section">
          <div className="lib-two">
            {usedIn.length > 0 && (
              <div>
                <h2>Programs that use it</h2>
                <div className="lib-grid">
                  {usedIn.map((program) => (
                    <Link key={program.slug} className="lib-link-card" href={`/programs/${program.slug}`}>
                      <strong>{program.h1}</strong>
                      <span>{program.daysPerWeek} days a week · {program.difficulty}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {relatedTools.length > 0 && (
              <div>
                <h2>Calculators</h2>
                <div className="lib-grid">
                  {relatedTools.map((tool) => (
                    <Link key={tool.slug} className="lib-link-card" href={`/tools/${tool.slug}`}>
                      <strong>{tool.name}</strong>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {guide && (
        <section className="lib-wrap lib-section lib-faq">
          <h2>Questions</h2>
          {guide.faq.map((item) => (
            <article key={item.q}>
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </article>
          ))}
        </section>
      )}
    </div>
  )
}
