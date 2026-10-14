/**
 * api.js — Centralized Axios API Client
 *
 * This file creates ONE shared Axios instance used by every service file.
 * Benefits:
 *   - The base URL is set in one place (VITE_API_BASE_URL env variable)
 *   - The JWT token is attached automatically to every request via an interceptor
 *   - Error handling logic lives here, not scattered across components
 *
 * SECURITY NOTE:
 * The JWT is read from localStorage on every request.
 * localStorage is accessible to JavaScript on the same origin, so it is
 * vulnerable to XSS. For this college assignment this is acceptable.
 * In production you would use HttpOnly cookies instead.
 */

import axios from 'axios';

// Read the backend URL from the Vite environment variable.
// Falls back to http://localhost:8080 for local development.
// Set VITE_API_BASE_URL=http://localhost:8080 in your frontend/.env file.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// The localStorage key where we store the JWT
export const TOKEN_STORAGE_KEY = 'studbuddy_jwt_token';

// The localStorage key where we store logged-in user info (name, email)
export const AUTH_USER_KEY = 'studbuddy_auth_user';

/**
 * Creates and returns the configured Axios instance.
 */
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10-second request timeout
});

/**
 * REQUEST INTERCEPTOR
 * Runs before every outgoing request.
 * Reads the JWT from localStorage and adds it to the Authorization header.
 *
 * This is what attaches: Authorization: Bearer eyJhbGc...
 * to every protected API call automatically.
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * RESPONSE INTERCEPTOR
 * Runs after every incoming response.
 * If the server returns 401 Unauthorized, the token has likely expired.
 * We clear stored credentials and redirect to the login page.
 */
apiClient.interceptors.response.use(
  (response) => response, // Pass successful responses straight through
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear everything and send to login
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
      // Only redirect if not already on auth pages (avoid redirect loops)
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
