# Web acquisition attribution model

## Capture rules

The browser reads only campaign parameters from the current URL:

- `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, and `utm_term`;
- `app_store_campaign`, or the Apple campaign parameter `ct` when present.

Values are normalized to short token-shaped strings. URLs, email-shaped values, control characters, and overlong values are discarded. The page path is stored without a query string so the landing-page record does not contain arbitrary parameters.

The first attribution-bearing visit is stored under `jacked:attribution:first-touch`. Later attribution-bearing visits replace `jacked:attribution:last-touch`. The first page path is stored separately under `jacked:attribution:landing-page`. No account identifier, email, workout value, CSV content, or health data is written to these keys.

The page-view event reports both first-touch and last-touch UTM source, medium, and campaign fields. `utm_content`, `utm_term`, and `app_store_campaign` use the current value when present and otherwise the retained last-touch value. App Store campaign values are also exposed as `first_touch_app_store_campaign` and `last_touch_app_store_campaign` for reporting that needs the full handoff.

Each browser session emits one `web_session_started` event. The event is
deduplicated with session storage and labels the session `new` or `returning`
using a boolean local-storage marker; it never creates an account or stores a
browser fingerprint.

## Page-view identity

`web_page_view` is keyed by pathname plus meaningful search parameters. Attribution and click-identification parameters (`utm_*`, `ct`, `pt`, `mt`, and common ad-click IDs) are excluded from the identity key. Tool parameters such as `range` remain meaningful. A pathname/search key is emitted once per browser session of the loaded analytics component, including React Strict Mode effect replay.

## App Store handoff

App Store URLs retain the Apple provider token `128406689`, `mt=8`, and the existing `ct` campaign tokens. The canonical outbound event adds the page pathname and CTA placement so shared campaign tokens remain distinguishable in web reporting. CTA placement is read from the existing `data-global-cta` marker, a tool marker, or the destination campaign token as a final fallback.

`web_cta_viewed` is emitted when a marked App Store CTA is at least half visible
in the viewport. `app_store_outbound_clicked` remains the click event. Their
shared `source_page`, `cta_placement`, and campaign fields make the web funnel
`web_cta_viewed → app_store_outbound_clicked` measurable without claiming an
App Store install that Mixpanel cannot observe.

The site also records 25/50/75/90% scroll-depth buckets and starts/completions
for explicitly marked product videos. These events are page-scoped and
deduplicated; they do not contain raw coordinates, media URLs, or user input.

## Region and independent counter

The existing Mixpanel initialization uses `https://api-eu.mixpanel.com`. Local tests verify the configuration and payload contract only. Production EU-project readback is `BLOCKED` until authorized EU Mixpanel project access or an approved export/query path is available.

An independent Cloudflare Web Analytics counter is not enabled in this change because no site token was supplied. No token has been invented and no production counter delivery is claimed. It can be added later as an opt-in, documented sanity check and compared by date and pathname, allowing for normal blocking differences.
