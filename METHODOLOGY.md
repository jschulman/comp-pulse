# Methodology

How does the median advertised salary-range maximum change within the observed crypto-native employer sample?

```
p50(t) = median extracted salary-range maximum among eligible open listings
index(t) = p50(t) / p50(baseline observation) × 100
```

This is an **all-role** measure, including engineering, product, sales and finance, across observed locations and employers. The existing index includes all tracked open listings with a usable range, including companies excluded from prospecting. That scope is preserved. It is not a finance-specific series. The index is anchored at the first usable observation on or after 2026-05-20; the actual baseline date is published in metadata. Absolute salary values and company-level salary ranges are not published.

Version 2.0 deltas compare the latest index with the mean of the complete prior 7-, 30- or 90-calendar-day window, excluding the current observation. A missing or unknown day makes that comparison unknown; a window does not become statistically reliable merely because 30 or 90 calendar days have passed. Legacy version 1.0 exports used the previous N observed rows, which could span more than N calendar days when collection was interrupted. Follow snapshot metadata when comparing versions.

## Extraction, sample and disclosure

The producer extracts salary ranges from supported public job-board fields and description formats. Only parsed ranges contribute; omitted or unsupported formats do not. Source coverage differs across ATS providers and can change with parser updates. The maximum of a disclosed range is the input, not an accepted offer, average employee pay or total compensation.

The disclosure table reports listings with extracted ranges, all observed open listings, and the resulting share. Version 2.0 multi-day rows require every daily observation in the window; otherwise values are unknown. Complete windows contain rounded average counts and mean daily disclosure rates, so the displayed ratio of averages may differ slightly from the average rate. Sample counts and company breadth are shown when supplied; missing company counts remain unknown. No dollar salaries are exposed by this dashboard.

## Sources and coverage

The private producer polls public Ashby, Greenhouse and Lever job-board feeds and publishes aggregates here. The crypto-native baseline is a selected, evolving employer sample; it is not a census or a representative survey. Company additions, exclusions, title classification, job-board coverage and collection failures can change the sample. Companies without observed eligible jobs are not represented in a JD denominator.

The baseline is retained separately from any expanded panel of incumbent financial businesses. An incumbent employer must not be added to this series simply to widen market observation. Employer type, infrastructure-provider role and use case are separate attributes in the expanded research panel. A crypto-native firm can also provide financial infrastructure.

Daily refresh is the intended cadence. The date shown in the dashboard is the observation date, which can precede publication. A scheduled workflow or recent export is not proof that every employer feed was refreshed successfully. Snapshots live in `data/` and `docs/data/`; the dashboard reads `docs/data/latest.json`.

## Interpretation and limits

The index is descriptive context. A rise can result from more senior or higher-paying roles entering the sample, geography, employer mix, disclosure practices or actual changes to advertised bands. It cannot isolate a crypto or blockchain talent premium without a comparable outside employer group and matching roles, seniority and locations. It also cannot identify cost-of-living-adjusted pay, equity or total compensation.

Disclosure measures the parser's observed coverage, not a company's intent to become more or less transparent. A falling rate can reflect newly collected jobs or unsupported formats. Small or changing samples, an unrepresentative baseline and collection gaps remain material limitations even with a long history.

## Historical continuity

The original all-role index and anchor are retained. Version 2.0 aligns the disclosure denominator to all tracked open listings, matching the existing salary numerator; older disclosure percentages may have excluded some companies from their denominator and are not directly comparable. The interpretation update removes unsupported talent-premium labels, distinguishes missing values from zero and displays the observation date independently of publication. Changes to parsing, source coverage or window calculation require methodology metadata; old snapshots retain the method used at the time.

## Missing data and historical comparability

An unknown numerator or a zero/unknown denominator produces an unknown percentage, displayed as `—`; it is never interpreted as 0%. Missing calendar dates and unavailable values remain gaps in charts. A measured zero requires a known, positive denominator. Material definition changes can break comparability even where a chart is continuous.

The 2026-09-25 interpretation update removes unsupported success/failure verdicts. Version 2.0 producer snapshots identify the updated methodology in metadata; older snapshots retain their original version. Original aggregate series and URLs remain available. Generated snapshots are published by the producer, not fabricated by the dashboard.

## Reproducibility

Replicate the selected employer feeds, eligibility rules, title and text patterns, and snapshot date. Keep dated counts and denominators together. Save unique-job and company counts at collection time; do not derive old coverage from today’s database. The private producer owns collection and aggregation; this repository renders the published aggregates.
