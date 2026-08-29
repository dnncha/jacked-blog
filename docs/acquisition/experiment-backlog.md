# Surpass acquisition experiment backlog

This backlog is ready for execution when the required read-only event exports
are available. It distinguishes an experiment design from a demonstrated
result; no item is a winner until event availability, denominators, exposure,
and guardrails are visible.

## SEO-007 — Alpha Progression comparison landing

Status: implemented in source; baseline and public propagation required.

Question: does a balanced, comparison-intent page create qualified discovery
for lifters evaluating Alpha Progression without relying on competitor
misrepresentation or unsupported product claims?

- Route: `/alpha-progression-alternative`, with a self-canonical URL,
  page-level WebPage/FAQ/Breadcrumb schema, and the existing product-screen
  acquisition template.
- Promise: explain the actual workflow difference—focused priority blocks,
  visible next decisions, and local-first control—while naming where Alpha
  Progression may be the better fit, including its exercise-video catalogue.
- Campaign: `seo_alpha_progression_alternative`; add the route to the shared
  campaign map and retain the existing CTA, consent, and ephemeral-session
  measurement boundaries.
- Primary diagnostic: Search Console impressions, clicks, CTR, and average
  position for the route; qualified `web_cta_viewed` to
  `app_store_outbound_clicked` sessions once source exports are available.
- Guardrails: no stale-brand copy, no unsupported superiority claim, no
  automatic-program promise, no broken internal links, valid self-canonical
  200 response, and no regression in web error or field-vital diagnostics.
- Decision rule: do not call the page a growth win from source construction,
  local tests, crawl delivery, or competitor search presence alone. Keep or
  revise it only after a defined search window and qualified handoff baseline.

## Release guard: representative acquisition conversion paths

The public conversion check covers the homepage and the six highest-intent
acquisition routes (`/workout-tracker`, `/gym-workout-planner`,
`/progressive-overload`, `/hypertrophy-app`, `/hevy-alternative`, and
`/import-workout-history`). Each route must expose its hero, final, and sticky
mobile App Store handoffs; preserve the bounded experiment, presentation, copy,
campaign, pre-hydration visibility, and high-contrast markers. This is a
delivery and measurement guard, not evidence of traffic or conversion lift.

The check was extended on 2026-08-15 because a homepage-only pass could leave
the SEO acquisition surfaces unverified. The live readback passed all six
representative routes. At 2026-08-15T20:59Z, the unified growth gate reports
the release layer as passing; measurement remains blocked by missing
Search Console rows and owner-authorized web, App Store Connect, and app
analytics exports.

## 2026-08-15 provider readback and measurement boundary

- App Store Connect readback at `2026-08-15T20:43:08Z` reports Surpass
  `4.0.3` as `READY_FOR_SALE` / `READY_FOR_DISTRIBUTION` with
  `AFTER_APPROVAL` release type.
- The public App Store check at `2026-08-15T20:43:14Z` and the unified gate at
  `2026-08-15T20:59Z` both pass for the Surpass listing: version `4.0.3`,
  current release note, no stale Jacked text, no repeated subtitle opening,
  and no retired onboarding promise.
- The EU Mixpanel project was resolved as `3995480` in workspace `4491282`.
  Schema discovery found the native activation events and web handoff events;
  the existing dashboard `11433074` is now named `Surpass Growth & Activation`
  and includes native activation/product-loop funnels, web CTA exposures,
  App Store handoffs, and onboarding-to-workout return measurement.
- No conversion or retention ratio is claimed from this readback. The
  OAuth-backed export attempt requires a Mixpanel API secret, and the query
  endpoint was rate-limited. The local acquisition report therefore remains
  blocked rather than treating unavailable data as zero.

Unless an item explicitly names a different denominator, every qualified
store-intent KPI below counts only sessions whose identity appears in both
`web_cta_viewed` and `app_store_outbound_clicked`. An outbound session without
a matching CTA-view event remains a measurement diagnostic, not a qualified
success.

## EXP-001 — Homepage hero CTA promise

Status: implemented locally; baseline required before public exposure or winner decision.

Hypothesis: an outcome-led hero CTA will produce more qualified App Store
intent than a generic download instruction because the visitor can see the
immediate product payoff before leaving the site.

- Control: `Start free on iPhone`, campaign `surpass_coach_home_hero_control`.
- Treatment: `See your next set on iPhone`, campaign `surpass_coach_home_hero_outcome_v1`.
- Surface: `/`, homepage hero only; keep header, download, and final CTA unchanged.
- Primary KPI: unique CTA-viewed sessions that also emit
  `app_store_outbound_clicked`, divided by unique sessions with
  `web_cta_viewed`, filtered to `source_page=/` and
  `cta_placement=homepage_hero`, reported separately by campaign/variant.
- Secondary diagnostics: CTA-view rate per `web_session_started`, `web_vital_measured`
  p75 by viewport class, and `web_error_visible` rate.
- Assignment: the client assigns a stable 50/50 `control` or `outcome_v1`
  variant in first-party local storage under the bounded key
  `surpass:experiment:homepage-hero-cta:v1`; if storage is unavailable, it keeps
  one in-memory assignment for the page lifetime. No account, email, device
  fingerprint, or workout data is collected.
- Exposure: the CTA is marked not-ready until assignment completes, so the
  analytics observer does not count the server-rendered control as a treatment
  exposure. The report key includes experiment variant and campaign, allowing
  the two arms to be compared without joining user-level rows. Export a
  trailing 28-day baseline, then run one sequential treatment window of at least
  14 days; do not overlap another homepage CTA change.
- Success rule: the treatment’s primary KPI improves with a confidence interval
  that excludes no change, while event availability and guardrails remain valid.
- Rollback: restore the control copy/campaign, rebuild, publish, and verify the
  homepage geometry, App Store URL, and SEO crawl before re-opening exposure.

Local verification (2026-08-15): homepage and web-analytics contract tests pass;
the current production report remains blocked because its event export is
missing. This is an implementation candidate, not a live exposure or conversion
lift claim.

## EXP-002 — Acquisition-page hero proof

Status: queued after EXP-001.

Question: for `/workout-tracker`, `/progressive-overload`, and migration pages,
does a product-screen hero outperform lifestyle photography for qualified
store intent without worsening field performance on mobile?

- Keep search intent, copy, pricing/availability claims, and CTA campaign
  constant; change only the hero presentation.
