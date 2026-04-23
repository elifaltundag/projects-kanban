"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUserId } from "../../lib/auth-user";
import {
  createTaskForProject,
  deleteAllTasksForProject,
  deleteTaskForProject,
  moveTaskToStatusForProject,
  reorderTaskWithinColumn,
  updateTaskDefinitionForProject,
} from "../../lib/task-queries";
import type { TaskStatus } from "@prisma/client";

export async function createTask(formData: FormData) {
  const userId = await requireUserId();

  const rawProjectId = formData.get("projectId");
  const projectId = typeof rawProjectId === "string" ? rawProjectId : "";

  const rawDefinition = formData.get("definition");
  const definition =
    typeof rawDefinition === "string" ? rawDefinition.trim() : "";

  if (!projectId) {
    redirect("/projects?error=task-project-invalid");
  }

  if (!definition) {
    redirect(`/projects/${projectId}?error=task-definition-required`);
  }

  const task = await createTaskForProject(userId, projectId, definition);

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/projects");

  if (!task) {
    redirect(`/projects/${projectId}?error=task-project-missing`);
  }

  redirect(`/projects/${projectId}?created=1`);
}

export async function updateTaskDefinition(formData: FormData) {
  const userId = await requireUserId();

  const rawProjectId = formData.get("projectId");
  const projectId = typeof rawProjectId === "string" ? rawProjectId : "";

  const rawTaskId = formData.get("taskId");
  const taskId = typeof rawTaskId === "string" ? rawTaskId : "";

  const rawDefinition = formData.get("definition");
  const definition =
    typeof rawDefinition === "string" ? rawDefinition.trim() : "";

  if (!projectId || !taskId) {
    redirect("/projects?error=task-edit-invalid");
  }

  if (!definition) {
    redirect(`/projects/${projectId}?error=task-edit-definition-required`);
  }

  const task = await updateTaskDefinitionForProject(
    userId,
    projectId,
    taskId,
    definition,
  );

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/projects");

  if (!task) {
    redirect(`/projects/${projectId}?error=task-edit-missing`);
  }

  redirect(`/projects/${projectId}?edited=1`);
}

export async function deleteTask(formData: FormData) {
  const userId = await requireUserId();

  const rawProjectId = formData.get("projectId");
  const projectId = typeof rawProjectId === "string" ? rawProjectId : "";

  const rawTaskId = formData.get("taskId");
  const taskId = typeof rawTaskId === "string" ? rawTaskId : "";

  if (!projectId || !taskId) {
    redirect("/projects?error=task-delete-invalid");
  }

  const deleteResult = await deleteTaskForProject(userId, projectId, taskId);

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/projects");

  if (deleteResult.count === 0) {
    redirect(`/projects/${projectId}?error=task-delete-missing`);
  }

  redirect(`/projects/${projectId}?deleted=1`);
}

export async function deleteAllTasks(formData: FormData) {
  const userId = await requireUserId();

  const rawProjectId = formData.get("projectId");
  const projectId = typeof rawProjectId === "string" ? rawProjectId : "";

  if (!projectId) {
    redirect("/projects?error=task-delete-all-invalid");
  }

  const deleteResult = await deleteAllTasksForProject(userId, projectId);

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/projects");

  if (!deleteResult) {
    redirect(`/projects/${projectId}?error=task-delete-all-missing`);
  }

  redirect(`/projects/${projectId}?cleared=1&count=${deleteResult.count}`);
}

export async function reorderTask({
  direction,
  projectId,
  taskId,
}: {
  direction: "up" | "down";
  projectId: string;
  taskId: string;
}) {
  const userId = await requireUserId();

  if (!projectId || !taskId || !direction) {
    return {
      error: "task-reorder-invalid",
      ok: false,
    } as const;
  }

  const result = await reorderTaskWithinColumn(
    userId,
    projectId,
    taskId,
    direction,
  );

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/projects");

  if (!result) {
    return {
      error: "task-reorder-missing",
      ok: false,
    } as const;
  }

  return {
    ok: true,
  } as const;
}

export async function moveTaskToStatus({
  projectId,
  targetStatus,
  taskId,
}: {
  projectId: string;
  targetStatus: TaskStatus;
  taskId: string;
}) {
  const userId = await requireUserId();

  if (!projectId || !taskId || !targetStatus) {
    return {
      error: "task-move-invalid",
      ok: false,
    } as const;
  }

  const result = await moveTaskToStatusForProject(
    userId,
    projectId,
    taskId,
    targetStatus,
  );

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/projects");

  if (!result) {
    return {
      error: "task-move-missing",
      ok: false,
    } as const;
  }

  return {
    ok: true,
  } as const;
}
