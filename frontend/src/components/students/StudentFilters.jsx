import React from 'react';
import { Search, X } from 'lucide-react';
import { BRANCH_OPTIONS, YEAR_OPTIONS } from '../../data/mockStudents.js';
import { Button } from '../common/Button.jsx';

export const StudentFilters = ({
  searchQuery,
  onSearchChange,
  branchFilter,
  onBranchChange,
  yearFilter,
  onYearChange,
  onClearFilters,
  totalResults,
  totalStudents
}) => {
  const hasActiveFilters = searchQuery.trim() !== '' || branchFilter !== 'all' || yearFilter !== 'all';

  return (
    <div className="bg-white border border-[#EAEAEA] rounded p-4 mb-6 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        {/* Search input */}
        <div className="lg:col-span-5 relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-[#737373]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by ID, name, or email..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#BDBDBD] rounded placeholder:text-[#737373] focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-sans"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#737373] hover:text-black"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Branch filter */}
        <div className="lg:col-span-3">
          <select
            value={branchFilter}
            onChange={(e) => onBranchChange(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-[#BDBDBD] rounded text-black focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-sans"
            aria-label="Filter by branch"
          >
            <option value="all">All Branches</option>
            {BRANCH_OPTIONS.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
        </div>

        {/* Year filter */}
        <div className="lg:col-span-2">
          <select
            value={yearFilter}
            onChange={(e) => onYearChange(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-[#BDBDBD] rounded text-black focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-sans"
            aria-label="Filter by academic year"
          >
            <option value="all">All Years</option>
            {YEAR_OPTIONS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Clear filters action */}
        <div className="lg:col-span-2 flex items-center justify-end">
          {hasActiveFilters ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={onClearFilters}
              className="w-full lg:w-auto"
              icon={X}
            >
              Clear Filters
            </Button>
          ) : (
            <span className="text-xs text-[#737373] hidden lg:inline">
              Showing {totalResults} of {totalStudents}
            </span>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="pt-2 border-t border-[#F5F5F5] flex items-center justify-between text-xs text-[#737373]">
          <span>
            Matching <strong>{totalResults}</strong> of {totalStudents} students
          </span>
          <button
            onClick={onClearFilters}
            className="underline hover:text-black font-medium"
          >
            Reset all filters
          </button>
        </div>
      )}
    </div>
  );
};
