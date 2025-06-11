// import { memo, useState } from "react";
// import {
//   DndContext,
//   DragOverlay,
//   closestCorners,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   type DragEndEvent,
//   type DragStartEvent,
// } from "@dnd-kit/core";
// import {
//   SortableContext,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable";
// import KanbanColumn from "./KanbanColumn";
// import KanbanItem from "./KanbanItem";
// import { useAppDispatch } from "../../store/hooks";
// import { moveTask } from "../../store/kanbanSlice";
// import { Box } from "@mui/material";
// import type { Task } from "../../types/kanbanTypes";
// import { updateTask } from "../../api/taskApi";

// const stages = [
//   { id: 0, title: "Backlog", color: "#FFEBEE" },
//   { id: 1, title: "To Do", color: "#E3F2FD" },
//   { id: 2, title: "In Progress", color: "#E8F5E9" },
//   { id: 3, title: "Done", color: "#E0F7FA" },
// ];

// interface KanbanBoardProps {
//   tasks: Task[];
// }

// const KanbanBoard = ({ tasks }:KanbanBoardProps) => {
//   const [activeTask, setActiveTask] = useState<Task | null>(null);
//   const dispatch = useAppDispatch();

//   const sensors = useSensors(
//     useSensor(PointerSensor),
//     useSensor(KeyboardSensor)
//   );

//   const handleDragStart = (event: DragStartEvent) => {
//     const { active } = event;
//     const task = tasks.find((t) => t.id === active.id);
//     if (task) setActiveTask(task);
//   };

//   const handleDragEnd = async (event: DragEndEvent) => {
//     const { active, over } = event;
//     setActiveTask(null);

//     if (!over || active.id === over.id) return;

//     const activeTask = tasks.find((t) => t.id === active.id);
//     const overColumnId = over.data.current?.columnId; 

//     if (activeTask && overColumnId !== undefined) {
//       const newStage = parseInt(overColumnId);
//       if (activeTask.stage !== newStage) {
//         await updateTask({
//           ...activeTask,
//           stage: newStage,
//         });
//         dispatch(moveTask({ taskId: activeTask.id, newStage }));
//       }
//     }
//   };

//   return (
//     <Box sx={{ p: 3 }}>
//       <DndContext
//         sensors={sensors}
//         collisionDetection={closestCorners}
//         onDragStart={handleDragStart}
//         onDragEnd={handleDragEnd}
//       >
//         <Box
//           display="flex"
//           gap={3}
//           sx={{
//             overflowX: "auto",
//             pb: 2,
//             "&::-webkit-scrollbar": {
//               height: 8,
//             },
//             "&::-webkit-scrollbar-track": {
//               background: "#f1f1f1",
//               borderRadius: 4,
//             },
//             "&::-webkit-scrollbar-thumb": {
//               background: "#888",
//               borderRadius: 4,
//             },
//           }}
//         >
//           {stages?.map((stage) => {
//             const stageTasks = tasks.filter((task) => task.stage === stage.id);
//             return (
//               <KanbanColumn
//                 key={stage.id}
//                 id={stage.id}
//                 title={stage.title}
//                 color={stage.color}
//               >
//                 <SortableContext
//                   items={stageTasks}
//                   strategy={verticalListSortingStrategy}
//                 >
//                   {stageTasks.map((task) => (
//                     <KanbanItem key={task.id} task={task} />
//                   ))}
//                 </SortableContext>
//               </KanbanColumn>
//             );
//           })}
//         </Box>

//         <DragOverlay>
//           {activeTask ? <KanbanItem task={activeTask} isDragging /> : null}
//         </DragOverlay>
//       </DndContext>
//     </Box>
//   );
// };

// export default memo(KanbanBoard);

// KanbanBoard.tsx
import  { memo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  MeasuringStrategy
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import KanbanColumn from "./KanbanColumn";
import KanbanItem from "./KanbanItem";
import { useAppDispatch } from "../../store/hooks";
import { moveTask } from "../../store/kanbanSlice";
import { Box } from "@mui/material";
import type { Task } from "../../types/kanbanTypes";
import { updateTask } from "../../api/taskApi";  

const stages = [
  { id: 0, title: "Backlog", color: "#FFEBEE", accent: "#F44336" },
  { id: 1, title: "To Do", color: "#E3F2FD", accent: "#2196F3" },
  { id: 2, title: "In Progress", color: "#E8F5E9", accent: "#4CAF50" },
  { id: 3, title: "Done", color: "#E0F7FA", accent: "#00BCD4" },
];

interface KanbanBoardProps {
  tasks: Task[];
}

const KanbanBoard = ({ tasks }: KanbanBoardProps) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<number | null>(null);
  const dispatch = useAppDispatch();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over || active.id === over.id) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    const overColumnId = over.data.current?.columnId;

    if (activeTask && overColumnId !== undefined) {
      const newStage = parseInt(overColumnId);
      if (activeTask.stage !== newStage) {
        await updateTask({
          ...activeTask,
          stage: newStage,
        });
        dispatch(moveTask({ taskId: activeTask.id, newStage }));
      }
    }
  };
 

  return (
    <Box sx={{ 
      p: 3,
      height: 'calc(100vh - 64px)',
      display: 'flex',
      flexDirection: 'column'
    }}> 

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        measuring={{
          droppable: {
            strategy: MeasuringStrategy.Always
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 3,
            overflowX: 'auto',
            flexGrow: 1,
            pb: 2,
            '&::-webkit-scrollbar': {
              height: 8,
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: 4,
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#888',
              borderRadius: 4,
            },
          }}
        >
          {stages?.map((stage) => {
            const stageTasks = tasks.filter((task) => task.stage === stage.id);
            return (
              <KanbanColumn
                key={stage.id}
                id={stage.id}
                title={stage.title}
                color={stage.color}
                accentColor={stage.accent} 
                count={stageTasks.length}
              >
                <SortableContext
                  items={stageTasks}
                  strategy={verticalListSortingStrategy}
                >
                  {stageTasks.map((task) => (
                    <KanbanItem key={task.id} task={task} />
                  ))}
                </SortableContext>
              </KanbanColumn>
            );
          })}
        </Box>

        <DragOverlay>
          {activeTask ? (
            <Box sx={{ 
              transform: 'rotate(3deg)',
              opacity: 0.9,
              width: 280
            }}>
              <KanbanItem task={activeTask} isDragging />
            </Box>
          ) : null}
        </DragOverlay>
      </DndContext> 
    </Box>
  );
};

export default memo(KanbanBoard);