# Surpass growth scorecard

This is the operating scorecard for improving commercial success across
`jacked.coach` and the native iPhone app. It defines what to measure, where the
source of truth lives, and what can safely be claimed. It does not turn missing
connectors into zero activity.

## Decision the scorecard supports

Each weekly review should answer three questions:

1. Which qualified visitors reach the App Store handoff?
2. Which new installations reach a useful first set and return for another workout?
3. Which acquisition surfaces should be improved, held, or retired based on evidence?

## Primary KPIs

| KPI | Definition | Source of truth | Decision it enables |
| --- | --- | --- | --- |
| Qualified store-intent rate | Unique CTA-viewed browser sessions that also emit `app_store_outbound_clicked`, divided by unique sessions with `web_cta_viewed`; report total outbound sessions and outbound-without-view diagnostics separately, then segment controlled changes by `experiment_name`, `experiment_variant`, bounded `hero_presentation`, and bounded `copy_version` where present | EU Mixpanel web events | Improve page promise, product proof, CTA placement, or campaign routing |
| First-set activation | Unique app installations with `first_set_logged` within seven days of first `activation_entry`, divided by installations with first `activation_entry` | App analytics export | Reduce onboarding and first-workout friction; compare recommended, custom, import, and source cohorts |
| Return-to-training cohorts | Second `workout_started` within elapsed 1-day, 7-day, and 30-day windows from first workout, divided by first-workout installations whose observation window is mature; report mature denominator, returning installations, and rate separately | App analytics export, using event time and `workout_number_bucket` as a diagnostic | Improve the second-session handoff, next-target clarity, and early product value without treating immature cohorts as churn |
| App Store product-page-to-download rate | Aggregate App Store downloads divided by complete aggregate product-page views, reported overall and by campaign with source rows and metric quality visible | Campaign-linked App Store Connect export | Improve listing promise, screenshot story, campaign continuity, and store handoff after public propagation |
| Web-to-App Store campaign continuity | Bounded App Store campaign tokens observed on web outbound rows matched against App Store Connect campaign rows; report one-sided campaigns and identity/metric quality explicitly | Web analytics plus campaign-linked App Store Connect export | Catch broken attribution or provider-export mismatches before interpreting campaign conversion |

App Store Connect is the source of truth after the browser handoff for product
page views, downloads, campaign performance, subscriptions, and revenue. The
website analytics layer must not claim any of those outcomes.

## Drivers

### Website and SEO

- Search impressions, clicks, CTR, and average position by page/query/device from Search Console.
- The non-brand search baseline uses the query export's `brand_class` and one
  preferred reporting window (`trailing-28d` when present); overlapping `max`,
  90-day, and 28-day rows are never summed, and page-only exports cannot
  establish non-brand totals.
- `web_page_view`, `web_session_started`, `web_cta_viewed`, and `app_store_outbound_clicked` by canonical route and campaign.
- Web `session_id` values are ephemeral and rotate after 30 minutes without activity; attribution storage remains separate and does not identify a person.
- Canonical `app_store_outbound_clicked` events are deduplicated by page-view key,
  CTA placement, and App Store campaign within the current analytics page-session
  lifetime; this keeps
  raw event diagnostics clean without changing the unique-session KPI.
- The acquisition report now compares control and treatment CTA segments using
  unique CTA-view and outbound sessions, a 100-session-per-arm exposure floor,
  and a 95% Newcombe-Wilson interval for treatment-minus-control. `no_control`,
  `no_treatment`, low exposure, missing identity, and inconclusive reads remain
  explicit rather than being turned into a winner or a zero.
- Acquisition hero proof is explicitly segmented with the fixed-source
  `hero_presentation` marker (`photo` or `screen`) so a screen-versus-photo
  comparison is never inferred from a route name or campaign token.
- The blog hub now uses the same outcome-led `Start free on iPhone` handoff at
  both the hero and mid-library surfaces, with explicit `blog_hub_hero` and
  `blog_hub_mid` placements under the bounded `blog_hub_cta` experiment; this
  is a construction improvement until provider exports supply denominators.
- `tool_started`, `tool_completed`, `import_checker_completed`, and `tool_shared` for utility-led acquisition.
- `web_vital_measured` by page template and viewport class to catch performance regressions that can suppress search visibility or CTA completion.
- 25/50/75/90% scroll buckets and marked product-media completion as diagnostic engagement, never as revenue.
- Published articles must pass the content-quality scan before an editorial change is treated as an SEO candidate; language artifacts and unsupported promises are conversion risks, not traffic wins.
- Acquisition landing templates now expose explicit page-level `WebPage` and
  `BreadcrumbList` structured data alongside the existing FAQ schema, and
  preload their fixed hero proof image; these are crawl and delivery
  diagnostics, not ranking or rich-result claims.
- The homepage now preloads its fixed hero photo and marks the controlled
  `homepage_hero_cta` with `hero_presentation=photo`; the current promise
  treatment is bounded as `copy_version=home_promise_v2`. This makes first-
  viewport delivery and future proof/message comparisons measurable without
  inferring presentation or copy from a route or campaign name.

### Native app

- `activation_entry`, `onboarding_path_selected`, `first_workout_ready`, `workout_started`, and `first_set_logged` for time-to-value loss points. `activation_entry` is the new-user denominator; `app_opened` is a launch diagnostic only. Break activation out by onboarding path and app version/build so release regressions are not hidden in the aggregate.
- Web-to-App Store campaign continuity is a routing diagnostic only: compare the bounded campaign token on `app_store_outbound_clicked` with App Store Connect campaign rows, keep one-sided campaigns visible, and never treat the token as a person-level join.
- The acquisition report also derives aggregate time to first set from the first `activation_entry` to the first valid `first_set_logged`, reporting sample count, median, p75, and bounded time buckets when identity and event time are complete.
- `workout_completed`, `receipt_viewed`, and the ordered second `workout_started` event for early value and return behaviour; report maturity-aware 1-day, 7-day, and 30-day windows, and use `workout_number_bucket` as a diagnostic where present.
- `next_session_preview_mounted` and `next_session_preview_activated` for the post-workout next-session handoff; segment exposure and explicit `START NEXT SESSION` intent by bounded `source` and `planned_exercises_bucket`, then pair with the mature second `workout_started` cohort. These are return-loop diagnostics, not proof of lift or causality.
- `weekly_review_surface_mounted` and `weekly_review_open_today` for the Weekly Review recovery path; segment the loaded surface and `OPEN TODAY` intent by `data_state=empty|populated`, then pair empty-state intent with the later ordered `workout_started` cohort. These diagnose recovery opportunity, not retention, revenue, or causal lift.
- The acquisition report now emits `weekly_review_recovery_diagnostics` with state-level users/events, intent-from-surface, start-after-intent, and explicit missing-quality diagnostics; same-timestamp intent/start pairs remain unresolved rather than being counted as ordered.
- `recommendation_viewed`, `recommendation_used_unchanged`, `recommendation_edited`, and `recommendation_replaced_with_previous` for trust in next-set guidance.
- `import_source_selected`, `import_file_validated`, `exercise_mapping_completed`, and `import_completed` for migration cohorts.
- When a premium surface is active, use `paywall_viewed`, one
  `purchase_started` per attempt, entitlement-confirmed `trial_started`,
  `purchase_completed`, and bounded purchase/restore failure events. Never
  infer a trial from the product page's advertised offer, and never treat
  missing provider exports as zero conversion.

