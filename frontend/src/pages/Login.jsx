import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormInput } from '../components/common/FormInput.jsx';
import { Button } from '../components/common/Button.jsx';
import { validateLoginForm } from '../utils/validation.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Info, AlertCircle } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(''); // Server-side error message
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-level and API errors when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (apiError) setApiError('');
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setForgotPasswordMessage(
      'Password recovery is not available in this version. Contact your administrator.'
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation first (avoids unnecessary network call)
    const validation = validateLoginForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    setApiError('');

    try {
      // login() calls POST /api/auth/login, stores the JWT, and updates React state
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      // Show the user-friendly error from authService.js
      // We never reveal which specific field was wrong (security best practice)
      setApiError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* StudbuddY Wordmark */}
        <div className="text-center mb-6">
          <span className="font-heading font-extrabold text-3xl tracking-tight text-black">
            StudbuddY
          </span>
          <p className="text-xs text-[#737373] mt-1 tracking-wide uppercase font-sans">
            Student Management System
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white border border-[#EAEAEA] rounded shadow-sm p-8 sm:p-10 space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-black font-heading">
              Welcome back.
            </h1>
            <p className="mt-1.5 text-sm text-[#737373] leading-relaxed">
              Sign in with your administrator account to access the student directory.
            </p>
          </div>

          {/* Backend connection notice */}
          <div className="p-3 bg-[#FBFBFB] border border-[#EAEAEA] rounded flex items-start gap-2.5 text-xs text-[#404040]">
            <Info className="w-4 h-4 text-black shrink-0 mt-0.5" />
            <span>
              <strong>Live Mode:</strong> Sign-in connects to the real backend. Register an account first if you haven't already.
            </span>
          </div>

          {/* API / server error banner */}
          {apiError && (
            <div
              role="alert"
              className="p-3 bg-[#FFF5F5] border border-red-200 rounded flex items-start gap-2.5 text-xs text-red-700"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <span>{apiError}</span>
            </div>
          )}

          {forgotPasswordMessage && (
            <div className="p-3 bg-[#F5F5F5] border border-black rounded text-xs text-black leading-relaxed">
              {forgotPasswordMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              id="login-email"
              name="email"
              type="email"
              label="Staff / Faculty Email"
              placeholder="e.g. admin@college.edu"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
              disabled={isSubmitting}
            />

            <FormInput
              id="login-password"
              name="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              disabled={isSubmitting}
            />

            <div className="flex items-center justify-end text-xs pt-1">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-[#404040] hover:text-black underline font-medium"
              >
                Forgot password?
              </button>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in…' : 'Sign in to StudbuddY'}
              </Button>
            </div>
          </form>

          <div className="pt-4 border-t border-[#EAEAEA] text-center text-xs text-[#737373]">
            Don't have an administrator account?{' '}
            <Link to="/register" className="text-black font-semibold hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
