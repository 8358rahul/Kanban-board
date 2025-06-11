import { useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  CircularProgress,
  useTheme
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTasksStart, fetchTasksSuccess } from '../store/kanbanSlice';
import { fetchTasks } from '../api/taskApi';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
 

const DashboardPage  = () => {
  const dispatch = useAppDispatch(); 
  const { user } = useAppSelector((state) => state.auth);
  const { tasks,error,loading } = useAppSelector((state) => state.kanban)
  const theme = useTheme();   
  
  useEffect(() => {
    if (user) {
      const loadTasks = async () => {
        try {
          dispatch(fetchTasksStart());
          let response = await fetchTasks();   
          const filteredTasks = response.filter(task => task.userId === user.id);
          
          dispatch(fetchTasksSuccess(filteredTasks)); 
        } catch (err) {
          console.error(err);
        }
      };
      loadTasks();
    }
  }, [user, dispatch]);
 

  if (!user) {
    return <Typography>Please login to view dashboard</Typography>;
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks?.filter((task) => task.stage === 3).length;
  const pendingTasks = totalTasks - completedTasks;

  const priorityData = [
    { name: 'High', value: tasks?.filter(t => t.priority === 'high').length },
    { name: 'Medium', value: tasks?.filter(t => t.priority === 'medium').length },
    { name: 'Low', value: tasks?.filter(t => t.priority === 'low').length },
  ];

  const statusData = [
    { name: 'Backlog', value: tasks?.filter(t => t.stage === 0).length },
    { name: 'To Do', value: tasks?.filter(t => t.stage === 1).length },
    { name: 'In Progress', value: tasks?.filter(t => t.stage === 2).length },
    { name: 'Done', value: tasks?.filter(t => t.stage === 3).length },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Dashboard Overview
      </Typography>

      {loading && tasks.length === 0 ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" textAlign="center" mt={4}>
          {error}
        </Typography>
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <div>
              <motion.div whileHover={{ scale: 1.03 }}>
                <Card sx={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  borderRadius: 3,
                  minWidth: "20vw",
                  minHeight: "25vh"
                }}>
                  <CardContent>
                    <Typography variant="h6">Total Tasks</Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                      {totalTasks}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div>
              <motion.div whileHover={{ scale: 1.03 }}>
                <Card sx={{ 
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  color: 'white',
                  borderRadius: 3,
                     minWidth: "20vw",
                  minHeight: "25vh"
                }}>
                  <CardContent>
                    <Typography variant="h6">Completed Tasks</Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                      {completedTasks}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div>
              <motion.div whileHover={{ scale: 1.03 }}>
                <Card sx={{ 
                  background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                  color: 'white',
                  borderRadius: 3,
                     minWidth: "20vw",
                  minHeight: "25vh"
                }}>
                  <CardContent>
                    <Typography variant="h6">Pending Tasks</Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                      {pendingTasks}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </Grid>

          <Grid container spacing={3}>
            <div>
              <motion.div whileHover={{ scale: 1.01 }}>
                <Card sx={{ borderRadius: 3, p: 2,   minWidth: "25vw" }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Tasks by Priority
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={priorityData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar 
                        dataKey="value" 
                        fill={theme.palette.primary.main}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>
            </div>

            <div>
              <motion.div whileHover={{ scale: 1.01 }}>
                <Card sx={{ borderRadius: 3, p: 2, minWidth: "40vw" }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Tasks by Status
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={statusData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar 
                        dataKey="value" 
                        fill={theme.palette.secondary.main}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>
            </div>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default DashboardPage;