## Guardrails

- `web_error_visible`, import failures, save failures, and purchase/restore failures must not worsen while a growth change is live.
- Every new iOS event must carry `app_brand=surpass`, `brand_generation=surpass_launch`, and schema version `2` through the runtime envelope.
- No event may contain names, notes, weights, reps, RIR, CSV text, email addresses, health information, raw errors, exact workout dates, or destination URLs.
- A rate is not reportable until its numerator, denominator, source status, date range, and event availability are visible.
- Search Console exports must retain `start_date` and `end_date` for the selected
  query window; App Store Connect exports must retain period boundaries; web
  and native event exports must retain a valid timestamp on every row. The
  acquisition report marks incomplete or contradictory source coverage invalid
  and leaves the affected rate null.
- Keep the public claim boundary: local tests prove construction and privacy filtering; they do not prove live delivery, traffic, downloads, retention, or revenue.
- Every indexable route must be 200, self-canonical, useful, and free of broken internal links before it is retained in the sitemap.
- Run `npm run content:quality` and `npm run public:language` before publishing content or metadata changes; a pass proves source hygiene only.

## Target-setting rule

No absolute traffic, download, retention, or revenue target is set in this
snapshot because Search Console, EU Mixpanel readback, App Store Connect, and
live app-analytics exports are not available in this development lane. Once the
baseline is authorized, set a numeric target from the trailing 28-day baseline
and predeclare the exposure window, minimum sample, primary KPI, and rollback
path for each experiment. A candidate is only a winner when the primary KPI
improves without a guardrail regression.

## Hosting decision

The site remains on its existing DigitalOcean App Platform static-site path.
The repository configuration already owns `jacked.coach`, `www` aliasing,
redirects, TLS, and the `gh-pages` static output. DigitalOcean's current
first-party pricing gives static sites a free tier for up to three apps with a
1 GiB outbound allowance per app; ChatGPT Sites is currently described as
usage-limited by plan rather than as a separately priced hosting service, and
there is no existing Surpass Sites project in this workspace. Moving now would
add custom-domain, DNS, redirect, deployment-lineage, and measurement risk
without evidence of lower cost or better commercial performance. Revisit only
after the actual DigitalOcean invoice and outbound-traffic baseline are
available, or if an Atlas deployment can document equivalent TLS/CDN,
redirects, uptime monitoring, rollback, and analytics continuity at lower
marginal cost.

## Required inputs and commands

1. Run `node scripts/search-console-export.mjs --ranges max,90d,28d` with a read-only Search Console credential; see [Search Console setup](../search-console-setup.md).
2. Export aggregate EU Mixpanel web events with event names and the bounded properties in [the web taxonomy](../analytics/event-taxonomy.md); do not export raw form or workout data.
3. Export campaign-linked App Store Connect data for the same date range.
4. Export the native app event stream with the app-scoped `installation_id`, ephemeral process-scoped `app_session_id` when session diagnostics are needed, app version/build, event time, and only the bounded properties in [the measurement specification](../analytics/measurement-specification.md). Web events must include the ephemeral `session_id`; the acquisition report returns experiment-ready CTA segments, onboarding-path activation rows, release rows, and maturity-aware return cohorts. Never use `app_session_id` as a person or cohort identity.
5. Run `npm run acquisition:report` and record source status before interpreting any funnel rate.
6. Run `npm run public:brand` against the canonical domain before calling a rebrand or conversion change live; a stale-brand or non-200 result is a release blocker.
7. Run `npm run public:brand:crawl` against the canonical sitemap after content, template, or brand changes; every sitemap URL must return HTTP 200 with visible Surpass branding and no stale visible Jacked product copy.
8. Run `npm run public:conversion` against the canonical homepage after a mobile CTA or experiment change; it must confirm the recovery dock is hidden before hydration, carries its experiment marker, and has an explicit high-contrast label rule.
9. Run `npm run growth:gate` to execute the release and measurement checks together. It writes `reports/acquisition/growth-gate-latest.json`, keeps public release blockers separate from missing analytics sources, and exits non-zero until both layers are ready.

## Current evidence status

- Verification refresh (2026-08-15T20:05Z): the canonical public site still
  passes the Surpass brand crawl for 317/317 sitemap URLs, with zero stale
  visible-brand findings or non-200 responses; the technical SEO audit covers
  329 discovered URLs and 326 audited HTML/XML URLs with zero blocked pages,
  broken internal links, or sitemap noindex conflicts. The available
  dependency-free source contracts also pass for acquisition landing pages,
  SEO structure, CTA handoffs, tools, TikTok, proof, and growth-gate logic.
  The standalone web-analytics utility probe remains environment-blocked by
  the absent `react` package, and no provider traffic or conversion result is
  inferred from that failure.

- Measurement refresh (2026-08-15T20:02Z): `node
  scripts/acquisition-report.mjs` remains correctly `blocked` with null funnel
  values because Search Console, web analytics, App Store Connect, and native
  app exports are absent. A read-only Mixpanel connector probe returned an
  unavailable backend tool rather than project data; no event query or
  mutation was attempted. The public App Store check still reports version
  4.0.2 with stale release-note branding, a repeated subtitle opening, and
  the retired onboarding promise, while candidate 4.0.3 is not public.

- Rebrand-safe measurement namespace (2026-08-15T19:10Z): the canonical web
  attribution/session keys now use the `surpass:` namespace and the canonical
  UI error event is `surpass:web-error-visible`. Existing `jacked:` keys are
  read once, copied to the canonical key, and blanked so anonymous attribution
  and session continuity survive the migration. `node app/webAnalytics.test.mjs`,
  layout analytics, homepage product-truth, syntax, and diff checks pass. This
  is current-source evidence pending the next verified site publication.

- Fresh public release readback (2026-08-15T19:10Z): public brand, homepage
  conversion, and the full 317/317 sitemap brand crawl pass with zero stale
  visible-brand or non-200 findings. The read-only App Store provider reports
  candidate `4.0.3` as `IN_REVIEW` and public `4.0.2` as `READY_FOR_SALE`; all
  four English public locales still have the stale Jacked note, repeated
  subtitle opening, and retired onboarding promise. No public propagation or
  commercial result is inferred.

- Current cross-surface readback (2026-08-15T18:55Z): the current-source
  native `JackedTests` bundle reports 2,137 tests passed and zero failures on
  the iPhone 17 iOS 26.2 simulator. The canonical homepage returns HTTP 200,
  contains 77 visible `Surpass` references and no visible `Jacked` references,
  and the live sitemap contains 317 URLs. These are local regression and
  public-delivery checks only; they do not prove physical-device behaviour,
  rankings, traffic, installs, activation, retention, or revenue.

