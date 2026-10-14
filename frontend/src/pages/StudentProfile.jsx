import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Edit3, Trash2, ArrowLeft, Mail, BookOpen, GraduationCap, Hash, User, AlertCircle } from 'lucide-react';
import { useStudents } from '../context/StudentContext.jsx';
import { getStudentInitials } from '../utils/studentHelpers.js';
import { PageHeader } from '../components/common/PageHeader.jsx';
import { Button } from '../components/common/Button.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { ConfirmDialog } from '../components/common/ConfirmDialog.jsx';

export const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getStudent, deleteStudent } = useStudents();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // id from URL is a string; getStudent compares with String(s.id) so this works
  const student = getStudent(id);

  if (!student) {
    return (
      <div className="space-y-6 font-sans">
        <PageHeader
          title="Student Record Not Found"
          backTo="/students"
          backLabel="Back to Student Directory"
        />
        <EmptyState
          title="No student found with this ID"
          description={`The student identifier "${id}" does not exist in the current records.`}
          actionLabel="Return to Student Directory"
          onAction={() => navigate('/students')}
        />
      </div>
    );
  }

  const initials = getStudentInitials(student.name);

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    setDeleteError('');
    try {
      await deleteStudent(student.id);
      navigate('/students');
    } catch (err) {
      setDeleteError(err.message);
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title={student.name}
        description={`Record summary for student ID: ${student.id}`}
        backTo="/students"
        backLabel="Back to Student Directory"
        actions={
          <div className="flex items-center gap-2">
            <Link to={`/students/${student.id}/edit`}>
              <Button variant="secondary" icon={Edit3}>
                Edit Record
              </Button>
            </Link>
            <Button
              variant="outline"
              icon={Trash2}
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </Button>
          </div>
        }
      />

      {/* Main Student Card */}
      <div className="bg-white border border-[#EAEAEA] rounded p-6 sm:p-8 max-w-3xl space-y-8">
        {/* Profile Header Identity */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-6 border-b border-[#EAEAEA]">
          <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-xl font-bold font-heading shrink-0">
            {initials}
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-black font-heading">
              {student.name}
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#737373]">
              <span className="font-mono font-semibold text-black">#{student.id}</span>
              <span aria-hidden="true">·</span>
              <span>{student.branch}</span>
              <span aria-hidden="true">·</span>
              <span>{student.year}</span>
            </div>
          </div>
        </div>

        {/* Structured Field List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student ID */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#737373] uppercase tracking-wider font-heading">
              <Hash className="w-3.5 h-3.5" />
              <span>Student ID</span>
            </div>
            <p className="text-base font-mono font-semibold text-black">
              {student.id}
            </p>
          </div>

          {/* Full Name */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#737373] uppercase tracking-wider font-heading">
              <User className="w-3.5 h-3.5" />
              <span>Full Name</span>
            </div>
            <p className="text-base font-medium text-black">
              {student.name}
            </p>
          </div>

          {/* College Email */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#737373] uppercase tracking-wider font-heading">
              <Mail className="w-3.5 h-3.5" />
              <span>Email Address</span>
            </div>
            <p className="text-base font-medium text-black break-all">
              {student.email}
            </p>
          </div>

          {/* Branch */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#737373] uppercase tracking-wider font-heading">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Branch</span>
            </div>
            <p className="text-base font-medium text-black">
              {student.branch}
            </p>
          </div>

          {/* Academic Year */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#737373] uppercase tracking-wider font-heading">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Academic Year</span>
            </div>
            <p className="text-base font-medium text-black">
              {student.year}
            </p>
          </div>
        </div>

        {/* Action Row */}
        <div className="pt-6 border-t border-[#EAEAEA] flex items-center justify-between">
          <Link
            to="/students"
            className="text-xs font-medium text-[#737373] hover:text-black transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to directory</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <Link to={`/students/${student.id}/edit`}>
              <Button variant="secondary" size="sm" icon={Edit3}>
                Edit Details
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              icon={Trash2}
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteError('');
        }}
        onConfirm={handleDeleteConfirm}
        studentName={student.name}
        studentId={student.id}
        errorMessage={deleteError}
        isLoading={isDeleting}
      />
    </div>
  );
};
