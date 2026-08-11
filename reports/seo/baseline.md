# Search Console organic-search baseline

Status: **BLOCKED**

Generated at (UTC): 2026-08-08T07:19:28.418Z

## Why this baseline is blocked

No Search Console data was retrieved. Set GSC_ACCESS_TOKEN, the OAuth refresh-token variables, or GSC_SERVICE_ACCOUNT_FILE.

The configured property is `sc-domain:jacked.coach`, but the property, permissions, sitemap submission, and Search Console data are not confirmed by this run. No numbers, URLs, rankings, or opportunity claims have been inferred.

## Reporting range

| View | Start | End | Data status |
| --- | --- | --- | --- |
| max | 2025-04-05 | 2026-08-05 | Not retrieved |
| trailing-90d | 2026-05-08 | 2026-08-05 | Not retrieved |
| trailing-28d | 2026-07-09 | 2026-08-05 | Not retrieved |

The `max` view requests a 16-calendar-month lookback by default, which is a configurable proxy for the Search Console history window. The `trailing-90d` and `trailing-28d` views are inclusive date ranges. The API end date defaults to UTC today minus three days unless overridden.

## Latest complete data date

**Unknown.** A finalized date-dimension request requires Search Console access.

## Totals

**Not available.** Total clicks, impressions, CTR, and average position are intentionally omitted because no API response was received.

## Branded and non-branded split

**Not available.** The export applies documented query filters only after Search Console rows are returned.

## URLs with impressions or clicks

**Not available.** A sitemap URL inventory and Search Console page rows are separate evidence sources. The technical URL audit is intentionally outside this lane.

## Top opportunity queries

**Not available.** No query, page, device, country, or search-appearance rows were retrieved.

## Required setup step

Authorize a Google account or service account that can read the verified `sc-domain:jacked.coach` property in Search Console, then provide one of the supported environment-variable/configuration paths in [docs/search-console-setup.md](../../docs/search-console-setup.md). The smallest practical one-run path is a bearer token in `GSC_ACCESS_TOKEN` with the `webmasters.readonly` scope.

## Limitations

- This is a blocked access baseline, not evidence that Google has zero impressions.
- Search Console data freshness, property verification, sitemap fetch status, anonymized queries, API row limits, and top-row sampling remain unverified.
- The raw files are header-only and preserve the intended schema: detailed dimensions requested were `date,query,page,device,country,searchAppearance`.
- No technical URL audit, crawl test, canonical check, or sitemap fetch check is included here.
- No Mixpanel or App Store outbound-event data is included in this Search Console report.