- App Store propagation readback (2026-08-15T18:54Z): the read-only provider
  result reports candidate `4.0.3` as `IN_REVIEW` with clean candidate
  metadata, while public `4.0.2` remains `READY_FOR_SALE` and still carries
  stale Jacked/repeated-subtitle/retired-onboarding copy in all four English
  locales. Public propagation therefore remains an owner-controlled release
  gate; no public-store conversion result is inferred.

- Privacy-safe measurement hardening (2026-08-15T17:54Z): the local web
  analytics bootstrap now disables automatic pageviews and autocapture,
  persistent identity and cookies, client-IP enrichment, automatic referrer
  and Google storage, and raw current/referrer URL properties. Explicit site
  session and CTA events remain bounded and session-scoped. The focused
  analytics checks, full `npm test`, and a 400/400 static export pass. This is
  the construction record; publication was subsequently verified below.

- Live measurement hardening (2026-08-15T18:00Z): `gh-pages` commit
  `e15d3c903` reached ACTIVE as DigitalOcean deployment
  `8d948148-063c-441f-a3cb-83ec20468019`. Live homepage and privacy-page
  readback found the session-only Mixpanel configuration and the updated
  disclosure/date, with no old bootstrap or privacy wording. This proves
  public configuration delivery and privacy-boundary intent only; provider
  readback, traffic, conversion, and revenue results remain unavailable.

- Alternate analytics probe (2026-08-15T17:54Z): the accessible PostHog
  project schema contained no Surpass canonical acquisition events, so it is
  not used as a baseline source. This avoids treating an unrelated or
  incomplete event stream as zero Surpass traffic.

- Live growth gate refresh (2026-08-15T17:47Z): public Surpass brand,
  homepage conversion, 317/317 sitemap crawl, and 329-discovered/326-audited
  SEO checks pass. The public App Store check remains blocked on the stale
  4.0.2 storefront metadata, while Search Console, web analytics, App Store
  Connect, and native app analytics exports remain unavailable. Funnel
  metrics remain null rather than zero; no commercial outcome is inferred.

- Current-source native test readback (2026-08-15T17:39Z): the completed
  focused `JackedTests` result bundle reports `result=unknown`, zero executed
  tests, and no test nodes because the simulator build stopped in
  `CasePathsMacros` while resolving `SwiftDiagnostics`. The failed, inactive
  DerivedData tree was removed after an open-handle check, recovering about
  974 MB; the current build tree and simulator were preserved. Native runtime
  evidence remains unavailable, so no activation, retention, or commercial
  outcome is inferred.

- Combined growth gate refresh (2026-08-15T17:26Z): public site brand,
  conversion, 317/317 sitemap crawl, and 329-discovered/326-audited SEO
  checks pass. The live App Store check remains blocked on public version
  4.0.2, while Search Console, web analytics, App Store Connect exports, and
  app analytics remain unavailable. Funnel metrics are therefore null rather
  than zero; no commercial outcome is inferred.

- Measurement access probe (2026-08-15T17:30Z): the bundled Mixpanel client
  imports, but project `3995480` returns `ConfigError: No account configured`.
  No event/property/user query or mutation was attempted. Treat the missing EU
  web source as an access/configuration gate, not zero traffic; the funnel
  remains null until a region-matched read-only export is available.

- App Store candidate metadata repair (2026-08-15T17:17Z): the checked-in
  Surpass descriptions were applied to all four localizations of candidate
  `4.0.3` in App Store Connect through a metadata-only update. The fresh
  provider readback passes with no field mismatches, stale-brand strings,
  repeated-subtitle opening, or retired onboarding promise. The candidate is
  still `WAITING_FOR_REVIEW`; the public storefront remains 4.0.2 and its
  public App Store check still fails on the older Jacked release note,
  repeated-subtitle opening, and retired onboarding copy. This repairs the
  pending candidate but proves neither public propagation nor store conversion.
  A metadata-only attempt to repair those 4.0.2 fields was rejected because
  App Store Connect does not allow them to be edited in the `READY_FOR_SALE`
  state; no public-version mutation occurred.

- Homepage CTA assignment race repair (2026-08-15T16:49Z): the browser
  analytics observer no longer marks a server-rendered experiment CTA as
  observed while `data-experiment-ready="false"`; the assignment-attribute
  mutation triggers a fresh viewport observation. `npm test` passed, the
  static export generated 400/400 routes, `gh-pages` commit `8e684a26` reached
  ACTIVE as DigitalOcean deployment `e22ed9c5-814f-4571-9660-55d08ff211c4`,
  and live bundle checks found the readiness guard and attribute observer.
  Post-deploy public brand and conversion checks passed; the full 317/317
  sitemap crawl and 329-discovered/326-audited technical SEO check passed with
  zero stale visible-brand findings, non-200s, blocked pages, broken internal
  links, or sitemap-noindex conflicts. This repairs experiment denominator
  quality and public delivery; it does not prove CTA lift, traffic, downloads,
  activation, retention, or revenue.

- Live mobile conversion path readback (2026-08-15T16:59Z): at a 390x844
  viewport the homepage hero heading and primary App Store CTA remain visible
  before the prepared-session image, the document has no horizontal overflow,
  and the recovery dock is hidden at the top of the page. After the hero leaves
  the viewport, the dock becomes visible with `aria-hidden="false"`, a 68px
  height, and the `Start free` handoff. This verifies responsive delivery and
  recovery-CTA state from live DOM geometry; it does not prove visual polish,
  CTA lift, traffic, downloads, activation, retention, or revenue.

- Automatic TikTok handoff context repair (2026-08-15T17:09Z): the direct
  `/tiktok/app-store` handoff now carries the shared web schema, canonical page
  context, ephemeral session ID, sanitized first/last-touch attribution,
  viewport class, origin-only referrer domain, and bounded landing/copy
  markers. `npm test` passed, the static export generated 400/400 routes,
  `gh-pages` commit `847c7e3` reached ACTIVE as DigitalOcean deployment
  `ffa7fff9-be3e-4119-a19b-d05aff32942b`, and live bundle checks found the
  direct-handoff markers. The route returned HTTP 200 with Surpass branding;
  public conversion passed; the 317/317 sitemap crawl and 329-discovered /
  326-audited technical SEO check passed with zero stale-brand findings,
  non-200s, blocked pages, broken internal links, or sitemap-noindex conflicts.
  This repairs campaign measurement continuity and public delivery; it does
  not prove TikTok traffic, App Store conversion, downloads, activation,
  retention, or revenue.

