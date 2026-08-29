# Search Console export setup

This repository contains a dependency-free exporter for the Google Search Console Search Analytics API:

```sh
node scripts/search-console-export.mjs --ranges max,90d,28d
```

The exporter writes these files under `reports/seo/`:

- `baseline.md`: summarized Markdown, or an explicit `BLOCKED` report when access is unavailable.
- `search-console-pages.csv`: page, date, device, country, and search-appearance rows.
- `search-console-queries.csv`: query, date, device, country, and search-appearance rows, with documented classification columns.
- `query-page-cannibalization.csv`: queries associated with more than one returned page in a requested range.
- `search-console-dimensional.csv`: optional raw rows using the configurable detailed dimensions.

The script never creates, prints, or writes credentials. Use an environment variable or a JSON configuration file outside the repository. The repository already ignores `.env*.local`; verify any local file before sourcing it with `git check-ignore -q .env.local`.

## Property and Search Console checks

The default property is `sc-domain:jacked.coach`, because a verified domain property is preferred. Confirm the exact property in Search Console before exporting. If only a URL-prefix property is verified, override it:

```sh
export GSC_PROPERTY='https://jacked.coach/'
```

After access is available, confirm the sitemap separately in Search Console:

1. Open the selected property.
2. Open **Sitemaps**.
3. Inspect `https://jacked.coach/sitemap.xml`.
4. Record the submission status and latest successful fetch date in the relevant technical audit. This exporter does not infer sitemap status from Search Analytics data.

## Fast one-run access-token path

Use an OAuth 2.0 bearer token with this read-only scope:

```text
https://www.googleapis.com/auth/webmasters.readonly
```

The Google OAuth 2.0 Playground is a practical way to obtain a token without adding an authentication library to the site:

