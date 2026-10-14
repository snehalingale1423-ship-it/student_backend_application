import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button.jsx';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 font-sans">
      <div className="w-16 h-16 rounded-full bg-[#F5F5F5] border border-[#BDBDBD] flex items-center justify-center text-black mb-4">
        <FileQuestion className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-black font-heading tracking-tight mb-2">
        404 — Page Not Found
      </h1>
      <p className="text-sm text-[#737373] max-w-md mb-6 leading-relaxed">
        The page or student record you are looking for does not exist in the StudbuddY directory.
      </p>
      <div className="flex items-center gap-3">
        <Link to="/dashboard">
          <Button variant="primary" icon={ArrowLeft}>
            Return to Dashboard
          </Button>
        </Link>
        <Link to="/students">
          <Button variant="secondary">
            View Student Directory
          </Button>
        </Link>
      </div>
    </div>
  );
};
