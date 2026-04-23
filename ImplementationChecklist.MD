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
- Phase 4 projects page implemented with owner-scoped server queries
- Project create flow implemented with server-side validation
- Project delete flow implemented with confirmation and owner-scoped deletion
- Shared auth/project helpers added to centralize ownership checks
- Phase 4 verified with manual project create/delete plus lint and build
- Phase 5 task board implemented with owner-scoped project/task loading
- Task CRUD implemented: create, edit, delete, and delete all with confirmations where required
- Task ordering and cross-column movement persist `status` and `sortOrder` to the database
- Accessible task movement added with keyboard controls plus pointer drag-and-drop
- Phase 5 verified with lint and interactive task-board checks

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
- Phase 4: DONE
- Phase 5: DONE
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
1. Create the Google OAuth app and collect the client ID and client secret.
2. Add the required environment variables for Auth.js and database access.
3. Add local and production auth callback URLs to the OAuth app settings.
4. Keep local SQLite and production Neon connection values documented in `.env` and `.env.example`.
5. Confirm Prisma initialization is in place before schema work starts.
6. Run `npm run dev` and verify the app boots cleanly.

## Phase 2 - Data Model - DONE
1. Define the core `User` model in `prisma/schema.prisma`.
2. Define `Project` with a required owner reference back to `User`.
3. Define `Task` with a project relation, status enum, and persisted `sortOrder`.
4. Add task and project timestamps, including `createdAt` and `updatedAt`.
5. Add task date fields for `targetCompletionDate` and `actualCompletionDate`.
6. Generate Prisma Client after the schema is updated.
7. Create and apply the initial local migration.
8. Apply the follow-up migration that renames the task date fields.
9. Open Prisma Studio and verify the schema and local database tables.

## Phase 3 - Auth and Session - DONE
1. Install Auth.js for the Next.js app with the `next-auth` package.
2. Add Google provider settings to the environment variables and auth configuration.
3. Extend `prisma/schema.prisma` with the Auth.js adapter models and related `User` fields.
4. Create and apply a Prisma migration for the new auth tables.
5. Connect Auth.js to Prisma so accounts and sessions are stored in the database.
6. Verify Google sign-in maps the signed-in account to the correct local `User` record.
7. Enable persistent sessions so users stay signed in after refresh or reopening the browser.
8. Add sign-in and sign-out UI on the home page.
9. Protect app routes so only signed-in users can access projects and tasks.
10. Verify signed-out users are redirected away from protected pages.

## Phase 4 - Projects - DONE
1. Replace the `/projects` placeholder with the real projects page.
2. Load projects on the server with Auth.js and Prisma.
3. Scope project reads and deletes to the authenticated owner.
4. Render the project list and an empty state.
5. Add the create project flow with name validation.
6. Add the delete project flow with confirmation.
7. Refresh the projects view after create and delete actions.
8. Verify signed-out users are redirected away from `/projects`.

## Phase 5 - Task Board - DONE
1. Render five task status columns: `to-do`, `in progress`, `in review`, `cancelled`, and `done`.
2. Add new tasks to the `to-do` column.
3. Support editing task definitions.
4. Support deleting individual tasks.
5. Support deleting all tasks with confirmation.
6. Reorder tasks within a column.
7. Drag and drop tasks between columns.
8. Persist task status and order changes to the database.

## Phase 6 - Analytics - TODO
1. Review the task board page to see where tasks are loaded and refreshed.
2. Add a small helper to calculate analytics counts from the project tasks.
3. Map statuses into three buckets: `done`, `cancelled`, and `unfinished`.
4. Include a total task count for empty-state handling.
5. Add an analytics section to the project board page.
6. Render a simple pie chart with labels, colors, and counts.
7. Show a clear empty state when the project has no tasks.
8. Make sure task changes refresh the analytics counts automatically.
9. Verify counts for create, delete, delete all, drag/drop, and keyboard moves.


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
