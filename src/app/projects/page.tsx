import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "../../../auth";

export default async function ProjectsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-stone-100 px-6 py-12 text-stone-950">
      <main className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-4xl items-center justify-center">
        <section className="w-full rounded-[2rem] border border-stone-200 bg-white p-8 shadow-[0_24px_80px_rgba(41,37,36,0.08)] sm:p-12">
          <div className="flex flex-col gap-6">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-stone-500">
              Protected Route
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
              Projects page access is now restricted to signed-in users.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-stone-600">
              You are signed in as {session.user.name ?? session.user.email}.
              This placeholder page proves the route guard is working before
              Phase 4 project features are built.
            </p>
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
