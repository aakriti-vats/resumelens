# DEV_NOTES

Quick developer notes and run instructions for instructors/students.

Run locally

1. Install dependencies

```bash
npm install
```

2. Start dev server

```bash
npm run dev
```

Open the app at the address Vite prints (usually `http://localhost:5173`).

Key pages for syllabus demonstrations

- Home (forms, file reading, controlled components): [src/pages/Home.jsx](src/pages/Home.jsx#L1-L160)
- Results (lists, conditional rendering, components): [src/pages/Results.jsx](src/pages/Results.jsx#L1-L40)
- History (localStorage demo, lists): [src/pages/History.jsx](src/pages/History.jsx#L1-L40)
- Compare (protected route demo): [src/pages/Compare.jsx](src/pages/Compare.jsx#L1-L40)
- Fetch Demo (fetch, promises, async/await): [src/pages/FetchDemo.jsx](src/pages/FetchDemo.jsx#L1-L200)
- Profiles (nested & dynamic routes): [src/pages/ProfileLayout.jsx](src/pages/ProfileLayout.jsx#L1-L40) and [src/pages/Profile.jsx](src/pages/Profile.jsx#L1-L40)
- 404 page: [src/pages/NotFound.jsx](src/pages/NotFound.jsx#L1-L20)

Auth / Protected routes (demo-only)

- Sign in: visit `/signin` and click "Sign in" to set a demo auth flag in `localStorage`.
- Protected route (`/compare`) checks `localStorage.resumelens-auth === '1'` and redirects to `/signin` when not signed in.

Testing checklist for an instructor demo

- [ ] Start dev server and open app
- [ ] Show `Home` form: paste resume text and job description, submit, and view `Results`
- [ ] Open `History` to show local-storage persistence
- [ ] Demonstrate `Fetch Demo` (click both fetch buttons)
- [ ] Show nested routes: open `/profile` then click a profile link to view `/profile/:id`
- [ ] Show protected route behavior: visit `/compare` while signed out (redirects), then sign in and revisit

Notes & recommendations

- Consider adding a short `README.md` for students with week-by-week file pointers.
- To demonstrate server interaction without external services, add a small mocked API route (Vite proxy or local JSON server).
