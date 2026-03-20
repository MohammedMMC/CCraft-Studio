import { CC_COLORS } from '@/models/CCColors';
import { getMonitorSize, MONITOR_SIZES } from '@/models/Project';
import React, { useState } from 'react';
import { Modal } from './Modal';

interface CustomMonitorProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (value: { blocks: string; width: number; height: number }) => void;
}

export const CustomMonitor: React.FC<CustomMonitorProps> = ({ isOpen, onClose, onCreate }) => {
  if (!isOpen) return null;

  const [monitorSize, setMonitorSize] = useState<string>('5x3');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Custom Monitor" width="max-w-xl">

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4 p-3 bg-app-bg rounded border border-app-border">
          <div className="flex items-center gap-4 p-3">
            <div className="text-center">
              <input className="text-2xl font-mono text-app-accent bg-transparent text-center" type="number" min="1" max="8" value={monitorSize.split('x')[0]} onChange={(e) => setMonitorSize(`${e.target.value}x${monitorSize.split('x')[1]}`)} />
              <div className="text-[10px] text-app-text-dim">Width</div>
            </div>
            <div className="text-app-text-dim">&times;</div>
            <div className="text-center">
              <input className="text-2xl font-mono text-app-accent bg-transparent text-center" type="number" min="1" max="6" value={monitorSize.split('x')[1]} onChange={(e) => setMonitorSize(`${monitorSize.split('x')[0]}x${e.target.value}`)} />
              <div className="text-[10px] text-app-text-dim">Height</div>
            </div>
            <div className="text-xs text-app-text-dim ml-2">Monitors</div>
          </div>
          <div className="flex items-center gap-4 p-3">
            <div className="text-center">
              <div className="text-2xl font-mono text-app-accent">{getMonitorSize(monitorSize).width}</div>
              <div className="text-[10px] text-app-text-dim">Width</div>
            </div>
            <div className="text-app-text-dim">&times;</div>
            <div className="text-center">
              <div className="text-2xl font-mono text-app-accent">{getMonitorSize(monitorSize).height}</div>
              <div className="text-[10px] text-app-text-dim">Height</div>
            </div>
            <div className="text-xs text-app-text-dim ml-2">Characters</div>
          </div>
        </div>

        {/* Preview */}
        <div className="mt-4">
          <label className="block text-xs text-app-text-dim mb-2">Monitor Preview</label>
          <div className="bg-black rounded border border-app-border p-2 flex items-center justify-center overflow-hidden">
            <div
              className="border border-cc-gray"
              style={{
                width: `${Math.min(getMonitorSize(monitorSize).width * 6, 400)}px`,
                height: `${Math.min(getMonitorSize(monitorSize).height * 9, 200)}px`,
                backgroundColor: CC_COLORS.black.hex,
              }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <span style={{ color: CC_COLORS.yellow.hex, fontSize: '10px', fontFamily: 'monospace' }}>
                  {getMonitorSize(monitorSize).width}x{getMonitorSize(monitorSize).height}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-6 pt-4 border-t border-app-border">
        <button
          onClick={onClose}
          className="btn-secondary"
        >Cancel</button>
        <button
          onClick={() => {onCreate(getMonitorSize(monitorSize));onClose();}}
          className="btn-primary"
        >Create Monitor</button>
      </div>
    </Modal>
  );
};
