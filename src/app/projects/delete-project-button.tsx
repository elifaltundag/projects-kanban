"use client";

import { useFormStatus } from "react-dom";
import { deleteProject } from "../actions/project-actions";

type DeleteProjectButtonProps = {
  projectId: string;
  projectName: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Deleting..." : "Delete project"}
    </button>
  );
}

export function DeleteProjectButton({
  projectId,
  projectName,
}: DeleteProjectButtonProps) {
  return (
    <form
      action={deleteProject}
      onSubmit={(event) => {
        const confirmed = window.confirm(
          `Delete "${projectName}"? This will also remove its tasks.`,
        );

        if (!confirmed) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="projectId" value={projectId} />
      <SubmitButton />
    </form>
  );
}