- Primary KPI: the same qualified store-intent rate, segmented by canonical
  source page, viewport class, and bounded `hero_presentation` (`photo` or
  `screen`) marker.
- Guardrails: `web_vital_measured` p75, `web_error_visible`, 200/self-canonical
  status, and no broken internal links.
- Published candidate: use the verified Surpass product screen in the
  `/workout-tracker` hero (`surpass-build-home.png`) and the
  `/progressive-overload` hero (`surpass-progress.png`); existing planner and
  migration acquisition pages retain their verified screen presentation. The
  CTA remains `acquisition_hero_cta` / `outcome_v1` with the original SEO
  campaign tokens.
- Measurement repair: acquisition hero CTAs now carry the fixed-source
  `hero_presentation` marker into `web_cta_viewed` and
  `app_store_outbound_clicked`; the acquisition report segments CTA rows by
  that marker without collecting user-entered data.
- Verification: `npm test` passed, the static export generated 397/397 routes,
  `gh-pages` commit `b62b4a65` reached ACTIVE as DigitalOcean deployment
  `b019cb99-3308-400c-8c9c-d6984b9267a1`, and fresh desktop/390px screenshots
  `visual/30-workout-tracker-hero-after.png`,
  `visual/31-progressive-overload-hero-after.png`,
  `visual/32-workout-tracker-mobile-after.png`, and
  `visual/33-progressive-overload-mobile-after.png` were inspected. The live
  322-URL public brand crawl and 325-URL SEO audit passed with zero failures,
  blocked pages, broken internal links, or sitemap noindex violations. This
  proves product proof delivery and measurement construction, not conversion
  lift.

## EXP-003 — Tool-result handoff

Status: published; public guardrails passed; baseline required.

Question: does a result-specific explanation plus a single App Store CTA convert
better than a generic “download the app” prompt after a visitor completes a
calculator or import checker?

- Compare only the result CTA copy and supporting explanation; preserve the
  calculation and import output.
- Candidate: move the single result CTA into the result header, use `Start free
  on iPhone`, explain the tool-specific handoff, and carry
  `tool_completion_state=preview|completed` on the privacy-safe App Store
  events. Preview clicks remain diagnosable rather than being mixed into the
  completed-result denominator.
- Primary KPI: unique `app_store_outbound_clicked` sessions with
  `tool_completion_state=completed` divided by unique `tool_completed` sessions,
  segmented by tool campaign and `tool_result_handoff` variant.
- Diagnostics: preview versus completed-result outbound clicks, result CTA
  view rate, tool completion rate, share success, and visible errors.
- Guardrails: completion rate, share success, visible errors, and privacy
  contract tests for calculator/import analytics.
- Verification: `npm test` passed, the static export generated 397/397 routes,
  `gh-pages` commit `94e77038` reached ACTIVE as DigitalOcean deployment
  `29f22c1f-62e4-46f0-b64c-285b653847d8`, and the live next-set calculator
  exposes the result-header CTA, campaign URL, and preview/completed state
  transition. The post-deploy SEO audit checked 325 discovered URLs with zero
  blocked pages, broken internal links, or sitemap noindex violations. This is
  delivery and measurement evidence, not conversion lift.

## EXP-004 — SEO landing hero CTA promise

Status: instrumented, baseline required before any winner is declared.

Hypothesis: `Start free on iPhone` communicates the immediate, low-friction
next step more clearly than the previous `View Surpass on the App Store`,
especially on pages where the visitor has already expressed workout-tracker
intent.

- Current variant: `outcome_v1`, experiment `acquisition_hero_cta`, applied to
  the shared hero CTA on the workout-tracker, planner, progression, and import
  acquisition pages.
- Previous control copy: `View Surpass on the App Store`.
- Primary KPI: unique CTA-viewed sessions that also emit
  `app_store_outbound_clicked`, divided by unique sessions with
  `web_cta_viewed`, segmented by canonical source page,
  `cta_placement`, and the experiment variant.
- Diagnostics: CTA-view rate per `web_session_started`, page-level web vitals,
  visible errors, and App Store campaign continuity.
- Decision rule: do not call the outcome variant a winner until the control and
  treatment have comparable exposure, valid denominators, and a predeclared
  confidence interval that excludes no change without a guardrail regression.
- Rollback: restore the previous CTA copy and remove the outcome variant only
  after the page crawl, campaign URLs, and event properties are re-verified.

## EXP-005 — Mobile header recovery

Status: published and verified; baseline required.

Finding: a fresh 390px audit of the live `/workout-tracker/` page showed the
desktop navigation wrapping and clipping the right side of the primary install
control. This is a conversion-quality fix, not a claimed experiment lift.

- Published change: replace the cramped mobile desktop navigation with a compact
  `Start free` CTA plus an accessible native menu; keep the full route set
  reachable and mark each route with `data-nav-section`.
- Measurement: compare mobile `web_cta_viewed` to
  `app_store_outbound_clicked` for `header_mobile` and the SEO hero, segmented
  by canonical source page and viewport class.
- Guardrails: no horizontal overflow, hero CTA remains in the first viewport,
  menu routes remain reachable, `web_error_visible` does not worsen, and the
  mobile Apple campaign remains `surpass_coach_mobile`.
- Verification gate: the published change passed the site suite, 390px and
  desktop checks, campaign-map review, and the full 328-URL live brand crawl.

## EXP-006 — Content quality and trust floor

Status: published and verified; Search Console baseline required.

Finding: a source audit found mixed-script fragments in 24 published article
files and several stale or over-strong promises, including a seven-day trial
claim and an unsupported auto-progression percentage. These are trust and
conversion defects even when the page is technically indexable.

- Published change: correct the language artifacts, rewrite the affected product and
  evidence claims in plain English, and preserve the existing article URLs.
- Guardrail: `npm run content:quality` must reject CJK/Cyrillic fragments,
  stale trial promises, guaranteed auto-progression outcomes, the identified
  unsupported statistic, and absolute evidence wording; `npm run public:language`
  must also pass.
- Measurement now available to compare: Search Console CTR, impressions,
  average position, organic `web_cta_viewed`, and organic
  `app_store_outbound_clicked` for the affected URLs against the trailing
  pre-change window. Treat the first read as directional until indexing and
  query mix are stable.
- Decision rule: keep the content change only if crawl/indexability remains
  healthy and trust/conversion diagnostics do not regress; do not call it an
  SEO or revenue lift without Search Console and analytics evidence.
