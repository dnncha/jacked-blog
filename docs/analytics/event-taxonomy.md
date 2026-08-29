# Web analytics event taxonomy

This document defines the privacy-safe browser event contract for Surpass on
`jacked.coach`. Mixpanel is configured in the EU region in `app/layout.js`; the
browser model is also designed to remain harmless when the client is blocked or
unavailable.

## Canonical events

| Event | When it is emitted | Required context |
| --- | --- | --- |
| `web_page_view` | Initial load and each distinct pathname plus meaningful search-parameter state | Canonical page properties below |
| `web_session_started` | The first observed page view in a browser session | Page context, entry page, and `session_type` (`new` or `returning`) |
| `web_navigation_clicked` | A marked site navigation or related-tool link is selected | `source_page`, `target_path`, and the safe navigation marker |
| `web_cta_viewed` | An App Store CTA is at least 50% visible in the viewport | `source_page`, `cta_placement`, campaign context, Apple provider token, optional controlled experiment fields, and the bounded `hero_presentation` and `copy_version` markers when present |
| `web_scroll_depth` | A page reaches a 25%, 50%, 75%, or 90% viewport depth threshold | Page context and `depth_bucket` |
| `web_vital_measured` | A page is hidden or navigated away after the browser observes a Core Web Vital | Page context, controlled `metric_name` (`LCP`, `CLS`, or `INP`), rounded `metric_value`, `metric_rating`, and `metric_unit` |
| `web_video_played` | A marked product video starts | Page context and `video_name` |
| `web_video_completed` | A marked product video reaches its end once per page view | Page context and `video_name` |
| `tool_started` | The first change to a calculator or checker | `tool_name`, `tool_type`, safe context categories, and `source_page` |
| `tool_completed` | A calculator form is submitted | The `tool_started` context plus `completion_kind` and an aggregate `result_category` |
| `import_checker_completed` | A Hevy, Strong, FitNotes, or workout CSV checker is submitted | The sanitized `tool_completed` context |
| `app_store_outbound_clicked` | An App Store link is selected or an App Store handoff starts, once per canonical page-view key, placement, and campaign during the current analytics page-session lifetime | `source_page`, `cta_placement`, `app_store_campaign`, and `apple_provider_token`; controlled CTAs may also include `experiment_name`, `experiment_variant`, and the bounded `hero_presentation` and `copy_version`; automatic handoffs also include `handoff_type` |
| `web_error_visible` | A UI error surface emits the `surpass:web-error-visible` browser event | Page context and a controlled `error_category`; never the raw error text |

The component retains the existing `nav_click`, `cta_click`, `tool_viewed`, `tool_app_store_clicked`, `tool_shared`, and `tool_related_tool_clicked` names for historical reports. New reporting should use the canonical names.

## Campaign diagnostics

The no-index `/tiktok` acquisition page also emits bounded campaign diagnostics:

| Event | When it is emitted | Required context |
| --- | --- | --- |
| `tiktok_landing_view` | The campaign page mounts | Shared web page context, `landing_variant`, sanitized `source`, `campaign`, `creative`, and origin-only `referrer_domain` |
| `tiktok_landing_cta` | A campaign CTA is selected | The view context plus fixed `placement` (`hero`, `final`, or `sticky`) |
| `tiktok_landing_motion_link` | The visitor selects the in-page product-preview link | Shared campaign page context |

These events are diagnostics for creative and landing-path QA. Primary
qualified store-intent reporting still uses the canonical
`web_cta_viewed` → `app_store_outbound_clicked` pair, whose session and CTA
denominators are emitted by the shared analytics component.

## Native app return-loop event

The iOS app uses the same privacy boundary and sends schema-versioned events
with `app_brand=surpass` and `brand_generation=surpass_launch`. The
post-workout Today handoff adds bounded exposure and intent diagnostics:

