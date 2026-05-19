import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface EditModalProps {
  label: string;
  value: string;
  inputType: string;
  onSave: (value: string) => void;
  onClose: () => void;
}

export const EditModal: React.FC<EditModalProps> = ({ label, value, inputType, onSave, onClose }) => {
  const [localValue, setLocalValue] = useState(value ?? '');
  const isTextarea = inputType === 'textarea';
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, []);

  const handleSave = () => onSave(localValue);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isTextarea) handleSave();
    if (e.key === 'Escape') onClose();
  };

  return (
    <>
      <div className="edit-modal-overlay" onClick={onClose} />
      <div className="edit-modal">
        <div className="edit-modal-header">
          <span className="edit-modal-label">{label}</span>
          <button className="edit-modal-close" type="button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="edit-modal-body">
          {isTextarea ? (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              className="edit-modal-input"
              value={localValue}
              onChange={e => setLocalValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          ) : (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type={inputType}
              className="edit-modal-input"
              value={localValue}
              onChange={e => setLocalValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          )}
        </div>
        <div className="edit-modal-footer">
          <button className="edit-modal-cancel" type="button" onClick={onClose}>キャンセル</button>
          <button className="edit-modal-save" type="button" onClick={handleSave}>保存</button>
        </div>
      </div>
    </>
  );
};
