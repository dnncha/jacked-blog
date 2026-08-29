# Product measurement specification

This specification defines the small set of Mixpanel reports needed to assess
whether Surpass helps a new lifter reach a useful workout quickly, return to
train, and discover the iPhone app through the website. It is deliberately
limited to events and aggregate categories that can be interpreted without
collecting workout contents or account data.

## Primary measures

### First-set activation rate

`unique installations with first_set_logged within 7 days of first activation_entry`
divided by `unique installations with first activation_entry`.

`activation_entry` is emitted only when onboarding is still required, so it is
the new-user denominator. `app_opened` remains a launch diagnostic and must not
be used as the activation denominator because returning users can also open the
app. Use `onboarding_path_selected`, `first_workout_ready`, `workout_started`,
and `first_set_logged` to identify the path and the point of loss. Break down by
`path`, `source`, `app_version`, and `app_build` (or the documented
`build_number` export alias). The acquisition report now emits both onboarding
path and release rows. The installation identifier is app-scoped and random; it
is not an account identifier.

### Return-to-training rates

Report a second observed `workout_started` event within elapsed 1-day, 7-day,
and 30-day windows from each installation's first `workout_started`. The
denominator for each window is limited to first-workout installations whose
window is mature by the latest valid event time in the supplied export. This
prevents a recent cohort from being counted as a non-return. Report the mature
denominator, returning installations, and rate separately; if workout identity
or time is incomplete, the affected rate is unknown.

The iOS runtime emits bounded workout-number context on set, completion, and
recommendation events when the session history lookup has resolved. Build the
cohort from ordered `workout_started` timestamps; use
`workout_number_bucket` as a diagnostic where present, not as the denominator.
Do not invent a separate retention event or send exact dates as event
properties. The event timestamp is already part of the Mixpanel envelope.

`next_session_preview_mounted` is a bounded exposure diagnostic for the
post-workout Today handoff. Segment it by `source` (`after_workout` or
`manual`) and `planned_exercises_bucket`, then compare exposed installations
with the ordered second `workout_started` cohort when the observation window is
mature. It does not replace `workout_started`, does not define a retention
denominator, and cannot establish that the preview caused a return.

`next_session_preview_activated` is the deliberate `START NEXT SESSION` intent
boundary. Pair its bounded `source` and `planned_exercises_bucket` with the
mounted exposure and later `workout_started(source=next_session_preview)`;
activation is a diagnostic of handoff intent, not a return or causal-retention
outcome.

`weekly_review_surface_mounted` is the denominator for a loaded Weekly Review
surface. Segment by `data_state=empty|populated`; an empty state means the
summary resolved without current-week volume, not that the user abandoned the
surface. `weekly_review_open_today` is the explicit `OPEN TODAY` intent
boundary. Pair it with the later ordered `workout_started` cohort, keeping the
surface and intent counts separate. These events diagnose recovery-path
opportunity and intent; they do not replace first-set activation, define a
retention denominator, or establish causal lift.

The acquisition report exposes this read as
`measurement.app.weekly_review_recovery_diagnostics` and
`breakdowns.appWeeklyReviewRecovery`. It returns state-level user/event counts,
intent-from-surface and start-after-intent diagnostics, plus explicit quality
flags for missing identity/time, invalid state values, and starts without a
preceding intent. Same-timestamp intent/start pairs remain unresolved rather
than being treated as ordered.

### Time to first set

For each installation with a valid first `activation_entry`, calculate the
elapsed time to its first valid `first_set_logged` within seven days. Report
the qualified installation count, median, p75, and bounded buckets (`under_2m`,
`2_5m`, `5_10m`, `10_20m`, `20m_plus`). This is an aggregate onboarding-speed
diagnostic that helps locate time-to-value friction; it is unknown when
installation identity or event time is incomplete and must not be interpreted
as a retention or conversion outcome.

### Qualified App Store click-through rate

A qualified store-intent session is a browser session whose identity appears in
both `web_cta_viewed` and `app_store_outbound_clicked`. The rate is the number
of unique CTA-viewed sessions that also emit the outbound event, divided by
the number of unique sessions with `web_cta_viewed`. Outbound sessions without
a recorded CTA view remain a separate data-quality diagnostic.

The site emits at most one canonical outbound event for a page-view key, CTA
placement, and App Store campaign during the current analytics page-session
lifetime. This is a raw event quality guardrail; the KPI still uses unique
`session_id` denominators and must not treat event-row deduplication as evidence
of a conversion lift.

