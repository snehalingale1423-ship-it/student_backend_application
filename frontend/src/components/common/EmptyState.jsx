import React from 'react';
import { SearchX, FolderOpen } from 'lucide-react';
import { Button } from './Button.jsx';

export const EmptyState = ({
  icon: Icon = FolderOpen,
  title = 'No records found',
  description = 'There are no items matching your criteria.',
  actionLabel,
  onAction
}) => {
  return (
    <div className="py-12 px-4 text-center flex flex-col items-center justify-center border border-dashed border-[#BDBDBD] rounded bg-[#FBFBFB]">
      <div className="w-12 h-12 rounded bg-[#F5F5F5] border border-[#BDBDBD] flex items-center justify-center mb-3 text-black">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-black font-heading mb-1">
        {title}
      </h3>
      <p className="text-sm text-[#737373] max-w-sm mb-5 font-sans leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
