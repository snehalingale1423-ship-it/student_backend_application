/**
 * AuthContext.jsx — Real Backend Authentication Context
 *
 * Replaces the previous simulated (browser-only) authentication with
 * real calls to the Spring Boot backend:
 *   POST /api/auth/register
 *   POST /api/auth/login
 *
 * JWT STORAGE:
 * The JWT received after login is stored in localStorage under TOKEN_STORAGE_KEY.
 * The user's name and email are stored separately under AUTH_USER_KEY.
 *
 * SECURITY TRADE-OFF (documented, not hidden):
 * localStorage is readable by JavaScript on the same origin.
 * This means an XSS vulnerability could steal the token.
 * For this college assignment, localStorage is acceptable.
 * In a production app, use HttpOnly cookies to mitigate XSS token theft.
 *
 * On every page load, we restore the logged-in user from localStorage.
 * When the token expires (backend rejects it with 401), the Axios interceptor
 * in api.js automatically clears storage and redirects to /login.
 */

import React, { createContext, useContext, useState } from 'react';
import { TOKEN_STORAGE_KEY, AUTH_USER_KEY } from '../services/api.js';
import { loginUser, registerUser } from '../services/authService.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  /**
   * currentUser is either:
   *   null                         → not logged in
   *   { name, email, role }        → logged in (read from localStorage on page load)
   */
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      // Restore session from localStorage if a user was previously logged in
      const saved = localStorage.getItem(AUTH_USER_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // If JSON parse fails or localStorage is blocked, start unauthenticated
    }
    return null; // Not logged in by default
  });

  const isAuthenticated = Boolean(currentUser);

  /**
   * Login with real backend credentials.
   *
   * On success:
   *   1. Saves JWT to localStorage (for Axios interceptor to attach to requests)
   *   2. Saves user info to localStorage (for restoring session on page reload)
   *   3. Updates React state so UI re-renders immediately
   *
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{ success: true }>}
   * @throws {Error} with user-friendly message on failure
   */
  const login = async (email, password) => {
    // loginUser() calls POST /api/auth/login — throws on error
    const data = await loginUser(email, password);
    // data = { token, email, name, message } from AuthResponse

    // Store the JWT so Axios attaches it to future requests
    localStorage.setItem(TOKEN_STORAGE_KEY, data.token);

    // Store user info for session restoration on page reload
    const userInfo = {
      name: data.name,
      email: data.email,
      role: 'College Administrator',
    };
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userInfo));

    // Update React state so the UI knows we're now logged in
    setCurrentUser(userInfo);

    return { success: true };
  };

  /**
   * Register a new account with the real backend.
   *
   * Registration does NOT auto-login (the backend does not return a token
   * on registration, only a message). The user is shown a success state
   * and redirected to log in.
   *
   * @param {string} fullName
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{ success: true, message: string }>}
   * @throws {Error} with user-friendly message on failure
   */
  const register = async (fullName, email, password) => {
    // registerUser() calls POST /api/auth/register — throws on error
    const data = await registerUser(fullName, email, password);
    // data = { message: "Registration successful" } from AuthResponse
    return { success: true, message: data.message };
  };

  /**
   * Log out: remove JWT and user info from storage, clear React state.
   * The user is then redirected to /login (handled by ProtectedLayout in App.jsx).
   */
  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
