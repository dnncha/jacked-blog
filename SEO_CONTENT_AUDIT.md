# Jacked.coach SEO Content Audit

Date: 2026-05-15

## Summary

The blog has strong topical coverage, but the implementation and a subset of commercial-intent posts were limiting search value.

Google Search Central emphasizes helpful, people-first content, clear titles/snippets, crawlable URLs, canonical URLs, and valid structured data. The prior site had the opposite risk pattern in several places: thin sales-led app posts, stale pricing/trial claims, duplicated title text, invalid generated article HTML, weak metadata, and incomplete sitemap/date handling.

## Findings

- 259 markdown articles exist in `content/blog`.
- 235 posts have no usable `date`.
- 247 posts were still categorized as `General`.
- 166 posts do not include a visible references section.
- 23 posts were under 600 words.
- The custom markdown renderer produced invalid HTML for many lists and headings.
- Article page titles rendered as `Title | Jacked | Jacked`.
- Structured data included empty or default dates for many posts.
- Commercial pages such as `best-hypertrophy-app-ios-review`, `progressive-overload-app-works`, and `hypertrophy-app-vs-generic-tracker` were thin, overly promotional, and included stale pricing/free-trial claims.

## Improvements Made

- Replaced the custom regex markdown renderer with `remark` + `remark-html`.
- Added better article metadata: clean title, canonical URL, Open Graph article dates when valid, reading time, category, and editorial review signal.
- Improved Article JSON-LD with author URL, word count, article section, and omitted invalid dates instead of emitting placeholders.
- Added safer diagram/callout rendering for existing `{{...}}` placeholders.
- Improved related article cards with excerpts for internal linking.
- Fixed homepage/search/feed/sitemap sorting for missing dates.
- Updated sitemap generation to omit invalid `lastmod` values.
- Rewrote four high-intent app-marketing articles:
  - `best-hypertrophy-app-ios-review.md`
  - `best-workout-app-hypertrophy-2026.md`
  - `progressive-overload-app-works.md`
  - `hypertrophy-app-vs-generic-tracker.md`

## Remaining Work

- Assign real categories across the full library instead of relying on `General`.
- Add or verify dates only when the publication/update date is known.
- Prioritize source review for the 166 posts without references.
- Expand or consolidate the 19 remaining short articles under 600 words.
- Add expert/reviewer bios if Jacked has a named qualified reviewer.
- Consider topic hubs for hypertrophy apps, progressive overload, supplements, recovery, and program design.