| Event | When it is emitted | Required context |
| --- | --- | --- |
| `next_session_preview_mounted` | The inline next planned session is visible on the Today surface | `surface=home_next_session_preview`, `source` (`after_workout` or `manual`), and `planned_exercises_bucket` (`0`, `1_3`, `4_10`, or `11_plus`) |
| `next_session_preview_activated` | The user selects `START NEXT SESSION` from the visible next-session preview | `surface=home_next_session_preview`, bounded `source`, `planned_exercises_bucket`, and `action=start_next_session` |
| `weekly_review_surface_mounted` | Weekly Review finishes loading and resolves to either an empty or populated summary state | `surface=weekly_review` and `data_state` (`empty` or `populated`) |
| `weekly_review_open_today` | The user selects `OPEN TODAY` from Weekly Review, including the empty-state recovery path | `surface=weekly_review`, `data_state` (`empty` or `populated`), and `action=open_today` |

These are handoff diagnostics, not retention events. Pair them with the
ordered second `workout_started` cohort when the native export is available;
do not interpret preview exposure or intent as a return or causal lift.

The Weekly Review events separate a loaded-surface denominator from explicit
return-to-Today intent. Segment by `data_state`, then pair the intent event with
the later ordered `workout_started` cohort when the observation window is
mature. Neither event is itself a retention, activation, or revenue outcome.

## Canonical page properties

Every `web_page_view` includes:

- `pathname`, `canonical_url`, `page_type`, and `page_slug`;
- an ephemeral `session_id` shared only within the current browser session;
- `tool_name` for tool routes and `article_category` when the page exposes it;
- origin-only `referrer` and `referrer_domain`;
- the first recorded `landing_page` path;
- `first_touch_utm_source`, `first_touch_utm_medium`, and `first_touch_utm_campaign`;
- `last_touch_utm_source`, `last_touch_utm_medium`, and `last_touch_utm_campaign`;
- current or retained `utm_content`, `utm_term`, and `app_store_campaign`;
- `viewport_class` (`mobile`, `tablet`, `desktop`, or `unknown`).

The Mixpanel browser profile also receives the schema version, platform, retained
landing page, and tokenized first- and last-touch campaign fields. These are
registered as context properties; first-touch fields are written once.

The browser SDK is configured with automatic pageview tracking and autocapture
disabled, persistence and cookies disabled, client-IP enrichment disabled, and
automatic referrer/Google campaign storage disabled. Raw current-page and
referrer properties are blacklisted. The site's canonical page, session, CTA,
and handoff events remain explicit so the measurement contract does not depend
on an unbounded SDK event stream or a persistent browser identifier.

Query values used for attribution are normalized to short campaign-safe tokens. Meaningful tool parameters remain in the page-view dedupe key but are never copied into analytics properties.

## Privacy boundary

Calculator analytics contains only tool and controlled context metadata. It does not include entered exercise names, weights, reps, RIR, bodyweight, age, CSV text, uploaded file contents, email addresses, health information, result numbers, or raw form state. CSV parsing remains local to the browser.

The native preview event carries only the fixed surface/source tokens and a
count bucket. Weekly Review events carry only the fixed surface, action, and
empty/populated state tokens. They do not contain workout names, exercise
names, targets, session identifiers, dates, or logged set details.

Video names and CTA placements come from fixed source markers, not user-visible
copy or arbitrary URLs. Scroll depth is emitted as a threshold bucket rather
than an exact coordinate. Web Vital events contain only a rounded timing or
layout-shift score, a controlled rating, and its unit; they do not include raw
performance entries, element selectors, URLs, or interaction details. Sharing
records the successful method (`native` or `clipboard`) and never the shared
URL contents.

App Store events retain only the Apple provider token and campaign token from the destination URL. They do not send the destination URL, query string, or document referrer as a raw value.

The browser deduplicates repeated App Store clicks for the same canonical page
view, CTA placement, and campaign within the current analytics page-session
lifetime. This keeps rapid double-clicks and repeated activation of the same
handoff from inflating raw event diagnostics while preserving the
unique-session denominator.

The `session_id` is a random, session-storage-only identifier. It is cleared
when the browser session ends, is not joined to the retained visitor marker,
and is not an account or device identifier. It exists so aggregate exports can
calculate unique-session denominators instead of treating raw event rows as
people or sessions.

The `hero_presentation` field is a fixed source marker (`photo` or `screen`),
and `copy_version` is a fixed source marker such as `home_promise_v2`,
`header_promise_v1`, `acquisition_promise_v2`, `article_promise_v2`,
`blog_hub_promise_v2`, or `tiktok_promise_v2`, not user input. They exist to
compare proof and message treatments while keeping the CTA experiment and App
Store campaign fields unchanged.
