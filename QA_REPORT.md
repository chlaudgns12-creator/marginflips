# MarginFlips V1 — QA Report

## Production Cycle 1 — 2026-09-11

Added one crawlable page: `/guides/ebay-sold-comps/` (24 to 25 sitemap URLs; six calculators unchanged). The existing guide template supplies navigation, typography, Article JSON-LD, canonical, og:url, and the unchanged $9.99 Payhip CTA. The Guides index and sitemap include the guide automatically.

Candidate review:

- **eBay sold comps guide — selected.** Addresses the concrete intent of finding sold items and interpreting comparable prices. Existing sourcing guides mention sold evidence but do not teach matching condition, accepted offers, shipping normalization, exclusions, or a repeatable evidence record. Connects directly to maximum buy price and the workbook's sourcing/sales workflow. Search opportunity is qualitative; no search-volume or ranking claim is made.
- **Sell-through rate tool — deferred.** Useful demand intent, but sold/active ratios and time-window inventory metrics can answer different questions; an unsupported denominator would make a quick calculator misleading. Official eBay Product Research already provides its own metrics.
- **Dimensional shipping weight guide — deferred.** Useful shipping intent, but carrier/service-specific rules require greater maintenance and connect less directly to the workbook than sourcing evidence does.

Primary research checked: [eBay Product Research](https://www.ebay.com/help/selling/selling-tools/product-research?id=4853), [eBay Advanced Search](https://www.ebay.com/sch/ebayadvsearch), and [USPS package preparation](https://www.usps.com/ship/packages.htm). The selected guide cites the two eBay sources in context. All example prices and fees are expressly hypothetical.

Validation:

- `npm test`: PASS, including all pre-existing regression checks, every generated page's internal links and SEO, sitemap coverage, Google verification, custom 404 and Cloudflare configuration.
- Additional checks: six calculators' normal and zero cases, rejection of nonfinite/negative inputs (except legitimate negative ROI profit), reverse-price fees at 100% and 101%, guide discovery and sources, and both worked-example purchase ceilings ($14.76 and $16.50): PASS.
- Browser visual inspection at 1440 x 900 and 390 x 844: PASS. Article, formulas, CTA and footer fit the existing design. At 320 x 740: no horizontal overflow. Mobile menu opens/closes, and the guide is present in the Guides listing. Linked calculator route loads.
- Browser calculation of the guide's $38 scenario: $14.76. Literal Infinity input produces the validation message, with no browser console errors. The new guide itself has no form or numeric input; guide-specific input boundaries are not applicable.
- Compared 24 pre-existing page bodies (all except the Guides listing) against the pre-cycle commit: unchanged. Calculator JS, shared CSS, and Cloudflare configuration: unchanged. Existing prices and Payhip URL: unchanged.
- `git diff --check`: PASS.

Build artifact reconciliation: committed `dist` had stale SEO host values and an unsupported legacy 404 rewrite despite the existing build/config already targeting Cloudflare. A clean build synchronizes existing page metadata and robots.txt to the configured production origin, removes `dist/_redirects`, and emits `dist/404.html` from the existing 404 page. This adds no second content page and changes no calculator body or formula.

Production handoff: after the ordinary main push, allow the existing Cloudflare integration to deploy. A person should confirm deployment success, the new guide and Guides link, mobile readability, canonical/og:url/Article URL and sitemap, calculator links, and the unchanged Payhip CTA. Deployment completion is not claimed by local QA.

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
