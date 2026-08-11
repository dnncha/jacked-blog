# Web analytics event taxonomy

This document defines the privacy-safe browser event contract for jacked.coach. Mixpanel is configured in the EU region in `app/layout.js`; the browser model is also designed to remain harmless when the client is blocked or unavailable.

## Canonical events

| Event | When it is emitted | Required context |
| --- | --- | --- |
| `web_page_view` | Initial load and each distinct pathname plus meaningful search-parameter state | Canonical page properties below |
| `web_navigation_clicked` | A marked site navigation or related-tool link is selected | `source_page`, `target_path`, and the safe navigation marker |
| `tool_started` | The first change to a calculator or checker | `tool_name`, `tool_type`, safe context categories, and `source_page` |
| `tool_completed` | A calculator form is submitted | The `tool_started` context plus `completion_kind` and an aggregate `result_category` |
| `import_checker_completed` | A Hevy, Strong, FitNotes, or workout CSV checker is submitted | The sanitized `tool_completed` context |
| `app_store_outbound_clicked` | An App Store link is selected | `source_page`, `cta_placement`, `app_store_campaign`, and `apple_provider_token` |
| `web_error_visible` | A UI error surface emits the `jacked:web-error-visible` browser event | Page context and a controlled `error_category`; never the raw error text |

The component retains the existing `nav_click`, `cta_click`, `tool_viewed`, `tool_app_store_clicked`, `tool_shared`, and `tool_related_tool_clicked` names for historical reports. New reporting should use the canonical names.

## Canonical page properties

Every `web_page_view` includes:

- `pathname`, `canonical_url`, `page_type`, and `page_slug`;
- `tool_name` for tool routes and `article_category` when the page exposes it;
- origin-only `referrer` and `referrer_domain`;
- the first recorded `landing_page` path;
- `first_touch_utm_source`, `first_touch_utm_medium`, and `first_touch_utm_campaign`;
- `last_touch_utm_source`, `last_touch_utm_medium`, and `last_touch_utm_campaign`;
- current or retained `utm_content`, `utm_term`, and `app_store_campaign`;
- `viewport_class` (`mobile`, `tablet`, `desktop`, or `unknown`).

Query values used for attribution are normalized to short campaign-safe tokens. Meaningful tool parameters remain in the page-view dedupe key but are never copied into analytics properties.

## Privacy boundary

Calculator analytics contains only tool and controlled context metadata. It does not include entered exercise names, weights, reps, RIR, bodyweight, age, CSV text, uploaded file contents, email addresses, health information, result numbers, or raw form state. CSV parsing remains local to the browser.

App Store events retain only the Apple provider token and campaign token from the destination URL. They do not send the destination URL, query string, or document referrer as a raw value.