- Import compatibility authority guide publication (2026-08-15T16:19Z): the
  static export generated 400/400 routes, including the new
  `/import-workout-history` guide with self-canonical metadata, one H1,
  FAQ/WebPage/Breadcrumb structured data, and the dedicated
  `seo_import_workout_history` campaign. Publication commit `8fdafae73`
  reached ACTIVE as DigitalOcean deployment
  `b7eb8c18-8942-4416-a692-9ef3771e319e`. The live guide, homepage, and sitemap
  returned HTTP 200; the guide is present in the 317-URL sitemap and linked
  from the homepage. Public brand checks passed with zero stale visible-brand
  findings; the full 317/317 sitemap crawl passed with zero failures or
  non-200 responses; and the technical audit covered 329 discovered URLs,
  326 HTML/XML pages, and 3 assets with zero blocked pages, broken internal
  links, or sitemap/noindex conflicts. This proves evidence-backed content
  delivery and crawl hygiene, not ranking, organic traffic, installs, App
  Store conversion, retention, or revenue lift.
- Unified growth-gate refresh (2026-08-15T16:32Z): the live release checks
  pass public Surpass branding, the homepage conversion contract, the full
  sitemap crawl, and technical SEO. The gate remains blocked by the public
  App Store 4.0.2 current-version note containing the retired Jacked name and
  repeating the subtitle as the description opening; the readback also flags
  the retired Quick Start/four-question onboarding promise. The measurement
  layer remains blocked because Search Console, web analytics, App Store
  Connect, and native app analytics exports are unavailable; funnel outcomes
  remain `null`, not zero. See the machine-readable
  [latest gate report](../../reports/acquisition/growth-gate-latest.json).
- App Store candidate consistency readback (2026-08-15T16:34Z): the provider
  version matches the checked-in `4.0.3` candidate, but all four provider
  description fields differ from the local packet and retain the retired
  Quick Start/four-question promise. The candidate remains
  `WAITING_FOR_REVIEW` / `AFTER_APPROVAL`; no provider mutation was made.
  This is release-copy drift evidence, not App Store conversion or download
  evidence.
- Native candidate compile evidence (2026-08-15 14:15 local): an isolated
  simulator build from the current native source produced an arm64 app bundle
  whose display name is `Surpass` and whose version/build is `4.0.3 (121)`;
  the compiler emitted warnings but no Swift errors. The wrapper lost the
  underlying `xcodebuild` exit code after completion because it reused zsh's
  read-only `status` variable, so this is artifact-level compile evidence,
  not a clean command-exit claim. A separately started onboarding UI-test run
  logged a successful build phase but no inspectable test-result bundle was
  available. Released behavior, physical-device proof, App Store propagation,
  and commercial outcomes remain unverified.
- Hypertrophy-intent acquisition page (2026-08-15 local): added
  `/hypertrophy-app` with a dedicated `seo_hypertrophy_app` App Store campaign,
  product-screen proof, WebPage/Breadcrumb/FAQ schema through the shared
  landing template, internal links from the homepage and footer, and both
  sitemap routes. This expands qualified discovery and gives the intent its own
  measurement boundary; it proves source construction only, not ranking,
  traffic, installs, conversion, or revenue lift.
- Hypertrophy-intent publication (2026-08-15T13:33Z): static commit `c4c278acb`
  reached ACTIVE as DigitalOcean deployment
  `83739aa8-4bfa-443f-ad9f-dc079437cf91`. Live `/hypertrophy-app` returns 200,
  exposes self-canonical metadata, visible Surpass branding, FAQ schema, and
  the `seo_hypertrophy_app` campaign. The cache-busted full public crawl
  checked 316/316 sitemap URLs with zero failures, stale-brand findings, or
  non-200 responses; the technical audit covered 325 URLs plus 3 assets with
  zero blocked pages, broken links, or sitemap/noindex conflicts. This proves
  delivery and crawl hygiene, not rankings, traffic, installs, conversion, or
  revenue lift.
- Hypertrophy authority reinforcement (2026-08-15T13:49Z): the best-workout-
  app, best-hypertrophy-app-for-iOS, and auto-progression articles now link to
  `/hypertrophy-app` with contextual product language. Static export generated
  399/399 routes; publication commit `34b630075` reached ACTIVE as DigitalOcean
  deployment `5c245085-b3bb-40b6-9e54-0dbfb3958bfb`; live checks found all
  three links. The full 316-URL brand crawl, 325-URL technical SEO audit, and
  homepage conversion contract passed with zero failures. This proves internal
  discovery delivery and crawl hygiene, not ranking, traffic, conversion, or
  revenue lift.
- Unified growth-gate refresh (2026-08-15T13:51Z): the live release layer now
  passes public Surpass branding, homepage conversion, the 316-URL brand crawl,
  and the 325-URL technical SEO audit. The gate remains blocked only on the
  public 4.0.2 App Store metadata defect and missing authorized Search Console,
  web analytics, App Store Connect, and native app analytics sources; all
  outcome fields remain `null`, not zero. See the machine-readable
  [latest gate report](../../reports/acquisition/growth-gate-latest.json).
- Public delivery verification (2026-08-15T12:55Z): the local static export
  published `gh-pages` commit `677bfe97a` and DigitalOcean deployment
  `dfc8c3df-09d5-4a1e-864a-4332f17d0558` reached `ACTIVE`. The homepage
  conversion gate now passes its experiment-readiness and hidden-mobile-dock
  checks; the public brand crawl checked 315 sitemap URLs with zero stale-brand
  or non-200 results. The technical audit checked 315 sitemap URLs and 324
  HTML/XML URLs plus 3 assets, with zero broken internal links or sitemap
  noindex violations. The public App Store listing remains the sole release
  blocker: it is still 4.0.2 with the retired-brand current note and repeated
  subtitle opening. The acquisition report remains blocked by missing
  authorized exports, so traffic, conversion, activation, retention, and
  revenue remain unknown rather than zero.
- Canonical SEO repair (2026-08-15T12:54Z): three missing legacy article
  targets now resolve through DigitalOcean 301 rules to existing canonical
  pages, and the source links point directly at those canonical slugs. Direct
  checks returned 301 for all three legacy paths and 200 for all three targets;
  this repairs crawl and reader recovery without claiming ranking or traffic
  improvement.
- Methodology authority asset (2026-08-15 local): `/methodology` now explains
  next-set guidance, e1RM context, RIR/RPE, weekly hard sets, assumptions, and
  the privacy boundary in a crawlable page with visible FAQs, `WebPage`,
  `BreadcrumbList`, and `FAQPage` structured data. It is linked from the tools
  hub and sitewide footer and included in both sitemap routes. `npm test`, the
  production build (398/398 static routes), and local HTTP smoke checks pass.
  This creates a stronger trust and internal-discovery surface; it does not
  prove rankings, backlinks, traffic, App Store conversion, or revenue lift
  until public propagation and source-backed measurement are available.
- Local conversion/SEO refinement (2026-08-15T11:47Z): homepage visible FAQ
  answers now emit matching page-level `FAQPage` structured data; the shared
  acquisition landing CTA uses the existing download icon component, and its
  mobile recovery dock is removed from layout and accessibility before
  hydration with an explicit high-contrast label rule. Targeted source checks,
  the full `npm test`, the production build, and 397/397 static route
  generation pass. This is local construction and crawl-readiness evidence,
  not a ranking, traffic, App Store, or conversion-lift claim.