- Rollback: restore only the specific article source after reviewing the
  source diff and preserving any URL-level redirects or canonical rules.

## EXP-007 — App Store listing clarity and brand cleanup

Status: public listing verified; campaign/download baseline required.

Finding: a fresh public listing capture showed a retired-brand release-note
sentence and repeated lead copy in the description. Both defects weaken trust at
the highest-intent handoff from the site.

- Published candidate: a brand-neutral “What’s New” note, a distinct opening
  description line, and natural category language for strength training,
  workout tracking, progressive overload, and weekly targets across `en-US`,
  `en-GB`, `en-CA`, and `en-AU`.
- Provider state: read-only App Store Connect readback at 2026-08-15T10:50Z
  confirms version 4.0.3 is `WAITING_FOR_REVIEW` with release type
  `AFTER_APPROVAL`; all four current English localizations pass the stale-brand
  and repeated-description checks. This is provider preparation, not public
  storefront propagation.
- Local handoff state (2026-08-15T08:16Z): the credential-free release packet
  passes metadata checks and fingerprints all 12 candidate PNG assets across
  the four expected iPhone/iPad localization sets, including store-valid
  dimensions. This proves local packet integrity, not provider acceptance or
  public asset display.
- Public state: read-only storefront check at `2026-08-15T20:43:14Z` finds
  Surpass version `4.0.3`, a current release note, no stale-brand release-note
  text, and a distinct description opening. The public App Store gate passes;
  App Store campaign, product-page, and download metrics remain owner-export
  inputs.
- Primary KPI after public propagation: App Store product-page-to-download
  rate by storefront and campaign, with product-page views and downloads as
  separate denominators.
- Secondary diagnostics: site `app_store_outbound_clicked` by campaign,
  listing page-view mix, install activation rate, and review/rating state.
- Guardrails: no stale visible Jacked product copy, no unsupported product
  claims, metadata byte/character limits, valid support/privacy URLs, and no
  regression in first-set activation for the same acquisition cohorts.
- Decision rule: treat the first post-publication read as directional until the
  listing has a mature exposure window and App Store Connect confirms campaign
  continuity; do not call the candidate a winner from metadata validation alone.
- Provider readback command: from the native repository, run
  scripts/app-store-readback.rb with the fastlane Ruby/GEM_PATH. The provider
  and public readbacks now pass for 4.0.3; the remaining gate is campaign and
  download evidence, not metadata propagation.
- Verification: `ruby scripts/validate-app-store-metadata.rb`,
  `./scripts/check-public-language.sh`, `npm run public:app-store`, public
  storefront capture, and an authorized App Store Connect readback after
  submission. The public check scopes stale-brand detection to the current
  version-history entry so older release notes do not create a false pass or
  false failure.

## EXP-008 — Native onboarding path first-workout handoff

Status: implemented in native source; release and cohort baseline required.

Finding: recommended onboarding already opened the first planned session, but
custom and imported setup landed on Today after the plan-ready summary. That
added a navigation step at the moment when the plan context and first-session
intent were strongest.

- Candidate: make `START FIRST WORKOUT` the completion action for every
  completed onboarding path, while retaining bounded `recommended`, `custom`,
  and `import` source labels for analysis. A pending external workout request
  remains authoritative.
- Primary KPI: unique installations with `first_set_logged` within seven days
  of `activation_entry`, segmented by `onboarding_path` and app version/build.
- Secondary diagnostics: time from `activation_entry` to
  `first_workout_ready`, `workout_started`, and `first_set_logged`; compare
  handoff completion and early return cohorts when observation windows mature.
- Guardrails: no duplicate start when an external request is pending, no
  source-label collapse, no change to returning-user Train choices, and no
  regression in save/recovery or privacy-safe event contracts.
- Verification: the current app target build passed for the iPhone 17 / iOS
  26.2 simulator, and focused simulator execution passed 226/226 tests across
  AppFeature, OnboardingFeature, TrainFeature, AnalyticsEvents, and Paywall
  coverage with zero failures. This is local simulator evidence; no runtime
  accessibility, release, cohort, or commercial lift is claimed.
- Decision rule: keep the handoff only if first-set activation improves or
  remains neutral by path without a guardrail regression after a mature release
  cohort; rollback the source change if duplication, recovery, or early-session
  completion worsens.

## EXP-009 — Article claim hygiene and final CTA handoff

Status: published and verified on 2026-08-15; baseline readout required.

Finding: a live progressive-overload article ended with the generic action
`Open the App Store listing` and still contained a retired free seven-day trial
promise. Two other indexed articles used the same trial framing. This creates
an avoidable trust break at the end of otherwise high-intent organic content.

- Published candidate: replace trial and price language with the current
  free-to-start promise, use `Start free on iPhone` for the final article
  action, and expose a distinct `${campaign}_final` placement for measurement.
- Primary KPI: unique CTA-viewed sessions that also emit
  `app_store_outbound_clicked`, divided by unique `web_cta_viewed` sessions
  for article final CTAs, segmented by `blog_*`
  campaign and canonical source page.
- Diagnostics: article header versus final CTA rates, tool-link engagement,
  visible errors, viewport class, and App Store campaign continuity.
- Guardrails: `npm run content:quality`, `npm run public:language`, no stale
  trial/price promises, self-canonical 200 responses, no broken internal links,
  and no mobile overflow or visible brand drift.
- Verification: the pre-publish live audit captured the stale trial sentence
  and generic final action at desktop and 390px. Local source tests passed;
  `gh-pages` commit `9895054b` reached ACTIVE as DigitalOcean deployment
  `a2927cd5-1943-4010-88bf-6e2063cb0a90`; the live article carries `Start free
  on iPhone` plus the `${campaign}_final` marker, contains zero retired-trial
  or generic-listing hits, and the 322-URL public brand crawl passes with zero
  failures or stale visible-brand findings. This is a trust/conversion repair,
  not evidence of lift.
- Decision rule: retain the candidate only after a mature exposure window shows
  valid denominators and no guardrail regression; do not call it a winner from
  local tests or publication checks alone.

## EXP-010 — Article inline CTA consistency and measurement

Status: published candidate; intent-relevant copy update is now source-ready;
public guardrails and baseline remain required.

Finding: 219 published articles still ended with italic, plain-text prompts
such as `Download now`. Those prompts were visually inconsistent with the
current Surpass handoff, did not provide a dependable App Store link, and
could not be separated from header or final article CTA exposure.

