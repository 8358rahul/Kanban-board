 
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://68481df0ec44b9f3493fb016.mockapi.io/api',  
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

 

export {axiosInstance};
