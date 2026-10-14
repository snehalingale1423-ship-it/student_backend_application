import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudents } from '../context/StudentContext.jsx';
import { PageHeader } from '../components/common/PageHeader.jsx';
import { StudentForm } from '../components/students/StudentForm.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';

export const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getStudent } = useStudents();

  const student = getStudent(id);

  if (!student) {
    return (
      <div className="space-y-6 font-sans">
        <PageHeader
          title="Student Not Found"
          backTo="/students"
          backLabel="Back to Student Directory"
        />
        <EmptyState
          title="Cannot edit missing record"
          description={`No student record found with ID "${id}".`}
          actionLabel="Return to Directory"
          onAction={() => navigate('/students')}
        />
      </div>
    );
  }

  const handleSuccess = (updatedId) => {
    navigate(`/students/${updatedId}`);
  };

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title={`Edit Student: ${student.name}`}
        description={`Modify record values for student ID ${student.id}`}
        backTo={`/students/${student.id}`}
        backLabel="Back to Student Profile"
      />

      <StudentForm
        initialData={student}
        isEdit={true}
        onSubmitSuccess={handleSuccess}
      />
    </div>
  );
};
