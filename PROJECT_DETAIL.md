# Project Details: Shanuzz Academy LMS (Vue 3)

## Overview
This project is a modern Learning Management System (LMS) for Shanuzz Academy, migrated from a vanilla HTML/JS implementation to a Vue.js 3, TypeScript, and Pinia-based SPA. The backend is powered by Google Apps Script, using Google Sheets as the primary data store.

## Tech Stack
- **Frontend:**
  - Vue.js 3 (Composition API)
  - TypeScript
  - Pinia (state management)
  - Tailwind CSS (utility-first styling)
  - Vite (build tool)
- **Backend:**
  - Google Apps Script (GAS)
  - Google Sheets (data storage)
- **Other:**
  - ESLint (linting)
  - Netlify (optional, for deployment)

## Key Features
- Custom authentication (no OAuth, uses legacy logic)
- Modular, type-safe state management
- API service layer for GAS integration
- Protected routes and role-based access
- Responsive, mobile-first UI (with Tailwind)
- Lead management, activities, tasks, and reporting (planned)

## Authentication
- Uses a custom login system integrated with Google Apps Script
- Stores JWT token and user info in localStorage
- Handles login, logout, token validation, and profile updates
- No Google OAuth or third-party auth

## Project Structure
- `src/`
  - `views/` — Main app pages (Dashboard, Login, Leads, etc.)
  - `components/` — Reusable UI components
  - `stores/` — Pinia stores (auth, leads, etc.)
  - `services/` — API and business logic (auth, GAS integration)
  - `router/` — Vue Router setup and guards
  - `style.css` — Tailwind CSS entry
- `public/` — Static assets
- `index.html` — App entry point

## Development
- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Build for production: `npm run build`
- Lint code: `npm run lint`

## Deployment
- Can be deployed to Netlify or any static hosting
- Backend (GAS) must be deployed as a web app and CORS configured

## Status
- Core migration to Vue 3 complete
- Custom authentication re-integrated
- Main features and UI under active development

## Notes
- All sensitive logic (auth, data sync) is handled via Google Apps Script endpoints
- The original vanilla JS version is backed up as `index-backup.html`
- For backend changes, update the GAS script and redeploy

---
_Last updated: December 19, 2025_