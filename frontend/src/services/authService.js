// Authentication service - handles all auth API calls
import api from './api';

const authService = {
  // Check current authentication status
  checkAuth: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Auth check failed:', error);
      return { success: false, authenticated: false, user: null };
    }
  },

  // Initiate eSignet OAuth - redirects to backend auth endpoint
  initiateESignetAuth: () => {
    const backendAuthUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/auth/esignet`;
    window.location.href = backendAuthUrl;
  },

  // Logout and clear session
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      return response.data.success;
    } catch (error) {
      console.error('Logout failed:', error);
      return false;
    }
  },

  // Get eSignet OIDC config (dev/testing)
  getESignetConfig: async () => {
    try {
      const response = await api.get('/auth/esignet/config');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch eSignet config:', error);
      throw error;
    }
  },
};

export default authService;
