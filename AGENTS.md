# Jifelog Agent Guide

Purpose: Quick-start conventions for agentic coding in this repo.
Scope: Build/lint/test commands, style rules, and project structure.

## Project Summary
- Stack: Vite + React 19 + TypeScript.
- UI: Tailwind classes via CDN in index.html.
- Router: react-router-dom with routes defined in App.tsx.
- Animation: framer-motion used in several components.
- Icons: lucide-react.
- Fonts: Pretendard loaded via CDN in index.html.

## Commands
- Install: `npm install`
- Dev server: `npm run dev`
- Build: `npm run build`
- Preview build: `npm run preview`

### Lint/Test
- No lint or test scripts are defined in `package.json`.
- No ESLint/Prettier/Jest/Vitest configs were found.
- There is no single-test command configured.

If you add tests later, document how to run a single test here.

## Environment Variables
- `.env.local`: must contain `GEMINI_API_KEY`.
- Vite exposes `process.env.GEMINI_API_KEY` and `process.env.API_KEY`.

## Agent Rules (Cursor/Copilot)
- No `.cursor/rules/`, `.cursorrules`, or `.github/copilot-instructions.md` found.
- If you add any of these, update this file to mirror their guidance.

## Key Paths
- `App.tsx`: routing and page composition.
- `index.tsx`: app entry, mounts React root.
- `index.html`: Tailwind CDN + font config + theme setup.
- `vite.config.ts`: Vite config and env injection.
- `components/`: UI components (PascalCase file names).
- `public/`: static images.
- `types.ts`: shared TypeScript interfaces.

## App Structure
- No `src/` directory; most source files live at repo root.
- `App.tsx` wires top-level pages and layout composition.
- `MainLayout` wraps authenticated/inner pages with sidebars.
- `index.tsx` uses `BrowserRouter` and `React.StrictMode`.
- Assets referenced directly from `/public` (e.g., mockups, logo).

## Code Style (Observed)
General
- React functional components with `React.FC` and prop interfaces.
- `interface` preferred for props and shared types.
- Default exports for components.
- Single quotes for string literals.
- Semicolons used consistently.
- Indentation varies by file (2 or 4 spaces). Follow the file you edit.
- Some files start with a blank line; keep existing local formatting.

Imports
- React imports appear first, then external libraries, then local modules.
- Keep related imports grouped; avoid reordering if unnecessary.
- Some files insert blank lines between import groups; preserve spacing.

Naming
- Component names and files use PascalCase.
- Event handlers are typically `handleX` or `onX`.
- State setters use `setX`.
- Constants for config and helpers are in `const` declarations near usage.

JSX and Styling
- Tailwind utility classes in `className` strings are the norm.
- Dark mode uses the `dark` class on `documentElement`.
- For custom CSS utilities, prefer inline `<style>` in components only when
  already established in that file.

Custom CSS Utilities
- `index.html` defines shared utilities like `logo-font`, `teal-gradient`,
  `dark-card`, `glass-header`, `no-scrollbar`, and `animate-bounce-slow`.
- `@apply` is used inside the `index.html` style block for Tailwind utilities.
- When adding new global utilities, update `index.html` and this guide.

TypeScript
- `tsconfig.json` uses `moduleResolution: bundler` and `noEmit: true`.
- `allowJs` and `allowImportingTsExtensions` are enabled.
- There is no `strict` flag, so be explicit with types where practical.
- Path alias `@/` maps to the repo root.

Data and State
- Local component state is the default; no global store is configured.
- Keep derived data in `useMemo` when it affects render performance.
- Avoid storing derived values in state unless necessary.

Error Handling
- Minimal explicit error handling in UI.
- Entry point throws an Error if root element is missing.
- Avoid silent failures; prefer visible UI errors or thrown exceptions.

Routing
- Routes are defined in `App.tsx` using `Routes` and `Route`.
- Navigation helpers call `navigate()` and `window.scrollTo(0, 0)`.

Localization
- UI copy is primarily Korean; keep new text consistent in language and tone.
- Date formatting often uses `toLocaleDateString('ko-KR', ...)`.

State and Effects
- Hooks (`useState`, `useEffect`, `useMemo`, `useRef`) are used directly.
- Keep hook usage idiomatic and avoid side effects in render.
- Cleanup any timers or listeners in `useEffect` return callbacks.

Animation
- framer-motion components wrap buttons, modals, and layout transitions.
- When editing animated components, keep motion props consistent.
- Prefer `motion.*` and `AnimatePresence` patterns already in use.

## Design Notes
- UI uses teal as the primary accent.
- Typography uses Pretendard; body font declared in `index.html`.
- Dark mode uses slate tones and `dark:` class modifiers.
- Cards often use rounded corners, shadows, and subtle borders.
- Components favor bold, high-contrast headings with tight tracking.

## Adding New Files
- Place new UI components under `components/`.
- Use PascalCase file names and component names.
- Export the component as default, unless a pattern in that folder differs.

## Static Assets
- Add images and mockups under `public/`.
- Reference assets with `/filename.ext` in JSX or CSS.

## Build and Run Notes
- Tailwind is pulled from the CDN in `index.html` (no local config file).
- If you move to local Tailwind config, update this doc and scripts.
- `index.html` includes an import map for React and lucide-react.

## Update Checklist for Agents
- If you add lint or test tooling, update the Commands section.
- If you add Cursor/Copilot rules, mirror them here.
- Keep guidance in sync with actual code patterns.
