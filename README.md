# KDermaDentist

KDermaDentist is a premium orthodontic clinic website built as a React single-page experience with a polished public front end, animated sections, and an admin area for managing news content. The design is tuned to feel clean, modern, and patient-friendly while still giving the site a strong editorial presence.

The public experience uses bundled fallback content so the main marketing pages stay readable even when the local API is not running. The admin and article management flows still rely on the Express backend in `server.ts` during local development.

## What It Includes

   A refined landing page with hero content, service highlights, trust signals, and contact sections that introduce the clinic quickly.
   A news and updates area that loads live articles when the API is available and falls back to seeded content when it is not.
   A treatment-flow subpage that explains the process in a more guided, step-by-step format.
   A protected admin dashboard for logging in, editing articles, and managing scheduled content.
   A responsive contact section with map, form, and supporting clinic details.
   Motion-driven UI details and card transitions that make the site feel more premium without becoming distracting.

## Key Sections

   The hero section establishes the brand with a large visual frame, strong typography, and clear calls to action.
   The about and services sections explain the clinic offering in a concise, trustworthy way.
   The updates section surfaces the latest clinic news and educational articles.
   The team, equipment, and testimonials sections add credibility and social proof.
   The contact section brings together the map, form, and practical visitor information.
   The admin pages support content editing without exposing the management flow to regular visitors.

## Technologies

   React 19
   Vite
   TypeScript
   Tailwind CSS 4
   Motion for UI transitions
   Express for the local API
   GitHub Pages for static deployment

## Visual Style

The design leans into a calm medical aesthetic with a stronger premium finish:

   Soft white and blue surfaces for clarity and trust.
   Dark slate text for readable contrast.
   Gentle shadows, rounded cards, and layered spacing.
   Blue accent details to reinforce the clinic identity.
   Smooth motion and subtle reveal effects instead of heavy animation.

## Project Structure

   src/App.tsx controls the page routing and high-level layout.
   src/components/ contains the marketing sections, admin UI, and content modules.
   src/lib/kdermaApi.ts handles article and admin API requests.
   defaultArticles.ts provides fallback article content for the public news area.
   server.ts runs the local Express API used by the admin and articles features.
   .github/workflows/deploy.yml publishes the built site to GitHub Pages.

## Development

   npm install installs dependencies.
   npm run dev starts the Vite frontend on port 3000.
   npm run api starts the local Express backend on port 3001.
   npm run build creates the production bundle for GitHub Pages.
   npm run lint runs the TypeScript check.

## Live Site

GitHub Pages deployment is configured for the repository path `/KDermaDentist/`.

The public site will be available at:

https://<your-github-username>.github.io/KDermaDentist/

The admin and article management features still need the Express API from `server.ts` or another hosted backend to be fully functional outside local development.
