"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUserId } from "../../lib/auth-user";
import {
  createTaskForProject,
  updateTaskDefinitionForProject,
} from "../../lib/task-queries";

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
