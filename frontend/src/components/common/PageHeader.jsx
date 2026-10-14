import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const PageHeader = ({
  title,
  description,
  backTo,
  backLabel = 'Back',
  actions,
  className = ''
}) => {
  return (
    <div className={`pb-6 border-b border-[#EAEAEA] ${className}`}>
      {backTo && (
        <div className="mb-3">
          <Link
            to={backTo}
            className="inline-flex items-center gap-1.5 text-xs text-[#737373] hover:text-black font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{backLabel}</span>
          </Link>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black font-heading">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-[#737373] font-sans">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2.5 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
