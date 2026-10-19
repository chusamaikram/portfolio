import axiosInstance, {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from '../api/axiosInstance.js';
import { ENDPOINTS, API_BASE_URL } from '../api/endpoints.js';

const LOCAL_USER_KEY = 'portfolio_admin_user';

export const authService = {
  /**
   * Log in user and establish session
   */
  async login(credentials) {
    try {
      const response = await axiosInstance.post(ENDPOINTS.AUTH.LOGIN, credentials);
      const data = response.data;
      const token = data.access || data.accessToken || data.token;
      const user = data.user || {
        username: credentials.username || 'admin',
        role: 'admin',
        name: 'Usama Ikram',
      };

      if (token) {
        setAccessToken(token);
      }
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
      return { user, token };
    } catch (error) {
      // Offline / Developer Demo Fallback
      const isDemo =
        (credentials.username === 'admin' && credentials.password === 'admin123') ||
        (credentials.username === 'usama' && credentials.password === 'admin123') ||
        error.code === 'ERR_NETWORK' ||
        error.message?.includes('Network Error');

      if (isDemo && credentials.password === 'admin123') {
        const mockToken = 'mock-jwt-access-token-usama-architect';
        const mockUser = {
          id: 1,
          username: credentials.username || 'admin',
          name: 'Usama Ikram',
          role: 'Principal Architect & Admin',
          email: 'usama.code404@gmail.com',
          mode: 'Offline Mock Mode (Backend Offline)',
        };
        setAccessToken(mockToken);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(mockUser));
        return { user: mockUser, token: mockToken, isMock: true };
      }

      throw error;
    }
  },

  /**
   * Refresh in-memory access token
   */
  async refreshToken() {
    try {
      const response = await axiosInstance.post(
        ENDPOINTS.AUTH.REFRESH,
        {},
        { withCredentials: true }
      );
      const token =
        response.data?.access || response.data?.accessToken || response.data?.token;
      if (token) {
        setAccessToken(token);
      }
      return token;
    } catch (error) {
      clearAccessToken();
      localStorage.removeItem(LOCAL_USER_KEY);
      throw error;
    }
  },

  /**
   * Terminate active session
   */
  async logout() {
    try {
      await axiosInstance.post(ENDPOINTS.AUTH.LOGOUT, {}, { withCredentials: true });
    } catch (error) {
      console.warn('Backend logout call skipped (backend offline or unavailable):', error.message);
    } finally {
      clearAccessToken();
      localStorage.removeItem(LOCAL_USER_KEY);
    }
  },

  /**
   * Retrieve currently authenticated user profile
   */
  async getCurrentUser() {
    try {
      const response = await axiosInstance.get(ENDPOINTS.AUTH.ME);
      const user = response.data;
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
      return user;
    } catch (error) {
      // Fallback to local stored user
      const stored = localStorage.getItem(LOCAL_USER_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return null;
        }
      }
      return null;
    }
  },

  getStoredUser() {
    const stored = localStorage.getItem(LOCAL_USER_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  },

  getAccessToken,
  setAccessToken,
  clearAccessToken,
};

export { getAccessToken, setAccessToken, clearAccessToken };
export default authService;
