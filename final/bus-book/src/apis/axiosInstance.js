import axios from 'axios';

const api = process.env.REACT_APP_API_JAVA;

const axiosInstance = axios.create({
  baseURL: api,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach token dynamically
axiosInstance.interceptors.request.use(
  (config) => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        if (user?.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
