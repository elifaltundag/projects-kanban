"use client";

import type { TaskStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { moveTaskToStatus } from "../../actions/task-actions";

type DragPayload = {
  projectId: string;
  sourceStatus: TaskStatus;
  taskId: string;
};

type TaskColumnDropZoneProps = {
  children: React.ReactNode;
  projectId: string;
  targetStatus: TaskStatus;
};

export function TaskColumnDropZone({
  children,
  projectId,
  targetStatus,
}: TaskColumnDropZoneProps) {
  const router = useRouter();
  const [isOver, setIsOver] = useState(false);
  const [isPending, startTransition] = useTransition();

  function readPayload(event: React.DragEvent<HTMLDivElement>) {
    const rawPayload = event.dataTransfer.getData("application/json");

    if (!rawPayload) {
      return null;
    }

    try {
      return JSON.parse(rawPayload) as DragPayload;
    } catch {
      return null;
    }
  }

  return (
    <div
      onDragEnter={(event) => {
        event.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsOver(false);
        }
      }}
      onDragOver={(event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        setIsOver(true);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setIsOver(false);

        const payload = readPayload(event);

        if (!payload || payload.projectId !== projectId) {
          return;
        }

        if (payload.sourceStatus === targetStatus) {
          return;
        }

        startTransition(async () => {
          const result = await moveTaskToStatus({
            projectId,
            targetStatus,
            taskId: payload.taskId,
          });

          if (result.ok) {
            router.refresh();
          }
        });
      }}
      className={[
        "mt-5 flex flex-1 flex-col gap-3 rounded-[1.5rem] transition",
        isOver ? "bg-stone-100 ring-2 ring-stone-300 ring-offset-2" : "",
        isPending ? "opacity-70" : "",
      ].join(" ")}
    >
      {children}
    </div>
  );
}
