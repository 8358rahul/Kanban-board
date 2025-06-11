import { memo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Stack,Typography } from '@mui/material';
import { createTask, updateTask } from '../../api/taskApi'; 
import { addTask, updateTask as updateTaskStore } from '../../store/kanbanSlice';
import type { Task } from '../../types/kanbanTypes';
import { useAppDispatch } from '../../store/hooks';
 

interface TaskFormDialogProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  task?: Task;
}

const TaskFormDialog = ({ open, onClose, userId, task }:TaskFormDialogProps) => {
  const dispatch = useAppDispatch();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Task>({
    defaultValues: task || {
      name: '',
      priority: 'medium',
      deadline: new Date().toISOString().split('T')[0],
      stage: 0,
    }
  }); 
  const [error, setError] = useState('');

  const onSubmit = async (data: Task) => { 
    try {
      if (task) {
        // Update existing task
        const updatedTask = await updateTask({
          ...task,
          ...data
        });
        dispatch(updateTaskStore(updatedTask));
      } else {
        // Create new task
        const newTask = await createTask({
          ...data,
          userId,
        });
        dispatch(addTask(newTask));
      }
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save task');
    }
  };

  const handleClose = () => {
    reset();
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={3} mt={1}>
            {error && (
              <Typography color="error">{error}</Typography>
            )}

            <TextField
              label="Task Name"
              {...register('name', { required: 'Task name is required' })}
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
            />

            <TextField
              select
              label="Priority"
              {...register('priority')}
              fullWidth
              defaultValue={task ? task.priority : 'medium'}
            >
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </TextField>

            <TextField
              label="Deadline"
              type="date"
              {...register('deadline', { required: 'Deadline is required' })}
              error={!!errors.deadline}
              helperText={errors.deadline?.message}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {task ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default memo(TaskFormDialog);