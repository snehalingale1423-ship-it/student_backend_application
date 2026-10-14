import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit3, Trash2, ArrowUpDown } from 'lucide-react';
import { getStudentInitials } from '../../utils/studentHelpers.js';
import { Button } from '../common/Button.jsx';
import { EmptyState } from '../common/EmptyState.jsx';

export const StudentTable = ({
  students = [],
  onDeleteClick,
  sortField,
  sortDirection,
  onSort,
  isCompact = false
}) => {
  if (students.length === 0) {
    return (
      <EmptyState
        title="No students found"
        description="Try adjusting your search query or filters to find what you're looking for."
      />
    );
  }

  const renderSortIndicator = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-[#BDBDBD] opacity-60 inline ml-1" />;
    }
    return (
      <span className="text-black font-bold ml-1 text-xs">
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  return (
    <div className="bg-white border border-[#EAEAEA] rounded overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#EAEAEA] bg-[#FBFBFB] text-xs font-semibold text-[#404040] uppercase tracking-wider font-heading">
              <th
                scope="col"
                className="py-3 px-4 cursor-pointer select-none hover:bg-[#F5F5F5] transition-colors"
                onClick={() => onSort && onSort('id')}
              >
                <div className="flex items-center">
                  <span>Student ID</span>
                  {onSort && renderSortIndicator('id')}
                </div>
              </th>
              <th
                scope="col"
                className="py-3 px-4 cursor-pointer select-none hover:bg-[#F5F5F5] transition-colors"
                onClick={() => onSort && onSort('name')}
              >
                <div className="flex items-center">
                  <span>Student Name</span>
                  {onSort && renderSortIndicator('name')}
                </div>
              </th>
              <th scope="col" className="py-3 px-4">
                Email
              </th>
              <th scope="col" className="py-3 px-4">
                Branch
              </th>
              <th scope="col" className="py-3 px-4">
                Academic Year
              </th>
              <th scope="col" className="py-3 px-4 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAEAEA] text-sm font-sans">
            {students.map((student) => {
              const initials = getStudentInitials(student.name);

              return (
                <tr
                  key={student.id}
                  className="hover:bg-[#F9F9F9] transition-colors group"
                >
                  {/* Student ID */}
                  <td className="py-3.5 px-4 font-mono text-xs font-semibold text-black">
                    <Link
                      to={`/students/${student.id}`}
                      className="hover:underline focus:outline-none focus:ring-1 focus:ring-black rounded px-1 -mx-1"
                    >
                      {student.id}
                    </Link>
                  </td>

                  {/* Student Name + Avatar */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-7 h-7 rounded-full bg-[#EAEAEA] border border-[#BDBDBD] text-black font-semibold text-xs flex items-center justify-center shrink-0 font-heading"
                        aria-hidden="true"
                      >
                        {initials}
                      </div>
                      <Link
                        to={`/students/${student.id}`}
                        className="font-medium text-black hover:underline"
                      >
                        {student.name}
                      </Link>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="py-3.5 px-4 text-[#404040]">
                    <span className="truncate max-w-[200px] block" title={student.email}>
                      {student.email}
                    </span>
                  </td>

                  {/* Branch (Unboxed text with zero pills) */}
                  <td className="py-3.5 px-4 text-[#404040]">
                    <span>{student.branch}</span>
                  </td>

                  {/* Year (Unboxed text with zero pills) */}
                  <td className="py-3.5 px-4 text-[#404040]">
                    <span>{student.year}</span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/students/${student.id}`}
                        className="p-1.5 text-[#737373] hover:text-black hover:bg-[#EAEAEA] rounded transition-colors"
                        title={`View details of ${student.name}`}
                        aria-label={`View details of ${student.name}`}
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/students/${student.id}/edit`}
                        className="p-1.5 text-[#737373] hover:text-black hover:bg-[#EAEAEA] rounded transition-colors"
                        title={`Edit ${student.name}`}
                        aria-label={`Edit ${student.name}`}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => onDeleteClick && onDeleteClick(student)}
                        className="p-1.5 text-[#737373] hover:text-black hover:bg-[#EAEAEA] rounded transition-colors"
                        title={`Delete ${student.name}`}
                        aria-label={`Delete ${student.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
