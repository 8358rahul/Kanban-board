export type TaskPriority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  name: string;
  stage: number;
  priority: TaskPriority;
  deadline: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface KanbanStage {
  id: number;
  title: string;
  color: string;
}