import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { StudentProvider } from './context/StudentContext.jsx';
import { AppLayout } from './components/layout/AppLayout.jsx';
import { Login } from './pages/Login.jsx';
import { Register } from './pages/Register.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { Students } from './pages/Students.jsx';
import { AddStudent } from './pages/AddStudent.jsx';
import { StudentProfile } from './pages/StudentProfile.jsx';
import { EditStudent } from './pages/EditStudent.jsx';
import { NotFound } from './pages/NotFound.jsx';

// Protected Route for simulated frontend demo session
const ProtectedLayout = () => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <AppLayout />;
};

export default function App() {
  return (
    <AuthProvider>
      <StudentProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Application workspace routes inside AppLayout */}
            <Route element={<ProtectedLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/students" element={<Students />} />
              <Route path="/students/new" element={<AddStudent />} />
              <Route path="/students/:id" element={<StudentProfile />} />
              <Route path="/students/:id/edit" element={<EditStudent />} />
            </Route>

            {/* 404 Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </StudentProvider>
    </AuthProvider>
  );
}
