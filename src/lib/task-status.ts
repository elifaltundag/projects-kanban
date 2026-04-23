import type { TaskStatus } from "@prisma/client";

export const orderedTaskStatuses: TaskStatus[] = [
  "TO_DO",
  "IN_PROGRESS",
  "IN_REVIEW",
  "CANCELLED",
  "DONE",
];

export const taskStatusLabels: Record<TaskStatus, string> = {
  TO_DO: "To-Do",
  IN_PROGRESS: "In Progress",
  IN_REVIEW: "In Review",
  CANCELLED: "Cancelled",
  DONE: "Done",
};
