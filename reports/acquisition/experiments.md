# Acquisition experiments

## Baseline status

No experiment is declared a winner in this snapshot. Search Console and EU Mixpanel access are not yet represented by a source-backed report, so traffic and conversion volumes must be supplied before evaluating a change. The acquisition report now provides arm-level comparison diagnostics once those exports arrive.

## Candidate sequential experiments

| Hypothesis | Change | Primary metric | Guardrails | Status |
| --- | --- | --- | --- | --- |
| A direct answer improves qualified engagement | Replace generic hero preamble with the tool answer and one CTA | Tool completion rate from landing page | Page views, error-visible events, mobile usability | Ready to define baseline |
| Product proof improves outbound intent | Add a real, dated product screenshot beside the result | App Store outbound clicks per completed tool | No unsupported feature claims; preserve campaign token | Needs current app evidence |
| A result-specific CTA is stronger | Use the completed task's campaign and placement in the final CTA | Attributable outbound clicks per completion | No duplicate click events; no navigation regression | Instrumentation in progress |
| Import evidence reduces uncertainty | Show supported columns, an anonymised fixture, and failure cases | Import-checker completion rate | Never upload or log CSV contents | Needs fixture review |
| A persistent mobile handoff recovers intent | Add a safe-area mobile dock after the acquisition-page proof sections | Unique mobile-dock App Store outbound sessions per mobile-dock CTA-view session | No overflow, no obscured content, no duplicate credit, preserve campaign markers | Local candidate; baseline required |
| An outcome-led homepage promise improves qualified intent | Stable 50/50 homepage hero copy and App Store campaign assignment | Unique homepage hero outbound sessions per unique hero CTA-view session | No fallback exposure counted as treatment; preserve first-viewport geometry and SEO | Implemented locally; baseline required |
| Transparent methodology reduces decision uncertainty | Link a formula-and-assumptions page from the tools hub and sitewide footer | Tool starts and App Store outbound sessions per qualified methodology visit | No unsupported scientific or performance claims; preserve privacy boundary and page speed | Implemented locally; baseline required |

## Decision rules

Predeclare the exposure window and minimum sample before starting. The shared report requires at least 100 unique CTA-view sessions per arm and a 95% uncertainty interval that excludes no change before a treatment can be decision-eligible; this is not a substitute for power analysis or guardrail review. Stop if the change introduces a privacy issue, unsupported product claim, broken CTA, material mobile regression, or repeated runtime error. Retain the previous copy and route as the rollback path until the result is reviewed.
