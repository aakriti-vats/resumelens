# Syllabus → Repo Mapping

This file maps the syllabus topics (from the provided image) to where they are implemented or demonstrated in this repository.

- 1–6 HTML / CSS / Accessibility / Responsive
  - Implemented: [src/index.css](src/index.css#L1-L200), [src/components/Navbar.jsx](src/components/Navbar.jsx#L1-L96), [src/components/Footer.jsx](src/components/Footer.jsx#L1-L29), page styles in [src/pages/Home.module.css](src/pages/Home.module.css#L1-L40)

- 7–12 JavaScript basics, Dev tools, Git
  - Examples of JS basics across components (variables, functions, arrays, objects, loops) in many files (see [src/hooks/useKeywordMatch.js](src/hooks/useKeywordMatch.js#L1-L40)).
  - Dev/Git guidance: add README or instructor notes (recommended).

- 13–18 ES6+ (let/const, arrow, destructuring, modules), Promises, async/await, fetch, DOM, forms
  - ES modules & modern syntax: [src/App.jsx](src/App.jsx#L1-L40)
  - `async/await` (file reading): [src/pages/Home.jsx](src/pages/Home.jsx#L1-L80)
  - `fetch` examples (promises & async/await): [src/pages/FetchDemo.jsx](src/pages/FetchDemo.jsx#L1-L200)
  - Forms and controlled components: [src/pages/Home.jsx](src/pages/Home.jsx#L80-L160)

- 19–24 Events, forms, controlled components, React project setup with Vite
  - React + Vite setup visible in `package.json` and `src/main.jsx` ([package.json](package.json#L1-L40), [src/main.jsx](src/main.jsx#L1-L40)).
  - Event handlers and form submission: [src/pages/Home.jsx](src/pages/Home.jsx#L80-L160)

- 25–30 React basics (JSX, components, props, state, lists, conditional rendering)
  - Examples: [src/pages/Results.jsx](src/pages/Results.jsx#L1-L40), `KeywordBadge`, `ScoreRing` components

- 31–36 Hooks, custom hooks, composition, memoization, lifting state
  - Built-in hooks used: `useState`, `useEffect`, `useRef`, `useMemo`, `useCallback` in `ScoreRing`, `Results`, and `Home`.
  - Custom hooks: [src/hooks/useLocalHistory.js](src/hooks/useLocalHistory.js#L1-L60) and [src/hooks/useKeywordMatch.js](src/hooks/useKeywordMatch.js#L1-L80)

- 37–42 React Router basics, nested routes, dynamic routes, protected routes, 404
  - Router setup: [src/App.jsx](src/App.jsx#L1-L40)
  - Nested/dynamic route demo: [src/pages/ProfileLayout.jsx](src/pages/ProfileLayout.jsx#L1-L40) and [src/pages/Profile.jsx](src/pages/Profile.jsx#L1-L40)
  - Protected route: [src/components/ProtectedRoute.jsx](src/components/ProtectedRoute.jsx#L1-L40)
  - 404 page: [src/pages/NotFound.jsx](src/pages/NotFound.jsx#L1-L20)

Recommendations / Missing items
- Add a short `README.md` or instructor notes highlighting which files to open for each week (recommended for evaluation).
- Add a short Git/VSCode setup note or `DEV_NOTES.md` showing commands to run (`npm install`, `npm run dev`) and a checklist for student demonstrations.

If you want, I can:
- create the `README.md` / `DEV_NOTES.md` now with run instructions and quick links, or
- style the new pages to match the app theme.
