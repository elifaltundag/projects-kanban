import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import prisma from "../../lib/prisma";

export default async function ProjectsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  const projects = await prisma.project.findMany({
    where: {
      ownerId: session.user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const projectCountLabel =
    projects.length === 1 ? "1 project" : `${projects.length} projects`;

  return (
    <div className="min-h-screen bg-stone-100 px-6 py-12 text-stone-950">
      <main className="mx-auto max-w-5xl">
        <section className="w-full rounded-[2rem] border border-stone-200 bg-white p-8 shadow-[0_24px_80px_rgba(41,37,36,0.08)] sm:p-12">
          <div className="flex flex-col gap-6">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-stone-500">
              Projects
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
              Your projects now render as a real list backed by the database.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-stone-600">
              Signed in as {session.user.name ?? session.user.email}. The page
              is loading your projects on the server and presenting them as the
              main surface for the next Phase 4 steps.
            </p>
            <div className="flex items-center justify-between gap-4 rounded-[1.5rem] border border-stone-200 bg-stone-50 px-6 py-5">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-stone-500">
                  Project Index
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
                  {projectCountLabel}
                </p>
              </div>
              <p className="max-w-sm text-sm leading-7 text-stone-600">
                Projects are ordered by most recently updated so the latest work
                stays closest to the top.
              </p>
            </div>
            <div className="grid gap-4">
              {projects.map((project) => (
                <article
                  key={project.id}
                  className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-3">
                      <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">
                        Project
                      </p>
                      <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
                        {project.name}
                      </h2>
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-stone-600">
                        <p>
                          Created {project.createdAt.toLocaleDateString()}
                        </p>
                        <p>
                          Updated {project.updatedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <span className="inline-flex rounded-full border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700">
                        Board coming in Phase 5
                      </span>
                    </div>
                  </div>
                </article>
              ))}
              {projects.length === 0 ? (
                <div className="rounded-[1.5rem] border border-dashed border-stone-300 bg-stone-50 p-6 text-sm leading-7 text-stone-600">
                  No project cards can render yet because no projects exist for
                  this user. Step 3 will replace this with the proper empty
                  state.
                </div>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-stone-50 transition hover:bg-stone-800"
              >
                Back to home
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
