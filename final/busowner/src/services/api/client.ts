import axios from 'axios';
import { API_BASE_URL } from '../../utils/constants';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach token dynamically
axiosInstance.interceptors.request.use(
  (config) => {
    const userSessionStr = localStorage.getItem('user');
    if (userSessionStr) {
      try {
        const session = JSON.parse(userSessionStr);
        if (session?.auth) {
          config.headers.Authorization = `Bearer ${session.auth}`;
        }
      } catch (error) {
        console.error('Error parsing user session from localStorage:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'PATCH';
  body?: any;
  headers?: any;
}

export async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const method = options.method || 'GET';
  const url = `/${endpoint.replace(/^\//, '')}`;

  try {
    const response = await axiosInstance({
      url,
      method,
      data: options.body,
      headers: options.headers,
    });
    
    const data = response.data;
    if (data && typeof data === 'object') {
      if ('status' in data && !('statusCode' in data)) {
        (data as any).statusCode = data.status;
      }
    }
    return data as T;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'API request failed');
    }
    throw new Error(error.message || 'Network error');
  }
}
