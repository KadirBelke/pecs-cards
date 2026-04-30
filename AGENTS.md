# AGENTS.md

## Project Overview

- Project: Static Görsel İletişim Kartları web app for Turkish-speaking autistic children, parents, and teachers.
- Primary goal: Help users quickly browse, select, and use visual communication cards in Turkish.
- Product direction: Simple, calm, accessible, tablet-friendly, and easy to use in homes, classrooms, and therapy settings.
- Deployment target: Vercel.

## Positioning

- Use user-facing product wording such as "Gorsel Iletisim Kartlari" or "gorsel iletisim kartlari" rather than "PECS cards".
- PECS is a specific trademarked methodology, not a generic term for all visual communication cards.
- This project is a supportive visual communication tool and not an official PECS product.

## Core Principles

- Turkish-first UI. Turkish labels, instructions, navigation, and card text should be the default.
- Keep the experience simple. Favor low-friction navigation and obvious actions over feature depth.
- Optimize for touch. The main usage target is tablets and touch devices.
- Accessibility is a product requirement, not a follow-up task.
- Keep the MVP static. Do not introduce backend complexity.

## Tech Stack

- React
- Vite
- TypeScript
- Tailwind CSS for styling conventions and utility-first UI work
- Static JSON or TypeScript data files for card content
- No backend for MVP
- No database
- No authentication
- No paid third-party services

## Current Repository Commands

- Install dependencies: `npm install`
- Start local dev server: `npm run dev`
- Build production bundle: `npm run build`
- Run lint checks: `npm run lint`
- Preview production build locally: `npm run preview`

## Coding Style

- Use TypeScript everywhere for app code.
- Prefer small, focused React components with clear responsibilities.
- Keep file and folder structure easy to scan.
- Avoid large monolithic components.
- Prefer explicit props and simple state flows over abstraction-heavy patterns.
- Keep data structures straightforward and readable.
- Use static local data for cards and categories.
- Avoid premature optimization and unnecessary libraries.

## Suggested Structure

- `src/components`: Reusable UI components
- `src/features`: Feature-level screens or grouped functionality
- `src/data`: Static card/category JSON or TypeScript data
- `src/assets`: Images, icons, illustrations
- `src/styles`: Shared styling utilities if needed

## UI Rules

- Use large buttons and generous touch targets.
- Use high contrast colors.
- Use rounded cards and clearly separated interactive elements.
- Keep text readable with comfortable spacing and obvious hierarchy.
- Keep layouts stable and uncluttered.
- Prefer simple page flows over dense dashboards.
- Avoid tiny icons as the only cue for meaning.
- Avoid interaction patterns that depend on hover.

## Accessibility Rules

- Design for tablet use first, while remaining usable on desktop and mobile.
- Ensure interactive controls are large enough for touch input.
- Use semantic HTML elements where possible.
- Provide clear visible focus states for keyboard users.
- Do not rely on color alone to communicate meaning.
- Supply alt text for meaningful images and mark decorative images appropriately.
- Keep language plain and predictable for children and caregivers.
- Support screen readers with proper labels and headings.
- Avoid motion that distracts from core tasks.

## Data Rules

- Card content should live in static local files.
- Prefer plain JSON or typed constants for card/category definitions.
- Keep naming consistent across IDs, labels, categories, and assets.
- Turkish text content should be reviewed for clarity and consistency.

## Content and Licensing Rules

- Do not use copyrighted PECS or Pics for PECS materials.
- MVP should use emoji-based placeholder symbols or original or open-licensed assets.
- Future symbol or image sources must be open-licensed and attribution-compatible.
- Do not make medical, diagnostic, therapy, or treatment claims.
- Content should be reviewed by a special education professional before public release.

## MVP Scope

- Browse visual communication cards by category
- View large card visuals with Turkish labels
- Basic search or filtering if it stays simple
- Fast loading static experience
- Responsive layout for tablets

## Out of Scope for MVP

- Backend APIs
- Database storage
- User accounts or authentication
- Realtime sync
- Payments
- Analytics platforms that add complexity
- Any paid service dependency unless explicitly approved later

## Deployment Notes

- Target hosting is Vercel.
- Keep the app compatible with static deployment.
- Avoid server-only features in MVP.

## Working Agreement For Future Changes

- Preserve Turkish-first UX decisions.
- Preserve accessibility and tablet usability in all UI work.
- Do not add backend, database, auth, or paid services without an explicit scope change.
- Prefer incremental changes that keep the codebase easy to maintain.
- After changes, run `npm run build` when possible.
