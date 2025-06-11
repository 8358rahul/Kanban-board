 
import type { User ,RegisterPayload,LoginPayload} from '../types/authTypes';
import {authInstance} from '../utils/axiosInstance';
 

export const registerUser = async (userData: RegisterPayload): Promise<User> => {
  const response = await authInstance.post<User>('/register', userData);
  return response.data;

};


export const getUser = async (): Promise<User> => {
  const response = await authInstance.get<User>('/register');
  return response.data;

};

export const loginUser = async (credentials: LoginPayload): Promise<User> => {
  const response = await authInstance.post<User>('/login', credentials);
  return response.data;
};
