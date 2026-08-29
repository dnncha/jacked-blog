# Acquisition report

Generated: 2026-08-17T08:50:08.128Z

Status: **BLOCKED**

This report connects search visibility to web and product acquisition only when the corresponding source export is present. Null values mean the source was missing or had no usable rows; they do not mean zero activity.

## Source status

| Source | Status | Rows | File |
| --- | --- | ---: | --- |
| Search Console queries | empty | 0 | /Users/donncha/Documents/GitHub/jacked-blog/reports/seo/search-console-queries.csv |
| Search Console pages | empty | 0 | /Users/donncha/Documents/GitHub/jacked-blog/reports/seo/search-console-pages.csv |
| Search Console metric selection | blocked | 0 | no Search Console query rows |
| Web analytics | missing | 0 | not supplied |
| App Store Connect | missing | 0 | not supplied |
| App analytics | missing | 0 | not supplied |
| Search Console date coverage | no rows | 0 / 0 | unknown to unknown |
| Web event date coverage | unknown | unknown / unknown | unknown to unknown |
| App Store Connect date coverage | unknown | unknown / unknown | unknown to unknown |
| App event date coverage | unknown | unknown / unknown | unknown to unknown |

## Funnel

| Stage | Value |
| --- | ---: |
| Non-brand search impressions | unknown |
| Search clicks | unknown |
| Search metric window | unknown |
| Search metric quality | no Search Console query rows |
| Web page views | unknown |
| Web sessions | unknown |
| Tool starts | unknown |
| Tool completions | unknown |
| App Store outbound sessions | unknown |
| App Store outbound event rows (diagnostic) | unknown |
| CTA-view sessions | unknown |
| Qualified outbound sessions (CTA viewed and handoff) | unknown |
| Outbound sessions without a CTA view (diagnostic) | unknown |
| Qualified store-intent rate | unknown |
| CTA-view rate | unknown |
| App Store product-page views | unknown |
| App Store product-page-to-download rate | unknown |
| Downloads | unknown |
| First workouts | unknown |
| Activation-entry installations | unknown |
| First-set activated installations | unknown |
| First-set activation rate | unknown |
| Median time to first set | unknown seconds |
| P75 time to first set | unknown seconds |
| Second workout within seven days | unknown |
| Seven-day return rate | unknown |
| Second workout within one day | unknown |
| One-day return rate | unknown |
| Second workout within 30 days | unknown |
| 30-day return rate | unknown |
| Completed workouts | unknown |

## App Store Connect metrics

These aggregate metrics are reportable only when the supplied export contains
complete product-page-view and download values. They are not inferred from
website clicks, and missing or incomplete rows remain unknown.

| Metric | Value |
| --- | ---: |
| Source rows | unknown |
| Metric quality | unknown |
| Product-page views | unknown |
| Downloads | unknown |
| Product-page-to-download rate | unknown |
| Product-page field | unknown |
| Download field | unknown |

### App Store Connect campaign breakdown

| Campaign | Product-page views | Downloads | Product-page-to-download rate | Quality |
| --- | ---: | ---: | ---: | --- |
| none | unknown | unknown | unknown | source missing, invalid coverage, campaign field missing, or no complete rows |

## Web-to-App Store campaign continuity

Campaign tokens are compared across the browser handoff and App Store Connect
rows to expose routing or export mismatches. This is a continuity diagnostic;
web outbound sessions are not substituted for App Store product-page views or
downloads, and a matched token does not establish that the same visitor
installed the app.

| Campaign | Web outbound sessions | Product-page views | Downloads | Product-page-to-download rate | Quality |
| --- | ---: | ---: | ---: | ---: | --- |
| none | unknown | unknown | unknown | unknown | source missing, empty, or no campaign rows |

## Return-to-training cohorts

Each denominator contains only first-workout installations whose elapsed
window is mature by the latest valid event time in the export. A recent cohort
is therefore reported as unavailable rather than as a non-return.

| Window | Mature first-workout installations | Returning installations | Rate | Cohort status |
| --- | ---: | ---: | ---: | --- |
| 1 day | unknown | unknown | unknown | not mature / unavailable |
| 7 days | unknown | unknown | unknown | not mature / unavailable |
| 30 days | unknown | unknown | unknown | not mature / unavailable |

## Time to first set diagnostic

This diagnostic uses only the elapsed time between the first
'activation_entry' and the first valid 'first_set_logged' for each app-scoped
installation. It is an aggregate onboarding-speed signal, not a user-level
report; missing identity or event time keeps it unknown.

