import React, { useState, useEffect, useRef } from 'react';
import { create } from 'zustand';

interface PromptState {
  isOpen: boolean;
  title: string;
  message: string;
  defaultValue: string;
  resolve: ((value: string | null) => void) | null;
  open: (opts: { title?: string; message?: string; defaultValue?: string }) => Promise<string | null>;
  close: (value: string | null) => void;
}

export const usePromptStore = create<PromptState>((set, get) => ({
  isOpen: false,
  title: '',
  message: '',
  defaultValue: '',
  resolve: null,

  open: (opts) =>
    new Promise<string | null>((resolve) => {
      set({
        isOpen: true,
        title: opts.title ?? 'Input',
        message: opts.message ?? '',
        defaultValue: opts.defaultValue ?? '',
        resolve,
      });
    }),

  close: (value) => {
    const { resolve } = get();
    resolve?.(value);
    set({ isOpen: false, resolve: null });
  },
}));

export const PromptDialog: React.FC = () => {
  const { isOpen, title, message, defaultValue, close } = usePromptStore();
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setValue(defaultValue);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, defaultValue]);

  if (!isOpen) return null;

  const handleOk = () => close(value);
  const handleCancel = () => close(null);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleOk();
    if (e.key === 'Escape') handleCancel();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.5)' }}
    >
      <div className="bg-ide-surface border border-ide-border rounded-lg shadow-xl w-80 p-5">
        <h3 className="text-sm font-semibold text-ide-text mb-2">{title}</h3>
        {message && (
          <p className="text-xs text-ide-text-dim mb-3">{message}</p>
        )}
        <input
          ref={inputRef}
          className="input-field mb-4"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="flex justify-end gap-2">
          <button className="btn-secondary text-xs px-3 py-1" onClick={handleCancel}>
            Cancel
          </button>
          <button className="btn-primary text-xs px-3 py-1" onClick={handleOk}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};
