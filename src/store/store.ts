import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import kanbanReducer from './kanbanSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    kanban: kanbanReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: { 
        ignoredActionPaths: ['payload.profileImage'], 
        ignoredPaths: ['auth.user.profileImage'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;