# GrowthLab Network Micro-App

Standalone **Network** section built to match the existing GrowthLab network UI/UX and the [Network Section Build Prompt](https://example.com) spec. Use the same branding as GrowthStarter and Apps & Deals. Integrate into the main GrowthLab platform as a micro-app (e.g. mount at `/network` or subdomain).

## Brand & design

- **Colors:** Primary teal `#0F7377`, teal light `#00A884`; CSS vars in `app/globals.css`.
- **Classes:** `.gs-gradient`, `.gs-card-hover`, `.gs-glass`, `.gs-filter-active` (active filter chips).
- **Header:** Sticky glass header + “Exhibit your startup” CTA.
- **Navigation:** Directory tabs (Startup Directory · Investors · Mentors · Incubators & Accelerators · Industry Experts · Teachers · Government Agencies); active tab uses `gs-gradient` or teal highlight.

## Routes (spec-aligned)

| Route | Description |
|-------|-------------|
| `/` | Hub: My Network (stats, quick access cards, Connections / Pending / Suggestions tabs, CTA strip) |
| `/startups` | Startup Directory (filters, search, sort, card grid) |
| `/startups/exhibit` | Exhibit your startup (multi-step form, success state) |
| `/startups/[id]` | Startup detail |
| `/investors` | Investors |
| `/mentors` | Mentors |
| `/incubators-accelerators` | Incubators & Accelerators |
| `/industry-experts` | Industry Experts |
| `/teachers` | Teachers |
| `/government` | Government Agencies |
| `/connections` | My Connections |

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Integrate into main platform

1. **Same origin:** Build with `basePath: '/network'` and deploy the app under the main domain so routes become `/network`, `/network/startups`, etc.
2. **Subdomain:** Deploy at e.g. `network.growthlab.com` and link from the main app’s “Network” nav.
3. **Auth:** Send auth token (e.g. `Authorization: Bearer <token>`) for “Exhibit” and “Join directory” when wiring to your backend.

## Tech stack

- Next.js 14 (App Router)
- Tailwind CSS
- Lucide icons
- No shadcn/Radix (minimal UI in-repo for portability)
