# Acquisition experiments

## Baseline status

No experiment is declared a winner in this snapshot. Search Console and EU Mixpanel access are not yet represented by a source-backed report, so traffic and conversion volumes must be supplied before evaluating a change.

## Candidate sequential experiments

| Hypothesis | Change | Primary metric | Guardrails | Status |
| --- | --- | --- | --- | --- |
| A direct answer improves qualified engagement | Replace generic hero preamble with the tool answer and one CTA | Tool completion rate from landing page | Page views, error-visible events, mobile usability | Ready to define baseline |
| Product proof improves outbound intent | Add a real, dated product screenshot beside the result | App Store outbound clicks per completed tool | No unsupported feature claims; preserve campaign token | Needs current app evidence |
| A result-specific CTA is stronger | Use the completed task's campaign and placement in the final CTA | Attributable outbound clicks per completion | No duplicate click events; no navigation regression | Instrumentation in progress |
| Import evidence reduces uncertainty | Show supported columns, an anonymised fixture, and failure cases | Import-checker completion rate | Never upload or log CSV contents | Needs fixture review |

## Decision rules

Predeclare the exposure window and minimum sample before starting. Stop if the change introduces a privacy issue, unsupported product claim, broken CTA, material mobile regression, or repeated runtime error. Retain the previous copy and route as the rollback path until the result is reviewed.
