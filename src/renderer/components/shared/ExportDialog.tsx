import React, { useState } from 'react';
import { Modal } from '../shared/Modal';
import { useProjectStore } from '../../stores/projectStore';
import { exportProject, ExportOptions, ExportFile } from '../../engine/luaExport/index';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({ isOpen, onClose }) => {
  const project = useProjectStore((s) => s.project);

  const [mode, setMode] = useState<'full' | 'uiOnly'>('full');
  const [minify, setMinify] = useState(false);
  const [previewFiles, setPreviewFiles] = useState<ExportFile[]>([]);
  const [activePreviewIdx, setActivePreviewIdx] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  if (!project) return null;

  const handlePreview = () => {
    const options: ExportOptions = { mode, minify };
    const files = exportProject(project, options);
    if (files.length > 0) {
      setPreviewFiles(files);
      setActivePreviewIdx(0);
      setShowPreview(true);
    }
  };

  const handleExport = async () => {
    if (!window.electronAPI) {
      handlePreview();
      return;
    }

    const options: ExportOptions = { mode, minify };
    const files = exportProject(project, options);

    if (files.length > 0) {
      await window.electronAPI.exportMultiFile({
        files: files.map(f => ({ path: f.path, content: f.content })),
      });
    }

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Lua Program" width="max-w-2xl">
      <div className="space-y-5">
        {/* Export Mode */}
        <div>
          <label className="block text-xs text-ide-text-dim mb-2">Export Mode</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setMode('full')}
              className={`p-3 rounded border text-left transition-all ${
                mode === 'full'
                  ? 'border-ide-accent bg-ide-accent/10'
                  : 'border-ide-border bg-ide-bg hover:bg-ide-hover'
              }`}
            >
              <div className="text-sm font-medium text-ide-text-bright">Full Export</div>
              <div className="text-[10px] text-ide-text-dim mt-1">
                UI rendering + block logic + event loop. Ready to run.
              </div>
            </button>
            <button
              onClick={() => setMode('uiOnly')}
              className={`p-3 rounded border text-left transition-all ${
                mode === 'uiOnly'
                  ? 'border-ide-accent bg-ide-accent/10'
                  : 'border-ide-border bg-ide-bg hover:bg-ide-hover'
              }`}
            >
              <div className="text-sm font-medium text-ide-text-bright">UI Only</div>
              <div className="text-[10px] text-ide-text-dim mt-1">
                Just screen drawing functions. Code your own logic.
              </div>
            </button>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={minify}
              onChange={(e) => setMinify(e.target.checked)}
              className="accent-ide-accent"
            />
            <span className="text-xs text-ide-text">Minify output</span>
            <span className="text-[10px] text-ide-text-dim">(remove comments and extra whitespace)</span>
          </label>
        </div>

        {/* File structure info */}
        <div className="bg-ide-bg border border-ide-border rounded p-3">
          <div className="text-xs text-ide-text-dim mb-1">Export structure:</div>
          <div className="text-[11px] text-ide-text font-mono space-y-0.5">
            <div>vars.lua</div>
            <div>screens/</div>
            {project.screens.map(s => (
              <div key={s.id} className="pl-4">{s.name.replace(/[^a-zA-Z0-9_]/g, '_')}.lua</div>
            ))}
            <div>handlers.lua</div>
            {mode === 'full' && (
              <>
                <div>logic/</div>
                {project.screens.map(s => (
                  <div key={s.id} className="pl-4">{s.name.replace(/[^a-zA-Z0-9_]/g, '_')}.lua</div>
                ))}
              </>
            )}
            <div>startup.lua</div>
          </div>
        </div>

        {/* Preview */}
        {showPreview && previewFiles.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1 overflow-x-auto">
                {previewFiles.map((f, i) => (
                  <button
                    key={f.path}
                    onClick={() => setActivePreviewIdx(i)}
                    className={`px-2 py-0.5 text-[10px] rounded whitespace-nowrap ${
                      i === activePreviewIdx
                        ? 'bg-ide-accent text-ide-bg'
                        : 'bg-ide-bg text-ide-text-dim hover:text-ide-text'
                    }`}
                  >
                    {f.path}
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(previewFiles[activePreviewIdx].content);
                }}
                className="text-[10px] text-ide-accent hover:text-ide-accent/80 ml-2 whitespace-nowrap"
              >
                Copy
              </button>
            </div>
            <pre className="bg-ide-bg border border-ide-border rounded p-3 text-[11px] text-ide-text font-mono max-h-80 overflow-auto whitespace-pre">
              {previewFiles[activePreviewIdx].content}
            </pre>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between pt-2 border-t border-ide-border">
          <button onClick={handlePreview} className="btn-secondary text-xs">
            Preview Code
          </button>
          <div className="flex gap-2">
            <button onClick={onClose} className="btn-secondary text-xs">Cancel</button>
            <button onClick={handleExport} className="btn-primary text-xs">
              Export
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
