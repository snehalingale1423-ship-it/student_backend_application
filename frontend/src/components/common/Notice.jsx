import React from 'react';
import { Check, Info, X } from 'lucide-react';

export const Notice = ({ message, type = 'info', onDismiss }) => {
  if (!message) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-50 max-w-md bg-black text-white px-4 py-3 rounded shadow-lg border border-neutral-800 flex items-center justify-between gap-3 text-sm animate-in fade-in slide-in-from-bottom-2 duration-200"
      role="status"
    >
      <div className="flex items-center gap-2.5">
        <span className="p-1 bg-white/10 rounded shrink-0">
          {type === 'success' ? <Check className="w-3.5 h-3.5" /> : <Info className="w-3.5 h-3.5" />}
        </span>
        <span className="font-sans text-xs leading-normal">{message}</span>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-neutral-400 hover:text-white p-1 rounded focus:outline-none"
          aria-label="Dismiss notice"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
