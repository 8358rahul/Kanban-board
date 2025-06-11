import type { Task } from "../types/kanbanTypes"; 
 
import {taskInstance} from '../utils/axiosInstance';

interface CreateTaskPayload extends Omit<Task, 'id' | 'createdAt' | 'updatedAt'> {}
interface UpdateTaskPayload extends Task {}

export const fetchTasks = async (): Promise<Task[]> => {
  const response = await taskInstance.get<Task[]>(`/tasks`);
  return response.data;
};

export const createTask = async (taskData: CreateTaskPayload): Promise<Task> => {
  const response = await taskInstance.post<Task>('/tasks', taskData);
  return response.data;
};

export const updateTask = async (taskData: UpdateTaskPayload): Promise<Task> => {
  const response = await taskInstance.put<Task>(`/tasks/${taskData.id}`, taskData);
  return response.data;
};

export const deleteTask = async (taskId: string): Promise<void> => {
  await taskInstance.delete(`/tasks/${taskId}`);
};

 
