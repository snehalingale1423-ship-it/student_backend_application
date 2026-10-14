/**
 * authService.js — Authentication API Functions
 *
 * Wraps the backend auth endpoints:
 *   POST /api/auth/register
 *   POST /api/auth/login
 *
 * These functions call the real Spring Boot API and return data
 * the AuthContext can use to update the logged-in user state.
 */

import apiClient from './api.js';

/**
 * Register a new user account.
 *
 * Sends: { name, email, password }
 * Expects: { message: "Registration successful" }
 *
 * @param {string} name     - Full name (maps to backend RegisterRequest.name)
 * @param {string} email    - Email address
 * @param {string} password - Plain-text password (sent over HTTPS, never stored)
 * @returns {Promise<{ message: string }>}
 * @throws {Error} with a user-friendly message on failure
 */
export const registerUser = async (name, email, password) => {
  try {
    const response = await apiClient.post('/api/auth/register', {
      name,    // maps to RegisterRequest.name
      email,   // maps to RegisterRequest.email
      password // maps to RegisterRequest.password (backend hashes it with BCrypt)
    });
    return response.data; // { message: "Registration successful" }
  } catch (error) {
    throw parseAuthError(error);
  }
};

/**
 * Log in with email and password.
 *
 * Sends: { email, password }
 * Expects: { token, email, name, message }
 *
 * @param {string} email    - Registered email
 * @param {string} password - Plain-text password (not stored anywhere after this call)
 * @returns {Promise<{ token: string, email: string, name: string, message: string }>}
 * @throws {Error} with a user-friendly message on failure
 */
export const loginUser = async (email, password) => {
  try {
    const response = await apiClient.post('/api/auth/login', {
      email,   // maps to LoginRequest.email
      password // maps to LoginRequest.password
    });
    return response.data; // { token, email, name, message }
  } catch (error) {
    throw parseAuthError(error);
  }
};

/**
 * Extracts a readable error message from an Axios error response.
 *
 * The Spring Boot backend can return errors in these shapes:
 *   - { message: "..." }           — from GlobalExceptionHandler
 *   - { errors: { field: "..." } } — from @Valid validation failures
 *
 * We never expose stack traces or internal error codes to the user.
 *
 * @param {import('axios').AxiosError} error
 * @returns {Error}
 */
const parseAuthError = (error) => {
  if (!error.response) {
    // Network error — backend is unreachable
    return new Error('Cannot reach the server. Make sure the backend is running on port 8080.');
  }

  const { status, data } = error.response;

  if (status === 409) {
    // Conflict — email already registered
    return new Error(data?.message || 'An account with this email already exists.');
  }

  if (status === 401) {
    // Invalid credentials at login
    return new Error('Invalid email or password. Please try again.');
  }

  if (status === 400) {
    // Validation errors from Spring's @Valid
    if (data?.errors) {
      // Collect all field-level validation messages into one string
      const messages = Object.values(data.errors).join(' ');
      return new Error(messages);
    }
    return new Error(data?.message || 'Invalid request. Please check the form fields.');
  }

  if (status === 500) {
    return new Error('A server error occurred. Please try again later.');
  }

  return new Error(data?.message || `Unexpected error (HTTP ${status}).`);
};