A browser session is represented by the ephemeral `session_id` in
`sessionStorage`. It starts on the first measurable page or interaction and
rotates after 30 minutes without activity; first/last-touch attribution stays
separate in `localStorage` and is not used as a person identifier. If browser
session storage is unavailable, the site keeps one in-memory session for the
current page lifetime and reports only the fields that are actually present.

Segment by `source_page`, `cta_placement`, `page_type`, `viewport_class`,
`copy_version` (`home_promise_v2`, `header_promise_v1`,
`acquisition_promise_v2`, `article_promise_v2`, `blog_hub_promise_v2`, or
`tiktok_promise_v2` for the current source treatments), `first_touch_utm_campaign`, and
`last_touch_utm_campaign`. App Store Connect is
the source of truth for installs, subscriptions, and store conversion after the
browser handoff; Mixpanel does not represent those outcomes.

The web export must include the random `session_id` emitted by the site event
contract. If a historical export lacks that field, the report returns an
unknown rate rather than substituting raw event rows or visitor IDs. Acquisition
hero comparisons also segment by the bounded `hero_presentation` marker and
the fixed `copy_version` marker so a screen-versus-photo or message change is
not inferred from a page or campaign name.

### CTA experiment comparison

The acquisition report groups CTA segments by canonical source page, placement,
experiment, proof presentation, and viewport, intentionally leaving the App
Store campaign token out of the comparison key because control and treatment
must retain different handoff tokens. It compares each `control` arm with each
available treatment using unique CTA-view sessions as exposure and unique
outbound sessions that share the CTA-view session identity as success events.
Outbound rows without matching exposure are retained as a diagnostic and are
not counted as qualified intent.

The report uses a 95% Newcombe-Wilson interval for treatment-minus-control,
requires at least 100 CTA-view sessions in each arm, and returns bounded
decisions such as `no_control`, `no_treatment`, `below_minimum_exposure`,
`data_quality_insufficient`, `inconclusive_95_ci`, `treatment_ahead_95_ci`, or
`treatment_behind_95_ci`. These are decision diagnostics, not automatic winner
declarations; review the predeclared exposure window and guardrails before
changing the public variant.

The homepage hero candidate uses a stable first-party assignment key,
`surpass:experiment:homepage-hero-cta:v1`, with `control` and `outcome_v1`
variants. The CTA remains marked not-ready until the assignment is available;
the web observer must not count the server-rendered fallback as an exposure.
Storage failure may use one in-memory page-lifetime assignment, which is
reported as a measurement limitation rather than a person-level identity.

### Export requirements for cohort rates

The web event export needs `event_name`, `session_id`, and the bounded event
properties. The report emits CTA rows segmented by `source_page`,
`cta_placement`, `experiment_name`, `experiment_variant`, `hero_presentation`,
`copy_version`, `viewport_class`, and `app_store_campaign` so the predeclared experiment can be
reviewed without joining raw event rows by hand. The native export needs `event_name`,
`installation_id`, and event time (`time`, `timestamp`, or an equivalent
documented field). Current native envelopes also carry an ephemeral
`app_session_id`; use it only for launch/session diagnostics and discard it
from aggregate reporting. It is generated for one app process, is not
persisted, and is not an account, device, workout, or health identifier. The
report uses the persistent app-scoped installation identifier only to form
aggregate denominators and never writes either identifier to the report
output. Missing identity or event time makes the affected cohort rate
unknown; a missing `activation_entry` export makes first-set activation
unknown rather than falling back to `app_opened`.

### App Store Connect export requirements

The App Store Connect export should provide one aggregate row per reporting
period and campaign where possible, with explicit `start_date` and `end_date`
(or documented equivalent period fields) on every row. The reader accepts `product_page_views`
and `downloads` (with documented equivalent header aliases), and optionally
`app_store_campaign` for campaign breakdowns. The report emits product-page
views, downloads, and product-page-to-download rate only when both metric
fields and date coverage are present and complete for the supplied rows;
mixed reporting periods are not summed, and incomplete rows remain unknown
rather than being summed as zero. Website outbound clicks are a
separate handoff diagnostic and never substitute for App Store product-page
or download counts.

The web and native event exports must retain a valid event timestamp on every
row used by the report. The report records each source's observed start and end
date, marks a source invalid when any row lacks usable coverage or has reversed
period boundaries, and leaves the affected funnel values null. This prevents a
freshness or mixed-window error from looking like a conversion result.

