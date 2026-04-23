import Link from "next/link";
import { notFound } from "next/navigation";
import type { TaskStatus } from "@prisma/client";
import {
  createTask,
  updateTaskDefinition,
} from "../../actions/task-actions";
import { DeleteAllTasksButton } from "./delete-all-tasks-button";
import { DeleteTaskButton } from "./delete-task-button";
import { DraggableTaskCard } from "./draggable-task-card";
import { MoveTaskStatusButtons } from "./move-task-status-buttons";
import { ReorderTaskButtons } from "./reorder-task-buttons";
import { TaskColumnDropZone } from "./task-column-drop-zone";
import { requireSessionUser } from "../../../lib/auth-user";
import { getProjectBoardForUser } from "../../../lib/project-queries";

type ProjectBoardPageProps = {
  params: Promise<{
    projectId: string;
  }>;
  searchParams?: Promise<{
    cleared?: string;
    count?: string;
    created?: string;
    deleted?: string;
    edited?: string;
    error?: string;
  }>;
};

const boardColumns: Array<{
  status: TaskStatus;
  label: string;
  description: string;
  accentClassName: string;
}> = [
  {
    status: "TO_DO",
    label: "To-Do",
    description: "New tasks start here before active work begins.",
    accentClassName: "bg-sky-100 text-sky-800",
  },
  {
    status: "IN_PROGRESS",
    label: "In Progress",
    description: "Tasks currently being worked on.",
    accentClassName: "bg-amber-100 text-amber-800",
  },
  {
    status: "IN_REVIEW",
    label: "In Review",
    description: "Tasks waiting for a final check before closure.",
    accentClassName: "bg-violet-100 text-violet-800",
  },
  {
    status: "CANCELLED",
    label: "Cancelled",
    description: "Tasks intentionally stopped or no longer needed.",
    accentClassName: "bg-rose-100 text-rose-800",
  },
  {
    status: "DONE",
    label: "Done",
    description: "Finished work collected at the end of the board.",
    accentClassName: "bg-emerald-100 text-emerald-800",
  },
];

