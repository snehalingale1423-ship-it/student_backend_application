import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormInput } from '../components/common/FormInput.jsx';
import { Button } from '../components/common/Button.jsx';
import { validateRegisterForm } from '../utils/validation.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Check, AlertCircle } from 'lucide-react';

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');       // Server error message
  const [successMessage, setSuccessMessage] = useState(''); // Server success message
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (apiError) setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    const validation = validateRegisterForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    setApiError('');

    try {
      // register() calls POST /api/auth/register
      // fullName maps to RegisterRequest.name in the backend
      const result = await register(formData.fullName, formData.email, formData.password);
      setSuccessMessage(result.message || 'Registration successful!');
    } catch (err) {
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
              Create an account.
            </h1>
            <p className="mt-1.5 text-sm text-[#737373] leading-relaxed">
              Register a college administrator profile to access the student directory.
            </p>
          </div>

          {/* Success state — shown after successful registration */}
          {successMessage ? (
            <div className="space-y-5">
              <div className="p-4 bg-[#F5F5F5] border border-black rounded space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-sm font-bold text-black font-heading">
                    Account Registered
                  </h3>
                </div>
                <p className="text-xs text-[#404040] leading-relaxed">
                  Your profile for <strong>{formData.fullName}</strong> ({formData.email}) has been created.
                  You can now sign in.
                </p>
              </div>

              <div className="space-y-2.5">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => navigate('/login')}
                >
                  Sign in now
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* API error banner */}
              {apiError && (
                <div
                  role="alert"
                  className="p-3 bg-[#FFF5F5] border border-red-200 rounded flex items-start gap-2.5 text-xs text-red-700"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                  <span>{apiError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <FormInput
                  id="reg-fullname"
                  name="fullName"
                  label="Full Name"
                  placeholder="e.g. Prof. Priya Nair"
                  value={formData.fullName}
                  onChange={handleChange}
                  error={errors.fullName}
                  required
                  disabled={isSubmitting}
                />

                <FormInput
                  id="reg-email"
                  name="email"
                  type="email"
                  label="College Email"
                  placeholder="e.g. priya.nair@college.edu"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                  disabled={isSubmitting}
                />

                <FormInput
                  id="reg-password"
                  name="password"
                  type="password"
                  label="Password"
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  required
                  disabled={isSubmitting}
                />

                <FormInput
                  id="reg-confirmpassword"
                  name="confirmPassword"
                  type="password"
                  label="Confirm Password"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  required
                  disabled={isSubmitting}
                />

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Registering…' : 'Register Administrator'}
                  </Button>
                </div>
              </form>

              <div className="pt-4 border-t border-[#EAEAEA] text-center text-xs text-[#737373]">
                Already have an account?{' '}
                <Link to="/login" className="text-black font-semibold hover:underline">
                  Sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
