# Implementation Checklist

## Progress
- Stack decisions finalized
- Prisma installed (`prisma`, `@prisma/client`)
- dotenv installed
- Prisma schema set to SQLite for local dev
- `.env` and `.env.example` created (Neon URL stored in `DATABASE_URL_PROD`)
- Phase 2 schema completed for `User`, `Project`, `Task`, and `TaskStatus`
- Prisma Client generated successfully
- Initial Prisma migration created and applied locally
- Follow-up migration created and applied for task date field renaming
- Local database verified through Prisma Studio
- Auth.js (`next-auth`) installed and configured for Google sign-in
- Auth-related Prisma models added and migrated locally
- Prisma adapter connected for database-backed auth and sessions
- Sign-in and sign-out UI implemented on the home page
- Protected `/projects` route added and verified

## Decisions Locked
- Single-user projects only (no sharing, roles, or collaboration)
- Google-only auth (no email/password, no verification flows)
- App hosting: Render
- DB hosting: Neon
- Database: SQLite (local), Postgres (production/demo)
- ORM: Prisma
- Auth: Auth.js / NextAuth

## Phase Status Overview
- Phase 0: DONE
- Phase 1: DONE
- Phase 2: DONE
- Phase 3: DONE
- Phase 4: TODO
- Phase 5: TODO
- Phase 6: TODO
- Phase 7: TODO
- Phase 8: TODO
- Phase 9: TODO
- Phase 10: TODO

## Phase 0 - Stack Choices (Final) - DONE
- App hosting: Render
- DB hosting: Neon
- Database: SQLite (local), Postgres (production/demo)
- ORM: Prisma
- Auth: Auth.js / NextAuth (Google-only)

## Phase 1 - Environment Setup - DONE
- Create OAuth app and obtain Google client ID/secret
- Add env vars for auth and database
- Add auth callback URL for local and production
- Validate `npm run dev` boots cleanly
- Note: Prisma initialization is already done; schema work starts in Phase 2

## Phase 2 - Data Model - DONE
- Define `User`
- Define `Project` with owner reference
- Define `Task` with status enum and sort order
- Add timestamps (`createdAt`, `updatedAt`, `actualCompletionDate`)
- Add `targetCompletionDate`
- Generate Prisma Client
- Generate and run initial migration
- Run follow-up rename migration for task date fields
- Verify schema and database in Prisma Studio

## Phase 3 - Auth and Session - DONE
- Install and configure Auth.js for this Next.js app (`next-auth`)
- Add Google sign-in settings in environment variables and auth configuration
- Update `prisma/schema.prisma` for Auth.js by adding the required auth tables/models (`Account`, `Session`, and the related `User` fields; include `VerificationToken` if using the standard adapter schema)
- Create and apply a Prisma migration for the new auth tables
- Configure Auth.js to use Prisma so Google accounts and sessions are stored in the database
- Make sure a signed-in Google user is matched to the correct local `User` record
- Set up persistent login sessions so the user stays signed in after refresh or reopening the browser
- Protect app pages so only signed-in users can access projects and tasks
- Add a sign-in page/button and a sign-out button

## Phase 4 - Projects - TODO
- Project list page / section
- Create project flow (form + validation)
- Delete project flow (confirm dialog)
- Empty state for no projects
- Ensure users only see their own projects

## Phase 5 - Task Board - TODO
- 5 status columns: `to-do`, `in progress`, `in review`, `cancelled`, `done`
- Add task to `to-do`
- Edit task definition
- Delete task
- Delete all tasks (confirm)
- Reorder tasks within a column
- Drag-and-drop between columns
- Persist status and order to DB

## Phase 6 - Analytics - TODO
- Compute counts for `done`, `cancelled`, `unfinished`
- Render pie chart for the three buckets
- Update chart reactively after changes

## Phase 7 - Validation and UX - TODO
- Validate required fields (project name, task definition)
- Validate date inputs (no invalid date)
- Optimistic UI for drag/drop with rollback on error
- Loading and error states

## Phase 8 - QA - TODO
- Auth flow: sign-in, sign-out, session persistence
- Project CRUD: create, delete, list
- Task CRUD: create, edit, delete, delete all
- Drag/drop: reorder and status change persistence
- Analytics: correct counts after each action

## Phase 9 - Minimal Tests - TODO
- Model tests for task status transitions
- UI tests for create project and create task flows

## Phase 10 - Deployment Readiness - TODO
- Production auth callback URL verified
- Build passes: `npm run build`
- Lint passes: `npm run lint`
- Document env vars in README or `.env.example`
