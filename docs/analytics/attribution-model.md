# Web acquisition attribution model

## Capture rules

The browser reads only campaign parameters from the current URL:

- `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, and `utm_term`;
- `app_store_campaign`, or the Apple campaign parameter `ct` when present.

Values are normalized to short token-shaped strings. URLs, email-shaped values, control characters, and overlong values are discarded. The page path is stored without a query string so the landing-page record does not contain arbitrary parameters.

The first attribution-bearing visit is stored under `surpass:attribution:first-touch`. Later attribution-bearing visits replace `surpass:attribution:last-touch`. The first page path is stored separately under `surpass:attribution:landing-page`. No account identifier, email, workout value, CSV content, or health data is written to these keys. Existing `jacked:` keys are migrated once on read and then blanked, so the public rebrand does not reset anonymous attribution or session continuity.

The page-view event reports both first-touch and last-touch UTM source, medium, and campaign fields. `utm_content`, `utm_term`, and `app_store_campaign` use the current value when present and otherwise the retained last-touch value. App Store campaign values are also exposed as `first_touch_app_store_campaign` and `last_touch_app_store_campaign` for reporting that needs the full handoff.

Each browser session emits one `web_session_started` event. The event is
deduplicated with session storage and carries a random `session_id` that is
reused by events in that browser session. The session is labelled `new` or
`returning` using a boolean local-storage marker; it never creates an account,
stores a browser fingerprint, or persists the session ID across sessions.

## Page-view identity

`web_page_view` is keyed by pathname plus meaningful search parameters. Attribution and click-identification parameters (`utm_*`, `ct`, `pt`, `mt`, and common ad-click IDs) are excluded from the identity key. Tool parameters such as `range` remain meaningful. A pathname/search key is emitted once per browser session of the loaded analytics component, including React Strict Mode effect replay.

## App Store handoff

App Store URLs retain the Apple provider token `128406689`, `mt=8`, and the existing `ct` campaign tokens. The canonical outbound event adds the page pathname, CTA placement, and ephemeral session ID so shared campaign tokens remain distinguishable in web reporting. CTA placement is read from the existing `data-global-cta` marker, a tool marker, or the destination campaign token as a final fallback.

`web_cta_viewed` is emitted when a marked App Store CTA is at least half visible
in the viewport. `app_store_outbound_clicked` remains the click event. Their
shared `source_page`, `cta_placement`, and campaign fields make the web funnel
`web_cta_viewed → app_store_outbound_clicked` measurable without claiming an
App Store install that Mixpanel cannot observe.

The direct `/tiktok/app-store` route emits the same canonical outbound event
with `handoff_type=automatic` before redirecting to Apple. It gives the final
Mixpanel event a bounded 300 ms flush window and uses the redirect callback when
available, with an unconditional timer fallback so measurement cannot hold the
App Store handoff indefinitely. The TikTok landing also sanitizes source,
campaign, creative, and referrer-domain tokens before emitting its campaign
events.

The site also records 25/50/75/90% scroll-depth buckets, field Core Web Vitals
for LCP/CLS/INP when the page is hidden or navigated away, and
starts/completions for explicitly marked product videos. These events are
page-scoped and deduplicated; they do not contain raw coordinates, performance
entries, media URLs, or user input. Web Vital values are rounded and labelled
with a controlled good/needs-improvement/poor rating for diagnostic reporting.

The no-index TikTok landing uses the same page context, ephemeral session key,
attribution capture, schema version, and safe tracking boundary for its
campaign-specific view, CTA, and motion-link diagnostics. Those custom events
help separate source/campaign/creative behavior, but the qualified store-intent
KPI remains the canonical `web_cta_viewed` to
`app_store_outbound_clicked` session funnel.

## Region and independent counter

The existing Mixpanel initialization uses `https://api-eu.mixpanel.com`. Local tests verify the configuration and payload contract only. Production EU-project readback is `BLOCKED` until authorized EU Mixpanel project access or an approved export/query path is available.

The browser SDK is configured for explicit, session-scoped measurement:
automatic pageviews and autocapture are disabled; Mixpanel persistence and
cookies are disabled; client-IP enrichment, automatic referrer storage, and
automatic Google campaign storage are disabled; and raw current/referrer URL
properties are blacklisted. The explicit site `session_id` remains random and
session-storage-only, while attribution is retained only as sanitized campaign
tokens and a landing path.

An independent Cloudflare Web Analytics counter is not enabled in this change because no site token was supplied. No token has been invented and no production counter delivery is claimed. It can be added later as an opt-in, documented sanity check and compared by date and pathname, allowing for normal blocking differences.
