# Implementation Checklist

## Progress
- Stack decisions finalized
- Prisma installed (`prisma`, `@prisma/client`)
- dotenv installed
- Prisma schema set to SQLite for local dev
- `.env` and `.env.example` created (Neon URL stored in `DATABASE_URL_PROD`)

## Decisions Locked
- Single-user projects only (no sharing, roles, or collaboration)
- Google-only auth (no email/password, no verification flows)
- App hosting: Render
- DB hosting: Neon
- Database: SQLite (local), Postgres (production/demo)
- ORM: Prisma
- Auth: Auth.js / NextAuth

## Phase 0 - Stack Choices (Final)
- App hosting: Render
- DB hosting: Neon
- Database: SQLite (local), Postgres (production/demo)
- ORM: Prisma
- Auth: Auth.js / NextAuth (Google-only)

## Phase 1 - Environment Setup
- Create OAuth app and obtain Google client ID/secret
- Add env vars for auth and database
- Add auth callback URL for local and production
- Validate `npm run dev` boots cleanly
- Note: Prisma initialization is already done; schema work starts in Phase 2

## Phase 2 - Data Model
- Define `User`
- Define `Project` with owner reference
- Define `Task` with status enum and sort order
- Add timestamps (`createdAt`, `updatedAt`, `completedAt`)
- Generate and run initial migration

## Phase 3 - Auth and Session
- Configure Google-only OAuth
- Set up session handling
- Add protected route guard
- Create sign-in and sign-out UI

## Phase 4 - Projects
- Project list page / section
- Create project flow (form + validation)
- Delete project flow (confirm dialog)
- Empty state for no projects
- Ensure users only see their own projects

## Phase 5 - Task Board
- 5 status columns: `to-do`, `in progress`, `in review`, `cancelled`, `done`
- Add task to `to-do`
- Edit task definition
- Delete task
- Delete all tasks (confirm)
- Reorder tasks within a column
- Drag-and-drop between columns
- Persist status and order to DB

## Phase 6 - Analytics
- Compute counts for `done`, `cancelled`, `unfinished`
- Render pie chart for the three buckets
- Update chart reactively after changes

## Phase 7 - Validation and UX
- Validate required fields (project name, task definition)
- Validate date inputs (no invalid date)
- Optimistic UI for drag/drop with rollback on error
- Loading and error states

## Phase 8 - QA
- Auth flow: sign-in, sign-out, session persistence
- Project CRUD: create, delete, list
- Task CRUD: create, edit, delete, delete all
- Drag/drop: reorder and status change persistence
- Analytics: correct counts after each action

## Phase 9 - Minimal Tests
- Model tests for task status transitions
- UI tests for create project and create task flows

## Phase 10 - Deployment Readiness
- Production auth callback URL verified
- Build passes: `npm run build`
- Lint passes: `npm run lint`
- Document env vars in README or `.env.example`
