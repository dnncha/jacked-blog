# Acquisition landing-page system

Surpass acquisition pages should solve one concrete search problem, show how the answer was obtained, and offer one attributable next step into the shipping iPhone app.

## Page contract

Each retained page must document:

- one primary query or intent cluster;
- the immediate answer or tool interaction above the fold;
- a unique method, example, import explanation, or product workflow;
- one primary next action;
- the exact App Store campaign token and CTA placement;
- the product version or capability source for every product claim;
- privacy and limitation notes;
- owner, test date, and rollback path.

The page must remain useful when a visitor does not install the app. A CTA is a next step, not a substitute for the answer.

## Priority journeys

| Journey | Search entry | Immediate value | Product bridge | Primary CTA |
| --- | --- | --- | --- | --- |
| Hevy migration | `/hevy-alternative` | Explain compatible export and local inspection | Show the supported import boundary and first useful workout context | `seo_hevy_alternative` |
| Strong migration | `/strong-alternative` | Explain the supported Strong export path | Show what history is retained and what is not | `seo_strong_alternative` |
| FitNotes migration | `/fitnotes-alternative` | Explain the workout CSV boundary | Show how compatible history informs the next target | `seo_fitnotes_alternative` |
| Import history guide | `/import-workout-history` | Compare the supported Hevy, Strong, and FitNotes file boundaries | Give switchers one reviewable path into Surpass without account access | `seo_import_workout_history` |
| Next set | `/tools/next-set-calculator` | Calculate add-reps, add-load, repeat, or back-off guidance | Show how Surpass keeps that decision with the active workout | `next_set_calculator` |
| Weekly volume | `/tools/weekly-volume-checker` | Explain the weekly set total and its assumptions | Show sets completed and remaining in the app | `weekly_volume_checker` |
| Progressive overload | `/progressive-overload` | Explain the decision system with a worked example | Show the same decision inside the workout flow | `seo_progressive_overload` |
| Hevy comparison | `/surpass-vs-hevy` | Honest, dated side-by-side with prices and sources | Priority, block and proof loop; Hevy CSV import | `seo_surpass_vs_hevy` |
| Fitbod comparison | `/surpass-vs-fitbod` | Honest, dated side-by-side with prices and sources | You pick the muscle instead of the algorithm | `seo_surpass_vs_fitbod` |
| Physique app roundup | `/best-physique-tracker-apps` | Eight apps: what each gives and where it stops; photo routine | Not a score, a plan plus private proof | `seo_best_physique_tracker_apps` |
| Muscle priority | `/bigger-arms`, `/wider-shoulders`, `/bigger-chest`, `/wider-back`, `/whole-frame` | Which muscles, weekly sets, exercises and photo angles | The eyebrow repeats the app's first-screen choice so ad, page and app match | `seo_priority_*` |

These are a starting set for measurement, not a claim that each page should remain indexable. Search Console, link data, technical indexability, and product evidence must decide the final set.

## Experiment rules

Run one sequential change at a time while traffic is low. Predeclare the hypothesis, primary metric, exposure window, stopping rule, and rollback. Do not call a winner from a tiny or incomplete sample.

## Muscle-priority pages

Each muscle page is data in `app/components/PriorityLanding.js`. Its eyebrow is the exact onboarding label from `OnboardingView.buildPriorityTitle` in the iOS app (Bigger arms, Wider shoulders, More chest, Wider back, Better whole frame), and its hero is that choice's card image. If the app renames a choice, rename it here in the same change. `app/comparisonLanding.test.mjs` pins the labels.

Competitor facts on comparison pages carry a checked-on date and source links. Re-check them before reusing a page in paid traffic.