- Published candidate: replace the legacy prompts with a tracked in-article
  handoff whose eyebrow, headline, and supporting copy match the article's
  bounded intent (`workout_apps`, `nutrition`, `recovery`, `exercise`,
  `progression`, `programming`, or `training`). Keep one clear `Start free on
  iPhone` action. Each link keeps the article-specific `blog_*` campaign and
  carries `article_inline_cta` / `outcome_v1` for the privacy-safe web event
  taxonomy; the copy marker is `article_intent_promise_v1`.
- Primary KPI: unique CTA-viewed sessions that also emit
  `app_store_outbound_clicked`, divided by unique `web_cta_viewed` sessions
  for `${campaign}_inline`, segmented by article,
  campaign, viewport class, and `article_inline_cta` / `outcome_v1`.
- Diagnostics: inline CTA view rate, scroll-depth bucket at first exposure,
  header versus inline versus final CTA outbound rate, article-tool clicks,
  visible errors, and App Store campaign continuity.
- Guardrails: no stale trial or generic-download wording, no duplicate CTA
  event inflation within a page view, no broken internal links, self-canonical
  200 responses, and no visible brand or mobile overflow regression.
- Verification before publication: the focused article acquisition contract
  must pass, then `npm test`, static export, public brand/conversion checks,
  the full brand crawl, and technical SEO audit must be rerun. Existing
  publication evidence for the shared CTA remains valid only for the prior
  `article_promise_v2` copy; it does not establish delivery or lift for this
  intent-relevant update. The source change is not evidence of traffic,
  App Store conversion, or revenue.
- Historical verification: `npm test` passed; the static export generated 399/399 routes;
  `gh-pages` commit `54ff82e3` reached ACTIVE as DigitalOcean deployment
  `38aa4e50-6afd-471a-a6e5-9ff9d038460f`; a live canonical article returned
  HTTP 200 with the `article_promise_v2` marker on its header, inline, and
  final handoffs; the public brand and conversion checks, 316/316 brand crawl,
  and 325-URL SEO audit passed with zero stale-brand, non-200, blocked,
  broken-link, or sitemap-noindex findings. This proves delivery and
  denominator-safe construction, not conversion lift.
- Decision rule: retain the candidate only after a mature exposure window has
  valid denominators and no guardrail regression; do not infer traffic, ranking,
  App Store conversion, or revenue from publication checks.

## EXP-011 — Homepage lower-funnel CTA consistency

Status: published candidate; baseline required.

Finding: the homepage hero already used the outcome-led `Start free on iPhone`
promise, but its mid-page download panel and final CTA still used the weaker
`View on the App Store` label. The homepage audit also found that the hero's
control campaign was not carrying the explicit `_control` suffix used by the
experiment fixture and backlog.

- Published candidate: align the homepage download panel, final CTA, and
  mobile dock with the free-to-start handoff; tag the lower surfaces as
  `homepage_lower_cta` / `outcome_v1`; and make the hero campaign
  `surpass_coach_home_hero_control` so the control denominator is unambiguous.
- Primary KPI: unique CTA-viewed sessions that also emit
  `app_store_outbound_clicked`, divided by unique `web_cta_viewed` sessions,
  segmented by `homepage_download`, `homepage_final`,
  and `homepage_mobile_dock` placement plus the lower-CTA experiment variant.
- Diagnostics: hero versus lower-funnel CTA view rate, outbound rate by
  viewport, campaign continuity, scroll-depth bucket at first exposure,
  `web_vital_measured`, and `web_error_visible`.
- Guardrails: no change to hero layout or hero copy, no duplicate event rows
  from the fixed mobile dock, no broken App Store URL, no mobile overflow, and
  no regression in public brand or SEO crawl gates.
- Verification: `npm test` passed, the static export generated 397/397 routes,
  `gh-pages` commit `e644cab9` reached ACTIVE as DigitalOcean deployment
  `f3a65687-4ccc-4e94-a8b7-c3f0e5ae57bb`, and the live homepage returned HTTP
  200 with the explicit control campaign, three lower-CTA experiment markers,
  and zero `View on the App Store` homepage labels. Fresh after-publication
  screenshots `visual/23-homepage-mobile-after.png` and
  `visual/24-homepage-desktop-after.png` were inspected at 390px and desktop;
  the 322-URL public brand crawl and 325-URL SEO audit passed with zero
  failures, blocked pages, broken internal links, or sitemap noindex
  violations. This is a candidate for baseline measurement, not a conversion
  or revenue claim.
- Decision rule: keep the candidate only after placement-level denominators are
  mature and the lower-CTA readout does not worsen guardrails; do not combine
  this comparison with a hero treatment window.

## EXP-012 — Post-workout next-session handoff

Status: implemented in native source; release and cohort baseline required.

Hypothesis: showing the next planned session immediately after a saved workout
will reduce the amount of navigation a new lifter must do before understanding
what to train next, improving the chance of a later return without forcing a
new workout.

- Candidate: on the completed-training Today state, show the existing inline
  next-session preview by default, keep it reversible with the same control,
  emit one privacy-safe `next_session_preview_mounted` exposure event per
  loaded home state, and record one bounded
  `next_session_preview_activated` event when the user selects `START NEXT
  SESSION` from a valid scheduled preview.
- Primary diagnostic: mature second `workout_started` within 1-day, 7-day, and
  30-day windows, segmented by whether the preview exposure was observed and by
  `source`; the report must show mature denominators separately.
- Supporting diagnostics: `next_session_preview_mounted` rate after
  `workout_completed`, explicit `next_session_preview_activated` intent,
  preview planned-exercise bucket, and time from the saved workout to the next
  `workout_started(source=next_session_preview)`.
- Guardrails: no automatic workout start, no duplicate preview exposure events,
  no raw workout or exercise content in analytics, no regression in save/recovery
  or accessibility, and no new CTA competing with the primary Today action.
- Local verification: the bounded event contract, fail-closed reducer guard,
  cohort-reader diagnostics, and privacy assertions pass source-level checks;
  the schema-2 reader suite passes 23/23 and changed Swift files parse cleanly.
  A current simulator/build rerun remains gated by safe native-build headroom;
  no end-to-end pass or retention lift is claimed.
- Decision rule: retain only after a released cohort has valid exposure,
  identity, event-time, maturity, and guardrail evidence; do not infer a
  retention or revenue outcome from local tests.

