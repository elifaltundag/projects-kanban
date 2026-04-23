"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { reorderTask } from "../../actions/task-actions";

type ReorderTaskButtonsProps = {
  canMoveDown: boolean;
  canMoveUp: boolean;
  projectId: string;
  taskId: string;
};

type MoveButtonProps = {
  direction: "up" | "down";
  disabled: boolean;
  onClick: () => void;
  pending: boolean;
};

function MoveButton({
  direction,
  disabled,
  onClick,
  pending,
}: MoveButtonProps) {
  const label = direction === "up" ? "Move up" : "Move down";
  const symbol = direction === "up" ? "↑" : "↓";

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

export function ReorderTaskButtons({
  canMoveDown,
  canMoveUp,
  projectId,
  taskId,
}: ReorderTaskButtonsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");

  function handleMove(direction: "up" | "down") {
    setErrorMessage("");

    startTransition(async () => {
      const result = await reorderTask({
        direction,
        projectId,
        taskId,
      });

      if (!result.ok) {
        setErrorMessage("Task order could not be updated.");
        return;
      }

      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex gap-2">
        <MoveButton
          direction="up"
          disabled={!canMoveUp}
          pending={isPending}
          onClick={() => handleMove("up")}
        />
        <MoveButton
          direction="down"
          disabled={!canMoveDown}
          pending={isPending}
          onClick={() => handleMove("down")}
        />
      </div>
      {errorMessage ? (
        <p className="text-xs leading-6 text-rose-700">{errorMessage}</p>
      ) : null}
    </div>
  );
}
