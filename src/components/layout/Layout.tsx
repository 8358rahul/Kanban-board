import { Outlet } from 'react-router-dom'; 
import { Box } from '@mui/material';
import Header from './Header';
import { memo } from 'react';

const Layout = () => {
  return (
    <Box>
      <Header />
      <Box component="main" sx={{ p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default memo(Layout);