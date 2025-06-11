// import React, { memo } from 'react';
// import { useDroppable } from '@dnd-kit/core';
// import { Box, Typography, Paper } from '@mui/material';

// interface KanbanColumnProps {
//   id: number;
//   title: string;
//   color: string;
//   children: React.ReactNode; 
// }

// const KanbanColumn = ({ id, title, color, children}:KanbanColumnProps) => {
 

//   const { setNodeRef } = useDroppable({
//   id: id.toString(),
//   data: {
//     columnId: id.toString(),  
//   },
// });


//   return (
//     <Paper
//       ref={setNodeRef}
      
//       elevation={3}
//       sx={{
//         minWidth: 300,
//         maxWidth: 300,
//         backgroundColor: color,
//         p: 2,
//         borderRadius: 2,
//         display: 'flex',
//         flexDirection: 'column',
//         gap: 2,
//       }}
//     >
//       <Typography variant="h6" textAlign="center" fontWeight="bold">
//         {title}
//       </Typography>
//       <Box
//         sx={{
//           display: 'flex',
//           flexDirection: 'column',
//           gap: 2,
//           flexGrow: 1,
//           overflowY: 'auto',
//           maxHeight: 'calc(100vh - 200px)',
//           p: 1,
//         }}
//       >
//         {children}
//       </Box>
//     </Paper>
//   );
// };

// export default memo(KanbanColumn);

// KanbanColumn.tsx
import React, { memo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Box, Typography, Paper, IconButton, Badge } from '@mui/material';
import { Add } from '@mui/icons-material';

interface KanbanColumnProps {
  id: number;
  title: string;
  color: string;
  accentColor: string;
  children: React.ReactNode; 
  count: number;
}

const KanbanColumn = ({ 
  id, 
  title, 
  color, 
  accentColor, 
  children,  
  count
}: KanbanColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id.toString(),
    data: {
      columnId: id.toString(),
    },
  });

 
  return (
    <Paper
      ref={setNodeRef}
      elevation={3}
      sx={{
        minWidth: 300,
        width: 300,
        backgroundColor: isOver ? `${color}80` : color,
        p: 0,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        borderTop: `4px solid ${accentColor}`,
        transition: 'background-color 0.2s ease',
      }}
    >
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid ${accentColor}20`
        }}
      >
        <Badge 
          badgeContent={count} 
          color="default"
          sx={{
            '& .MuiBadge-badge': {
              backgroundColor: accentColor,
              color: 'white',
              fontWeight: 'bold'
            }
          }}
        >
          <Typography 
            variant="subtitle1" 
            fontWeight="bold"
            sx={{ color: 'text.primary' }}
          >
            {title}
          </Typography>
        </Badge> 
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          flexGrow: 1,
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 220px)',
          p: 2,
          '&::-webkit-scrollbar': {
            width: 6,
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: 3,
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: 3,
          },
        }}
      >
        {children}
      </Box>
    </Paper>
  );
};

export default memo(KanbanColumn);