/**
 * StudentContext.jsx — Real Backend Student Data Context
 *
 * Replaces the previous localStorage/mock-data implementation with
 * real CRUD calls to the Spring Boot backend:
 *
 *   GET    /api/students       — fetch all students (on mount)
 *   POST   /api/students       — create a student
 *   PUT    /api/students/{id}  — update a student
 *   DELETE /api/students/{id}  — delete a student
 *
 * All requests include the JWT automatically via the Axios interceptor in api.js.
 *
 * STATE:
 *   students     — the current list of students from the database
 *   isLoading    — true while fetching data
 *   error        — string error message, or null
 *   notification — temporary success/info banner { message, type, id }
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getAllStudents,
  getStudentById,
  createStudent as apiCreateStudent,
  updateStudent as apiUpdateStudent,
  deleteStudent as apiDeleteStudent,
} from '../services/studentService.js';
import { useAuth } from './AuthContext.jsx';

const StudentContext = createContext(null);

export const StudentProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  /**
   * Show a temporary notification banner.
   * Auto-dismisses after 4 seconds.
   */
  const showNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotification({ message, type, id });
    setTimeout(() => {
      setNotification((current) => (current?.id === id ? null : current));
    }, 4000);
  };

  const clearNotification = () => setNotification(null);

  /**
   * Fetch all students from the backend.
   * Called on mount (when the user is authenticated) and after mutations.
   */
  const fetchStudents = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllStudents();
      setStudents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Load students when the user logs in
  useEffect(() => {
    if (isAuthenticated) {
      fetchStudents();
    } else {
      // Clear student list on logout
      setStudents([]);
    }
  }, [isAuthenticated, fetchStudents]);

  /**
   * Get a single student from the local state by ID.
   * This avoids an extra network request for profile/edit pages.
   * The ID is numeric (from the database), matched as a number or string.
   */
  const getStudent = (id) => {
    if (!id) return null;
    // Compare both as strings to handle URL param (string) vs. DB id (number)
    return students.find((s) => String(s.id) === String(id)) || null;
  };

  /**
   * Add a new student via the backend API.
   * After success, the student list is re-fetched to stay in sync with the DB.
   *
   * @param {Object} studentData - { name, email, branch, year } (year as string label)
   * @returns {Promise<Object>} the created student object (with DB-assigned id)
   * @throws {Error} on API failure
   */
  const addStudent = async (studentData) => {
    const created = await apiCreateStudent(studentData);
    showNotification(`Student "${created.name}" was added successfully.`);
    await fetchStudents(); // Re-fetch to get the authoritative list from the DB
    return created;
  };

  /**
   * Update an existing student via the backend API.
   *
   * @param {number|string} id      - The database ID of the student to update
   * @param {Object} updatedData    - Updated { name, email, branch, year }
   * @returns {Promise<Object>}     Updated student object
   * @throws {Error} on API failure
   */
  const updateStudent = async (id, updatedData) => {
    const updated = await apiUpdateStudent(id, updatedData);
    showNotification(`Student record for "${updated.name}" updated successfully.`);
    await fetchStudents(); // Re-fetch to stay in sync
    return updated;
  };

  /**
   * Delete a student via the backend API.
   *
   * @param {number|string} id - The database ID of the student to delete
   * @throws {Error} on API failure
   */
  const deleteStudent = async (id) => {
    const studentToDelete = getStudent(id);
    const studentName = studentToDelete ? studentToDelete.name : `ID ${id}`;
    await apiDeleteStudent(id);
    showNotification(`Student "${studentName}" removed from directory.`);
    await fetchStudents(); // Re-fetch to reflect deletion
  };

  return (
    <StudentContext.Provider
      value={{
        students,
        isLoading,
        error,
        getStudent,
        addStudent,
        updateStudent,
        deleteStudent,
        fetchStudents,
        notification,
        showNotification,
        clearNotification,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudents = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudents must be used within a StudentProvider');
  }
  return context;
};
