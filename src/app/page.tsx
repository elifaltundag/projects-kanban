import { auth } from "../../auth";
import { signInWithGoogle, signOutUser } from "./actions/auth-actions";

export default async function Home() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-stone-100 px-6 py-12 text-stone-950">
      <main className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-4xl items-center justify-center">
        <section className="w-full rounded-[2rem] border border-stone-200 bg-white p-8 shadow-[0_24px_80px_rgba(41,37,36,0.08)] sm:p-12">
          <div className="flex flex-col gap-8">
            <div className="space-y-4">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-stone-500">
                Phase 3
              </p>
              <div className="space-y-3">
                <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
                  Sign in with Google to access your projects and tasks.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-stone-600">
                  This page is the first visible auth UI for the app. It lets
                  you start the Google sign-in flow and confirms when a session
                  is active.
                </p>
              </div>
            </div>

            <div className="rounded-[1.5rem] bg-stone-950 p-6 text-stone-50">
              {session?.user ? (
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                  <div className="space-y-2">
                    <p className="text-sm uppercase tracking-[0.2em] text-stone-300">
                      Signed In
                    </p>
                    <h2 className="text-2xl font-semibold">
                      {session.user.name ?? "Google user"}
                    </h2>
                    <p className="text-stone-300">
                      {session.user.email ?? "No email returned"}
                    </p>
                    <p className="text-sm text-stone-400">
                      Local user id: {session.user.id}
                    </p>
                  </div>

                  <form action={signOutUser}>
                    <button
                      type="submit"
                      className="rounded-full bg-stone-50 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-stone-200"
                    >
                      Sign out
                    </button>
                  </form>
                </div>
              ) : (
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                  <div className="space-y-2">
                    <p className="text-sm uppercase tracking-[0.2em] text-stone-300">
                      Signed Out
                    </p>
                    <h2 className="text-2xl font-semibold">
                      No active session yet
                    </h2>
                    <p className="max-w-xl text-stone-300">
                      Use Google sign-in to create a session. After login, this
                      page will show the user information loaded from Auth.js.
                    </p>
                  </div>

                  <form action={signInWithGoogle}>
                    <button
                      type="submit"
                      className="rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-200"
                    >
                      Continue with Google
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
