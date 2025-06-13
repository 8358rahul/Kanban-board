import { Box, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import {  loginSuccess } from "../store/authSlice";
import { useAppDispatch } from "../store/hooks";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
 const [loading, setLoading] = useState(true);
 

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = () => { 
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (storedUser) {
      setLoading(false);
      dispatch(loginSuccess(storedUser));
      navigate("/dashboard");
    }else{  
      setLoading(false); 
      setActiveTab(0)
    }
  };
 
 
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ p: 4 }}
    >
      {
        loading ?  <Box display="flex" justifyContent="center" mt={4}>
                  <CircularProgress />
                </Box>:  <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: activeTab === 0 ? -20 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: activeTab === 0 ? -20 : 20 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 0 ? (
          <Login activeTab={activeTab} setActiveTab={setActiveTab} />
        ) : (
          <Register activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
      </motion.div>
      }
       
    
    </Box>
  );
};

export default AuthPage;
