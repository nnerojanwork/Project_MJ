import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ProjectStatus = "not_started" | "in_progress" | "complete";

export interface TaskProgress {
  passed: boolean;
  attempts: number;
  hintsUsed: number;
  lastQuery: string;
  solutionRevealed: boolean;
}

export interface ProjectProgress {
  status: ProjectStatus;
  currentTaskIndex: number;
  tasks: Record<string, TaskProgress>;
}

interface ProgressState {
  projects: Record<string, ProjectProgress>;
  getProject: (projectId: string) => ProjectProgress;
  getTask: (projectId: string, taskId: string) => TaskProgress;
  recordAttempt: (projectId: string, taskId: string, query: string, passed: boolean) => void;
  useHint: (projectId: string, taskId: string) => void;
  revealSolution: (projectId: string, taskId: string) => void;
  advanceTask: (projectId: string, taskIndex: number, totalTasks: number) => void;
  isProjectComplete: (projectId: string, totalTasks: number) => boolean;
}

const emptyTask = (): TaskProgress => ({ passed: false, attempts: 0, hintsUsed: 0, lastQuery: "", solutionRevealed: false });
const emptyProject = (): ProjectProgress => ({ status: "not_started", currentTaskIndex: 0, tasks: {} });

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      projects: {},

      getProject: (projectId) => get().projects[projectId] ?? emptyProject(),

      getTask: (projectId, taskId) => get().projects[projectId]?.tasks[taskId] ?? emptyTask(),

      recordAttempt: (projectId, taskId, query, passed) =>
        set((state) => {
          const project = state.projects[projectId] ?? emptyProject();
          const task = project.tasks[taskId] ?? emptyTask();
          const updatedTask: TaskProgress = {
            ...task,
            attempts: task.attempts + 1,
            lastQuery: query,
            passed: task.passed || passed,
          };
          return {
            projects: {
              ...state.projects,
              [projectId]: {
                ...project,
                status: "in_progress",
                tasks: { ...project.tasks, [taskId]: updatedTask },
              },
            },
          };
        }),

      useHint: (projectId, taskId) =>
        set((state) => {
          const project = state.projects[projectId] ?? emptyProject();
          const task = project.tasks[taskId] ?? emptyTask();
          const updatedTask: TaskProgress = { ...task, hintsUsed: Math.min(3, task.hintsUsed + 1) };
          return {
            projects: {
              ...state.projects,
              [projectId]: {
                ...project,
                status: project.status === "not_started" ? "in_progress" : project.status,
                tasks: { ...project.tasks, [taskId]: updatedTask },
              },
            },
          };
        }),

      revealSolution: (projectId, taskId) =>
        set((state) => {
          const project = state.projects[projectId] ?? emptyProject();
          const task = project.tasks[taskId] ?? emptyTask();
          return {
            projects: {
              ...state.projects,
              [projectId]: {
                ...project,
                tasks: { ...project.tasks, [taskId]: { ...task, solutionRevealed: true } },
              },
            },
          };
        }),

      advanceTask: (projectId, taskIndex, totalTasks) =>
        set((state) => {
          const project = state.projects[projectId] ?? emptyProject();
          const status: ProjectStatus = taskIndex >= totalTasks ? "complete" : "in_progress";
          return {
            projects: {
              ...state.projects,
              [projectId]: {
                ...project,
                currentTaskIndex: Math.min(taskIndex, totalTasks - 1),
                status,
              },
            },
          };
        }),

      isProjectComplete: (projectId, totalTasks) => {
        const project = get().projects[projectId];
        if (!project) return false;
        const passedCount = Object.values(project.tasks).filter((t) => t.passed).length;
        return passedCount >= totalTasks;
      },
    }),
    { name: "sql-for-finance-progress" }
  )
);
