# Methodology

How Comp Pulse is computed, what its limits are, and how to read its numbers honestly.

## One question

In which direction is crypto-native middle-market compensation drifting?

## What gets published — and what doesn't

**Published every day:**
- The Comp Index value (anchored at 100 on the first data day, 2026-05-20)
- Percentage deltas vs trailing 7-day, 30-day, and 90-day averages
- The disclosure rate (what share of open listings include comp ranges)

**Never published:**
- Any specific company's salary range
- A per-listing salary number
- Median or absolute compensation in dollars
- Sub-sector breakdowns with fewer than 10 disclosed comps (to prevent re-identification)

The point of the canary is the *direction* of change, not the dollar number. A 4% rise in the index over a quarter tells you the crypto-native hiring premium is widening; the actual dollar median stays private.

## Data begins 2026-05-20

This canary started collecting on **2026-05-20**. The index is anchored at **100 = 2026-05-20 p50 disclosed compensation**. All deltas are versus this baseline or trailing rolling windows.

Until enough history accumulates, expect:
- The first 7 days: WoW delta is noise, not signal
- The first 30 days: MoM delta is provisional
- The first 90 days: 90-day delta is the first real trend you can quote

The canary becomes meaningful at 30 days. It becomes publishable as a trend at 90 days.

## The metric

For each daily snapshot:

```
p50(t) = median of comp_max across open listings disclosing comp on day t
index(t) = (p50(t) / p50(2026-05-20)) × 100
delta_7d(t) = (index(t) / mean(index over prior 7 days)) - 1
delta_30d(t) = (index(t) / mean(index over prior 30 days)) - 1
delta_90d(t) = (index(t) / mean(index over prior 90 days)) - 1
disclosure_rate(t) = (count of listings disclosing comp on day t) / (count of open listings on day t)
```

`comp_max` is used because (a) it's the more frequently-disclosed end of the range and (b) it captures the upper-band signal that drives competition for senior hires.

## Data source

The scanner polls public job-board APIs:
- **Ashby:** `https://api.ashbyhq.com/posting-api/job-board/{slug}` — exposes a `compensation` field on a subset of listings
- **Greenhouse:** `https://boards-api.greenhouse.io/v1/boards/{slug}/jobs?content=true` — comp is inside the `content` HTML field, regex-extracted
- **Lever:** does not expose comp in the public API (Lever-hosted companies are silent in this canary)

A JD-text regex extracts comp ranges from formats including `$120,000–$180,000`, `$120K to $180K`, `$120,000 - $180,000`, and `USD 120,000 to 180,000`. Both `comp_min` and `comp_max` are extracted where present.

All data is **public**. No portal logins. No robots.txt bypass. Per-domain rate limiting.

## Target universe

The canary draws from the same curated target list that powers the other Crypto Canaries: crypto-native middle-market companies (Series B–D, headcount roughly 50–500, last raise <36 months). The target list and scanner code are maintained privately; the methodology above is the canonical specification.

## Caveats and limits

- **Disclosure rate is the meta-story.** Today only ~16% of open listings disclose comp. The canary will surface changes in disclosure rate as a separate trend. Rising disclosure means more transparency; falling disclosure means companies are pulling ranges back.
- **Selection bias by ATS.** Greenhouse-hosted companies disclose comp ~25% of the time; Ashby ~19%; Lever 0%. Companies on Lever (notably Anchorage Digital with 70 open listings) contribute zero comp data. The index reflects the disclosing-companies population, not the entire crypto-native universe.
- **Selection bias by role.** Currently most disclosed-comp listings are engineering/product/sales roles. Finance roles in particular disclose comp at near-zero rates. The index is a corpus-wide blend, not a finance-specific signal.
- **First-period anchor.** The index is anchored at 2026-05-20. If that baseline day's disclosed comp was unrepresentative (small sample, outliers), the early-period deltas will be misleading. The methodology accepts this — at scale the noise washes out.
- **Geographic blend.** Roles span US/Remote/EU. The index is geographic-blend, not US-only.
- **Currency.** USD only. Non-USD ranges are excluded.

## What this cannot tell you

- A specific company's pay band
- Whether a specific role is over- or under-paid
- Cost-of-living-adjusted comp
- Equity or total-comp shifts (only base salary disclosure is parsed)

## Versioning

Methodology versions are tracked in this file. Material changes will bump the `version` field in `data/latest.json` and be noted here.

Current version: **1.0** (2026-05-20).

## Reproducibility

You can replicate Comp Pulse if you:
1. Curate your own list of crypto-native middle-market companies + their ATS slugs.
2. Poll their public job-board APIs daily.
3. Regex-extract `$XXX,XXX – $YYY,YYY` style ranges from job descriptions.
4. Compute the daily p50 of `comp_max`, then index and delta per the formulas above.

The methodology above is the canonical specification.
