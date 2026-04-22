# My First App

A solo-user to-do app built with Next.js. The product supports Google sign-in, project-based task boards, drag-and-drop task status changes, and lightweight status analytics.

## Current Status
- Phase 0: done
- Phase 1: done
- Phase 2: done
- Phase 3: done

## Stack
- App: Next.js (App Router) + React 19 + TypeScript
- Styling: Tailwind CSS v4
- Auth: Auth.js / `next-auth` (Google-only)
- ORM: Prisma
- Database: SQLite for local development, Postgres for production/demo
- DB Hosting: Neon
- App Hosting: Render

## Implemented So Far
- Local environment configured with `.env` and `.env.example`
- Prisma configured with SQLite for local development
- Prisma data model implemented for:
  - `User`
  - `Project`
  - `Task`
  - `TaskStatus`
- Auth.js configured with Google sign-in
- Prisma auth models added for:
  - `Account`
  - `Session`
  - `VerificationToken`
- Prisma adapter configured for database-backed auth and sessions
- Home page sign-in/sign-out UI implemented
- Protected `/projects` route added
- Local migrations created and applied
- Local Prisma database created as `dev.db`

## Current Data Model

### User
- `id`
- `name`
- `email`
- `emailVerified`
- `image`
- `createdAt`
- `updatedAt`

### Account
- `id`
- `userId`
- `provider`
- `providerAccountId`

### Session
- `id`
- `sessionToken`
- `userId`
- `expires`

### Project
- `id`
- `ownerId`
- `name`
- `createdAt`
- `updatedAt`

### Task
- `id`
- `projectId`
- `definition`
- `status`
- `targetCompletionDate`
- `actualCompletionDate`
- `sortOrder`
- `createdAt`
- `updatedAt`

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

Use the home page to sign in with Google. After signing in, open `/projects` to verify the protected route.

## Useful Commands

```bash
npm run dev
npm run lint
npm run build
npx prisma validate
npx prisma generate
npx prisma migrate status
npx prisma studio
```

## Environment Variables

The project currently expects these values:

```env
DATABASE_URL=
DATABASE_URL_PROD=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_SECRET=
AUTH_URL=
```

See `.env.example` for the local template.

## Auth Notes

- Google OAuth test users are managed in Google Cloud Console, not in this repo.
- Local auth sessions are stored in the database through Prisma.
- Signed-out users are redirected away from `/projects` back to `/`.




## Future Features
- Restore deleted task
- Restore deleted project