- Fresh unified gate readback (2026-08-15T11:46Z): the public brand check
  passes 8/8 representative routes, the 322/322 sitemap brand crawl passes,
  and the technical SEO audit covers 322 HTML/XML URLs plus 3 assets with
  zero blocked pages, broken internal links, or sitemap noindex violations.
  The public conversion gate still sees the older homepage bundle, the public
  App Store listing remains version 4.0.2 with stale current-note/description
  copy, and the acquisition report remains blocked because Search Console,
  web analytics, App Store Connect, and native app exports are unavailable.
  Funnel values remain `null`, not zero; the live gate report is
  [growth-gate-latest.json](../../reports/acquisition/growth-gate-latest.json).
- Local measurement-integrity change (2026-08-15T11:33Z): App Store outbound clicks now remain navigable during pre-hydration, but the analytics handler does not count them until the homepage experiment assignment is ready. This prevents a server-rendered control-arm default from contaminating experiment denominators; it reduces early event volume rather than fabricating an assignment. `node app/webAnalytics.test.mjs` passes, while live event delivery and cohort impact remain unverified.
- Mixpanel baseline access attempt (2026-08-15T11:33Z): no local Mixpanel account, OAuth bridge, or environment credentials were available, and the exposed connector endpoint was not callable from this session. No live event, activation, retention, or conversion values were inferred; the existing CSV/export contract remains the next authorized input.
- Unified growth-gate refresh (2026-08-15T11:33Z): `npm run growth:gate` checked the public brand, homepage conversion contract, App Store listing, all 322 sitemap URLs, technical SEO, and the acquisition report. Brand, full crawl, and technical SEO passed: 322/322 public pages were HTTP 200 with no stale visible Jacked branding, and the SEO audit covered 322 HTML/XML URLs plus 3 assets with zero blocked pages, broken internal links, or sitemap noindex violations. The release layer remains **blocked** by the live homepage serving the older conversion bundle and the public App Store listing still exposing version 4.0.2's stale current note and repeated subtitle opening. The measurement layer remains **blocked** because Search Console, web analytics, App Store Connect exports, and native app analytics are unavailable; funnel values remain `null`, not zero. The machine-readable report is [growth-gate-latest.json](../../reports/acquisition/growth-gate-latest.json). This is operational readiness evidence, not traffic, download, retention, or revenue lift.
- Fresh local/read-only gate refresh (2026-08-15T10:47Z): `npm run public:brand`
  passes all eight representative routes. `npm run public:conversion` still
  fails the four stale-public-bundle checks for hero experiment readiness,
  hidden-before-hydration mobile-dock state, the pre-hydration display guard,
  and dock-label contrast. `npm run public:app-store` still returns public
  version 4.0.2 with the retired-brand current note and repeated description
  opening. `npm run acquisition:report` remains **blocked** with all funnel
  outcomes `null`, and its new web-to-App Store campaign-continuity diagnostic
  is explicitly unavailable until both bounded web events and a campaign-
  linked App Store Connect export are supplied. The provider's 4.0.3 review
  state remains separate from public propagation.
- Fresh acquisition report refresh (2026-08-15T11:11Z): status remains
  **blocked** because Search Console is blocked and web analytics, App Store
  Connect, and native app exports are missing. Funnel outcomes remain `null`,
  and the campaign-continuity diagnostic remains unavailable; no traffic,
  store conversion, activation, retention, or revenue outcome is inferred.
- Fresh technical SEO readback (2026-08-15T11:11Z): `npm run seo:audit`
  audited 322 HTML/XML URLs and fetched 3 non-HTML assets (325 discovered URLs
  total, including all 322 sitemap URLs), with zero blocked pages, broken
  internal links, or sitemap noindex violations. This confirms crawl hygiene
  for the checked public state, not rankings, traffic, or conversion.
- Fresh provider readback (2026-08-15T10:50Z) remains read-only and reports
  version 4.0.3/build 121 as `WAITING_FOR_REVIEW` with `AFTER_APPROVAL`; all
  four current English localizations pass the stale-brand and repeated-opening
  checks. This confirms provider state only; the public listing remains the
  separately checked 4.0.2 storefront.
- Fresh mutable-state readback (2026-08-15T10:35Z): `npm run public:brand`
  passes all eight representative routes, `npm run seo:audit` checks 325
  discovered URLs with zero blocked pages, broken internal links, or sitemap
  noindex violations, and the acquisition report remains **blocked** because
  Search Console, web analytics, App Store Connect exports, and native app
  analytics are unavailable. The public conversion gate still fails its four
  stale-bundle checks, while the public App Store gate still finds version
  4.0.2 with the retired-brand current note and repeated description opening.
  A read-only App Store Connect readback now reports provider version 4.0.3 as
  `WAITING_FOR_REVIEW`; that review state is not public propagation.
- Fresh live gate readback (2026-08-15T09:58Z) keeps the public state split:
  `npm run seo:audit` audited 325 discovered URLs, including all 322 sitemap
  URLs, with zero blocked pages, broken internal links, or sitemap noindex
  violations; `npm run acquisition:report` remains **blocked** with Search
  Console blocked and web, App Store Connect, and native app exports missing,
  so every funnel outcome is `null`, not zero. The public conversion gate still
  fails on the four stale-bundle mobile/experiment checks, and the public
  App Store gate still finds version 4.0.2 with the retired-brand current note
  and repeated subtitle/description opening. Local source/build checks remain
  separate from public propagation.
- Public release verification (2026-08-15T00:28Z) passed after deployment `28d09192-f756-474d-b483-127eb015acf7` from `gh-pages` commit `6e700c42`: the canonical sitemap returned HTTP 200 with 322 URLs, and the reusable full sitemap crawl checked all 322 URLs with zero failures, zero non-200 responses, and zero stale visible-brand findings. Six merged article slugs are absent from discovery surfaces while their legacy URLs return permanent 301s to the canonical pages. This proves public rendering, redirect hygiene, and deployment lineage, not traffic, ranking, conversion, or revenue.
- Fresh technical SEO crawl (2026-08-15T00:27Z) audited 325 discovered URLs, including all 322 sitemap URLs: zero fetch blocks, broken internal links, or sitemap noindex violations. The updated audit keeps redirect chains distinct from canonical merges; this run encountered none because the legacy routes are no longer in the discovery graph. This proves crawl/indexability hygiene for the audited state, not search demand, rankings, or traffic.
- SEO internal-link coverage verification (2026-08-15T00:35Z) passed after deployment `bf792e79-19a5-46d3-8058-7f5b4f9e84b7` from `gh-pages` commit `4257e278`: live `/blog` HTML exposes 256 unique canonical article links, and the technical inventory reports zero zero-inbound canonical articles, minimum inbound links of 1, and median inbound links of 4. This proves internal discovery coverage, not ranking, organic traffic, or conversion lift; Search Console remains required.
- The current public App Store destination is Surpass. This confirms the public handoff target, not downloads, conversion, or revenue; those remain App Store Connect evidence gates.
- Read-only App Store Connect metadata readback (2026-08-15T08:11Z) reports iOS
  version 4.0.3 in PREPARE_FOR_SUBMISSION with release type AFTER_APPROVAL; all
  four current English provider localizations pass the stale-brand and repeated
  description checks. This confirms provider preparation, not public
  propagation, campaign, download, activation, retention, or revenue outcomes.
