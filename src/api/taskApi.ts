import type { Task } from "../types/kanbanTypes"; 
 
import {axiosInstance} from '../utils/axiosInstance';

interface CreateTaskPayload extends Omit<Task, 'id' | 'createdAt' | 'updatedAt'> {}
interface UpdateTaskPayload extends Task {}

export const fetchTasks = async (): Promise<Task[]> => {
  const response = await axiosInstance.get<Task[]>(`/tasks`);
  return response.data;
};

export const createTask = async (taskData: CreateTaskPayload): Promise<Task> => {
  const response = await axiosInstance.post<Task>('/tasks', taskData);
  return response.data;
};

export const updateTask = async (taskData: UpdateTaskPayload): Promise<Task> => {
  const response = await axiosInstance.put<Task>(`/tasks/${taskData.id}`, taskData);
  return response.data;
};

export const deleteTask = async (taskId: string): Promise<void> => {
  await axiosInstance.delete(`/tasks/${taskId}`);
};

 
