import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, width = 'max-w-lg' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className={`relative ${width} w-full bg-ide-surface border border-ide-border rounded-lg shadow-2xl`}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-ide-border">
          <h2 className="text-sm font-semibold text-ide-text-bright">{title}</h2>
          <button
            onClick={onClose}
            className="text-ide-text-dim hover:text-ide-text text-lg leading-none px-1"
          >
            &times;
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};