export default async function ProjectBoardPage({
  params,
  searchParams,
}: ProjectBoardPageProps) {
  const sessionUser = await requireSessionUser();
  const { projectId } = await params;
  const resolvedSearchParams = await searchParams;
  const cleared = resolvedSearchParams?.cleared === "1";
  const clearedCount = Number(resolvedSearchParams?.count ?? "0");
  const created = resolvedSearchParams?.created === "1";
  const deleted = resolvedSearchParams?.deleted === "1";
  const edited = resolvedSearchParams?.edited === "1";
  const taskDefinitionRequired =
    resolvedSearchParams?.error === "task-definition-required";
  const taskProjectMissing =
    resolvedSearchParams?.error === "task-project-missing";
  const taskEditDefinitionRequired =
    resolvedSearchParams?.error === "task-edit-definition-required";
  const taskEditMissing = resolvedSearchParams?.error === "task-edit-missing";
  const taskDeleteMissing =
    resolvedSearchParams?.error === "task-delete-missing";
  const taskDeleteAllMissing =
    resolvedSearchParams?.error === "task-delete-all-missing";

  const project = await getProjectBoardForUser(sessionUser.id, projectId);

  if (!project) {
    notFound();
  }

  const tasksByStatus = new Map(
    boardColumns.map((column) => [
      column.status,
      project.tasks.filter((task) => task.status === column.status),
    ]),
  );

  return (
    <div className="min-h-screen bg-stone-100 px-6 py-12 text-stone-950">
      <main className="mx-auto max-w-7xl">
        <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-[0_24px_80px_rgba(41,37,36,0.08)] sm:p-12">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-4">
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-stone-500">
                  Phase 5
                </p>
                <div className="space-y-3">
                  <h1 className="text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
                    {project.name}
                  </h1>
                  <p className="max-w-3xl text-lg leading-8 text-stone-600">
                    This first task board view renders the five workflow columns
                    from the existing `TaskStatus` enum and groups the
                    project&apos;s tasks under the correct status.
                  </p>
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-6 py-5">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-stone-500">
                  Board Snapshot
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
                  {project.tasks.length}{" "}
                  {project.tasks.length === 1 ? "task" : "tasks"}
                </p>
                <p className="mt-2 max-w-xs text-sm leading-7 text-stone-600">
                  Signed in as {sessionUser.name ?? sessionUser.email}. Empty
                  columns still render so the board shape is stable before CRUD
                  and drag-and-drop arrive in later steps.
                </p>
                <div className="mt-5">
                  <DeleteAllTasksButton
                    projectId={project.id}
                    projectName={project.name}
                    taskCount={project.tasks.length}
                  />
                </div>
              </div>
            </div>

            <section className="rounded-[1.75rem] border border-stone-200 bg-stone-50 p-6 sm:p-8">
              <div className="flex flex-col gap-6">
                <div className="space-y-3">
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-stone-500">
                    Add Task
                  </p>
                  <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
                    Create a new task in the To-Do column.
                  </h2>
                  <p className="max-w-2xl text-sm leading-7 text-stone-600">
                    The first task flow in Phase 5 validates the definition,
                    confirms the project belongs to the signed-in user, and
                    saves the task with `TO_DO` status plus the next available
                    `sortOrder` in that column.
                  </p>
                </div>
                <form action={createTask} className="flex flex-col gap-4">
                  <input type="hidden" name="projectId" value={project.id} />
                  <label
                    htmlFor="task-definition"
                    className="text-sm font-medium text-stone-700"
                  >
                    Task definition
                  </label>
                  <div className="flex flex-col gap-3 lg:flex-row">
                    <input
                      id="task-definition"
                      name="definition"
                      type="text"
                      placeholder="Draft the first milestone plan"
                      className="min-w-0 flex-1 rounded-full border border-stone-300 bg-white px-5 py-3 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-stone-950"
                    />
                    <button
                      type="submit"
                      className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-stone-50 transition hover:bg-stone-800"
                    >
                      Add task
                    </button>
                  </div>
                </form>
                {taskDefinitionRequired ? (
                  <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-7 text-rose-700">
                    Task definition is required. Enter at least one non-space
                    character before submitting.
                  </p>
                ) : null}
                {taskProjectMissing ? (
                  <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-7 text-rose-700">
                    That task could not be created. The project may be missing
                    or may not belong to this account.
                  </p>
                ) : null}
                {created ? (
                  <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-7 text-emerald-700">
                    Task created successfully in To-Do.
                  </p>
                ) : null}
                {cleared ? (
                  <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-7 text-emerald-700">
                    Deleted {clearedCount}{" "}
                    {clearedCount === 1 ? "task" : "tasks"} from this project.
                  </p>
                ) : null}
                {edited ? (
                  <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-7 text-emerald-700">
                    Task definition updated successfully.
                  </p>
                ) : null}
                {deleted ? (
                  <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-7 text-emerald-700">
                    Task deleted successfully.
                  </p>
                ) : null}
                {taskEditDefinitionRequired ? (
                  <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-7 text-rose-700">
                    Edited task definition is required. Enter at least one
                    non-space character before saving.
                  </p>
                ) : null}
                {taskEditMissing ? (
                  <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-7 text-rose-700">
                    That task could not be updated. It may be missing or may
                    not belong to this account.
                  </p>
                ) : null}
                {taskDeleteMissing ? (
                  <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-7 text-rose-700">
                    That task could not be deleted. It may be missing or may
                    not belong to this account.
                  </p>
                ) : null}
                {taskDeleteAllMissing ? (
                  <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-7 text-rose-700">
                    Tasks could not be deleted for this project. It may be
                    missing or may not belong to this account.
                  </p>
                ) : null}
              </div>
            </section>

            <div className="grid gap-5 xl:grid-cols-5">
              {boardColumns.map((column) => {
                const tasks = tasksByStatus.get(column.status) ?? [];

                return (
                  <section
                    key={column.status}
                    className="flex min-h-[24rem] flex-col rounded-[1.75rem] border border-stone-200 bg-stone-50 p-5"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <h2 className="text-xl font-semibold tracking-tight text-stone-950">
                          {column.label}
                        </h2>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${column.accentClassName}`}
                        >
                          {tasks.length}
                        </span>
                      </div>
                      <p className="text-sm leading-7 text-stone-600">
                        {column.description}
                      </p>
                    </div>

                    <TaskColumnDropZone
                      projectId={project.id}
                      targetStatus={column.status}
                    >
                      {tasks.length === 0 ? (
                        <div className="flex flex-1 items-center justify-center rounded-[1.5rem] border border-dashed border-stone-300 bg-white/80 p-6 text-center">
                          <p className="max-w-[14rem] text-sm leading-7 text-stone-500">
                            No tasks in {column.label.toLowerCase()} yet.
                          </p>
                        </div>
                      ) : (
                        tasks.map((task, index) => (
                          <DraggableTaskCard
                            key={task.id}
                            projectId={project.id}
                            status={task.status}
                            taskId={task.id}
                          >
                            <article className="rounded-[1.5rem] border border-stone-200 bg-white p-4 shadow-sm">
                              <div className="space-y-3">
                                <form
                                  action={updateTaskDefinition}
                                  className="flex flex-col gap-3"
                                >
                                  <input
                                    type="hidden"
                                    name="projectId"
                                    value={project.id}
                                  />
                                  <input
                                    type="hidden"
                                    name="taskId"
                                    value={task.id}
                                  />
                                  <label
                                    htmlFor={`task-definition-${task.id}`}
                                    className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500"
                                  >
                                    Edit task
                                  </label>
                                  <input
                                    id={`task-definition-${task.id}`}
                                    name="definition"
                                    type="text"
                                    defaultValue={task.definition}
                                    className="rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
                                  />
                                  <div className="flex justify-end">
                                    <button
                                      type="submit"
                                      className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
                                    >
                                      Save
                                    </button>
                                  </div>
                                </form>
                                <div className="flex items-center justify-between gap-3">
                                  <MoveTaskStatusButtons
                                    currentStatus={task.status}
                                    projectId={project.id}
                                    taskId={task.id}
                                  />
                                  <ReorderTaskButtons
                                    projectId={project.id}
                                    taskId={task.id}
                                    canMoveUp={index > 0}
                                    canMoveDown={index < tasks.length - 1}
                                  />
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                  <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                                    Keyboard move: use left/right arrows here via
                                    the move buttons.
                                  </p>
                                  <DeleteTaskButton
                                    projectId={project.id}
                                    taskId={task.id}
                                    taskDefinition={task.definition}
                                  />
                                </div>
                                <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs uppercase tracking-[0.18em] text-stone-500">
                                  <span>Order {task.sortOrder}</span>
                                  <span>
                                    Updated{" "}
                                    {task.updatedAt.toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </article>
                          </DraggableTaskCard>
                        ))
                      )}
                    </TaskColumnDropZone>
                  </section>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/projects"
                className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-stone-50 transition hover:bg-stone-800"
              >
                Back to projects
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