- Fresh read-only storefront QA (2026-08-15T08:12Z) still finds public version
  4.0.2 and two ASO trust defects outside the site crawl: the live “What’s New”
  note contains the retired “Jacked is now Surpass” sentence, and the live
  description repeats its lead promise. No public listing change is claimed.
- Credential-free local handoff verification (2026-08-15T08:16Z) passed for
  native candidate 4.0.3 (build 121) across `en-AU`, `en-CA`, `en-GB`, and
  `en-US`, with per-field SHA-256 fingerprints, no retired-brand copy in visible
  fields, distinct description openings, and a four-set screenshot manifest
  covering 12 PNG assets with store-valid dimensions and per-file SHA-256
  fingerprints. The provider-prepared state now agrees with this candidate;
  submission, review, public propagation, and outcome exports remain external
  gates.
- A repeatable `npm run public:app-store` gate now checks the public listing’s HTTP status, canonical URL, Surpass identity, current version note, and subtitle/description duplication. It intentionally ignores older version-history notes, so the current stale App Store copy remains a visible release blocker until the prepared metadata is publicly propagated.
- Fresh public App Store gate readback (2026-08-15T10:35Z) returned HTTP 200 for the Surpass listing but failed the two intended checks described above. The provider 4.0.3/build-121 candidate is now `WAITING_FOR_REVIEW`; public propagation and fresh storefront verification remain pending, and no provider mutation was performed in this lane.
- The website now emits privacy-safe `web_vital_measured` events for observed LCP, CLS, and INP values when a page is hidden or navigated away; local tests pass, but EU Mixpanel field readback is still blocked.
- The homepage hero now has a local stable 50/50 `homepage_hero_cta` assignment between `control` and `outcome_v1`; its CTA waits for assignment before exposure, carries the matching App Store campaign, and remains measured as a candidate until the EU event export is available. No public treatment exposure or lift is claimed.
- The published site now carries `acquisition_hero_cta` / `outcome_v1` markers on the shared SEO-landing hero CTA and the `Start free on iPhone` promise; the static export compiled all 397 routes and the live cache-busted homepage renders the new candidate. This proves implementation and public delivery, not CTA lift.
- Article claim/CTA repair (2026-08-15T01:06Z): `gh-pages` commit `9895054b` reached ACTIVE as DigitalOcean deployment `a2927cd5-1943-4010-88bf-6e2063cb0a90`. The live progressive-overload article now uses `Start free on iPhone`, exposes `blog_progression_final`, and has zero retired-trial or generic-listing hits; `npm run public:brand:crawl` checked 322 sitemap URLs with zero failures, non-200 responses, or stale visible-brand findings. This proves delivery and claim hygiene, not traffic, conversion lift, or revenue.
- Tool-result handoff candidate (2026-08-15T01:26Z): `gh-pages` commit `94e77038` reached ACTIVE as DigitalOcean deployment `29f22c1f-62e4-46f0-b64c-285b653847d8`. The next-set result card now presents one result-header `Start free on iPhone` CTA with `next_set_calculator_result`, `tool_result_handoff=outcome_v1`, and `tool_completion_state=preview|completed`; the tools hub and final tool CTA use the same outcome-led copy with `tools_hub_final` / `tools_*_final` placements. Live interaction verified the state transition after Calculate. The 325-URL SEO audit and 322-URL public brand crawl pass with zero failures. This proves delivery and denominator-safe instrumentation, not conversion lift.
- Article inline CTA consistency candidate (2026-08-15T01:39Z): `gh-pages` commit `ff72318c` reached ACTIVE as DigitalOcean deployment `2c7a7a12-0827-4137-812d-ea0b9f73af45`. The source replaced legacy plain-text `Download now` prompts in 219 articles with a shared `Make the next set obvious` handoff; live article markup carries the article-specific `blog_nutrition_inline` campaign plus `article_inline_cta` / `outcome_v1`. `npm test` passed, the static export generated 397/397 routes, the 322-URL public brand crawl passed with zero failures or stale visible-brand findings, and the 325-URL SEO audit passed with zero blocked pages, broken internal links, or sitemap noindex violations. This proves delivery and measurement construction, not organic traffic, App Store conversion, or revenue lift.
- Homepage lower-funnel CTA consistency candidate (2026-08-15T01:48Z): `gh-pages` commit `e644cab9` reached ACTIVE as DigitalOcean deployment `f3a65687-4ccc-4e94-a8b7-c3f0e5ae57bb`. The live homepage now aligns the download panel, final CTA, and mobile dock with `Start free on iPhone`, tags the lower surfaces `homepage_lower_cta` / `outcome_v1`, and uses `surpass_coach_home_hero_control` for the hero control. Fresh screenshots `23-homepage-mobile-after.png` and `24-homepage-desktop-after.png` were inspected at 390px and desktop; the live homepage returned HTTP 200, and the 322-URL public brand crawl plus 325-URL SEO audit passed with zero failures, stale visible-brand findings, blocked pages, broken internal links, or sitemap noindex violations. This proves delivery and measurement construction, not CTA lift.
- Fresh homepage funnel audit (2026-08-15T08:33Z) found the public 390px homepage still exposes the mobile dock while the hero CTA is visible, and the live dock label is muted by an overly broad span rule. The local source candidate now scopes dock copy, restores high-contrast button text, adds a destination label, and guards hidden state with `aria-hidden=true`; the local production build and 397/397 route generation pass. This is a local conversion-quality repair; public propagation and CTA lift remain unverified.
- Fresh live acquisition gates (2026-08-15T08:47Z) pass the public brand check on eight representative routes, the full 322/322 sitemap brand crawl, and the 325-URL technical SEO audit with zero failures, blocked pages, broken internal links, or sitemap noindex violations. The acquisition report remains `blocked` with Search Console blocked and web, App Store Connect, and app analytics exports missing; funnel outcomes remain `null`, not zero.
- Fresh mobile homepage audit (2026-08-15T09:28Z) captured the public 390px entry state and found the recovery dock visible while the hero CTA remained in view, with a low-contrast public dock label. The local source already includes the hidden-before-hydration and `#11100c` label rules; `npm run public:conversion` now makes those rules a public release gate. This is a current public rendering defect and a local guardrail, not a conversion-lift claim.
- Fresh gate readback (2026-08-15T09:29Z) passes the representative public brand check (8/8 HTTP 200, visible Surpass, no stale visible Jacked) but keeps the public conversion gate blocked on the four mobile/experiment defects above and the public App Store gate blocked on the two 4.0.2 storefront defects. The acquisition report remains `blocked`; Search Console is blocked and web, App Store Connect, and app analytics exports are missing, so funnel outcomes remain `null`, not zero.
- Blog-hub CTA candidate (2026-08-15T08:47Z): the hero and mid-library handoffs now use `Start free on iPhone`, explicit `blog_hub_hero` / `blog_hub_mid` placements, and `blog_hub_cta` / `outcome_v1` markers. Full source tests pass and the production build emits both markers in the generated `/blog` HTML. This is local construction evidence; the current public bundle and conversion baseline remain unchanged until an authorized deployment and provider readback.
- High-intent acquisition copy candidate (2026-08-15 local): the six dedicated workout and competitor landing pages now use the same outcome-led `Start free on iPhone` final handoff as their hero and mobile-dock CTAs. The SEO cluster also gained contextual RP-alternatives links in the refreshed supersets and myo-reps articles; the full source suite and production build pass, with all 397 routes generated and local SSR output carrying the conversion readiness, hidden-dock, and high-contrast label guards. This improves message continuity and internal discovery construction, not ranking, traffic, App Store conversion, or revenue lift; deployment remains owner-gated.
- Weekly Review recovery reporting candidate (2026-08-15 local): the acquisition report now consumes `weekly_review_surface_mounted` and `weekly_review_open_today`, segments `empty|populated` states, links only strictly later `workout_started` rows, and fails closed on invalid state or missing identity/time. Fixture calculations and syntax checks pass; no live app export is available, so no recovery or retention outcome is claimed.
- App Store handoff measurement candidate (2026-08-15 local): the acquisition report now accepts complete aggregate product-page-view and download fields, emits product-page-to-download rate overall and by bounded campaign, and returns explicit missing/incomplete quality states. Fixture calculations pass; no campaign-linked App Store Connect export is available, so no store conversion, download, activation, or revenue outcome is claimed.
- Acquisition-page product-screen hero candidate (2026-08-15T02:07Z): `gh-pages` commit `b62b4a65` reached ACTIVE as DigitalOcean deployment `b019cb99-3308-400c-8c9c-d6984b9267a1`. `/workout-tracker/` now presents `surpass-build-home.png` and `/progressive-overload/` presents `surpass-progress.png` in the hero while preserving the SEO copy, campaign tokens, and `acquisition_hero_cta` / `outcome_v1` CTA marker. The bounded `hero_presentation=screen` property is carried into CTA events and acquisition-report segments. Fresh desktop and 390px screenshots were inspected; the 322-URL public brand crawl and 325-URL SEO audit passed. This proves product proof delivery and measurement construction, not conversion lift.
- A fresh 390px live audit found the global desktop header wrapping and clipping the mobile install control on `/workout-tracker/`. The published candidate now replaces that with a compact mobile `Start free` CTA, an accessible menu containing all primary routes, `data-nav-section` navigation markers, and the distinct Apple campaign `surpass_coach_mobile`; the post-deploy public checks pass. This proves the layout repair is delivered, not that mobile conversion improved.
- A local editorial pass removed mixed-script artifacts from 24 published article sources, including a full rewrite of the all-Chinese Mike Mentzer article in place so its URL is preserved. `npm run content:quality` passed for 262 articles and `npm run public:language` passed for 343 files. This proves source quality only; it does not prove live rendering, indexing, rankings, or conversion.
- The full sitemap crawl exposed nine indexed 1RM pages that rendered the internal `jacked` formula token and two articles with ambiguous old-brand wording. The source now presents `Surpass average`, preserves the legacy calculator input alias, and uses brand-neutral article copy; the post-deploy 328-URL crawl passes with zero stale visible-brand findings.
- Native local verification: the `JackedTests` scheme compiled the current dirty source and executed 232 selected XCTest cases on the booted iPhone 17 simulator (`AnalyticsEventsTests` 26/26, `OnboardingFeatureTests` 15/15, `SettingsFeatureTests` 22/22, `FrameCheckFeatureTests` 17/17, `HevyImportFeatureTests` 40/40, `AppFeatureTests` 29/29, `HomeFeatureTests` 46/46, `PaywallFeatureTests` 19/19, `QuickStartPersonalizationTests` 16/16, and two focused `TrainFeatureTests`, zero failures). This proves local event/onboarding/settings/feature contracts and compilation, not live analytics delivery or retention.
- Most recent native commerce verification (2026-08-15 local): the current source build succeeded and 58 focused tests passed on the iPhone 17 simulator (`AnalyticsEventsTests` 35/35 and `PaywallFeatureTests` 23/23, zero failures). This proves bounded commerce event construction, privacy contracts, and paywall behavior locally; it does not prove live delivery, App Store conversion, subscriptions, or revenue.
- Native first-workout handoff candidate (2026-08-15 local): the current `Jacked` app target build succeeded for the iPhone 17 / iOS 26.2 simulator after extending the guarded handoff to recommended, custom, and imported onboarding paths. Focused simulator execution passed 226/226 tests across AppFeature, OnboardingFeature, TrainFeature, AnalyticsEvents, and Paywall coverage with zero failures. This proves local source and simulator contracts; it does not prove live runtime accessibility, activation, retention, App Store conversion, or revenue.
- The acquisition report now produces maturity-aware 1-day, 7-day, and 30-day return-to-training cohorts plus an activation-cohort next-session handoff diagnostic that joins preview exposure, explicit intent, and the later scheduled start. Its fixture suite passes, including an immature-cohort case that remains unknown rather than being counted as churn. This proves report logic only; no live app export is available.
- Acquisition landing SEO/performance candidate (2026-08-15): the shared
  template now emits page-level WebPage, BreadcrumbList, and FAQPage JSON-LD
  with an explicit canonical path and preloads the fixed hero proof image.
  `npm test` passed, the static export generated 397/397 routes, and live
  `/workout-tracker/` exposes the schema and preload. This proves crawl and
  delivery hygiene, not Search Console ranking or traffic lift.
