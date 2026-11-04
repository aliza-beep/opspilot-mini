# OpsPilot Mini

A polished, browser-local business operations dashboard built with React, TypeScript, Vite, Tailwind CSS, Recharts, and Lucide React.

OpsPilot Mini brings lead tracking, task management, pipeline reporting, and practical follow-up rules into one responsive workspace. All included contacts and companies are fictional demo data. The app has no backend, authentication, paid APIs, or secrets.

## Features

- Dashboard KPIs for total leads, conversion rate, open pipeline value, and overdue tasks
- Searchable and filterable lead CRM with create, edit, and delete workflows
- Task manager with priorities, due dates, completion toggles, and filters
- Revenue trend and lead pipeline charts powered by Recharts
- Rule-based follow-up suggestions based on lead stage and last-contact date
- CSV lead export
- Browser `localStorage` persistence and one-click demo data reset
- Responsive sidebar navigation, accessible forms, confirmations, and empty states

## Getting started

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, normally [http://localhost:5173](http://localhost:5173).

## Production build

```bash
npm run build
npm run preview
```

The optimized production files are generated in `dist/`.

## Data and privacy

Lead and task changes are stored only in the current browser using `localStorage`. Use **Reset demo data** in the sidebar to restore the original fictional records. Clearing site data in the browser will also remove local changes.
