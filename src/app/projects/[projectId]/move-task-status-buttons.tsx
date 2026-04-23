"use client";

import type { TaskStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { moveTaskToStatus } from "../../actions/task-actions";
import { orderedTaskStatuses, taskStatusLabels } from "../../../lib/task-status";

type MoveTaskStatusButtonsProps = {
  currentStatus: TaskStatus;
  projectId: string;
  taskId: string;
};

function MoveButton({
  direction,
  disabled,
  onClick,
  pending,
}: {
  direction: "left" | "right";
  disabled: boolean;
  onClick: () => void;
  pending: boolean;
}) {
  const label = direction === "left" ? "Move left" : "Move right";
  const symbol = direction === "left" ? "\u2190" : "\u2192";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || pending}
      className="rounded-full border border-stone-300 px-3 py-2 text-sm font-semibold text-stone-700 transition hover:border-stone-950 hover:text-stone-950 disabled:cursor-not-allowed disabled:opacity-40"
      aria-label={label}
      title={label}
    >
      {pending ? "..." : symbol}
    </button>
  );
}

export function MoveTaskStatusButtons({
  currentStatus,
  projectId,
  taskId,
}: MoveTaskStatusButtonsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [announcement, setAnnouncement] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const currentIndex = orderedTaskStatuses.indexOf(currentStatus);
  const leftStatus =
    currentIndex > 0 ? orderedTaskStatuses[currentIndex - 1] : null;
  const rightStatus =
    currentIndex < orderedTaskStatuses.length - 1
      ? orderedTaskStatuses[currentIndex + 1]
      : null;

  function handleMove(targetStatus: TaskStatus) {
    setAnnouncement("");
    setErrorMessage("");

    startTransition(async () => {
      const result = await moveTaskToStatus({
        projectId,
        targetStatus,
        taskId,
      });

      if (!result.ok) {
        setErrorMessage("Task could not be moved to another column.");
        return;
      }

      setAnnouncement(`Task moved to ${taskStatusLabels[targetStatus]}.`);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex gap-2">
        <MoveButton
          direction="left"
          disabled={!leftStatus}
          onClick={() => {
            if (leftStatus) {
              handleMove(leftStatus);
            }
          }}
          pending={isPending}
        />
        <MoveButton
          direction="right"
          disabled={!rightStatus}
          onClick={() => {
            if (rightStatus) {
              handleMove(rightStatus);
            }
          }}
          pending={isPending}
        />
      </div>
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
      {errorMessage ? (
        <p className="text-xs leading-6 text-rose-700">{errorMessage}</p>
      ) : null}
    </div>
  );
}
