import { TaskStatus } from "@prisma/client";
import prisma from "./prisma";

export async function createTaskForProject(
  ownerId: string,
  projectId: string,
  definition: string,
) {
  return prisma.$transaction(async (tx) => {
    const project = await tx.project.findFirst({
      where: {
        id: projectId,
        ownerId,
      },
      select: {
        id: true,
      },
    });

    if (!project) {
      return null;
    }

    const lastTaskInTodoColumn = await tx.task.findFirst({
      where: {
        projectId,
        status: TaskStatus.TO_DO,
      },
      orderBy: {
        sortOrder: "desc",
      },
      select: {
        sortOrder: true,
      },
    });

    const nextSortOrder = (lastTaskInTodoColumn?.sortOrder ?? -1) + 1;

    const task = await tx.task.create({
      data: {
        projectId,
        definition,
        status: TaskStatus.TO_DO,
        sortOrder: nextSortOrder,
      },
    });

    await tx.project.update({
      where: {
        id: projectId,
      },
      data: {
        updatedAt: new Date(),
      },
    });

    return task;
  });
}

export async function updateTaskDefinitionForProject(
  ownerId: string,
  projectId: string,
  taskId: string,
  definition: string,
) {
  return prisma.$transaction(async (tx) => {
    const task = await tx.task.findFirst({
      where: {
        id: taskId,
        projectId,
        project: {
          ownerId,
        },
      },
      select: {
        id: true,
        projectId: true,
      },
    });

    if (!task) {
      return null;
    }

    const updatedTask = await tx.task.update({
      where: {
        id: task.id,
      },
      data: {
        definition,
      },
    });

    await tx.project.update({
      where: {
        id: projectId,
      },
      data: {
        updatedAt: new Date(),
      },
    });

    return updatedTask;
  });
}

export async function deleteTaskForProject(
  ownerId: string,
  projectId: string,
  taskId: string,
) {
  return prisma.$transaction(async (tx) => {
    const deleteResult = await tx.task.deleteMany({
      where: {
        id: taskId,
        projectId,
        project: {
          ownerId,
        },
      },
    });

    if (deleteResult.count === 0) {
      return deleteResult;
    }

    await tx.project.update({
      where: {
        id: projectId,
      },
      data: {
        updatedAt: new Date(),
      },
    });

    return deleteResult;
  });
}

export async function deleteAllTasksForProject(
  ownerId: string,
  projectId: string,
) {
  return prisma.$transaction(async (tx) => {
    const project = await tx.project.findFirst({
      where: {
        id: projectId,
        ownerId,
      },
      select: {
        id: true,
      },
    });

    if (!project) {
      return null;
    }

    const deleteResult = await tx.task.deleteMany({
      where: {
        projectId,
      },
    });

    await tx.project.update({
      where: {
        id: projectId,
      },
      data: {
        updatedAt: new Date(),
      },
    });

    return deleteResult;
  });
}
