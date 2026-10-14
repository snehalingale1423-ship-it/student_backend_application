import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/common/PageHeader.jsx';
import { StudentForm } from '../components/students/StudentForm.jsx';

export const AddStudent = () => {
  const navigate = useNavigate();

  const handleSuccess = (newStudentId) => {
    navigate(`/students/${newStudentId}`);
  };

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="Add new student"
        description="Register an individual student profile into the college database records."
        backTo="/students"
        backLabel="Back to Student Directory"
      />

      <StudentForm
        isEdit={false}
        onSubmitSuccess={handleSuccess}
      />
    </div>
  );
};
