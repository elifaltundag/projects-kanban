# Implementation Checklist

## Decisions Locked
- Single-user projects only (no sharing, roles, or collaboration)
- Google-only auth (no email/password, no verification flows)

## Phase 0 - Stack Choices
- Choose auth provider (e.g. NextAuth, Clerk, Supabase Auth)
- Choose database (e.g. Postgres in prod, SQLite for local dev)
- Choose ORM (e.g. Prisma or Drizzle)
- Confirm hosting target (e.g. Vercel)

## Phase 1 - Environment Setup
- Create OAuth app and obtain Google client ID/secret
- Add env vars for auth and database
- Add auth callback URL for local and production
- Validate `npm run dev` boots cleanly

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
