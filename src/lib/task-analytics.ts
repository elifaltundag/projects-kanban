import type { TaskStatus } from "@prisma/client";

type TaskWithStatus = {
  status: TaskStatus;
};

export type TaskStatusCounts = Record<TaskStatus, number>;

export type TaskAnalyticsBucketCounts = {
  cancelled: number;
  done: number;
  unfinished: number;
};

export type TaskAnalyticsSummary = TaskAnalyticsBucketCounts & {
  total: number;
};

export function countTasksByStatus(tasks: TaskWithStatus[]): TaskStatusCounts {
  return tasks.reduce<TaskStatusCounts>(
    (counts, task) => ({
      ...counts,
      [task.status]: counts[task.status] + 1,
    }),
    {
      TO_DO: 0,
      IN_PROGRESS: 0,
      IN_REVIEW: 0,
      CANCELLED: 0,
      DONE: 0,
    },
  );
}

export function countTaskAnalyticsBuckets(
  statusCounts: TaskStatusCounts,
): TaskAnalyticsBucketCounts {
  return {
    cancelled: statusCounts.CANCELLED,
    done: statusCounts.DONE,
    unfinished:
      statusCounts.TO_DO + statusCounts.IN_PROGRESS + statusCounts.IN_REVIEW,
  };
}

export function getTaskAnalyticsSummary(
  tasks: TaskWithStatus[],
): TaskAnalyticsSummary {
  const bucketCounts = countTaskAnalyticsBuckets(countTasksByStatus(tasks));

  return {
    ...bucketCounts,
    total: tasks.length,
  };
}
