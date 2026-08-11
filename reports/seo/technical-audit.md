# Technical SEO audit

Run: 2026-08-08T07:32:09.312Z

Base URL: `https://jacked.coach`

## Scope and completeness

- Sitemap fetch: 200
- URLs listed in sitemap: 328
- URLs discovered from sitemap, known routes, and internal links: 334
- URLs audited: 300
- URLs not audited because of the bound: 34
- Fetch-blocked URLs: 0
- Audit bound: 300 pages, 8 concurrent requests, 8000ms timeout

The inventory gives every discovered URL an explicit provisional action. A `Review` action means evidence or the fetch bound was insufficient; it is not permission to remove a URL.

## Indexability checks

- Sitemap URLs with noindex in the audited rows: 0
- URLs with query parameters: 0
- Potential staging/deployment URLs: 0
- Broken internal links observed: 0
- Duplicate titles: 4 groups
- Duplicate descriptions: 0 groups

### Noindex URLs in sitemap

- None observed in the audited set.

### Broken internal links

- None observed in the audited set.

### Potential staging URLs

- None observed in the audited set.

## Findings requiring review

- A sitemap URL should be 200, indexable, canonical to itself, and useful before it is retained in the sitemap.
- A missing or non-self canonical is recorded as `needs_review` or `Merge`; no redirect is applied by this audit.
- Duplicate metadata and exact-content duplicate groups are recorded for content review. The script does not infer backlinks, Search Console demand, or a safe redirect destination.
- JavaScript-disabled rendering, mobile layout, structured-data visibility after hydration, and browser interaction are not proven by this HTTP crawl.

## Provisional decision counts

- Keep: 60
- Improve: 240
- Merge: 0
- Redirect: 0
- Noindex: 0
- Remove: 0
- Review: 34
