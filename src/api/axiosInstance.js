import axios from 'axios';
import { API_BASE_URL, ENDPOINTS } from './endpoints.js';

// In-memory access token storage (isolated from localStorage to prevent XSS exfiltration)
let inMemoryAccessToken = null;

export const getAccessToken = () => inMemoryAccessToken;
export const setAccessToken = (token) => {
  inMemoryAccessToken = token;
};
export const clearAccessToken = () => {
  inMemoryAccessToken = null;
};

// Queue to hold requests while token refresh is in flight
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Attach in-memory Access Token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: 401 Catching, Token Refreshing & Seamless Request Queuing
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Do not attempt refresh on login or refresh endpoint itself
    if (
      !originalRequest ||
      originalRequest.url?.includes(ENDPOINTS.AUTH.LOGIN) ||
      originalRequest.url?.includes(ENDPOINTS.AUTH.REFRESH)
    ) {
      return Promise.reject(error);
    }

    // Check for 401 Unauthorized and ensure request has not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to obtain a new access token using the HTTP-only refresh cookie
        const refreshResponse = await axios.post(
          `${API_BASE_URL}${ENDPOINTS.AUTH.REFRESH}`,
          {},
          { withCredentials: true }
        );

        const newAccessToken =
          refreshResponse.data?.access ||
          refreshResponse.data?.accessToken ||
          refreshResponse.data?.token;

        if (newAccessToken) {
          setAccessToken(newAccessToken);
          processQueue(null, newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } else {
          throw new Error('No access token returned by refresh endpoint');
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAccessToken();
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
