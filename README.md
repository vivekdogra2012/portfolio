# Vivek Dogra — Frontend Architect Portfolio

A personal portfolio site built with React, TypeScript, and Tailwind CSS. Designed to showcase frontend architecture expertise, platform migrations, and UI systems work.

## Live Site

**[https://vivekdogra2012.github.io/portfolio/](https://vivekdogra2012.github.io/portfolio/)**

## Tech Stack

- **React 19** with TypeScript
- **Vite** for fast builds and development
- **Tailwind CSS** (v4) for styling
- **Framer Motion** for animations
- **GitHub Pages** for hosting

## Local Development

### Prerequisites

- Node.js 20+ 
- npm 10+

### Getting Started

```bash
# Clone the repository
git clone https://github.com/vivekdogra2012/portfolio.git
cd portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at `http://localhost:5173/portfolio/`

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production (outputs to `dist/`) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run linter |

## Deployment

The site automatically deploys to GitHub Pages when changes are pushed to `main`. The deployment workflow:

1. Builds the project with `npm run build`
2. Uploads the `dist/` folder as a Pages artifact
3. Deploys to GitHub Pages

To deploy manually, push to `main` or trigger the workflow from the Actions tab.

## Project Structure

```
src/
├── components/     # React components
│   ├── Nav.tsx           # Sticky navigation
│   ├── Hero.tsx          # Hero section with staggered animations
│   ├── Skills.tsx        # Skills grouped by architect lenses
│   ├── Work.tsx          # Selected work case cards
│   ├── Architecture.tsx  # Architecture belief cards
│   ├── About.tsx         # About section
│   ├── Contact.tsx       # Contact CTAs
│   ├── Footer.tsx        # Footer
│   └── FadeUp.tsx        # Reusable fade-up animation wrapper
├── hooks/
│   └── useInView.ts      # IntersectionObserver hook
├── App.tsx               # Main app component
├── main.tsx              # Entry point
└── index.css             # Tailwind imports and custom theme
```

## Design

- **Theme**: Dark architect studio palette
- **Colors**: `#0B0F14` background, `#5B8CFF` accent, `#3DDC97` secondary accent
- **Typography**: Inter for body, JetBrains Mono for code/eyebrows
- **Animations**: Subtle fade-up reveals with `cubic-bezier(0.22, 1, 0.36, 1)` easing, respects `prefers-reduced-motion`

## License

© Vivek Dogra
