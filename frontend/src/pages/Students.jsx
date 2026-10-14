import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, ChevronLeft, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';
import { useStudents } from '../context/StudentContext.jsx';
import { filterStudents } from '../utils/studentHelpers.js';
import { PageHeader } from '../components/common/PageHeader.jsx';
import { Button } from '../components/common/Button.jsx';
import { StudentFilters } from '../components/students/StudentFilters.jsx';
import { StudentTable } from '../components/students/StudentTable.jsx';
import { ConfirmDialog } from '../components/common/ConfirmDialog.jsx';

export const Students = () => {
  const { students, deleteStudent, isLoading, error, fetchStudents } = useStudents();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');

  // Sorting state
  const [sortField, setSortField] = useState('id'); // 'id' | 'name'
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' | 'desc'

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Deletion modal state
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    const list = filterStudents(students, {
      searchQuery,
      branchFilter,
      yearFilter
    });

    return list.sort((a, b) => {
      let valA = a[sortField] ?? '';
      let valB = b[sortField] ?? '';

      // Sort by numeric ID (DB-assigned integer)
      if (sortField === 'id') {
        const numA = Number(valA) || 0;
        const numB = Number(valB) || 0;
        return sortDirection === 'asc' ? numA - numB : numB - numA;
      }

      valA = valA.toString().toLowerCase();
      valB = valB.toString().toLowerCase();
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [students, searchQuery, branchFilter, yearFilter, sortField, sortDirection]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedStudents = useMemo(() => {
    const start = (safeCurrentPage - 1) * itemsPerPage;
    return filteredStudents.slice(start, start + itemsPerPage);
  }, [filteredStudents, safeCurrentPage, itemsPerPage]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setBranchFilter('all');
    setYearFilter('all');
    setCurrentPage(1);
  };

  const handleDeleteConfirm = async () => {
    if (studentToDelete) {
      setDeleteError('');
      try {
        await deleteStudent(studentToDelete.id);
        setStudentToDelete(null);
      } catch (err) {
        setDeleteError(err.message);
      }
    }
  };

  // --- Loading state ---
  if (isLoading && students.length === 0) {
    return (
      <div className="space-y-6 font-sans">
        <PageHeader
          title="Students"
          description="Browse and manage student records."
          actions={
            <Link to="/students/new">
              <Button variant="primary" icon={UserPlus}>
                Add Student
              </Button>
            </Link>
          }
        />
        <div className="bg-white border border-[#EAEAEA] rounded p-12 text-center">
          <div className="inline-flex items-center gap-2 text-[#737373] text-sm">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Loading student records from database…</span>
          </div>
        </div>
      </div>
    );
  }

  // --- Backend error state ---
  if (error && students.length === 0) {
    return (
      <div className="space-y-6 font-sans">
        <PageHeader
          title="Students"
          description="Browse and manage student records."
        />
        <div className="bg-white border border-red-200 rounded p-8 text-center space-y-4">
          <div className="flex flex-col items-center gap-3 text-red-600">
            <AlertCircle className="w-8 h-8" />
            <div>
              <p className="font-semibold text-sm">Failed to load students</p>
              <p className="text-xs text-[#737373] mt-1">{error}</p>
            </div>
          </div>
          <Button variant="secondary" onClick={fetchStudents} icon={RefreshCw}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="Students"
        description="Browse and manage student records."
        actions={
          <Link to="/students/new">
            <Button variant="primary" icon={UserPlus}>
              Add Student
            </Button>
          </Link>
        }
      />

      {/* Filter and Search Bar */}
      <StudentFilters
        searchQuery={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          setCurrentPage(1);
        }}
        branchFilter={branchFilter}
        onBranchChange={(val) => {
          setBranchFilter(val);
          setCurrentPage(1);
        }}
        yearFilter={yearFilter}
        onYearChange={(val) => {
          setYearFilter(val);
          setCurrentPage(1);
        }}
        onClearFilters={handleClearFilters}
        totalResults={filteredStudents.length}
        totalStudents={students.length}
      />

      {/* Student Table — shows loading spinner if refreshing after a mutation */}
      {isLoading ? (
        <div className="bg-white border border-[#EAEAEA] rounded p-8 text-center">
          <div className="inline-flex items-center gap-2 text-[#737373] text-sm">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Refreshing…</span>
          </div>
        </div>
      ) : (
        <StudentTable
          students={paginatedStudents}
          onDeleteClick={(student) => setStudentToDelete(student)}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      )}

      {/* Pagination Bar */}
      {filteredStudents.length > itemsPerPage && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#EAEAEA] text-xs text-[#737373]">
          <div>
            Showing {(safeCurrentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(safeCurrentPage * itemsPerPage, filteredStudents.length)} of{' '}
            {filteredStudents.length} students
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="secondary"
              size="sm"
              disabled={safeCurrentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              icon={ChevronLeft}
            >
              Previous
            </Button>

            <span className="px-3 py-1 text-xs font-medium text-black">
              Page {safeCurrentPage} of {totalPages}
            </span>

            <Button
              variant="secondary"
              size="sm"
              disabled={safeCurrentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              icon={ChevronRight}
              iconPosition="right"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Deletions */}
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
        />
      )}
    </div>
  );
};