| Metric | Value |
| --- | ---: |
| Qualified installations | unknown |
| Median seconds | unknown |
| P75 seconds | unknown |
| Under 2 minutes | unknown |
| 2–5 minutes | unknown |
| 5–10 minutes | unknown |
| 10–20 minutes | unknown |
| 20 minutes or more | unknown |

## Next-session handoff diagnostic

This diagnostic relates preview exposure, explicit `START NEXT SESSION` intent,
and the later `workout_started(source=next_session_preview)` signal inside the
valid activation cohort. It is not a retention or causal measure. Source rows
may overlap when an installation is observed across multiple sessions.

| Source | Preview mounted users | Preview mounted events | Intent users | Intent events | Started after intent users | Started after intent events | Exposure to intent | Intent to start | Exposure to start |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| none | unknown | unknown | unknown | unknown | unknown | unknown | unknown | unknown | source missing or empty |

Starts without a preceding explicit intent: unknown event rows across unknown installations.

## Weekly Review recovery diagnostic

This diagnostic relates a resolved Weekly Review surface, explicit
`OPEN TODAY` intent, and a later `workout_started` event inside the valid
activation cohort. It segments the bounded `data_state` (`empty` or
`populated`) and is not an activation, retention, revenue, or causal measure.
Same-timestamp intent/start pairs are not treated as ordered by this report.

| Data state | Surface mounted users | Surface mounted events | OPEN TODAY users | OPEN TODAY events | Started after intent users | Started after intent events | Intent from surface | Start after intent |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| none | unknown | unknown | unknown | unknown | unknown | unknown | unknown | source missing or empty |

Intents without a preceding same-state surface: unknown event rows across unknown installations. Starts without a preceding Weekly Review intent: unknown event rows across unknown installations.

## Measurement quality

| Layer | Identity fields | Quality status |
| --- | --- | --- |
| Web | unknown | source missing |
| App | unknown | source missing |

Unique-session and unique-installation rates remain unknown when the required
identity or event-time fields are absent. Raw event rows are retained only as
diagnostics and are not used as people or session denominators.

## Web CTA segments

The rows below are the experiment-ready view of CTA exposure and outbound
handoff. An unknown rate means a required identity was missing in that segment.

| Source page | Placement | Experiment | Variant | Hero presentation | Copy version | Viewport | Campaign | CTA-view sessions | Outbound sessions | Qualified outbound sessions | Outbound without CTA view | Qualified intent | Quality |
| --- | --- | --- | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| none | none | none | none | none | none | none | none | unknown | unknown | unknown | unknown | unknown | source missing or empty |

## Web experiment comparisons

These rows compare unique CTA-view sessions, not raw event rows. The primary
rate is outbound sessions that share the same session identity as a CTA view,
divided by CTA-view sessions. A result is only
decision-eligible once both arms reach 100
CTA-view sessions and the 95% Newcombe-Wilson interval for treatment minus
control excludes zero. The report does not convert that diagnostic into a
winner.

| Source page | Placement | Experiment | Hero | Copy version | Viewport | Control | Treatment | Control views | Treatment views | Control intent | Treatment intent | Delta | 95% CI delta | Decision | Quality |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| none | none | none | none | none | none | none | none | unknown | unknown | unknown | unknown | unknown | unknown | source missing or no comparable arms |

## App activation paths

activation_entry is the new-user denominator. app_opened remains a launch
diagnostic and is not used to measure onboarding activation because returning
users can also open the app.

| Onboarding path | Activation entries | First-set activated installations | First-set activation rate | Quality |
| --- | ---: | ---: | ---: | --- |
| none | unknown | unknown | unknown | activation_entry export missing or empty |

## App activation by release

Release rows use the first valid activation_entry for each app-scoped
installation. They make build-level activation regressions visible without
turning app version or build into a user identifier.

| App version | App build | Activation entries | First-set activated installations | First-set activation rate | Quality |
| --- | --- | ---: | ---: | ---: | --- |
| none | none | unknown | unknown | unknown | activation_entry export missing or empty |

## Required next inputs

- **Search Console:** Run scripts/search-console-export.mjs with an authorized read-only token and retain query-level brand_class, range, start_date, and end_date fields.
- **Web analytics:** Export EU Mixpanel events or provide an approved aggregate event CSV.
- **App Store Connect:** Provide a campaign-linked App Store Connect export.
- **App analytics:** Provide an attribution-safe activation export.

## Decisions

- Keep search visibility, web behaviour, App Store activity, and app activation as separate evidence layers.
- Do not interpret blocked connectors as zero traffic.
- Do not declare an experiment winner without a predeclared window, sufficient sample, and rollback path.