## EXP-013 — App Store outbound event deduplication

Status: published and verified on 2026-08-15; provider baseline required.

Finding: the site already reports unique-session CTA rates, but repeated taps on
the same App Store link could still create multiple raw
`app_store_outbound_clicked` rows during one analytics page-session lifetime. That did not
change the unique-session denominator, but it made event-row diagnostics and
provider-side QA noisier than necessary.

- Published candidate: deduplicate the canonical outbound event by normalized
  page-view key, CTA placement, and App Store campaign for the lifetime of the
  browser analytics component. Attribution-only query parameters do not create
  a second key; meaningful tool parameters remain part of the page-view key.
- Primary KPI: unchanged qualified store-intent rate using unique
  `session_id` denominators. Deduplication is a measurement-quality repair,
  not a conversion treatment.
- Diagnostics: outbound event rows per unique outbound session, repeated-click
  suppression rate when provider exports are available, and presence of both
  `web_cta_viewed` and outbound denominators by placement.
- Guardrails: no lost first click when analytics is available, no destination
  URL or user input in the key, no change to campaign routing, and no
  regression in CTA-view or web-vital events.
- Verification: `node app/webAnalytics.test.mjs` and the full `npm test` suite
  pass; the static export generated 397/397 routes. `gh-pages` commit
  `c6a595069` reached ACTIVE as DigitalOcean deployment
  `f51ad938-1727-4ad6-a394-567a9a011c3c`; the live analytics bundle contains
  the canonical outbound event and CTA context, and the 322-URL public brand
  crawl plus 325-URL SEO audit pass with zero failures, non-200 pages, stale
  visible-brand findings, broken internal links, or sitemap noindex violations.
  This verifies delivery and event construction, not a conversion lift.
- Decision rule: keep the repair when provider readback confirms lower raw-row
  duplication without a fall in unique outbound sessions; never infer a
  conversion lift from lower event volume.

## EXP-014 — Mobile acquisition-page recovery CTA

Status: local candidate implemented; baseline required.

Hypothesis: a persistent, low-friction CTA after the hero will recover more
qualified App Store intent from mobile visitors who read the proof, comparison,
or FAQ sections but do not return to the hero.

- Surface: the shared SEO acquisition pages at `/workout-tracker`,
  `/gym-workout-planner`, `/progressive-overload`, `/hevy-alternative`,
  `/strong-alternative`, and `/fitnotes-alternative`; mobile viewports only.
- Treatment marker: `acquisition_mobile_cta` / `sticky_outcome_v1` with a
  campaign-specific `${campaignKey}_mobile_dock` placement.
- Primary KPI: unique CTA-viewed sessions from the mobile-dock placement that
  also emit `app_store_outbound_clicked`, divided by unique sessions with
  `web_cta_viewed` from that placement; report alongside total page-level
  qualified store intent so
  the dock is not credited for duplicate CTA exposure.
- Guardrails: no horizontal overflow, no content obscured by the safe-area dock,
  unchanged 200/self-canonical status, field-vital p75, visible errors, and
  campaign continuity. The dock must remain keyboard/VoiceOver reachable.
- Exposure: capture a trailing 28-day baseline once EU Mixpanel access is
  available, then run one sequential mobile window of at least 14 days without
  changing hero copy or product proof.
- Local production verification (2026-08-15): the 390x844
  `/workout-tracker` preview keeps the recovery dock absent while the hero CTA
  is visible, then exposes the dock after a 650px scroll. The initial DOM keeps
  the hidden dock out of the accessibility tree; the post-scroll DOM exposes
  the labeled `Start free` handoff. The desktop production preview keeps the
  dock hidden. `npm test` passed and `npm run build` generated 397/397 routes.
  This verifies local timing, layout, and accessibility-state construction only;
  it is not public propagation or conversion lift.
- Decision rule: retain only if the placement contributes incremental qualified
  intent without a guardrail regression; do not call it a winner from local
  rendering or a tiny/incomplete export.
- Rollback: remove the dock and its placement markers, rebuild, and rerun the
  mobile layout, brand, SEO, and event-contract checks.

## SEO-001 — Complete training-library discovery map

Status: published and verified; Search Console baseline required.

Finding: the interactive blog index initially server-rendered only its first
36 articles. Articles beyond that slice could still be reached through the
sitemap, but many had no inbound HTML link from the current internal graph.

- Published change: add an accessible, compact “Browse the complete training
  library” map containing every canonical article link, while retaining the
  existing search, filter, and load-more experience for normal visitors.
- Primary diagnostic: count of canonical sitemap articles with at least one
  inbound internal HTML link; report the minimum and median inbound-link count
  after each content release.
- Search diagnostic: Search Console impressions, clicks, CTR, and average
  position for articles receiving new internal links, compared with the
  trailing pre-change window after crawl/indexing stabilizes.
- Guardrails: no legacy/merged URLs in the map, zero broken internal links,
  self-canonical 200 responses, no sitemap noindex violations, and no visible
  brand or mobile conversion regression.
- Current verification: the live `/blog` HTML exposes 256 unique canonical
  article links; the 2026-08-15 technical crawl found zero zero-inbound
  canonical articles, minimum inbound links of 1, and median inbound links of
  4. This proves link-graph coverage, not ranking or traffic lift.

## SEO-002 — Acquisition landing schema and hero delivery

Status: published and verified; Search Console and field-performance baseline
required.

Finding: the acquisition pages already had page metadata and FAQ schema, but
their shared template did not describe the individual page as a `WebPage` with
a breadcrumb path. The hero proof image was also discovered through a CSS
background, which can delay the first meaningful product signal on a slow
connection.

- Published candidate: add page-level `WebPage`, `BreadcrumbList`, and existing
  `FAQPage` structured data to all six acquisition landing pages, with explicit
  canonical paths; preload each page's fixed hero proof image at high priority.
- Primary diagnostic: Search Console impressions, clicks, CTR, and average
  position by landing page after crawl/indexing stabilizes. Structured data is
  implementation evidence, not a guaranteed rich result or ranking effect.
- Performance diagnostic: field `web_vital_measured` LCP and INP p75 by route
  and viewport class, with sample count and field coverage visible before
  interpretation.
- Guardrails: valid self-canonical 200 pages, no structured-data claim that is
  absent from the visible page, no duplicate CTA events, no mobile overflow,
  and no regression in the public brand or sitemap crawl gates.
