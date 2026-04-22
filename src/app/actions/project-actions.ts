"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "../../../auth";
import prisma from "../../lib/prisma";

export async function createProject(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  const rawName = formData.get("name");
  const name = typeof rawName === "string" ? rawName.trim() : "";

  if (!name) {
    redirect("/projects?error=project-name-required");
  }

  await prisma.project.create({
    data: {
      name,
      ownerId: session.user.id,
    },
  });

  revalidatePath("/projects");
  redirect("/projects?created=1");
}

export async function deleteProject(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  const rawProjectId = formData.get("projectId");
  const projectId = typeof rawProjectId === "string" ? rawProjectId : "";

  if (!projectId) {
    redirect("/projects?error=project-delete-invalid");
  }

  const deleteResult = await prisma.project.deleteMany({
    where: {
      id: projectId,
      ownerId: session.user.id,
    },
  });

  revalidatePath("/projects");

  if (deleteResult.count === 0) {
    redirect("/projects?error=project-delete-missing");
  }

  redirect("/projects?deleted=1");
}
