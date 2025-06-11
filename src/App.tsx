import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import KanbanPage from './pages/KanbanPage'; 
import { useAppSelector } from './store/hooks';
import Layout from './components/layout/Layout';

const App = () => {
  const { isAuthenticated } = useAppSelector((state:any) => state.auth);
  
   return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        
        <Route 
          path="/" 
          element={isAuthenticated ? <Layout /> : <Navigate to="/auth" />}
        >
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="tasks" element={<KanbanPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;