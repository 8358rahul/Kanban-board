import React, { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Paper,
  useTheme,
  styled,
  Typography,
  Link,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import logo from "../assets/react.svg";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../store/authSlice";
import { useAppDispatch } from "../store/hooks";

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 600,
  fontSize: "1rem",
  color: theme.palette.text.secondary,
  "&.Mui-selected": {
    color: theme.palette.primary.main,
  },
}));

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleTabChange = (_event: any, newValue: number) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = () => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (storedUser) {
      dispatch(loginSuccess(storedUser));
      navigate("/dashboard");
    }
  };

  return ( 
          <Box  
              display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ p: 4 }}>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: activeTab === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: activeTab === 0 ? -20 : 20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 0 ? <Login  activeTab={activeTab} setActiveTab={setActiveTab}/> : <Register  activeTab={activeTab} setActiveTab={setActiveTab}/>}
            </motion.div>
          </Box>
        
  );
};

export default AuthPage;
