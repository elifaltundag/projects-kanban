Step‑by‑step checklist to complete before Phase 1, based on your chosen stack (Render + Neon + Prisma + Auth.js):

1. Create a Neon project - DONE

- Create a Postgres database in Neon.
- Copy the connection string.

2. Create local env files - DONE 

- Add .env with DATABASE_URL for SQLite.
- Add DATABASE_URL_PROD for Neon (or plan to swap via environment on Render).
- Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET (placeholders for now).
- Add NEXTAUTH_URL and NEXTAUTH_SECRET (placeholders for now).

3. Initialize Prisma (partially done)

- Install Prisma and Prisma client. DONE
- Run prisma init to create prisma/schema.prisma. SKIP (already present)

4. Configure Prisma for SQLite (local dev) - DONE

- Set the Prisma datasource to sqlite.
- Set DATABASE_URL to file:./dev.db.

5. Create initial schema

- Add User, Project, Task models with relations and enums.

6. Run local migration

- Generate and apply the first migration against SQLite.

7. Verify Prisma client

- Run a simple Prisma client query (optional smoke test).

8. Plan production DB usage

- Keep Neon URL ready for later.
- Decide how you’ll swap DATABASE_URL for production (Render env vars).
