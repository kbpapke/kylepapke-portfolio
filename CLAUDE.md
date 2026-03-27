# CLAUDE.md — kylepapke-portfolio

## Project
Kyle Papke's personal portfolio website. Built with Remix + Vite + TypeScript + Tailwind CSS v4.
Target: `kylepapke.xyz` via Vercel.

## Routing

| Situation | Read |
|---|---|
| Before writing any code | Check `.impeccable.md` for design context |
| Writing UI components | Follow pixel art design system in `app/styles/globals.css` |
| Adding new sections | Match existing section patterns in `app/components/sections/` |
| Updating resume content | Edit `app/data/resume.ts` only — content is data-driven |

## Core Rules
- **Dark mode only.** No light mode variants.
- **Pixel font (`Press Start 2P`) is display-only.** Never use it for body copy or small text.
- **Color palette is strict.** Only use tokens defined in `globals.css`. No arbitrary hex values.
- **Responsive required.** Every component must work on mobile (375px+) and desktop (1280px+).
- **No new dependencies without cause.** D3, Framer Motion, and Three.js references are intentional.
- **Content lives in `app/data/resume.ts`.** Never hardcode resume content in components.

## Design Context

### Users
Hiring managers and technical leads assessing Kyle's seniority and output quality. First impression is everything — the site itself is a portfolio piece.

### Brand Personality
Bold. Nostalgic. Technically serious.

### Aesthetic Direction
Habbo Hotel isometric RPG world. Dark (#0D0F0A) + neon lime (#39FF14) + pixel orange (#FF6B35).
Pixel font for display, Inter for body. Isometric room hero on desktop, pixel panels on mobile.

### Design Principles
1. The interface is evidence of skill
2. Pixel constraints create visual focus
3. Information hierarchy over flash — recruiter-readable in 30 seconds
4. Responsive is not an afterthought
5. Made with Claude, not despite it
