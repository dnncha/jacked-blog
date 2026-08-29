# Surpass hosting decision

Date: 2026-08-15

## Decision

Keep `jacked.coach` on the current DigitalOcean App Platform static-site
deployment for now. Do not create a second public site, change DNS, or split
SEO authority until an alternative passes the same route, redirect, analytics,
security-header, and custom-domain checks and has an observed cost advantage.

This is a cost-and-risk decision, not a claim that DigitalOcean is the only
valid long-term host.

## Evidence

- The current public domain is healthy: the latest technical crawl checked 325
  discovered URLs, including 322 HTML/XML sitemap URLs and 3 non-HTML assets,
  with zero blocked pages, broken internal links, or sitemap noindex violations.
  The full public brand crawl
  checked 322/322 URLs with zero non-200 responses or stale visible-brand hits.
- `.do/app.yaml` already describes the live custom domains, legacy-slug 301
  redirects, and static `gh-pages` source. The canonical domain and its SEO
  history therefore have a working production path.
- DigitalOcean's [first-party App Platform pricing](https://www.digitalocean.com/pricing/app-platform)
  currently lists up to three static-site apps at $0/month, with 1 GiB of
  transfer per static app, custom domains, HTTPS, and a global CDN. Additional
  transfer is listed at $0.02/GiB.
- This repository also contains an OpenNext/Cloudflare Workers path in
  `open-next.config.ts`, `wrangler.jsonc`, and the `preview`/`deploy` package
  scripts. Cloudflare's [first-party pricing](https://developers.cloudflare.com/workers/platform/pricing/)
  currently lists a free Workers plan with 100,000 requests per day and a
  paid plan starting at $5/month; the paid plan then meters requests and CPU
  time above its included allowances.
- ChatGPT Sites is currently described by OpenAI in its [first-party guidance](https://help.openai.com/en/articles/20001339)
  as a public beta with plan/workspace limits. Custom domains are available
  where supported and require DNS control, but the guidance does not provide a
  public monthly price that can establish a cheaper operating cost for this
  site.
- There is no `.openai/hosting.json` or existing Sites `project_id` in this
  repository. Creating a new Sites project would therefore create a parallel
  production surface rather than migrate the existing site.

## Why no migration was made

The site is a multi-route Next.js property with 397 generated routes, legacy
redirects, a subscription API route, privacy-safe analytics, App Store
campaign continuity, and an established custom domain. A new host must prove
all of those behaviors before DNS changes. A private preview or a new URL is
not evidence that the canonical site can be migrated safely.

The current source also has no provider export for traffic, conversion, or
revenue. Migrating before the baseline is available would make a host change
impossible to separate from an acquisition or SEO change.

## OpenNext validation result

The local OpenNext build passed on 2026-08-15 and generated the Cloudflare
worker bundle from the same source that generated 397/397 normal Next routes.
The follow-up Wrangler validation reached Cloudflare's asset upload stage but
failed before creating a Worker version: the generated Worker was about 10.5
MiB, while the current account limit reported by Cloudflare is 3 MiB on the
free plan and 10 MiB on the paid plan. The deployment list remained empty
after the failure. Seventeen static assets were uploaded during that failed
validation attempt; no Worker version, live URL, DNS change, or production
cutover was created.

This means the existing Cloudflare path is not currently a cheaper drop-in
replacement: it requires either substantial bundle-size work plus a paid
plan, or a different static-only deployment design. The proven DigitalOcean
static path remains the lower-risk option.

## Required alternative-host gate

Before any owner-authorized migration, run the existing production build and a
provider preview for the candidate host, then verify:

1. all 397 intended routes render with the canonical trailing-slash policy;
2. every legacy slug returns one direct 301 to the current canonical slug;
3. `/api/subscribe` and the consent/error behavior are preserved;
4. security headers, robots, sitemap, RSS, App Store URLs, and EU analytics
   configuration remain correct;
5. mobile hero/dock behavior and accessibility remain unchanged;
6. the candidate's observed monthly cost and traffic allowances beat the
   current static-site baseline without introducing a new paid dependency;
7. only after those checks pass, the owner approves DNS and public cutover.

## Static publication gate

The DigitalOcean app serves the generated `gh-pages` snapshot directly. Build
and verify one complete export before publishing it:

```sh
npm run static:build
```

The static contract checks that every generated HTML page has the matching
React Flight `.txt` payload and that all referenced Next assets exist. Publish
the complete `out/` snapshot in one `gh-pages` commit; do not selectively copy
changed HTML or JavaScript files. Verify the target `gh-pages` checkout with
`npm run static:verify` before any provider deployment or live-domain claim.

This gate exists because a partial generated-output publication can leave the
server-rendered HTML and its Flight payload from different builds. The result
can be an HTTP 200 page that fails during React startup even though the source
build and individual files appear healthy.

## Current owner gates

- No Sites project was created.
- No Cloudflare deployment or DNS change was performed.
- No production host was changed.
- The App Store candidate and public analytics exports remain separate release
  gates; hosting cannot substitute for those missing outcome evidence sources.