- Verification: `npm test` passed, the static export generated 397/397 routes,
  and the live `/workout-tracker/` HTML contains the hero preload plus
  page-level WebPage, BreadcrumbList, and FAQPage JSON-LD. The 322-URL public
  brand crawl and 325-URL SEO audit pass with zero failures, non-200 pages,
  stale visible-brand findings, broken internal links, or sitemap noindex
  violations. This proves crawl and delivery hygiene, not ranking or traffic
  lift.
- Decision rule: retain the candidate while crawl/indexability and field
  performance remain healthy; do not call it an SEO, traffic, conversion, or
  revenue lift without Search Console and analytics evidence.

## SEO-003 — Homepage hero delivery and proof-format measurement

Status: published and verified; field-performance baseline required.

Finding: the homepage hero is the first commercial handoff and its primary
photo was previously discovered only through a CSS background. The homepage
hero CTA also identified the copy experiment but not the proof format shown to
the visitor, which would make a future screen-versus-photo test difficult to
interpret.

- Published candidate: preload the fixed homepage hero photo at high priority
  and add the bounded `hero_presentation=photo` marker to the controlled
  `homepage_hero_cta` CTA.
- Primary diagnostic: `web_cta_viewed` and `app_store_outbound_clicked` by
  `experiment_name`, `experiment_variant`, `hero_presentation`, viewport
  class, and source page; report unique-session denominators separately.
- Performance diagnostic: field `web_vital_measured` LCP and INP p75 for the
  homepage by viewport class, with sample count and field coverage visible.
- Guardrails: no duplicate CTA events, no mobile overflow, no public-brand or
  sitemap-crawl regression, and no change to the visible product promise while
  the delivery candidate is measured.
- Verification: local tests and static export passed; live `/index.html`
  contains the hero preload and `data-hero-presentation="photo"`. The public
  brand crawl and technical SEO audit remain green after publication. This
  proves delivery and measurement construction, not field performance or CTA
  lift.
- Decision rule: keep the preload if it does not worsen field vitals or image
  transfer cost; do not call it a conversion or SEO winner without an
  authorized baseline and exposure window.

## EXP-015 — Homepage mobile dock timing

Status: published and verified; baseline required.

Finding: a fresh 390px audit of the public homepage still found the persistent
mobile homepage dock visible while the hero CTA was already in the first
viewport. It duplicated the primary action, covered the supporting trust line,
and its generic `span` color rule muted the dock button label against the gold
background.

- Local candidate: keep the mobile recovery CTA available, but reveal it only
  after the hero action group leaves the viewport. Scope support-copy styles to
  `.conversion-dock-copy`, force the button label to a high-contrast color,
  add an accessible destination label, and keep the hidden state `aria-hidden`,
  non-interactive, and out of layout before hydration.
- Primary KPI: unchanged homepage mobile-dock qualified store intent using
  unique CTA-viewed sessions that also emit `app_store_outbound_clicked`,
  divided by unique `web_cta_viewed` sessions; compare mobile-dock contribution
  with total homepage intent so recovery clicks are not double-credited.
- Guardrails: hero CTA remains visible and unobscured in the first viewport,
  the trust line is readable, no horizontal overflow, no keyboard/VoiceOver
  focus into the hidden dock, and no change to App Store campaign routing.
- Verification: the local production build generated 398/398 routes. At 390 ×
  844, the dock is `aria-hidden=true`, `display:none`, and zero-sized while
  the hero CTA is visible; after the hero leaves view it becomes
  `aria-hidden=false`, visible, and uses a dark high-contrast `Start free`
  label. Homepage, web-analytics, acquisition-landing, accessibility, and
  full-suite checks pass. The public conversion gate now passes after
  `gh-pages` commit `472cad45a` / DigitalOcean deployment
  `2eaf3f32-422a-45c1-af75-9341f3865bae`; the later SEO-repair deployment
  `dfc8c3df-09d5-4a1e-864a-4332f17d0558` retains those markers. This proves
  public construction and guardrail delivery, not conversion lift.
- Public boundary: public behavior is now verified at the HTML/contract level;
  a 390px visual and field-performance read remain separate evidence gates.
- Decision rule: retain only after a mature mobile baseline confirms the dock
  contributes qualified intent without worsening hero reachability or field
  vitals.

## SEO-004 — Canonical link repair and migration redirects

Status: published and verified; baseline required.

Finding: the public technical crawl found four internal links pointing to three
missing article slugs. Those links sent readers and crawlers to the 404 page and
created avoidable discovery loss in the training library.

- Candidate: point the four source links at existing canonical articles and add
  matching permanent redirects at both the application preview layer and the
  DigitalOcean ingress layer for any old inbound URL.
- Guardrails: no sitemap URL becomes a redirect, canonical targets remain
  self-canonical 200 pages, no stale visible-brand copy, and no redirect chain.
- Verification (2026-08-15): `npm test` passed; the static export generated
  398/398 routes; `gh-pages` commit `677bfe97a` reached ACTIVE as DigitalOcean
  deployment `dfc8c3df-09d5-4a1e-864a-4332f17d0558`; all three legacy paths
  returned 301 and all three canonical targets returned 200; the public
  315-URL brand crawl and technical SEO audit passed with zero failures and
  zero broken internal links. This proves crawl and recovery hygiene, not
  rankings, organic traffic, or conversion lift.
- Decision rule: retain the redirects while inbound or internal references
  exist; review any future consolidation against Search Console and backlink
  evidence before removing a canonical route.

## SEO-005 — Hypertrophy app intent landing

Status: published and verified; Search Console and web analytics baseline required.

Finding: the site had a strong hypertrophy content cluster and comparison
articles, but no dedicated commercial landing page for the high-intent
“hypertrophy app for iPhone” query family. Sending that intent only to a
generic article makes the App Store handoff and page-level measurement harder
to interpret.

- Candidate: add `/hypertrophy-app` with a distinct `seo_hypertrophy_app`
  campaign, visible product-screen proof, direct explanation of weekly muscle
  targets and effort context, and links into the progressive-overload,
  methodology, and hypertrophy review cluster.
- Primary diagnostic: unique CTA-viewed sessions that also emit
  `app_store_outbound_clicked`, divided by unique `web_cta_viewed` sessions
  for the new page, reported by CTA placement,
  viewport, and campaign; keep Search Console impressions, clicks, CTR, and
  position as the acquisition baseline.
