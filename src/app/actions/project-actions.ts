"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUserId } from "../../lib/auth-user";
import {
  createProjectForUser,
  deleteProjectForUser,
} from "../../lib/project-queries";

export async function createProject(formData: FormData) {
  const userId = await requireUserId();

  const rawName = formData.get("name");
  const name = typeof rawName === "string" ? rawName.trim() : "";

  if (!name) {
    redirect("/projects?error=project-name-required");
  }

  await createProjectForUser(userId, name);

  revalidatePath("/projects");
  redirect("/projects?created=1");
}

export async function deleteProject(formData: FormData) {
  const userId = await requireUserId();

  const rawProjectId = formData.get("projectId");
  const projectId = typeof rawProjectId === "string" ? rawProjectId : "";

  if (!projectId) {
    redirect("/projects?error=project-delete-invalid");
  }

  const deleteResult = await deleteProjectForUser(userId, projectId);

  revalidatePath("/projects");

  if (deleteResult.count === 0) {
    redirect("/projects?error=project-delete-missing");
  }

  redirect("/projects?deleted=1");
}
