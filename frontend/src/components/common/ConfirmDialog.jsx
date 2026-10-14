import React from 'react';
import { Modal } from './Modal.jsx';
import { Button } from './Button.jsx';
import { AlertCircle } from 'lucide-react';

/**
 * ConfirmDialog — Deletion confirmation modal
 *
 * Updated for Phase 6: delete is now async (backend call).
 * - onConfirm() is async; we do NOT auto-close on click — the parent closes us
 *   after the async delete succeeds (or shows errorMessage if it fails).
 * - errorMessage prop: shown inline if the delete API call fails.
 * - isLoading prop: disables buttons while the delete is in progress.
 */
export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete student?',
  studentName,
  studentId,
  confirmLabel = 'Confirm Delete',
  cancelLabel = 'Cancel',
  errorMessage = '',
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4 font-sans">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-[#F5F5F5] border border-[#BDBDBD] rounded shrink-0 mt-0.5">
            <AlertCircle className="w-5 h-5 text-black" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-black">
              {studentName}{' '}
              <span className="text-[#737373] font-normal">(ID: {studentId})</span>
            </p>
            <p className="text-sm text-[#404040] leading-relaxed">
              This action will permanently remove the student record from the database.
              This cannot be undone.
            </p>
          </div>
        </div>

        {/* Error from the API if delete failed */}
        {errorMessage && (
          <div className="p-3 bg-[#FFF5F5] border border-red-200 rounded text-xs text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EAEAEA]">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting…' : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
