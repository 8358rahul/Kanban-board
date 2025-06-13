import { useState, useEffect, memo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../api/authApi";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useAppDispatch } from "../../store/hooks";
import { loginSuccess } from "../../store/authSlice";
import type { User } from "../../types/authTypes";
import { BottomContent } from "./BottomContent";
import logo from "../../assets/logo.png";

const Login = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: number;
  setActiveTab: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const [userCaptcha, setUserCaptcha] = useState("");
  const [userList, setUserList] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const generateCaptcha = () => {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(result);
  };

  useEffect(() => {
    generateCaptcha();
    getUserList();
  }, []);

  const getUserList = async () => {
    try {
      const response: any = await getUser();
      setUserList(response);
    } catch (error: any) {
      console.error("Login error:", error.message);
    }
  };

  const onSubmit = async (data: any) => {
    if (userCaptcha !== captcha) {
      setError("Invalid captcha");
      generateCaptcha();
      return;
    }
setLoading(true)
    const userExists = userList.find(
      (user) =>
        (user.email === data.email || user.username === data.email) &&
        user.password === data.password
    );
    if (!userExists) {
      setError("Invalid email/username or password");
      setLoading(false);
      return;
    }
    localStorage.setItem("user", JSON.stringify(userExists));
    dispatch(loginSuccess(userExists));
    setLoading(false);
    navigate("/dashboard");
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          alignItems={"center"}
          justifyContent={"center"}
          sx={{
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 4,
            boxShadow: 24,
            p: 4,
          }}
        >
          <img
            src={logo}
            style={{
              width: 100,
              height: 100,
              marginBottom: 20,
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
            alt="Logo"
          />

          {error && (
            <Typography color="error" textAlign="center" mb={2}>
              {error}
            </Typography>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box mb={3}>
              <TextField
                fullWidth
                label="Username/Email"
                variant="outlined"
                {...register("email", { required: "Required" })}
                error={!!errors.email}
                helperText={
                  typeof errors.email?.message === "string"
                    ? errors.email.message
                    : undefined
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box mb={3}>
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                {...register("password", { required: "Required" })}
                error={!!errors.password}
                helperText={
                  typeof errors.password?.message === "string"
                    ? errors.password.message
                    : undefined
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box mb={3}>
              <Box display="flex" alignItems="center" mb={1}>
                <Typography variant="body2">Captcha: </Typography>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  ml={1}
                  sx={{ letterSpacing: 2 }}
                >
                  {captcha}
                </Typography>
              </Box>
              <TextField
                fullWidth
                label="Enter Captcha"
                variant="outlined"
                value={userCaptcha}
                onChange={(e) => setUserCaptcha(e.target.value)}
              />
            </Box>

            <Button
              fullWidth
              loading={loading} 
              variant="contained"
              size="large"
              type="submit"
              sx={{
                py: 1.5,
                borderRadius: 2,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              Sign In
            </Button>
          </form>
          <BottomContent activeTab={activeTab} setActiveTab={setActiveTab} />
        </Box>
      </motion.div>
    </Box>
  );
};

export default memo(Login);