- Guardrails: self-canonical 200 page, sitemap inclusion, zero broken internal
  links, no stale brand copy, no automatic-program promise, no duplicate CTA
  events, and no mobile overflow or field-vital regression.
- Verification (2026-08-15): source tests pass for the page, campaign, sitemap
  entries, canonical path, structured-data inheritance, and homepage / footer
  discovery. Static export generated 399/399 routes; `gh-pages` commit
  `c4c278acb` reached ACTIVE as DigitalOcean deployment
  `83739aa8-4bfa-443f-ad9f-dc079437cf91`; live route checks returned 200; the
  cache-busted 316-URL public brand crawl and 325-URL technical audit passed
  with zero failures, broken links, stale visible-brand findings, or sitemap
  noindex conflicts. This proves delivery and crawl hygiene only; it does not
  prove ranking, traffic, installs, conversion, or revenue lift.
- Authority reinforcement (2026-08-15): the three highest-intent supporting
  articles—best workout app for hypertrophy, best hypertrophy app for iOS, and
  auto-progression—now link contextually to `/hypertrophy-app`. Source SEO,
  content-quality, and public-language checks pass; publication commit
  `34b630075` reached ACTIVE as DigitalOcean deployment
  `5c245085-b3bb-40b6-9e54-0dbfb3958bfb`; live checks found all three links,
  zero stale-brand/non-200 pages across 316 sitemap URLs, and zero technical
  SEO failures. This improves internal discovery and handoff continuity, not
  proven ranking or conversion lift.
- Decision rule: retain or expand the page only after a mature query and
  qualified-intent baseline is available; do not judge it from page existence
  or a small/incomplete export.

## SEO-006 — Import compatibility authority guide

Status: published; public guardrails passed; Search Console and web analytics baseline required.

Finding: Hevy, Strong, and FitNotes migration pages already target separate
switcher queries, but the site had no single evidence-backed guide that stated
the current parser boundaries, required fields, file limits, review step, and
privacy boundary in one place.

- Candidate: add `/import-workout-history` with a dedicated
  `seo_import_workout_history` campaign, source-specific CSV guidance, current
  parser limits, review-before-save explanation, and links to each migration
  page and CSV checker.
- Primary diagnostic: unique CTA-viewed sessions that also emit
  `app_store_outbound_clicked`, divided by unique `web_cta_viewed` sessions
  for the guide, segmented by CTA placement,
  viewport, campaign, and first/last-touch source.
- Search diagnostic: Search Console impressions, clicks, CTR, and average
  position for the guide and its linked migration cluster after indexing
  stabilizes; internal-link and backlink acquisition are separate diagnostics.
- Guardrails: self-canonical 200 page, sitemap inclusion, one H1, valid
  structured data, zero broken internal links, no credentials or raw workout
  data in copy or events, and no unsupported import guarantee.
- Source basis: the current native importer exposes Hevy, Strong, and FitNotes
  sources; Strong requires `date` and `exercise_name`, FitNotes requires `date`
  and `exercise`, and the parser enforces the documented file/row/column
  limits. Current native parser tests cover Hevy, Strong, FitNotes, date
  ambiguity, missing columns, and safe recovery copy.
- Verification (2026-08-15T16:19Z): source contracts, `npm test`, and the
  static export passed; the export generated 400/400 routes. Publication
  commit `8fdafae73` reached ACTIVE as DigitalOcean deployment
  `b7eb8c18-8942-4416-a692-9ef3771e319e`. Live `/import-workout-history`
  returned 200 with one H1, self-canonical metadata, FAQ/WebPage schema, and
  its campaign token; the page is linked from the homepage and present in the
  sitemap. The public brand check passed, the 317/317 sitemap crawl passed
  with zero stale-brand or non-200 findings, and the technical audit reported
  317 sitemap URLs, 329 discovered URLs, 326 audited HTML/XML pages, 3 assets,
  zero blocked pages, zero broken internal links, and zero sitemap/noindex
  conflicts. This proves publication and crawl hygiene only; no ranking,
  traffic, conversion, install, retention, or revenue outcome is claimed.
- Decision rule: retain the guide while crawl/indexability and trust remain
  healthy; do not call it an SEO, traffic, conversion, or revenue lift without
  Search Console and analytics evidence.

## EXP-016 — TikTok campaign context alignment

Status: published and verified; provider baseline required.

Finding: the TikTok landing emitted custom view and CTA events, but those
events did not carry the shared web schema, canonical page context, or the
same privacy-safe attribution boundary as the main site funnel.

- Candidate: retain the creative-specific diagnostics while attaching the
  shared schema version, ephemeral session context, sanitized attribution, and
  canonical source page. Keep the canonical `web_cta_viewed` to
  `app_store_outbound_clicked` pair as the primary store-intent funnel.
- Diagnostics: `tiktok_landing_view`, `tiktok_landing_cta`, and
  `tiktok_landing_motion_link` by sanitized source, campaign, creative,
  placement, viewport, and landing variant.
- Guardrails: no raw destination URL, referrer URL, user input, or account
  identifier; no change to the no-index campaign page or App Store campaign
  routing.
- Verification (2026-08-15T17:09Z): TikTok and web analytics tests pass, the
  static export generated 400/400 routes, `gh-pages` commit `847c7e3` reached
  ACTIVE as DigitalOcean deployment `ffa7fff9-be3e-4119-a19b-d05aff32942b`,
  and the live direct-handoff route returned 200 with the shared analytics
  context present in its JavaScript bundle. The public brand and conversion
  checks passed; the 317/317 brand crawl and 329-discovered/326-audited SEO
  check passed with zero failures, blocked pages, broken links, or sitemap
  noindex conflicts. This proves delivery and measurement construction, not
  campaign traffic, installs, or revenue.

## EXP-017 — Blog hub CTA handoff

Status: published; public guardrails passed; baseline required.

Finding: the blog hub is a high-intent organic entry point, but its hero and
mid-library App Store links used weaker generic labels than the rest of the
site and did not expose stable placement or experiment context. That made the
handoff less consistent and made placement-level readouts noisier than the
article CTA contract.

- Candidate: use `Start free on iPhone` for both blog-hub handoffs and mark them
  as `blog_hub_hero` and `blog_hub_mid` under the bounded
  `blog_hub_cta` / `outcome_v1` experiment. Keep the `blog_hub` App Store
  campaign and the article-specific CTA contracts unchanged.
