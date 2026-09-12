import { level1 } from "./level1";
import { level2 } from "./level2";
import { level3 } from "./level3";
import { level4 } from "./level4";
import { level5 } from "./level5";
import { level6 } from "./level6";
import { Level, Project, Task } from "./types";

export const LEVELS: Level[] = [level1, level2, level3, level4, level5, level6];

export function getLevel(levelId: string): Level | undefined {
  return LEVELS.find((l) => l.id === levelId);
}

export function getProject(projectId: string): { level: Level; project: Project } | undefined {
  for (const level of LEVELS) {
    const project = level.projects.find((p) => p.id === projectId);
    if (project) return { level, project };
  }
  return undefined;
}

export function getTask(projectId: string, taskId: string): Task | undefined {
  const found = getProject(projectId);
  return found?.project.tasks.find((t) => t.id === taskId);
}

export function getAdjacentProject(projectId: string): { prevId: string | null; nextId: string | null } {
  const flat: string[] = [];
  for (const level of LEVELS) for (const p of level.projects) flat.push(p.id);
  const idx = flat.indexOf(projectId);
  return {
    prevId: idx > 0 ? flat[idx - 1] : null,
    nextId: idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null,
  };
}

export function levelProjectCount(levelId: string): number {
  return getLevel(levelId)?.projects.length ?? 0;
}

export function levelCompletedCount(levelId: string, isComplete: (projectId: string, totalTasks: number) => boolean): number {
  const level = getLevel(levelId);
  if (!level) return 0;
  return level.projects.filter((p) => isComplete(p.id, p.tasks.length)).length;
}
