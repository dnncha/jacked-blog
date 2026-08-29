# Web analytics verification

Date: 2026-08-15

## Local verification

The focused test `node app/webAnalytics.test.mjs` covers:

- EU Mixpanel initialization remaining in `app/layout.js`;
- explicit initial page-view delivery through `web_page_view`;
- pathname and meaningful-search route changes;
- duplicate suppression, including attribution-only query changes;
- first-touch and last-touch local attribution;
- origin-only referrers and viewport classification;
- Apple provider token `128406689`, campaign token parsing, and Smart App Banner preservation;
- source-page and CTA-placement fields for App Store events;
- sanitized calculator/checker completion payloads;
- absence of CSV, form, workout, health, email, and numeric input fields from the calculator analytics helper;
- `import_checker_completed` alongside the compatibility `tool_completed` event.
- Ephemeral web sessions now rotate after 30 minutes of inactivity, while
  first/last-touch attribution remains separate from the session key; utility
  coverage verifies identity reuse before expiry and rotation after expiry.
- TikTok campaign CTA markers, sanitized attribution tokens, and the automatic
  `/tiktok/app-store` handoff's bounded Mixpanel flush path.
- Shared SEO acquisition pages now expose a mobile-only recovery CTA with a
  campaign-specific placement and `acquisition_mobile_cta` /
  `sticky_outcome_v1` markers; it is a local conversion candidate, not a
  measured lift.
- Acquisition report experiment comparisons now pair control and treatment CTA
  segments without joining user-level rows, calculate a 95% Newcombe-Wilson
  interval for the intent-rate difference, and fail closed through
  `no_treatment`, `no_control`, `below_minimum_exposure`, and data-quality
  decisions. The exposure floor is 100 unique CTA-view sessions per arm.
- The homepage hero candidate now assigns a stable first-party `control` or
  `outcome_v1` variant, routes the matching App Store campaign, and marks the
  CTA not-ready until assignment completes; the observer skips that fallback
  state and includes variant/campaign in its exposure key.
- The native next-session handoff now distinguishes the mounted preview from a
  deliberate `next_session_preview_activated` start intent; the bounded event
  remains separate from the later `workout_started` return signal.
- The canonical acquisition report now exposes the same handoff diagnostic by
  activation cohort, with source-level mounted, intent, and scheduled-start
  counts plus fail-closed identity/time quality states. Its fixture covers a
  valid after-workout handoff and a manual exposure without intent.
- The blog hub now uses explicit `blog_hub_hero` and `blog_hub_mid` CTA
  placements under `blog_hub_cta` / `outcome_v1`; the full source suite and
  production route generation pass. This improves measurement construction,
  but it does not provide provider denominators or a conversion result.

The following bounded local checks passed:

```text
git diff --check
node app/webAnalytics.test.mjs
node app/layoutAnalytics.test.mjs
node app/tools/toolData.test.mjs
node app/acquisitionLanding.test.mjs
node app/blogAcquisition.test.mjs
node app/tiktokLanding.test.mjs
node scripts/acquisition-report.test.mjs
node app/homepageProductTruth.test.mjs
```

## Evidence boundary

Local source and utility tests do not prove production event delivery. Direct EU Mixpanel project readback is **BLOCKED** because authorized EU project access or an approved EU export/query path was not available in this lane. The existing browser configuration points at the EU API, but that is configuration evidence only.

An independent Cloudflare Web Analytics counter is **BLOCKED / not enabled** because no token was available. The repository does not claim a production counter or invent a token.

## Remaining integration caveat

The existing site-wide App Store URLs retain their current Apple campaign tokens. The new `app_store_outbound_clicked` event consistently records the current page and CTA placement, including for shared legacy campaigns. Production should be smoke-tested in the EU Mixpanel project after authorized access is available, with one direct load, one client-side navigation, one calculator completion, one import-checker completion, and one App Store click.

## Activation diagnostic update

The acquisition report now derives an aggregate time-to-first-set diagnostic
from `activation_entry` to the first valid `first_set_logged`, with sample
count, median, p75, and bounded time buckets. It uses the existing event
timestamps and app-scoped installation identity; it adds no new user-level
payload. The 2026-08-15 refresh correctly returned the diagnostic as unknown
because the authorized app export is still absent.

The acquisition report's new experiment-comparison layer is locally verified
with a synthetic aggregate fixture covering no-treatment, no-control, and a
100-session-per-arm treatment-ahead interval. Synthetic rows verify the
calculation and fail-closed states only; they are not production traffic or
conversion evidence.

The next-session handoff diagnostic is likewise construction evidence only. It
does not prove a return, retention, conversion, or causal effect until a mature
released app export is available.
