import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, ArrowRight, Users, GraduationCap, Laptop, BookOpen, RefreshCw } from 'lucide-react';
import { useStudents } from '../context/StudentContext.jsx';
import { getStudentMetrics } from '../utils/studentHelpers.js';
import { PageHeader } from '../components/common/PageHeader.jsx';
import { Button } from '../components/common/Button.jsx';
import { StudentTable } from '../components/students/StudentTable.jsx';
import { ConfirmDialog } from '../components/common/ConfirmDialog.jsx';

export const Dashboard = () => {
  const { students, deleteStudent, isLoading, error } = useStudents();
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Dynamic metrics calculated strictly from shared React state
  const metrics = getStudentMetrics(students);

  // Show up to 5 recently added or initial students in preview
  const recentStudents = students.slice(0, 5);

  const handleDeleteConfirm = async () => {
    if (studentToDelete) {
      setIsDeleting(true);
      setDeleteError('');
      try {
        await deleteStudent(studentToDelete.id);
        setStudentToDelete(null);
      } catch (err) {
        setDeleteError(err.message);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const metricCards = [
    {
      title: 'Total Students',
      value: metrics.total,
      description: 'Enrolled across all departments',
      icon: Users
    },
    {
      title: 'Computer Engineering',
      value: metrics.compEngCount,
      description: 'Primary department enrollment',
      icon: Laptop
    },
    {
      title: 'First-Year Students',
      value: metrics.firstYearCount,
      description: 'Newly inducted cohort',
      icon: BookOpen
    },
    {
      title: 'Second-Year Students',
      value: metrics.secondYearCount,
      description: 'Intermediate semester cohort',
      icon: GraduationCap
    }
  ];

  return (
    <div className="space-y-8 font-sans">
      <PageHeader
        title="Student overview"
        description="Manage student records and keep your student directory organized."
        actions={
          <Link to="/students/new">
            <Button variant="primary" icon={UserPlus}>
              Add student
            </Button>
          </Link>
        }
      />

      {/* Four Summary Metrics */}
      <section aria-label="Summary Metrics">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metricCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-[#EAEAEA] rounded p-5 space-y-2 hover:border-[#BDBDBD] transition-colors"
              >
                <div className="flex items-center justify-between text-[#737373]">
                  <span className="text-xs font-semibold uppercase tracking-wider font-heading">
                    {card.title}
                  </span>
                  <Icon className="w-4 h-4 text-black shrink-0" />
                </div>
                <div className="text-3xl font-extrabold text-black font-heading tracking-tight">
                  {card.value}
                </div>
                <p className="text-xs text-[#737373]">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Directory Preview Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-black font-heading">
              Recently added students
            </h2>
            <p className="text-xs text-[#737373]">
              Compact preview of current student records in the college system.
            </p>
          </div>

          <Link
            to="/students"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-black hover:underline"
          >
            <span>View all students</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <StudentTable
          students={recentStudents}
          onDeleteClick={(student) => setStudentToDelete(student)}
          isCompact
        />
      </section>

      {/* Delete Confirmation Modal */}
      {studentToDelete && (
        <ConfirmDialog
          isOpen={Boolean(studentToDelete)}
          onClose={() => {
            setStudentToDelete(null);
            setDeleteError('');
          }}
          onConfirm={handleDeleteConfirm}
          studentName={studentToDelete.name}
          studentId={studentToDelete.id}
          errorMessage={deleteError}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};
