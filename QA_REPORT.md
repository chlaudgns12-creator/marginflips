# MarginFlips V1 — QA Report

## Production Cycle 2 — 2026-09-11

Added one guide: `/guides/stale-ebay-inventory/` — **How to Handle Stale eBay Inventory**. Production Tools, Guides, the Cycle 1 sold-comps guide, and the $9.99 product page were inspected in the browser before selection. Baseline: six calculators, nine guides, 25 sitemap URLs. Result: six calculators, ten guides, 26 sitemap URLs.

Candidate comparison (editorial assessment, not measured search volume):

| Candidate | Practical/search intent | Overlap and tool connection | Workbook fit | Decision |
| --- | --- | --- | --- | --- |
| Lot cost allocation calculator | Assign a bulk purchase cost across inventory; recurring reseller question | Distinct, but a simple equal split is insufficient for mixed-value lots; needs a clearly chosen allocation method | Sourcing and sales records | Useful future candidate; narrower than the selected workflow |
| Markdown profit calculator | Understand profit after a price cut | Largely duplicates entering a lower price in the existing Offer Calculator | Offer Analyzer | Do not create a redundant calculator |
| Stale inventory review guide | Decide what to do with unsold stock and when a reduction makes sense | Adds post-listing diagnosis and action review, then uses sold comps, Offer, Break-Even and Profit tools | Offer Analyzer plus sourcing/sales records | Selected: actionable workflow beyond a single calculation |

Problem research included recurring seller questions about [aging inventory reductions](https://www.reddit.com/r/eBaySellerAdvice/comments/12iftnr) and [repricing listings](https://www.reddit.com/r/Flipping/comments/1bbahyl). These are qualitative intent signals only, not evidence for universal timing or performance claims. The guide uses original editorial wording, no copied discussion text, and no ranking or revenue promises.

Product facts are supported in context by [eBay Seller Hub](https://www.ebay.com/help/selling/selling-tools/seller-hub?id=4095), [Page views](https://www.ebay.com/help/selling/listing-tips/listings/page-views?id=4165), and [Revise a listing](https://www.ebay.com/help/selling/listings/creating-managing-listings/revising-listing?id=4356). Hypothetical example amounts are explicitly identified; the 30-day page-view window is sourced. Review cadence is left to category and seller constraints.

QA results:

- Build and all existing regression tests: PASS. All 26 sitemap pages have consistent canonical, og:url and structured-data URLs; internal links, robots, verification, custom 404 and hosting configuration checks pass.
- New guide examples: independent integer-cent arithmetic and existing calculator output agree on $22.70/$14.00/$9.65 profit, $13.05 profit reduction, 25% markdown and approximately $33.91 break-even. Offer targets at $45 and $50 are checked in regression tests and in the browser.
- Visual QA: full-page desktop 1440 x 900 and mobile 390 x 844 inspected; headings, formulas, lists and CTA remain legible in the existing layout. No horizontal overflow at 390px or 320px. Mobile menu works. Guides-to-guide-and-back and guide-to-Offer navigation work. No observed browser console errors.
- New page has one H1 and no input form; calculator-specific new-input QA does not apply. Existing six-calculator normal/zero/nonfinite/negative and reverse-fee regression checks remain PASS.
- Scope comparison against the Cycle 1 commit: exactly one new sitemap URL; 33 existing artifacts/source/config files unchanged after normalizing line endings, excluding only the intentionally updated Guides listing and sitemap. Homepage, existing guide contents, all calculator formulas, CSS, product price, Payhip links and robots remain unchanged.
- `git diff --check`: PASS. Changes are limited to build.mjs, tests.mjs, this QA record, the new generated guide, Guides listing and sitemap.

Production handoff: confirm the Cloudflare deployment for the pushed commit completes, then verify the guide route, Guides listing, mobile menu/readability, related free-tool links, unchanged $9.99 Payhip CTA, and SEO/sitemap values. Local PASS does not claim that the new production deployment has finished.

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
