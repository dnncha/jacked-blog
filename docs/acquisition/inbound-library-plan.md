# Inbound library plan

Date: 2026-10-06

## Thesis

People searching for gym help mostly want three things: how to do an exercise,
what program to run, and what number to lift. Surpass already has the data for
all three in the app (exercise catalog, ProgramHub templates, progression
engine). Publishing that data as genuinely useful pages beats more general
science blog posts, which compete with Examine, Stronger by Science, and PubMed
summaries that we cannot out-rank.

Every page ends at the same place: the lifter wants to log it. Program pages
go further than a download link. **Add to Surpass** opens a `jacked://plan`
link, and the app copies the whole program into an editable plan.

## Shipped in this branch

| Surface | Pages | Search intent |
| --- | ---: | --- |
| `/exercises/[slug]` | 112 | "how to do X", "X muscles worked", "X alternatives", "X form mistakes" |
| `/muscles/[slug]` | 13 | "best chest exercises", "rear delt exercises" |
| `/programs/[slug]` | 7 | "push pull legs workout plan", "upper lower split", "3 day full body workout" |
| `/exercises`, `/programs` | 2 | hubs and internal linking |

- Exercise guides are in `data/library/guides/*.json` (setup, cues, mistakes,
  progression, FAQ). Muscles, equipment, rep range, and RIR come from the app
  catalog, `data/library/exercise-catalog.json`, which is copied from
  `Jacked/Config/ExerciseLibrary.json`.
- Programs are in `data/library/programs-source.json`, extracted from
  `ProgramTemplate.swift`. The site maps 14 app IDs that are not in the
  catalog to catalog equivalents, so every link imports. The app has the same
  bug; fix it there too.
- `app/library/library.test.mjs` decodes every plan link with the `/plan`
  validator, checks that program IDs are in the catalog, and checks the
  numbers quoted in the program copy.

## Next, in priority order

1. **Measure.** Connect Search Console (see `docs/search-console-setup.md`),
   submit the sitemap, and request indexing for `/programs/` and `/exercises/`.
   Add `program_open` to the web analytics funnel (the links carry
   `data-program-open`), and compare plan-import events in the app
   (`plan_share` source) to App Store clicks.
2. **Strength standards per lift × bodyweight × sex**, e.g.
   `/standards/bench-press/80kg-male`. This intent has very high volume.
   Only build it from a defensible source: published standards with a cited
   method, or aggregated, opt-in Surpass data once there is enough of it.
   Never invent percentiles.
3. **More programs**, written as catalog-only templates: 5/3/1-style
   hypertrophy, PHUL, GZCLP-style beginner LP, home dumbbell-only, 2-day
   minimal, glute-focused lower body. Each one is a new page and a new
   import path.
4. **Exercise images or short loops.** These are the biggest quality gap
   against MuscleWiki and Hevy's library. Start with the 20 most-searched
   exercises.
5. **Exercise-to-exercise comparison pages** generated from catalog pairs
   that share a primary muscle and movement pattern, e.g. "hack squat vs leg
   press". Write them by hand, and only for pairs people actually search
   (check Search Console queries first).
6. **Distribution, not just SEO.** Post program pages where they answer real
   questions (r/Fitness weekly threads, r/naturalbodybuilding, r/workout).
   Share the plan link, not the App Store link. Offer creators a share link
   for their own program built in Surpass.
7. **Prune the blog.** 249 posts with thin or unreferenced content dilute the
   site. Use the existing `reports/seo/content-consolidation-plan.md`: merge,
   redirect, or noindex posts with no impressions after the library has been
   indexed for 8–12 weeks.

## Guardrails

- No invented statistics, citations, or user counts on library pages.
- Program pages must stay importable: `npm test` fails if an ID leaves the
  catalog.
- Re-copy `exercise-catalog.json` from the app whenever the app catalog
  changes, then re-run the tests.
