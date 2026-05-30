# K‑DERMA

K‑DERMA is a single-page React site for a premium dermatology/clinic experience. It combines a polished marketing front-end with a lightweight admin area and a small Express API for article management. The design focuses on clear information hierarchy, approachable visuals, and smooth micro-interactions.

**What It Includes**
- **Fixed navigation:** a floating, glass-styled nav that keeps the brand visible while you scroll.
- **Polished hero:** cinematic hero area with strong typography, CTA and optional frame-sequence animation experiments.
- **Content sections:** About, Services, Team, Equipment, Testimonials and Contact with map and contact form.
- **News & editor:** Aktuality (news) list that loads live content from a local API or falls back to seeded articles.
- **Admin dashboard:** protected admin UI for creating and editing articles and schedules.
- **Interactive UI details:** buttons, reveal effects, and a small drawer-style CTA for appointment booking.

**Key Sections**
- **Hero:** full-bleed headline and primary CTA that establishes the visual tone.
- **About & Services:** service summaries and treatment flow that educate visitors.
- **Aktuality (News):** article list, single-article view and editorial cards.
- **Team & Testimonials:** staff profiles, credentials and patient feedback for credibility.
- **Contact:** embedded map, phone/mail links and a short booking CTA.
- **Admin:** login, article editor and schedule editor used by clinic staff.

**Technologies**
- **React 19**: UI framework powering the SPA.
- **Vite**: fast dev server and build tooling.
- **TypeScript**: typed codebase for reliability.
- **Tailwind CSS 4**: utility-first styling and design tokens.
- **motion**: animation primitives used across the UI.
- **Express**: small local API used by admin/article flows (`server.ts`).

**Visual Style**
- **Palette:** soft whites and neutral surfaces with a brand blue accent.
- **Typography:** `Plus Jakarta Sans` / `Outfit` for display headings and `Inter` for UI/body text (see `src/index.css`).
- **Texture:** subtle glass, rounded cards, soft shadows and restrained motion to keep the site feeling premium and calm.

**Project Structure (high level)**
- **[src/](src/)**: React app sources and components (see `src/components/` for sections and UI building blocks).
- **[public/](public/)**: static assets and fallback files used at runtime.
- **data/kderma-db.json**: seeded articles and local data store.
- **defaultArticles.ts**: fallback articles used when the API is unavailable.
- **server.ts**: small Express API used for article management during development.
- **package.json**: scripts and dependencies used by the project.

**Development**
Install dependencies and run the local dev server and API:

```bash
npm install
npm run dev       # starts Vite frontend (port 3000)
npm run api       # starts the local Express API (server.ts)
```

Build and preview production output:

```bash
npm run build
npm run preview
```

Run TypeScript checks:

```bash
npm run lint
```

**Local configuration & environment**
- The API uses `server.ts` for local article CRUD; you can run it with `npm run api` during development.
- Static data is stored in `data/kderma-db.json`; editing that file will change seeded content.

**Deployment / GitHub**
- This project can be published to GitHub Pages or any static host that serves the `dist/` build.

Commit and push example:

```bash
git add .
git commit -m "chore: update README and docs"
git push origin main
```

If you want, I can create a `.github/workflows/deploy.yml` workflow or update an existing one to automatically publish `dist/` after each release.

---

If you'd like, I can also:
- generate a short screenshot of the navbar branding,
- add a small CONTRIBUTING section with dev setup tips, or
- open a PR that adds a GitHub Actions deploy workflow.

Readme updated: [README.md](README.md)
