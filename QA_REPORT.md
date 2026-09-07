# MarginFlips V1 — QA Report

Date: 2026-09-07

## Automated checks

- All required routes and static assets exist.
- JavaScript parses without syntax errors.
- Internal crawlable links resolve to generated pages.
- The exact Payhip checkout URL is present.
- `robots.txt`, `sitemap.xml`, canonical URLs, meta descriptions, Open Graph text, and basic structured data are included.

## Calculator test matrix

| Calculator | Normal | Loss | Zero cost | High fee | Blank | Invalid | Edge protection |
|---|---:|---:|---:|---:|---:|---:|---:|
| Profit | Pass | Pass | Pass | Pass | Pass | Pass | No NaN/Infinity |
| ROI | Pass | Pass | Pass | N/A | Pass | Pass | Zero investment explained |
| Break-even | Pass | N/A | Pass | Pass | Pass | Pass | Fee ≥100% rejected |
| Maximum buy | Pass | Pass | Pass | Pass | Pass | Pass | Impossible target explained |
| Marketplace fee/profit | Pass | Pass | Pass | Pass | Pass | Pass | Editable assumptions labeled |
| Offer | Pass | Pass | Pass | Pass | Pass | Pass | Target miss explained |

## Manual formula spot checks

- Profit example: $80 sale, $24 item cost, 13% fee, $0.30 fixed fee, $8.50 shipping, $1.20 packaging, $2 ads → fees $10.70, total costs $46.40, net profit $33.60, margin 42%, ROI 140%.
- Break-even example: $34 fixed costs and 15% percentage fee → $40.00.
- ROI example: $25 profit on $30 investment → 83.33%.
- ROI loss example: $100 investment and -$20 net profit → -20.00%. Automated test confirms negative Net Profit is accepted only in the ROI Calculator.
- ROI zero-investment case: $0 investment and -$20 net profit → ROI unavailable. Automated test confirms no division-by-zero, NaN, or Infinity output.
- Offer and maximum-buy calculations recompute percentage fees from the offered/expected sale price.

## Trust and readiness

- No fake reviews, users, earnings, ads, affiliate links, or affiliations.
- Fee assumptions are editable and explicitly described as potentially outdated.
- Legal pages disclose estimate limitations and non-affiliation.
- Layout includes responsive breakpoints, visible focus states, mobile-friendly inputs, and reduced-motion support.
- Optional future ad areas can be inserted between content sections without blocking tools or results; no fake ad slots are displayed.

## Owner action before public custom-domain launch

No required owner-side coding remains for the hosted V1.