1. Create or select a Google Cloud project and enable the **Search Console API**.
2. In **APIs & Services → Credentials**, create an OAuth client ID. A **Desktop app** client is suitable for a local export.
3. Open [Google OAuth 2.0 Playground](https://developers.google.com/oauthplayground). In the settings, enable **Use your own OAuth credentials** and enter that client ID and secret.
4. In Step 1, enter `https://www.googleapis.com/auth/webmasters.readonly`, authorize the Google account that has access to the selected Search Console property, and exchange the authorization code in Step 2.
5. Export the returned access token into the current shell only:

```sh
export GSC_ACCESS_TOKEN='paste-the-short-lived-token-here'
node scripts/search-console-export.mjs --property 'sc-domain:jacked.coach' --ranges max,90d,28d
```

Do not place the token in a tracked file, shell history, report, issue, or commit. For repeatable local runs, use the refresh-token path below rather than saving an access token.

## OAuth refresh-token path

The script can exchange a previously authorized OAuth refresh token for a fresh access token. Keep all three values outside the repository:

```sh
export GSC_OAUTH_CLIENT_ID='...'
export GSC_OAUTH_CLIENT_SECRET='...'
export GSC_OAUTH_REFRESH_TOKEN='...'
node scripts/search-console-export.mjs
```

The client must have been authorized by a Google account that is a user of the Search Console property. The script requests only `webmasters.readonly` and sends the resulting bearer token in the HTTP `Authorization` header.

## Service-account path

Use this for unattended local or CI-like exports when the property owner permits a service account:

1. In a Google Cloud project, enable the **Search Console API**.
2. Create a service account under **IAM & Admin → Service Accounts**.
3. Create a JSON key for that service account and save it outside this repository, for example under `~/.config/jacked/`. The script does not create or copy this file.
4. In Search Console, open the exact property’s **Settings → Users and permissions** and add the service account’s `client_email` as a user with the minimum permission that allows performance read access. Use the domain property `sc-domain:jacked.coach` or the exact URL-prefix property selected above.
5. Point the exporter at the key without exposing its contents:

```sh
export GSC_SERVICE_ACCOUNT_FILE="$HOME/.config/jacked/search-console-reader.json"
node scripts/search-console-export.mjs --ranges max,90d,28d
```

The exporter creates and signs a short-lived JWT in memory, exchanges it at `https://oauth2.googleapis.com/token`, and requests the read-only Search Console scope. It does not log the JWT, private key, or returned access token.

An inline `GSC_SERVICE_ACCOUNT_JSON` environment variable is also accepted, but a file outside the repository is easier to audit and less likely to be copied into logs.

## Ignored local JSON configuration

Instead of several environment variables, set `GSC_CONFIG_FILE` to an ignored or out-of-repository JSON file. The script reads it but never writes it. Example shape:

```json
{
  "property": "sc-domain:jacked.coach",
  "ranges": "max,90d,28d",
  "dimensions": "date,query,page,device,country,searchAppearance",
  "rowLimit": 1000,
  "maxRows": 10000,
  "dataState": "final",
  "serviceAccountFile": "/Users/you/.config/jacked/search-console-reader.json"
}
```

Run it with:

```sh
export GSC_CONFIG_FILE='/absolute/path/outside/the/repository/search-console.local.json'
node scripts/search-console-export.mjs
```

Do not add a real token, private key, OAuth secret, or refresh token to this repository. If a configuration path is used inside the repository, confirm it is ignored before creating it.

## Date ranges, dimensions, and pagination

Defaults are deliberately conservative:

- `max`: a 16-calendar-month lookback ending three UTC days before today. Override `GSC_MAX_HISTORY_START_DATE` when the property’s actual history start is known.
- `trailing-90d`: 90 inclusive days.
- `trailing-28d`: 28 inclusive days.
- `dataState=final`: finalized rows only. Use `--data-state all` only when the report is explicitly intended to include fresh, changeable data.
- `rowLimit=1000`: API page size. The Search Console API permits up to 25,000 rows per request; the script continues with `startRow` until an empty page or `maxRows` is reached.
- `maxRows=10000`: local cap per query and range. Set `--max-rows 0` to remove the local cap after considering output size and the API’s bounded row availability.

Examples:

```sh
# One explicit range.
node scripts/search-console-export.mjs \
  --start-date 2026-01-01 \
  --end-date 2026-07-31

# A smaller detailed export while retaining the fixed page/query views.
node scripts/search-console-export.mjs \
  --ranges 28d \
  --dimensions date,query,page,device,country,searchAppearance \
  --row-limit 2500 \
  --max-rows 10000

# Skip only the optional all-dimension CSV.
node scripts/search-console-export.mjs --no-detailed
```

The fixed output views use these dimensions:

- Pages: `date,page,device,country,searchAppearance`.
- Queries: `date,query,device,country,searchAppearance`.
- Cannibalization: `query,page`, aggregated to queries with more than one returned page.
- Detailed raw CSV: the `--dimensions`/`GSC_DIMENSIONS` value, defaulting to `date,query,page,device,country,searchAppearance`.

## Branded, non-branded, commercial, and utility filters

`search-console-queries.csv` and `query-page-cannibalization.csv` contain `brand_class` and `intent_view` columns. These are local, documented filters over the returned query text:

- `brand_class=branded` when the normalized query contains `surpass`, `surpass app`, `surpass strength`, `surpass workout`, `surpass coach`, `jacked`, `jacked coach`, `jacked workout app`, or `jacked workout log`.
- `brand_class=non-branded` for every non-empty query not matching those terms.
- `intent_view=commercial` when the query contains `workout tracker`, `hypertrophy app`, `progressive overload app`, `Hevy alternative`, `Strong alternative`, `FitNotes alternative`, or `gym workout planner`.
- `intent_view=utility` when the query contains `next set calculator`, `RIR calculator`, `weekly volume calculator/checker`, `warm-up calculator`, `plate calculator`, `1RM/one rep max calculator`, or `workout CSV validator`.
- `intent_view=other` for other non-empty queries.

These labels are analysis filters, not claims that Search Console reports an intent category. A query may be non-branded and commercial or utility at the same time.

## Data limitations

The Search Analytics API returns grouped rows rather than a complete event stream. It can omit anonymized queries, expose only a bounded top set, and return fewer rows than the true long tail. The baseline therefore uses the aggregate no-dimension response for property totals and labels query/page-derived counts as returned-row views. Search Console data is also subject to Google’s processing delay.

The exporter does not access Mixpanel, App Store Connect, credentials, production application state, or private customer data. It cannot answer App Store outbound activity, download, or first-workout questions. The technical URL audit remains a separate task.

Official references: [Search Analytics: query](https://developers.google.com/webmaster-tools/v1/searchanalytics/query), [Getting your performance data](https://developers.google.com/webmaster-tools/v1/how-tos/all-your-data), and [Using OAuth 2.0 for server-to-server applications](https://developers.google.com/identity/protocols/oauth2/service-account).