- Primary KPI: unique CTA-viewed sessions that also emit
  `app_store_outbound_clicked`, divided by unique `web_cta_viewed` sessions
  for each blog-hub placement, segmented by
  canonical source page, viewport class, and experiment variant.
- Diagnostics: article-library depth at first exposure, article-link
  engagement, page vitals, visible errors, and campaign continuity into the
  App Store.
- Guardrails: no duplicate outbound rows, no generic or stale product copy,
  no broken internal links, self-canonical 200 response, and no mobile
  overflow or public-brand regression.
- Verification (2026-08-15T15:34Z): the blog acquisition contract asserts both
  explicit placements, bounded experiment markers, and the outcome-led copy;
  the full site suite passes and the production build prerenders 399/399
  routes. `gh-pages` commit `54ff82e3` reached ACTIVE as DigitalOcean
  deployment `38aa4e50-6afd-471a-a6e5-9ff9d038460f`; live `/blog` returned
  HTTP 200 with two `blog_hub_promise_v2` markers, and the public brand and
  conversion checks, 316/316 brand crawl, and 325-URL SEO audit passed. A
  provider and analytics baseline is still required for a winner decision.
- Decision rule: retain only after both placements have valid denominators and
  the readout shows no guardrail regression; do not infer SEO traffic,
  installs, or revenue from source checks alone.

## EXP-019 — Shared header CTA promise and measurement

Status: published; public guardrails passed; baseline required.

Finding: the sitewide desktop header used `Start with Surpass` while the
current acquisition system consistently uses a free-start handoff. The header
also had a placement marker but no bounded copy marker, so its message could
not be separated cleanly from other sitewide App Store handoffs.

- Candidate: use `Start free` for both desktop and mobile header handoffs,
  expose the destination to assistive technology, and carry the fixed
  `header_promise_v1` marker while preserving the existing desktop/mobile
  campaign tokens and placements.
- Primary KPI: unique CTA-viewed sessions that also emit
  `app_store_outbound_clicked`, divided by unique `web_cta_viewed` sessions
  for `header` and `header_mobile`, segmented by
  viewport class, source page, and `header_promise_v1`.
- Diagnostics: header CTA view rate per web session, outbound event-row
  suppression, campaign continuity, web vitals, visible errors, and comparison
  with the nearest hero CTA on the same source page.
- Guardrails: no campaign-token change, no duplicate outbound rows, no stale
  brand copy, no mobile overflow, and the header CTA remains keyboard and
  VoiceOver reachable.
- Verification (2026-08-15T15:52Z): homepage product-truth and web-analytics
  contracts passed; `gh-pages` commit `2baa816d` reached ACTIVE in DigitalOcean
  deployment `f473a77b-ef3f-4aad-b433-5cea5a226606`; the live homepage,
  article, and acquisition pages each returned HTTP 200 with two
  `header_promise_v1` markers and zero legacy `Start with Surpass` hits. The
  public brand and conversion checks, 316/316 brand crawl, and 325-URL SEO
  audit passed. Provider and web analytics exports are still required before a
  baseline or winner decision.
- Decision rule: retain only after the header placements have valid mature
  denominators and no guardrail regression; do not infer conversion or revenue
  lift from copy alignment or publication checks.

## EXP-018 — Cross-surface App Store campaign continuity

Status: implemented locally; requires web and App Store Connect exports.

Finding: the site and App Store Connect each expose bounded campaign tokens,
but an independently valid report could still hide a routing or export-name
mismatch between the browser handoff and store-side campaign rows.

- Candidate: join `app_store_outbound_clicked.app_store_campaign` to the
  campaign rows emitted by the App Store Connect summary, keeping campaigns
  observed on only one side visible and preserving explicit web identity and
  store-metric quality flags.
- Diagnostic output: `measurement.app_store_campaign_continuity` and
  `breakdowns.appStoreCampaignContinuity`, with web outbound sessions,
  product-page views, downloads, product-page-to-download rate, and a bounded
  continuity quality value per campaign.
- Guardrail: this is a routing diagnostic, not a person-level join. Web
  outbound sessions must never replace App Store product-page views or
  downloads, and a matched token must not be described as an install or
  subscription.
- Local verification (2026-08-15): acquisition-report syntax, fixtures, and
  diff checks pass; with all provider exports absent, the live report remains
  blocked and the continuity readout is unavailable rather than zero.

## EXP-020 — Session-only, privacy-safe web measurement

Status: published; provider readback required.

Finding: the website needed a tighter measurement boundary so acquisition
denominators could be trustworthy without persistent browser identity,
automatic SDK pageviews, client-IP enrichment, or raw URL/referrer properties.

- Candidate: keep explicit bounded web session, CTA, outbound, navigation, and
  vitals events while disabling Mixpanel automatic pageviews/autocapture,
  cookies and persistence, IP enrichment, automatic referrer/Google storage,
  and raw URL/referrer properties.
- Primary diagnostic: valid explicit `web_session_started`, `web_cta_viewed`,
  and `app_store_outbound_clicked` session denominators after publication,
  with no unexpected automatic event stream or persistent identity.
- Guardrails: no raw current-page or referrer URL values, no client-IP
  enrichment, no account requirement for public policy/support pages, no
  duplicate explicit events, and no conversion claims before provider
  readback.
- Verification (2026-08-15): focused layout and web analytics tests, full
  site test suite, and 400/400 static export pass. `gh-pages` commit
  `e15d3c903` reached ACTIVE as DigitalOcean deployment
  `8d948148-063c-441f-a3cb-83ec20468019`; live homepage and privacy-page
  readback found the new configuration and disclosure. The live provider
  baseline is still unavailable, so this change is a measurement-quality
  repair, not a conversion winner.

## Execution gate

Search Console, EU Mixpanel, App Store Connect, and native app analytics
exports are currently unavailable in this lane. Until those inputs are
authorized, these are implementation-ready hypotheses, not traffic or
conversion claims. When access arrives, record the source status and event
denominators before starting EXP-001.

Measurement support (2026-08-15): `scripts/acquisition-report.mjs` now emits
arm-level CTA comparisons from unique session denominators. It intentionally
omits the campaign token from the comparison key, requires 100 CTA-view
sessions per arm, and reports a 95% Newcombe-Wilson interval plus explicit
`no_treatment`, `no_control`, `below_minimum_exposure`, data-quality, and
inconclusive decisions. The calculation fixture passes locally; no live
experiment has started and no winner is claimed.
