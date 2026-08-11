# Product measurement specification

This specification defines the small set of Mixpanel reports needed to assess
whether Jacked helps a new lifter reach a useful workout quickly, return to
train, and discover the iPhone app through the website. It is deliberately
limited to events and aggregate categories that can be interpreted without
collecting workout contents or account data.

## Primary measures

### First-set activation rate

`unique installations with first_set_logged within 7 days of first app_opened`
divided by `unique installations with first app_opened`.

Use `onboarding_path_selected`, `first_workout_ready`, `workout_started`, and
`first_set_logged` to identify the path and the point of loss. Break down by
`path`, `source`, `app_version`, and `build_number`. The installation identifier
is app-scoped and random; it is not an account identifier.

### Second-workout rate within seven days

`unique installations with second_workout_within_7d` divided by `unique
installations with a first workout_started`.

The iOS runtime derives the milestone from the first two observed
`workout_started` events and sends only a day-range bucket: `same_day`,
`2_3_days`, or `4_7_days`. This makes the retention window reportable without
sending exact dates or session identifiers.

### Qualified App Store click-through rate

`unique browser sessions with app_store_outbound_clicked` divided by `unique
browser sessions with web_cta_viewed`.

Segment by `source_page`, `cta_placement`, `page_type`, `viewport_class`,
`first_touch_utm_campaign`, and `last_touch_utm_campaign`. App Store Connect is
the source of truth for installs, subscriptions, and store conversion after the
browser handoff; Mixpanel does not represent those outcomes.

## Decision-supporting drivers

| Question | Events and properties |
| --- | --- |
| Does the first recommendation earn trust? | `recommendation_viewed`, `recommendation_explanation_opened`, `recommendation_used_unchanged`, `recommendation_edited`, `recommendation_replaced_with_previous` |
| Does the import path reach a usable plan? | `import_source_selected`, `import_file_validated`, `exercise_mapping_completed`, `training_scan_viewed`, `import_completed`, `import_failed` |
| Which product surfaces create return value? | `workout_completed`, `receipt_viewed`, `workout_share_completed`, `tab_viewed`, `second_workout_within_7d` |
| Do paid surfaces work without obscuring the funnel? | `paywall_viewed`, `purchase_started`, `purchase_completed`, `purchase_failed`, `purchase_timed_out`, `restore_completed`, `restore_failed` |
| Which website content creates qualified intent? | `web_page_view`, `web_session_started`, `web_cta_viewed`, `app_store_outbound_clicked`, `web_scroll_depth`, `web_video_played`, `web_video_completed`, `tool_completed`, `tool_shared` |

## Guardrails

Monitor these alongside the primary measures:

- `web_error_visible`, `import_failed`, and purchase or restore failure events;
- the proportion of events carrying `analytics_schema_version`;
- event volume by `app_version` and `build_number` after a release;
- the presence of both CTA impressions and outbound clicks before interpreting
  click-through changes.

A missing event is a measurement defect, not evidence of zero user activity.
Reports should show event availability and denominator counts before a rate.

## Contract rules

- iOS event names use `snake_case` and the schema version is `2`.
- Web event names use the `web_` prefix for site-level lifecycle and
  engagement events.
- Categorical values are short, controlled tokens. Counts are buckets.
- Do not send exercise names, notes, weights, reps, RIR, bodyweight, CSV text,
  file names, email addresses, health information, raw errors, exact dates, or
  destination URLs.
- `variant` is reserved for a controlled product or copy variant when one is
  actually present. It must not be inferred from a page pathname.
- Event time is the client event time in Mixpanel's standard Unix-second
  format. Cohort windows use elapsed time from the first qualifying event.

## Data availability

The source code and local tests verify event construction, privacy filtering,
queueing, and the EU endpoint configuration. Live EU Mixpanel readback is not
available in this development lane, so this document does not state current
counts, conversion rates, or growth results.
