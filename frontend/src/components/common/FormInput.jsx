import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const FormInput = ({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  options = [], // for type="select"
  className = '',
  readOnly = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || name;
  const isPassword = type === 'password';
  const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const baseInputStyles = `w-full px-3 py-2 text-sm bg-white text-black border rounded transition-colors placeholder:text-[#737373] focus:outline-none focus:ring-1 focus:ring-black disabled:bg-[#F5F5F5] disabled:text-[#737373] disabled:cursor-not-allowed ${
    error
      ? 'border-black ring-1 ring-black bg-[#FBFBFB]'
      : 'border-[#BDBDBD] hover:border-[#737373] focus:border-black'
  } ${className}`;

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={inputId} className="text-sm font-medium text-black">
            {label}
            {required && <span className="text-[#737373] ml-1" title="Required">*</span>}
          </label>
        </div>
      )}

      <div className="relative">
        {type === 'select' ? (
          <select
            id={inputId}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-help` : undefined}
            className={`${baseInputStyles} appearance-none pr-8 cursor-pointer`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => {
              const optVal = typeof opt === 'string' ? opt : opt.value;
              const optLabel = typeof opt === 'string' ? opt : opt.label;
              return (
                <option key={optVal} value={optVal}>
                  {optLabel}
                </option>
              );
            })}
          </select>
        ) : (
          <input
            id={inputId}
            name={name}
            type={effectiveType}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-help` : undefined}
            className={`${baseInputStyles} ${isPassword ? 'pr-10' : ''}`}
            {...props}
          />
        )}

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#737373] hover:text-black focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}

        {type === 'select' && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-[#737373]">
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>

      {error && (
        <p id={`${inputId}-error`} className="text-xs font-medium text-black mt-0.5 flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 bg-black rounded-full" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}

      {!error && helperText && (
        <p id={`${inputId}-help`} className="text-xs text-[#737373]">
          {helperText}
        </p>
      )}
    </div>
  );
};
