 
import type { User ,RegisterPayload} from '../types/authTypes';
import {axiosInstance} from '../utils/axiosInstance';
 

export const registerUser = async (userData: RegisterPayload): Promise<User> => {
  const response = await axiosInstance.post<User>('/register', userData); 
  return response.data;

};


export const getUser = async (): Promise<User> => {
  const response = await axiosInstance.get<User>('/register');
  return response.data;

};
 
