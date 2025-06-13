
import React, { memo, useState } from 'react';
import { useForm } from 'react-hook-form'; 
import { registerUser } from '../../api/authApi';
import {
  Box,
  Button,
  TextField, 
  InputAdornment,
  IconButton,
  Avatar
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Phone as PhoneIcon,
  Visibility,
  VisibilityOff,
  CameraAlt as CameraIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { BottomContent } from './BottomContent';

const Register = ({activeTab,setActiveTab}:{activeTab:number,setActiveTab:any}) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     const reader = new FileReader();
  //     reader.onload = (event) => {
  //       if (event.target?.result) {
  //         setProfileImage(event.target.result as string);
  //       }
  //     };
  //     reader.readAsDataURL(e.target.files[0]);
  //   }
  // };

  const uploadImageToImgBB = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  const API_KEY = "664d33d55fe9d05468f640823bd36ad1"; // Replace with real API key from imgbb.com


  const res = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (data.success) {
    return data.data.url; // This is a hosted image URL
  } else {
    throw new Error("Image upload failed.");
  }
};


  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];

    // show preview
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setProfileImage(event.target.result as string); // for local preview
      }
    };
    reader.readAsDataURL(file);

    try {
      const uploadedUrl = await uploadImageToImgBB(file);
      setProfileImage(uploadedUrl); // This will go in your registerUser API
    } catch (error) {
      console.error("Upload failed:", error);
    }
  }
};


  const onSubmit = async (data: any) => {
    try {
      const userData = {
        ...data,
        profileImage: profileImage || undefined
      };
      await registerUser(userData);  
        setActiveTab(0)
        alert("registeration success now login")
        
    } catch (err: any) {
      console.error('Registration error:', err.message);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"

    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 4,
            boxShadow: 24,
            p: 4,
          }}
        >


          <Box display="flex" justifyContent="center" mb={3}>
            <Box position="relative">
              <Avatar
                src={profileImage || undefined}
                sx={{
                  width: 100,
                  height: 100,
                  border: '3px solid',
                  borderColor: 'primary.main',
                }}
              />
              <IconButton
                component="label"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                <CameraIcon />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </IconButton>
            </Box>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box mb={2}>
              <TextField
                fullWidth
                label="Full Name"
                variant="outlined"
                {...register('name', { required: 'Required' })}
                error={!!errors.name}
                helperText={typeof errors.name?.message === 'string' ? errors.name.message : undefined}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box mb={2}>
              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                {...register('username', { required: 'Required' })}
                error={!!errors.username}
                helperText={typeof errors.username?.message === 'string' ? errors.username.message : undefined}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box mb={2}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                variant="outlined"
                {...register('email', {
                  required: 'Required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                error={!!errors.email}
                helperText={typeof errors.email?.message === 'string' ? errors.email.message : undefined}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box mb={2}>
              <TextField
                fullWidth
                label="Phone Number (Optional)"
                variant="outlined"
                {...register('contactNumber')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box mb={3}>
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                {...register('password', {
                  required: 'Required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                error={!!errors.password}
                helperText={typeof errors.password?.message === 'string' ? errors.password.message : undefined}
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

            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              sx={{
                py: 1.5,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              Sign Up
            </Button>
          </form>
        <BottomContent activeTab={activeTab} setActiveTab={setActiveTab} /> 
        </Box>
      </motion.div>
    </Box>
  );
};

export default memo(Register);
