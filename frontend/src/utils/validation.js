/**
 * Validation utility functions for forms
 */

/**
 * validateStudentFormForBackend — used when saving a student to the real backend.
 *
 * Differences from the old validateStudentForm:
 *   - No ID field: the backend auto-generates a numeric ID (auto-increment).
 *   - No client-side duplicate check: the server enforces unique emails at the DB level.
 *     The server returns a 409 Conflict response if an email is already taken.
 *
 * @param {{ name, email, branch, year }} formData
 * @returns {{ isValid: boolean, errors: Object }}
 */
export const validateStudentFormForBackend = ({ name, email, branch, year }) => {
  const errors = {};

  // Full Name
  const trimmedName = (name || '').trim();
  if (!trimmedName) {
    errors.name = 'Student name is required.';
  } else if (trimmedName.length < 2) {
    errors.name = 'Student name must be at least 2 characters.';
  }

  // Email
  const trimmedEmail = (email || '').trim();
  if (!trimmedEmail) {
    errors.email = 'Email address is required.';
  } else if (!isValidEmail(trimmedEmail)) {
    errors.email = 'Please enter a valid email address.';
  }
  // Note: duplicate email check is handled server-side (returns 409 Conflict)

  // Branch
  if (!branch || !branch.trim()) {
    errors.branch = 'Please select a branch.';
  }

  // Academic Year
  if (!year || !year.trim()) {
    errors.year = 'Please select an academic year.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const validateStudentForm = ({ id, name, email, branch, year }, existingStudents = [], currentStudentId = null) => {
  const errors = {};

  // Student ID validation
  const trimmedId = (id || '').trim();
  if (!trimmedId) {
    errors.id = "Student ID is required.";
  } else if (trimmedId.length < 3) {
    errors.id = "Student ID must be at least 3 characters.";
  } else {
    const isDuplicateId = existingStudents.some(
      (s) => s.id.toLowerCase() === trimmedId.toLowerCase() && s.id !== currentStudentId
    );
    if (isDuplicateId) {
      errors.id = "A student with this ID already exists.";
    }
  }

  // Full Name validation
  const trimmedName = (name || '').trim();
  if (!trimmedName) {
    errors.name = "Student name is required.";
  } else if (trimmedName.length < 2) {
    errors.name = "Student name must be at least 2 characters.";
  }

  // Email validation
  const trimmedEmail = (email || '').trim();
  if (!trimmedEmail) {
    errors.email = "Email address is required.";
  } else if (!isValidEmail(trimmedEmail)) {
    errors.email = "Please enter a valid email address.";
  } else {
    const isDuplicateEmail = existingStudents.some(
      (s) => s.email.toLowerCase() === trimmedEmail.toLowerCase() && s.id !== currentStudentId
    );
    if (isDuplicateEmail) {
      errors.email = "A student with this email address already exists.";
    }
  }

  // Branch validation
  if (!branch || !branch.trim()) {
    errors.branch = "Please select a branch.";
  }

  // Academic Year validation
  if (!year || !year.trim()) {
    errors.year = "Please select an academic year.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateLoginForm = ({ email, password }) => {
  const errors = {};

  if (!email || !email.trim()) {
    errors.email = "Email address is required.";
  } else if (!isValidEmail(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 6) {
    // Note: the backend requires 8 chars minimum. We check 6 client-side to give
    // a quick client-side error; the backend's 400 response will handle the 8-char rule.
    errors.password = 'Password must be at least 6 characters.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateRegisterForm = ({ fullName, email, password, confirmPassword }) => {
  const errors = {};

  if (!fullName || !fullName.trim()) {
    errors.fullName = "Full name is required.";
  } else if (fullName.trim().length < 2) {
    errors.fullName = "Full name must be at least 2 characters.";
  }

  if (!email || !email.trim()) {
    errors.email = "Email address is required.";
  } else if (!isValidEmail(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Confirm password is required.";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
