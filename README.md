# OpsPilot Mini — Business Operations Dashboard

[View the live demo](https://opspilot-mini.pages.dev)

## Overview

OpsPilot Mini is a responsive business operations dashboard that brings lead management, task tracking, pipeline visibility, and follow-up planning into one focused workspace.

Small teams often manage sales activity and operational follow-ups across disconnected spreadsheets and task lists. OpsPilot Mini addresses that problem with a clear, browser-based view of the information and actions needed to keep opportunities moving.

## Key Features

- **KPI dashboard:** Monitor total leads, conversion rate, open pipeline value, and overdue tasks at a glance.
- **Lead CRM:** Search, filter, create, edit, and delete leads while tracking status, value, source, and last-contact date.
- **Task manager:** Create and manage tasks with priorities, due dates, completion controls, and status filters.
- **Business charts:** Explore revenue trends and lead pipeline stages through responsive Recharts visualizations.
- **CSV export:** Download the current lead list as a CSV file for reporting or further analysis.
- **Rule-based follow-up recommendations:** Surface practical next steps based on lead stage and time since the last contact. These are deterministic business rules, not AI predictions.
- **Browser-local persistence:** Preserve lead and task changes with `localStorage` and restore the original fictional dataset with the reset control.

## Technology Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- Lucide React

## Local Installation

### Requirements

- Node.js 20 or newer
- npm

### Setup and Development

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, typically [http://localhost:5173](http://localhost:5173).

### Production Build

```bash
npm run build
```

The optimized production files are generated in `dist/`.

## Data and Architecture

All contacts, companies, tasks, and business figures included with the project are fictional demo data. User changes are stored only in the current browser through `localStorage`; clearing browser site data will remove those changes.

OpsPilot Mini is a frontend-only portfolio project. It has no backend, database, user accounts, authentication, payment processing, paid APIs, or application secrets.

## Future Improvements

- User accounts and secure authentication for personalized workspaces
- A persistent database for synchronized, multi-device access
- Integrations with email, calendars, and external CRM platforms
- Team collaboration, ownership, and activity history
