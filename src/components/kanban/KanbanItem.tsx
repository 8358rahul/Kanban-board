import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowBack,
  ArrowForward,
  Delete,
  DragIndicator,
  Edit,
  Flag,
  MoreVert,
  Schedule,
} from "@mui/icons-material";
import {
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import React, { memo, useState } from "react";
import { deleteTask as apiDeleteTask, updateTask } from "../../api/taskApi";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { deleteTask, moveTask } from "../../store/kanbanSlice";
import type { Task } from "../../types/kanbanTypes";
import { formatDate } from "../../utils/utils";
import TaskFormDialog from "./TaskFormDialog";

interface KanbanItemProps {
  task: Task;
  isDragging?: boolean;
}

const KanbanItem = ({ task, isDragging }: KanbanItemProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openForm, setOpenForm] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const dispatch = useAppDispatch();
  const open = Boolean(anchorEl);
  const { user } = useAppSelector((state: any) => state.auth);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: { task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : "auto",
    transition: "transform 0.2s ease, opacity 0.2s ease",
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMoveBackward = async () => {
    if (task.stage > 0) {
      await updateTask({
        ...task,
        stage: task.stage - 1,
      });
      dispatch(moveTask({ taskId: task.id, newStage: task.stage - 1 }));
    }
    handleMenuClose();
  };

  const handleMoveForward = async () => {
    if (task.stage < 3) {
      await updateTask({
        ...task,
        stage: task.stage + 1,
      });
      dispatch(moveTask({ taskId: task.id, newStage: task.stage + 1 }));
    }
    handleMenuClose();
  };

  const handleEditTask = () => {
    setOpenForm(true);
    handleMenuClose();
  };

  const handleDeleteConfirmed = async () => {
    await apiDeleteTask(task.id);
    dispatch(deleteTask(task.id));
    setConfirmOpen(false);
    handleMenuClose();
  };

  const handleDelete = () => {
    setConfirmOpen(true);
    handleMenuClose();
  };

  const getPriorityColor = () => {
    switch (task.priority) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  const isOverdue = new Date(task.deadline) < new Date() && task.stage !== 3;

  return (
    <>
      <Paper
        ref={setNodeRef}
        style={style}
        id={task.id.toString()}
        {...attributes}
        elevation={isDragging ? 8 : 2}
        sx={{
          p: 2,
          mb: 1.5,
          position: "relative",
          borderLeft: `3px solid ${getPriorityBorderColor()}`,
          "&:hover": {
            boxShadow: 4,
          },
          cursor: isDragging ? "grabbing" : "grab",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          gap={1}
        >
          <Box flexGrow={1}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              {task.name}
            </Typography>

            <Box display="flex" alignItems="center" gap={1} mb={1.5}>
              <Flag
                fontSize="small"
                sx={{
                  color: getPriorityIconColor(),
                  width: 16,
                  height: 16,
                }}
              />
              <Chip
                label={task.priority}
                size="small"
                color={getPriorityColor()}
                sx={{ height: 20, fontSize: "0.7rem" }}
              />
            </Box>

            <Box display="flex" alignItems="center" gap={1} mb={1.5}>
              <Schedule
                fontSize="small"
                sx={{
                  color: isOverdue ? "error.main" : "text.secondary",
                  width: 16,
                  height: 16,
                }}
              />
              <Typography
                variant="caption"
                color={isOverdue ? "error.main" : "text.secondary"}
                sx={{ fontWeight: isOverdue ? "bold" : "normal" }}
              >
                {isOverdue ? "Overdue" : "Due"} {formatDate(task.deadline)}
              </Typography>
            </Box>
          </Box>

          <IconButton
            size="small"
            onClick={handleMenuOpen}
            onMouseDown={(e) => e.stopPropagation()}
            sx={{
              mt: -1,
              mr: -1,
              color: "text.secondary",
            }}
          >
            <MoreVert fontSize="small" />
          </IconButton>
        </Box>

        <Tooltip title="Drag to move">
          <Box
            {...listeners}
            sx={{
              position: "absolute",
              bottom: 8,
              right: 8,
              opacity: 0.3,
              "&:hover": {
                opacity: 1,
              },
              transition: "opacity 0.2s ease",
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <DragIndicator fontSize="small" />
          </Box>
        </Tooltip>
      </Paper>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        aria-labelledby="confirm-dialog-title"
      >
        <DialogTitle id="confirm-dialog-title">Delete Task?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the task "
            <strong>{task.name}</strong>"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirmed}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          "& .MuiPaper-root": {
            boxShadow: 3,
            borderRadius: 2,
            minWidth: 180,
          },
        }}
      >
        <MenuItem onClick={handleMoveBackward} disabled={task.stage === 0}>
          <ArrowBack fontSize="small" sx={{ mr: 1.5 }} /> Move Back
        </MenuItem>
        <MenuItem onClick={handleMoveForward} disabled={task.stage === 3}>
          <ArrowForward fontSize="small" sx={{ mr: 1.5 }} /> Move Forward
        </MenuItem>
        <MenuItem onClick={handleEditTask}>
          <Edit fontSize="small" sx={{ mr: 1.5 }} /> Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <Delete fontSize="small" sx={{ mr: 1.5 }} /> Delete
        </MenuItem>
      </Menu>

      <TaskFormDialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        task={task}
        userId={user.id}
      />
    </>
  );

  function getPriorityBorderColor() {
    switch (task.priority) {
      case "high":
        return "#F44336";
      case "medium":
        return "#FF9800";
      case "low":
        return "#4CAF50";
      default:
        return "#9E9E9E";
    }
  }

  function getPriorityIconColor() {
    switch (task.priority) {
      case "high":
        return "#F44336";
      case "medium":
        return "#FF9800";
      case "low":
        return "#4CAF50";
      default:
        return "#9E9E9E";
    }
  }
};

export default memo(KanbanItem);
