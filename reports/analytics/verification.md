# Web analytics verification

Date: 2026-08-08

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

The following bounded local checks passed:

```text
git diff --check
node app/webAnalytics.test.mjs
node app/layoutAnalytics.test.mjs
node app/tools/toolData.test.mjs
node app/acquisitionLanding.test.mjs
node app/blogAcquisition.test.mjs
node app/tiktokLanding.test.mjs
```

## Evidence boundary

Local source and utility tests do not prove production event delivery. Direct EU Mixpanel project readback is **BLOCKED** because authorized EU project access or an approved EU export/query path was not available in this lane. The existing browser configuration points at the EU API, but that is configuration evidence only.

An independent Cloudflare Web Analytics counter is **BLOCKED / not enabled** because no token was available. The repository does not claim a production counter or invent a token.

## Remaining integration caveat

The existing site-wide App Store URLs retain their current Apple campaign tokens. The new `app_store_outbound_clicked` event consistently records the current page and CTA placement, including for shared legacy campaigns. Production should be smoke-tested in the EU Mixpanel project after authorized access is available, with one direct load, one client-side navigation, one calculator completion, one import-checker completion, and one App Store click.
