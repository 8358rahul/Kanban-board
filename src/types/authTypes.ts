export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  contactNumber?: string;
  password: string;
  profileImage?: string;
  
}

export interface RegisterPayload {
  name: string;
  username: string;
  email: string;
  contactNumber?: string;
  password: string;
  profileImage?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}