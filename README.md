# Vivek Dogra — Frontend Architect Portfolio

Personal portfolio, built as a static Astro site. The document is HTML (so search engines read the work, experience, and contact details without running JavaScript). Motion and smooth scrolling are layered on with CSS and a small Lenis script.

## Live Site

**[https://vivekdogra2012.github.io/portfolio/](https://vivekdogra2012.github.io/portfolio/)**

## Tech stack

- **Astro** for static HTML, file-based routing, and the `/portfolio/` base path
- **Tailwind CSS** (v4)
- **Lenis** for smooth scrolling and anchor jumps
- **Self-hosted Inter and JetBrains Mono**
- **GitHub Pages**

SEO is in the document itself: title, description, canonical URL, Open Graph, Twitter cards, JSON-LD `Person`, `robots.txt`, and a generated sitemap.

## Local development

Node.js 20+ and npm 10+.

```bash
npm install
npm run dev
```

The site is at `http://localhost:4321/portfolio/`.

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server |
| `npm run build` | Typecheck and build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | `astro check` |

## Deployment

Pushes to `main` build with `npm run build` and upload `dist/` to GitHub Pages.

## Project structure

```
src/
├── components/     # Astro sections (static HTML)
├── data/site.ts    # Profile, roles, expertise, stack
├── layouts/        # Document shell, meta, JSON-LD
├── pages/          # index and 404
├── scripts/site.ts # Lenis, nav, cursor, accordions
└── styles/         # Tailwind theme and motion
public/             # Headshot, favicon, robots.txt
```