- Homepage hero delivery candidate (2026-08-15): the homepage now preloads the
  fixed hero photo and carries `data-hero-presentation="photo"` on the
  controlled hero CTA. Live smoke verification confirms both markers. This
  proves public delivery and measurement construction, not field performance,
  traffic, conversion, or revenue lift.
- Web outbound-event quality repair (2026-08-15): the canonical App Store click
  event now deduplicates by normalized page-view key, CTA placement, and campaign
  for the browser session; attribution-only query changes do not create a second
  key. `node app/webAnalytics.test.mjs` and the full `npm test` suite pass;
  `gh-pages` commit `c6a595069` reached ACTIVE as DigitalOcean deployment
  `f51ad938-1727-4ad6-a394-567a9a011c3c`, and live bundle smoke verification
  found the canonical outbound/CTA event strings. The 322-URL brand crawl and
  325-URL SEO audit pass. This improves event quality; it does not prove a
  conversion or revenue lift.
- Web session-boundary repair (2026-08-15T05:33Z): ephemeral `session_id`
  values now rotate after 30 minutes without activity, preserving separate
  first/last-touch attribution and preventing an idle tab from inflating a
  single session. The focused web analytics test and full `npm test` suite pass,
  and the production build generates 397/397 routes. This improves denominator
  quality; it does not prove a conversion or revenue lift.
