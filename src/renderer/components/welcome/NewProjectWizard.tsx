import React, { useState } from 'react';
import { Modal } from '../shared/Modal';
import { DeviceType, DEVICE_PRESETS, MONITOR_SIZES } from '../../models/Project';
import { useProjectStore } from '../../stores/projectStore';
import { CC_COLORS, CCColor, CC_COLOR_NAMES } from '../../models/CCColors';

interface NewProjectWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewProjectWizard: React.FC<NewProjectWizardProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('My Project');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [device, setDevice] = useState<DeviceType>('advanced_computer');
  const [monitorSize, setMonitorSize] = useState('2x2');
  const [customWidth, setCustomWidth] = useState(51);
  const [customHeight, setCustomHeight] = useState(19);
  const [colorMode, setColorMode] = useState<'color' | 'grayscale'>('color');

  const createProject = useProjectStore((s) => s.createProject);

  const preset = DEVICE_PRESETS[device];

  const getDisplaySize = () => {
    if (device === 'monitor') {
      const ms = MONITOR_SIZES.find(m => m.blocks === monitorSize);
      return ms ? { width: ms.width, height: ms.height } : { width: customWidth, height: customHeight };
    }
    return { width: preset.defaultWidth, height: preset.defaultHeight };
  };

  const handleCreate = () => {
    const size = getDisplaySize();
    createProject({
      name,
      author,
      description,
      device,
      displayWidth: size.width,
      displayHeight: size.height,
      colorMode: preset.supportsColor ? colorMode : 'grayscale',
    });
    onClose();
    setStep(0);
  };

  const steps = [
    // Step 0: Project Info
    () => (
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-app-text-dim mb-1">Project Name *</label>
          <input
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Awesome Program"
            autoFocus
          />
        </div>
        <div>
          <label className="block text-xs text-app-text-dim mb-1">Author</label>
          <input
            className="input-field"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-xs text-app-text-dim mb-1">Description</label>
          <textarea
            className="input-field resize-none h-20"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does this program do?"
          />
        </div>
      </div>
    ),

    // Step 1: Device Selection
    () => (
      <div className="space-y-3">
        <p className="text-xs text-app-text-dim mb-2">Select the target device for your program:</p>
        <div className="grid grid-cols-2 gap-2">
          {(Object.entries(DEVICE_PRESETS) as [DeviceType, typeof DEVICE_PRESETS[DeviceType]][]).map(
            ([key, dev]) => (
              <button
                key={key}
                onClick={() => setDevice(key)}
                className={`p-3 rounded border text-left transition-all ${
                  device === key
                    ? 'border-app-accent bg-app-accent/10 text-app-text-bright'
                    : 'border-app-border bg-app-bg hover:bg-app-hover text-app-text'
                }`}
              >
                <div className="text-sm font-medium">{dev.label}</div>
                <div className="text-xs text-app-text-dim mt-1">{dev.description}</div>
                <div className="flex gap-2 mt-2">
                  {dev.supportsColor && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-app-accent/20 text-app-accent">Color</span>
                  )}
                  {dev.supportsTouch && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-app-success/20 text-app-success">Touch</span>
                  )}
                </div>
              </button>
            )
          )}
        </div>
      </div>
    ),

    // Step 2: Display Settings
    () => {
      const size = getDisplaySize();
      return (
        <div className="space-y-4">
          {device === 'monitor' && (
            <div>
              <label className="block text-xs text-app-text-dim mb-1">Monitor Size (blocks)</label>
              <select
                className="select-field"
                value={monitorSize}
                onChange={(e) => setMonitorSize(e.target.value)}
              >
                {MONITOR_SIZES.map((ms) => (
                  <option key={ms.blocks} value={ms.blocks}>
                    {ms.blocks} ({ms.width}x{ms.height} chars)
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center gap-4 p-3 bg-app-bg rounded border border-app-border">
            <div className="text-center">
              <div className="text-2xl font-mono text-app-accent">{size.width}</div>
              <div className="text-[10px] text-app-text-dim">Width</div>
            </div>
            <div className="text-app-text-dim">&times;</div>
            <div className="text-center">
              <div className="text-2xl font-mono text-app-accent">{size.height}</div>
              <div className="text-[10px] text-app-text-dim">Height</div>
            </div>
            <div className="text-xs text-app-text-dim ml-4">characters</div>
          </div>

          {preset.supportsColor && (
            <div>
              <label className="block text-xs text-app-text-dim mb-2">Color Mode</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setColorMode('color')}
                  className={`flex-1 p-2 rounded border text-sm transition-all ${
                    colorMode === 'color'
                      ? 'border-app-accent bg-app-accent/10 text-app-text-bright'
                      : 'border-app-border bg-app-bg hover:bg-app-hover'
                  }`}
                >
                  <div className="flex gap-1 justify-center mb-1">
                    {['red', 'orange', 'yellow', 'lime', 'blue', 'purple'].map((c) => (
                      <span
                        key={c}
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: CC_COLORS[c as CCColor].hex }}
                      />
                    ))}
                  </div>
                  16 Colors
                </button>
                <button
                  onClick={() => setColorMode('grayscale')}
                  className={`flex-1 p-2 rounded border text-sm transition-all ${
                    colorMode === 'grayscale'
                      ? 'border-app-accent bg-app-accent/10 text-app-text-bright'
                      : 'border-app-border bg-app-bg hover:bg-app-hover'
                  }`}
                >
                  <div className="flex gap-1 justify-center mb-1">
                    {['white', 'lightGray', 'gray', 'black'].map((c) => (
                      <span
                        key={c}
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: CC_COLORS[c as CCColor].hex }}
                      />
                    ))}
                  </div>
                  Grayscale
                </button>
              </div>
            </div>
          )}

          {/* Preview */}
          <div className="mt-4">
            <label className="block text-xs text-app-text-dim mb-2">Terminal Preview</label>
            <div className="bg-black rounded border border-app-border p-2 flex items-center justify-center overflow-hidden">
              <div
                className="border border-cc-gray"
                style={{
                  width: `${Math.min(size.width * 6, 400)}px`,
                  height: `${Math.min(size.height * 9, 200)}px`,
                  backgroundColor: CC_COLORS.black.hex,
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <span style={{ color: CC_COLORS.yellow.hex, fontSize: '10px', fontFamily: 'monospace' }}>
                    {size.width}x{size.height}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    },
  ];

  const stepTitles = ['Project Info', 'Device', 'Display'];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Project" width="max-w-xl">
      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-6">
        {stepTitles.map((title, i) => (
          <React.Fragment key={i}>
            <button
              onClick={() => setStep(i)}
              className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded transition-all ${
                i === step
                  ? 'bg-app-accent/20 text-app-accent font-medium'
                  : i < step
                    ? 'text-app-success cursor-pointer hover:bg-app-hover'
                    : 'text-app-text-dim'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                i === step
                  ? 'bg-app-accent text-app-bg'
                  : i < step
                    ? 'bg-app-success text-app-bg'
                    : 'bg-app-border text-app-text-dim'
              }`}>
                {i < step ? '\u2713' : i + 1}
              </span>
              {title}
            </button>
            {i < stepTitles.length - 1 && (
              <div className={`flex-1 h-px ${i < step ? 'bg-app-success' : 'bg-app-border'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      {steps[step]()}

      {/* Navigation */}
      <div className="flex justify-between mt-6 pt-4 border-t border-app-border">
        <button
          onClick={() => step > 0 ? setStep(step - 1) : onClose()}
          className="btn-secondary"
        >
          {step === 0 ? 'Cancel' : 'Back'}
        </button>
        <button
          onClick={() => step < steps.length - 1 ? setStep(step + 1) : handleCreate()}
          className="btn-primary"
          disabled={step === 0 && !name.trim()}
        >
          {step < steps.length - 1 ? 'Next' : 'Create Project'}
        </button>
      </div>
    </Modal>
  );
};
