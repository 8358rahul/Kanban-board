import  { useState, useEffect } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import KanbanBoard from "../components/kanban/KanbanBoard";
import TaskFormDialog from "../components/kanban/TaskFormDialog";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchTasksStart,
  fetchTasksSuccess,
  fetchTasksFailure,
} from "../store/kanbanSlice";
import { fetchTasks } from "../api/taskApi";

const KanbanPage  = () => {
  const dispatch = useAppDispatch();
  const { tasks, loading, error } = useAppSelector(
    (state: any) => state.kanban
  );
  const { user } = useAppSelector((state: any) => state.auth);
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    if (user) {
      const loadTasks = async () => {
        try {
          dispatch(fetchTasksStart());
          let response = await fetchTasks();
          const filteredTasks = response.filter(
            (task) => task.userId === user.id
          );

          dispatch(fetchTasksSuccess(filteredTasks));
        } catch (err) {
          dispatch(
            fetchTasksFailure(
              err instanceof Error ? err.message : "Failed to load tasks"
            )
          );
        }
      };
      loadTasks();
    }
  }, [user, dispatch]);

  if (!user) {
    return <Typography>Please login to view tasks</Typography>;
  }

  if (loading && tasks.length === 0) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" textAlign="center" mt={4}>
        {error}
      </Typography>
    );
  }

  return (
    <Box p={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Task Board</Typography>
        <Button variant="contained" onClick={() => setOpenForm(true)}>
          Create Task
        </Button>
      </Box>

      <KanbanBoard tasks={tasks} />

      <TaskFormDialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        userId={user.id}
      />
    </Box>
  );
};

export default KanbanPage;
