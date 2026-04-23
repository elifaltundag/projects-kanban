"use client";

import type { TaskStatus } from "@prisma/client";

type DraggableTaskCardProps = {
  children: React.ReactNode;
  projectId: string;
  status: TaskStatus;
  taskId: string;
};

export function DraggableTaskCard({
  children,
  projectId,
  status,
  taskId,
}: DraggableTaskCardProps) {
  const dragPayload = JSON.stringify({
    projectId,
    sourceStatus: status,
    taskId,
  });

  return (
    <div className="space-y-2">
      <div className="flex justify-start">
        <button
          type="button"
          draggable
          onDragStart={(event) => {
            event.dataTransfer.effectAllowed = "move";
            event.dataTransfer.setData("application/json", dragPayload);
            event.dataTransfer.setData("text/plain", taskId);
          }}
          className="inline-flex cursor-grab items-center rounded-full border border-stone-300 bg-stone-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-stone-600 active:cursor-grabbing"
          aria-label="Drag task to another column"
          title="Drag task to another column"
        >
          Drag
        </button>
      </div>
      {children}
    </div>
  );
}
