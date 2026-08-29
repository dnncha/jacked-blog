# Editorial quality and SEO gate

This document records the source-controlled quality gate for the training-library articles. It complements `docs/editorial-policy.md`; it does not replace a factual review by a named author or qualified reviewer.

## Scope

- Pass date: 2026-08-15.
- Inventory checked: 262 Markdown articles under `content/blog/`.
- Canonical articles scored: 248.
- Legacy or merged URLs routed to canonical articles: 14.
- Audit command: `node scripts/editorial-audit.mjs --write`.
- Generated evidence: `reports/seo/editorial-audit.csv` and `reports/seo/editorial-audit.md`.
- The audit evaluates search intent, title and description output, outline depth, practical application, internal navigation, limitation language, source signals, and high-risk wording.

## Mechanical release gate

Every article should have:

1. A clear title and search description that can be rendered without abrupt truncation.
2. A useful outline with an answer early in the article and an application path.
3. At least two relevant internal article or tool links.
4. A limitations section or equivalent careful, evidence-aware language.
5. Sources or a documented source-review queue when the article makes scientific, health, supplement, comparison, or compatibility claims.
6. No unsupported guarantees, absolute evidence claims, stale product promises, legacy brand CTAs, or malformed Markdown.

The article renderer supplies canonical URLs, date metadata, related articles, a table of contents, BreadcrumbList and BlogPosting structured data, and a visible updated date when `updatedAt` is present. `seoTitle`/description handling is intentionally bounded so long editorial titles and excerpts do not become poor search metadata.

## Current pass

The current pass has:

- reviewed all 262 source articles, with substantial rewrites for the highest-risk science, health, nutrition, product, and comparison anchors;
- removed unsupported hype and softened claims that exceeded the evidence;
- added practical application and evidence-limits sections where absent;
- added curated source sections and source-level internal links for the full article inventory;
- added `updatedAt` to the editorially processed pages and propagated it to the generated bundle, sitemap, Open Graph, JSON-LD, and article UI;
- added a content-quality warning for non-product pages that still lack a source signal.

The latest mechanical audit reports 248 `ready`, 0 `improve`, 0 `hold-for-editorial-review`, and 14 `legacy-redirect` rows. All scored articles now expose source signals, but this does not mean every sentence has been independently fact-checked.

The scientific-claim triage reports 163 review findings across 107 canonical articles. These are prompts to check exact numbers, study descriptions, comparisons, and health language; many are intentionally cautious claims that still need a human to verify against the cited primary source. The report does not treat a source list as proof of every nearby sentence.

## Human review order

1. Start with the findings in `reports/seo/scientific-claim-audit.md`, prioritising health-sensitive claims, exact outcomes, product comparisons, and current-event claims.
2. For each page, identify the actual claim, verify the supporting source, and remove or qualify claims that the source does not support.
3. Add a real author and, where the subject is health-sensitive, a real qualified reviewer. Do not invent either.
4. Re-run the audit and repository tests after editorial changes.
5. Only then consider consolidation, noindexing, publication claims, or external search-submission work. Existing URLs should remain until Search Console, canonical, link, and user-value evidence has been checked.

## Verification recorded for this pass

- `git diff --check` passed.
- `node scripts/editorial-audit.mjs --write` passed: 248 ready, 0 improve, 0 hold, 14 legacy redirects.
- `node scripts/scientific-claim-audit.mjs` completed: 163 triage findings across 107 canonical articles; these remain human source-check prompts, not a claim that every sentence is defective.
- `npm run seo:audit` passed: 322 HTML/XML URLs audited and 3 non-HTML assets fetched (325 discovered URLs total), with 0 blocked, 0 broken internal links, and 0 sitemap/noindex conflicts.
- `npm run public:language` passed: 345 files checked.
- `npm run content:quality` passed: 262 published articles checked.
- `npm test` passed, including public-language, content-quality, acquisition, brand, conversion, analytics, accessibility, tool, SEO, and press checks.
- `npm run build` passed and prerendered 397 static pages, including the `/blog/[slug]` route with 262 article paths.

This pass is source/content work only. It does not publish, deploy, submit URLs, change provider configuration, or claim that the human source-review queue has been completed.
