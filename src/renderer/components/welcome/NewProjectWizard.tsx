import React, { useState } from 'react';
import { Modal } from '../shared/Modal';
import { useProjectStore } from '../../stores/projectStore';

interface NewProjectWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewProjectWizard: React.FC<NewProjectWizardProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('My Project');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');

  const createProject = useProjectStore((s) => s.createProject);

  const handleCreate = () => {
    createProject({
      name,
      author,
      description,
    });
    onClose();
    setStep(0);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Project" width="max-w-xl">
      {/* Content */}
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

      {/* Navigation */}
      <div className="flex justify-between mt-6 pt-4 border-t border-app-border">
        <button
          onClick={() => step > 0 ? setStep(step - 1) : onClose()}
          className="btn-secondary"
        >Cancel</button>
        <button
          onClick={() => handleCreate()}
          className="btn-primary"
          disabled={step === 0 && !name.trim()}
        >Create Project</button>
      </div>
    </Modal>
  );
};
