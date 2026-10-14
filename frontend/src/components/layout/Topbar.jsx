import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { getStudentInitials } from '../../utils/studentHelpers.js';

export const Topbar = ({ onOpenMobile }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Determine breadcrumb/page title
  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/students') return 'Student Directory';
    if (path === '/students/new') return 'Students / Add New';
    if (path.includes('/edit')) return 'Students / Edit Record';
    if (path.startsWith('/students/')) return 'Students / Details';
    return 'Overview';
  };

  const userInitials = currentUser?.name ? getStudentInitials(currentUser.name) : 'AD';

  return (
    <header className="h-16 bg-white border-b border-[#EAEAEA] sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobile}
          className="md:hidden p-1.5 rounded text-[#737373] hover:text-black hover:bg-[#F5F5F5] focus:outline-none focus:ring-1 focus:ring-black"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <span className="text-xs sm:text-sm font-medium text-[#737373] font-sans">
          {getBreadcrumb()}
        </span>
      </div>

      {/* User initials avatar & small menu */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2.5 p-1 rounded hover:bg-[#F5F5F5] transition-colors focus:outline-none focus:ring-1 focus:ring-black"
          aria-expanded={dropdownOpen}
          aria-haspopup="true"
        >
          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-semibold tracking-wider font-heading">
            {userInitials}
          </div>
          <span className="hidden sm:inline text-xs font-medium text-black">
            {currentUser?.name || 'Administrator'}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-[#737373]" />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-52 bg-white border border-[#BDBDBD] shadow-lg rounded py-1 z-50 animate-in fade-in duration-100">
            <div className="px-3.5 py-2 border-b border-[#EAEAEA]">
              <p className="text-xs font-semibold text-black truncate">
                {currentUser?.name || 'Administrator'}
              </p>
              <p className="text-[11px] text-[#737373] truncate font-sans">
                {currentUser?.email || 'admin@college.edu'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full text-left px-3.5 py-2 text-xs text-black hover:bg-[#F5F5F5] flex items-center gap-2 font-medium transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 text-[#737373]" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
