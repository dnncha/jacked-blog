# Acquisition report

Generated: 2026-08-08T07:32:01.738Z

Status: **BLOCKED**

This report connects search visibility to web and product acquisition only when the corresponding source export is present. Null values mean the source was missing or had no usable rows; they do not mean zero activity.

## Source status

| Source | Status | Rows | File |
| --- | --- | ---: | --- |
| Search Console queries | empty | 0 | /Users/donncha/Documents/GitHub/jacked-blog/reports/seo/search-console-queries.csv |
| Search Console pages | empty | 0 | /Users/donncha/Documents/GitHub/jacked-blog/reports/seo/search-console-pages.csv |
| Web analytics | missing | 0 | not supplied |
| App Store Connect | missing | 0 | not supplied |
| App analytics | missing | 0 | not supplied |

## Funnel

| Stage | Value |
| --- | ---: |
| Non-brand search impressions | unknown |
| Search clicks | unknown |
| Web page views | unknown |
| Tool starts | unknown |
| Tool completions | unknown |
| App Store outbound clicks | unknown |
| Downloads | unknown |
| First workouts | unknown |
| Completed workouts | unknown |

## Required next inputs

- **Search Console:** Run scripts/search-console-export.mjs with an authorized read-only token.
- **Web analytics:** Export EU Mixpanel events or provide an approved aggregate event CSV.
- **App Store Connect:** Provide a campaign-linked App Store Connect export.
- **App analytics:** Provide an attribution-safe activation export.

## Decisions

- Keep search visibility, web behaviour, App Store activity, and app activation as separate evidence layers.
- Do not interpret blocked connectors as zero traffic.
- Do not declare an experiment winner without a predeclared window, sufficient sample, and rollback path.
