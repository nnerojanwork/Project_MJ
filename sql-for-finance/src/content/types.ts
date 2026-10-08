export interface Hint {
  tier: 1 | 2 | 3;
  text: string;
}

export interface Task {
  id: string;
  title: string;
  prompt: string;
  hints: [string, string, string];
  solutionSql: string;
  preserveOrder?: boolean;
  explanation: string;
}

export interface Project {
  id: string;
  levelId: string;
  title: string;
  scenario: string;
  tables: string[];
  tasks: Task[];
}

export interface Level {
  id: string;
  number: number;
  title: string;
  objective: string;
  projects: Project[];
}

export interface ColumnDef {
  name: string;
  type: string;
  description?: string;
}

export interface TableDef {
  name: string;
  description: string;
  columns: ColumnDef[];
}