- Acquisition report refresh (2026-08-15T02:34Z): status remains **blocked**;
  Search Console is blocked and web analytics, App Store Connect, and native
  app exports are missing. Funnel and cohort values remain `null`, not zero;
  the measurement system is ready for authorized exports but no live
  commercial outcome is claimed.
- Surpass promise and measurement refresh (2026-08-15T15:04Z): the homepage,
  social card, footer, manifest, TikTok metadata, press surface, methodology
  handoff, and article inline CTA now use the current `Get bigger on purpose`
  / `Build the body people notice` promise. Homepage App Store CTAs carry the
  fixed `copy_version=home_promise_v2` marker through the web analytics event
  and acquisition-report segment. The local full `npm test` suite passed, the
  static export generated 399/399 routes, `gh-pages` commit `a6745b257` is
  active in DigitalOcean deployment `c4a80aad-d3ba-4526-975f-e33ef436c8e0`,
  and live verification found HTTP 200, the new title and copy marker, a
  316/316 public brand crawl, and a 325-URL SEO audit with zero blocked pages,
  broken internal links, non-200s, stale visible-brand findings, or sitemap
  noindex violations. This proves delivery, brand consistency, and
  denominator-safe measurement construction, not traffic, conversion, or
  revenue lift; the provider-controlled App Store gate and authorized
  Search Console, web analytics, App Store Connect, and native app exports
  remain blocked.
- Shared acquisition copy measurement (2026-08-15 local): SEO acquisition
  landing pages now carry `copy_version=acquisition_promise_v2` on hero, final,
  and mobile recovery CTAs. The TikTok landing page carries
  `copy_version=tiktok_promise_v2` in its CTA markers and campaign diagnostics.
  The existing report segments these bounded markers without claiming a lift;
  the full `npm test` suite passed, the static export generated 399/399 routes,
  and `gh-pages` commit `ec0ebb9` reached ACTIVE in DigitalOcean deployment
  `bd34e254-6f32-45b0-af0a-909d7296af87`. Post-deploy public brand,
  conversion, 316/316 brand-crawl, and 325-URL SEO checks passed with zero
  stale-brand, non-200, blocked, broken-link, or sitemap-noindex findings.
  IndexNow accepted the homepage and eight acquisition/campaign URLs with
  HTTP 200 after publication.
  This proves measurement-marker delivery and public technical health, not
  traffic, conversion, or revenue lift.
- Organic CTA measurement (2026-08-15T15:34Z): the blog hub now carries
  `copy_version=blog_hub_promise_v2` on its hero and mid-library App Store
  handoffs, and canonical article pages carry
  `copy_version=article_promise_v2` on their header, inline, and final
  handoffs. The full site test suite passed, the static export generated
  399/399 routes, and `gh-pages` commit `54ff82e3` reached ACTIVE in
  DigitalOcean deployment `38aa4e50-6afd-471a-a6e5-9ff9d038460f`. Live
  verification found the expected markers on `/blog` and
  `/blog/best-workout-app-hypertrophy-2026`; the public brand check,
  conversion check, 316/316 brand crawl, and 325-URL SEO audit all passed
  with zero stale-brand, non-200, blocked, broken-link, or sitemap-noindex
  findings. The growth gate remains blocked only by the stale provider-owned
  public App Store metadata and missing authorized Search Console, web
  analytics, App Store Connect, and native app exports. This proves organic
  handoff measurement delivery and public technical health, not traffic,
  conversion, activation, retention, or revenue lift.
- Shared header CTA alignment (2026-08-15T15:52Z): the sitewide desktop and
  mobile App Store handoffs now use `Start free`, retain their existing
  `header` / `header_mobile` campaign and placement tokens, expose an
  accessible iPhone destination label, and carry `copy_version=header_promise_v1`.
  The full site suite passed, the static export generated 399/399 routes, and
  `gh-pages` commit `2baa816d` reached ACTIVE in DigitalOcean deployment
  `f473a77b-ef3f-4aad-b433-5cea5a226606`. Live homepage, article, and
  acquisition-page checks found HTTP 200, two header markers per page, and no
  legacy `Start with Surpass` hits. The public brand and conversion checks,
  316/316 brand crawl, and 325-URL SEO audit passed with zero stale-brand,
  non-200, blocked, broken-link, or sitemap-noindex findings. This proves
  message alignment and measurement-marker delivery, not conversion or
  revenue lift; provider and outcome exports remain blocked.
- App Store candidate readback (2026-08-15T15:58Z): the read-only provider
  check found Surpass app-info localizations for `en-AU`, `en-CA`, `en-GB`, and
  `en-US`; the latest iOS candidate is `4.0.3` in `WAITING_FOR_REVIEW` with
  `AFTER_APPROVAL` release type. The candidate release note and description
  pass the stale-brand and repeated-subtitle checks. The public storefront
  remains `4.0.2` with the older Jacked release note and repeated-subtitle
  opening, so public metadata propagation is still provider-controlled. No
  App Store Connect mutation was performed; product-page conversion,
  downloads, activation, retention, and revenue remain unknown until
  authorized exports are available.
- Unified gate refresh (2026-08-15T16:04Z): the public Surpass brand,
  conversion contract, 316/316 brand crawl, and 325-URL technical SEO audit
  all pass with zero stale visible-brand findings, non-200s, blocked pages,
  broken internal links, or sitemap-noindex conflicts. The release gate is
  blocked only by the public App Store `4.0.2` metadata; the measurement gate
  remains blocked because Search Console, EU Mixpanel, App Store Connect
  campaign data, and native app exports are unavailable. Funnel values remain
  `null`, not zero.
- Search Console baseline: **blocked** until an authorized read-only credential/property is available.
- EU Mixpanel readback: **blocked** until authorized project access or an approved aggregate export is available.
- App Store Connect metadata readback: **candidate confirmed** for `4.0.3`
  localizations; the public storefront remains `4.0.2` until provider review
  and propagation complete. Campaign/download/revenue data: **not supplied**
  in this lane.
- Native app analytics readback: **not supplied** in this lane; local event construction and privacy tests remain the available evidence.
- Acquisition report refresh (2026-08-14T23:08Z): **blocked** with all outcome metrics null because Search Console, EU Mixpanel, App Store Connect, and native app exports remain unavailable. The new maturity-aware return cohorts therefore have no live values yet.
- Acquisition report refresh (2026-08-15T00:05Z): **blocked** with all funnel values, including time-to-first-set, null because the four provider exports remain unavailable. The diagnostic is implemented and fixture-verified; it is not evidence of zero activity.
- Automatic DigitalOcean deploys remain **not enabled** because the current public-clone source is not GitHub-authenticated; the latest deployment was manually triggered after verified `gh-pages` publication and is active on `jacked.coach`.
- `npm run public:brand` is the release gate for brand drift; it must pass against the canonical domain after every provider or DNS change and before claiming the rebrand is live.
