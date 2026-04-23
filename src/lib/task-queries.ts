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

export async function reorderTaskWithinColumn(
  ownerId: string,
  projectId: string,
  taskId: string,
  direction: "up" | "down",
) {
  return prisma.$transaction(async (tx) => {
    const currentTask = await tx.task.findFirst({
      where: {
        id: taskId,
        projectId,
        project: {
          ownerId,
        },
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!currentTask) {
      return null;
    }

    const tasksInColumn = await tx.task.findMany({
      where: {
        projectId,
        status: currentTask.status,
      },
      orderBy: [
        {
          sortOrder: "asc",
        },
        {
          createdAt: "asc",
        },
      ],
      select: {
        id: true,
      },
    });

    const currentIndex = tasksInColumn.findIndex((task) => task.id === taskId);

    if (currentIndex === -1) {
      return null;
    }

    const targetIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= tasksInColumn.length) {
      return {
        moved: false,
      };
    }

    const reorderedTasks = [...tasksInColumn];
    const [taskToMove] = reorderedTasks.splice(currentIndex, 1);
    reorderedTasks.splice(targetIndex, 0, taskToMove);

    await Promise.all(
      reorderedTasks.map((task, index) =>
        tx.task.update({
          where: {
            id: task.id,
          },
          data: {
            sortOrder: index,
          },
        }),
      ),
    );

    await tx.project.update({
      where: {
        id: projectId,
      },
      data: {
        updatedAt: new Date(),
      },
    });

    return {
      moved: true,
    };
  });
}

export async function moveTaskToStatusForProject(
  ownerId: string,
  projectId: string,
  taskId: string,
  targetStatus: TaskStatus,
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
        status: true,
      },
    });

    if (!task) {
      return null;
    }

    if (task.status === targetStatus) {
      return {
        moved: false,
      };
    }

    const targetColumnTaskCount = await tx.task.count({
      where: {
        projectId,
        status: targetStatus,
      },
    });

    await tx.task.update({
      where: {
        id: task.id,
      },
      data: {
        status: targetStatus,
        sortOrder: targetColumnTaskCount,
      },
    });

    const sourceColumnTasks = await tx.task.findMany({
      where: {
        projectId,
        status: task.status,
      },
      orderBy: [
        {
          sortOrder: "asc",
        },
        {
          createdAt: "asc",
        },
      ],
      select: {
        id: true,
      },
    });

    const targetColumnTasks = await tx.task.findMany({
      where: {
        projectId,
        status: targetStatus,
      },
      orderBy: [
        {
          sortOrder: "asc",
        },
        {
          createdAt: "asc",
        },
      ],
      select: {
        id: true,
      },
    });

    await Promise.all([
      ...sourceColumnTasks.map((columnTask, index) =>
        tx.task.update({
          where: {
            id: columnTask.id,
          },
          data: {
            sortOrder: index,
          },
        }),
      ),
      ...targetColumnTasks.map((columnTask, index) =>
        tx.task.update({
          where: {
            id: columnTask.id,
          },
          data: {
            sortOrder: index,
          },
        }),
      ),
    ]);

    await tx.project.update({
      where: {
        id: projectId,
      },
      data: {
        updatedAt: new Date(),
      },
    });

    return {
      moved: true,
    };
  });
}
