 
import axios from 'axios';

const authInstance = axios.create({
  baseURL: 'https://68481df0ec44b9f3493fb016.mockapi.io/api',  
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const taskInstance = axios.create({
    baseURL: 'https://68482a4aec44b9f3493fe211.mockapi.io/api',  
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export {authInstance,taskInstance};
