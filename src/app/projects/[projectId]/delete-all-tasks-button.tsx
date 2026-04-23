"use client";

import { useFormStatus } from "react-dom";
import { deleteAllTasks } from "../../actions/task-actions";

type DeleteAllTasksButtonProps = {
  projectId: string;
  projectName: string;
  taskCount: number;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full border border-rose-200 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Deleting all..." : "Delete all tasks"}
    </button>
  );
}

export function DeleteAllTasksButton({
  projectId,
  projectName,
  taskCount,
}: DeleteAllTasksButtonProps) {
  return (
    <form
      action={deleteAllTasks}
      onSubmit={(event) => {
        const confirmed = window.confirm(
          `Delete all ${taskCount} tasks in "${projectName}"? This cannot be undone.`,
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
