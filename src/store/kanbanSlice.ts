import { createSlice, type PayloadAction } from '@reduxjs/toolkit'; 
import type { Task } from '../types/kanbanTypes';

interface KanbanState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: KanbanState = {
  tasks: [],
  loading: false,
  error: null,
};

const kanbanSlice = createSlice({
  name: 'kanban',
  initialState,
  reducers: {
    fetchTasksStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTasksSuccess: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchTasksFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    moveTask: (state, action: PayloadAction<{ taskId: string; newStage: number }>) => {
      const task = state.tasks.find(task => task.id === action.payload.taskId);
      if (task) {
        task.stage = action.payload.newStage;
      }
    },
    clearKanbanError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchTasksStart,
  fetchTasksSuccess,
  fetchTasksFailure,
  addTask,
  updateTask,
  deleteTask,
  moveTask,
  clearKanbanError,
} = kanbanSlice.actions;

export default kanbanSlice.reducer;