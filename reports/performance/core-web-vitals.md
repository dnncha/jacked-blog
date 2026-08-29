# Core Web Vitals audit

Run: 2026-08-17T08:50:09.497Z

## Measurement boundary

This run used dependency-free HTTP fetches against `https://jacked.coach`. It did not run Lighthouse, a browser, JavaScript interaction, a throttled mobile trace, CrUX, or PageSpeed Insights. LCP, INP, and CLS are therefore **not measured by this crawl** and no Core Web Vitals pass/fail claim is made. The site now emits privacy-safe, rounded web_vital_measured events when a page is hidden or navigated away; live field readback is still unavailable in this lane.

## Available HTTP timing signal

Successful HTML responses in the audited set: 326

- HTTP response duration p50: 19 ms
- HTTP response duration p75: 21 ms
- HTTP response duration p95: 25 ms

These durations include network and response-body transfer from this machine. They are not TTFB and must not be substituted for LCP, INP, or CLS.

## Required next measurement

Run representative home, acquisition, tool, and article templates in a browser on a throttled mobile profile with JavaScript enabled and disabled where relevant. Record field or lab evidence for LCP, INP, CLS, total blocking time, transferred bytes, image dimensions, video loading, hydration cost, font shifts, and third-party script cost. Compare the homepage hero, app-preview video, Mermaid requests, Mixpanel initialization, and the largest tool/article templates before changing implementation; then compare the field web_vital_measured sample by template, viewport class, and date range.