The acquisition report also compares the bounded `app_store_campaign` token on
`app_store_outbound_clicked` rows with the campaign rows in the App Store
Connect export. The resulting `measurement.app_store_campaign_continuity`
readout exposes campaigns observed only on one side, incomplete web session
identity, and incomplete App Store metrics. A matched token validates routing
continuity only; it must not be read as a person-level join or as proof that a
browser click became a product-page view, download, install, or subscription.

### Commerce taxonomy

Typed commerce lifecycle events are `paywall_viewed`, `trial_started`,
`purchase_started`, `purchase_completed`, `purchase_failed`,
`purchase_pending`, `purchase_timed_out`, `restore_started`,
`restore_completed`, and `restore_failed`. `trial_started` is emitted only
after StoreKit verifies a successful transaction with a free-trial offer and
the entitlement refresh confirms access; an introductory offer displayed on a
product page is not treated as eligibility proof. `purchase_started` is one
canonical event per attempt. The `plan` property is limited to `annual`,
`monthly`, `lifetime`, or `unknown`; raw StoreKit product identifiers and
transaction identifiers are not exported. `is_pro` is a bounded entitlement
result only, not a provider or account identifier.

## Decision-supporting drivers

| Question | Events and properties |
| --- | --- |
| Does the first recommendation earn trust? | `recommendation_viewed`, `recommendation_explanation_opened`, `recommendation_used_unchanged`, `recommendation_edited`, `recommendation_replaced_with_previous` |
| Does the saved-workout handoff create explicit next-session intent? | `next_session_preview_mounted` and `next_session_preview_activated` with `surface=home_next_session_preview`, bounded `source`, `planned_exercises_bucket`, and `action=start_next_session` on intent, paired with the ordered `workout_started(source=next_session_preview)` diagnostic |
| Does Weekly Review recover an empty week into a next action? | `weekly_review_surface_mounted` and `weekly_review_open_today`, segmented by `data_state=empty|populated`, paired with the later ordered `workout_started` cohort; treat these as recovery-path diagnostics, not retention or revenue outcomes |
| Does the import path reach a usable plan? | `import_source_selected`, `import_file_validated`, `exercise_mapping_completed`, `training_scan_viewed`, `import_completed`, `import_failed` |
| Which product surfaces create return value? | `workout_completed`, `receipt_viewed`, `workout_share_completed`, `tab_viewed`, `second_workout_within_7d` |
| Do paid surfaces work without obscuring the funnel? | `paywall_viewed`, `trial_started`, `purchase_started`, `purchase_completed`, `purchase_pending`, `purchase_failed`, `purchase_timed_out`, `restore_started`, `restore_completed`, `restore_failed` |
| Which website content creates qualified intent? | `web_page_view`, `web_session_started`, `web_cta_viewed`, `app_store_outbound_clicked`, `web_scroll_depth`, `web_vital_measured`, `web_video_played`, `web_video_completed`, `tool_completed`, `tool_shared` |

## Guardrails

Monitor these alongside the primary measures:

- `web_error_visible`, `import_failed`, and purchase or restore failure events;
- `web_vital_measured` by page template and viewport class; report p75 or p95
  only when the sample size, field coverage, and date range are visible. Do not
  interpret a client-side sample as a population-wide Core Web Vitals pass;
- the proportion of events carrying `analytics_schema_version`;
- event volume by `app_version` and `build_number` after a release;
- the presence of both CTA impressions and outbound clicks before interpreting
  click-through changes.

A missing event is a measurement defect, not evidence of zero user activity.
Reports should show event availability and denominator counts before a rate.
The acquisition report now calculates unique-session and unique-installation
rates only when the required identity and time fields are present; it keeps raw
event-row counts as diagnostics rather than treating them as people.

## Contract rules

- iOS event names use `snake_case` and the schema version is `2`.
- Web event names use the `web_` prefix for site-level lifecycle and
  engagement events.
- Categorical values are short, controlled tokens. Counts are buckets.
- Do not send exercise names, notes, weights, reps, RIR, bodyweight, CSV text,
  file names, email addresses, health information, raw errors, exact dates, or
  destination URLs.
- `variant` is reserved for a controlled product or copy variant when one is
  actually present. Web CTA events use `experiment_name` and
  `experiment_variant` only when the source marker explicitly assigns both;
  they must not be inferred from a page pathname or campaign token.
- Event time is the client event time in Mixpanel's standard Unix-second
  format. Cohort windows use elapsed time from the first qualifying event.

## Data availability

The source code and local tests verify event construction, privacy filtering,
queueing, and the EU endpoint configuration. Live EU Mixpanel readback is not
available in this development lane, so this document does not state current
counts, conversion rates, or growth results.
