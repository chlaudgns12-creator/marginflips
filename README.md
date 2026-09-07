# MarginFlips V1

Production-ready static website for English-speaking resellers. It includes six working calculators, eight original guides, product conversion pages, legal/trust pages, SEO files, future resources architecture, and analytics event hooks.

## Build and test

Requires Node.js 20 or newer.

```bash
npm run build
npm test
```

Deploy the generated `dist` directory to Cloudflare Pages, Netlify, GitHub Pages, or another static host. No backend, database, environment variables, macros, or paid service is required.

## Optional analytics

Key links and calculator actions expose privacy-neutral `data-event` attributes. The script pushes events to `window.dataLayer` only when a compatible analytics layer is added later. No analytics credentials or tracking service are included in V1.

Events: `calculator_view`, `calculator_completion`, `payhip_click`, `guide_visit`, and `hero_profit`.

## Before a custom-domain launch

Update canonical URLs and the sitemap if the production domain changes. Add a consent system and revise the Privacy Policy before enabling analytics or personalized advertising where required.

## Product checkout

All purchase calls to action use: https://payhip.com/b/pTi34
