"use client";

import { useFormStatus } from "react-dom";
import { deleteTask } from "../../actions/task-actions";

type DeleteTaskButtonProps = {
  projectId: string;
  taskId: string;
  taskDefinition: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}

export function DeleteTaskButton({
  projectId,
  taskId,
  taskDefinition,
}: DeleteTaskButtonProps) {
  return (
    <form
      action={deleteTask}
      onSubmit={(event) => {
        const confirmed = window.confirm(
          `Delete "${taskDefinition}"? This task will be removed from the board.`,
        );

        if (!confirmed) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="projectId" value={projectId} />
      <input type="hidden" name="taskId" value={taskId} />
      <SubmitButton />
    </form>
  );
}
