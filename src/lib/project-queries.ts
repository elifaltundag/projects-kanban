import prisma from "./prisma";

export function listProjectsForUser(ownerId: string) {
  return prisma.project.findMany({
    where: {
      ownerId,
    },
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export function getProjectBoardForUser(ownerId: string, projectId: string) {
  return prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId,
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      tasks: {
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
          definition: true,
          status: true,
          sortOrder: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });
}

export function createProjectForUser(ownerId: string, name: string) {
  return prisma.project.create({
    data: {
      name,
      ownerId,
    },
  });
}

export function deleteProjectForUser(ownerId: string, projectId: string) {
  return prisma.project.deleteMany({
    where: {
      id: projectId,
      ownerId,
    },
  });
}
