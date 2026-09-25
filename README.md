# Comp Pulse

Tracking advertised salary-range maxima across roles using aggregate public job-posting observations.

**[View the dashboard](https://jschulman.github.io/comp-pulse)**

## What this measures

How does the median advertised salary-range maximum change within the observed crypto-native employer sample?

```
p50(t) = median extracted salary-range maximum among eligible open listings
index(t) = p50(t) / p50(baseline observation) × 100
```

This is an **all-role** measure, including engineering, product, sales and finance, across observed locations and employers. The existing index includes all tracked open listings with a usable range, including companies excluded from prospecting. That scope is preserved. It is not a finance-specific series. The index is anchored at the first usable observation on or after 2026-05-20; the actual baseline date is published in metadata. Absolute salary values and company-level salary ranges are not published.

Version 2.0 deltas compare the latest index with the mean of the complete prior 7-, 30- or 90-calendar-day window, excluding the current observation. A missing or unknown day makes that comparison unknown; a window does not become statistically reliable merely because 30 or 90 calendar days have passed. Legacy version 1.0 exports used the previous N observed rows, which could span more than N calendar days when collection was interrupted. Follow snapshot metadata when comparing versions.


The crypto-native baseline is preserved. It is a selected employer sample, not a measure of adoption across incumbent banks, brokers or payment processors. See [Financial Rails](https://jschulman.github.io/stablecoin-signal/#financial-rails) and the separate [incumbent employer panel](https://jayschulman.com/blockchain#incumbent-panel).

See [METHODOLOGY.md](METHODOLOGY.md) for the current definitions, role coverage, historical changes and limitations. Missing percentages display as unknown; historical charts preserve gaps. Requested skills, persistent job listings and advertised pay do not by themselves establish adoption or demand for professional services.

## Architecture and refresh

- `docs/` — static HTML, JavaScript and CSS, served by GitHub Pages.
- `data/` and `docs/data/` — published aggregate snapshots from the private producer.
- `.github/workflows/` — publishing automation.
- `tests/` — renderer regression checks for measured zero, missing data and historical compatibility.

The private producer polls public Ashby, Greenhouse and Lever job-board feeds. Daily refresh is intended, but the observation date and coverage determine freshness. No individual job descriptions or private employer records are published here. The source location and scheduled publishing roots remain unchanged.

Run the renderer checks with `node --test tests/*.test.cjs`.

## The Crypto Canaries

- [CFO Gap](https://jschulman.github.io/cfo-gap) — persistent finance listings.
- [Crypto Tool Curve](https://jschulman.github.io/crypto-tool-curve) — tool and operational-skill demand.
- [Compliance Canary](https://jschulman.github.io/compliance-canary) — credential and control demand.
- [Comp Pulse](https://jschulman.github.io/comp-pulse) — advertised salary-range index.

Related: [Stablecoin Signal](https://jschulman.github.io/stablecoin-signal) · [Displacement Curve](https://jschulman.github.io/displacement-curve) · [Quantum Qanary](https://jschulman.github.io/quantum-qanary).

MIT — see [LICENSE](LICENSE).

— Jay Schulman · [jayschulman.com](https://jayschulman.com)
