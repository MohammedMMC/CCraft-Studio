import React, { useEffect, useState } from 'react';
import { Modal } from '../shared/Modal';
import { useProjectStore } from '../../stores/projectStore';
import { CraftOSPCIcon } from './Icons';
import { useAppStore } from '@/stores/appStore';

interface SettingsDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ isOpen, onClose }) => {
    const project = useProjectStore((s) => s.project);
    const changeProjectInfo = useProjectStore((s) => s.changeProjectInfo);
    const [settingsType, setSettingsType] = useState<'project' | 'app'>(project ? 'project' : 'app');
    const [newChanges, setNewChanges] = useState(false);

    const [projectName, setProjectName] = useState(project?.name);
    const [projectAuthor, setProjectAuthor] = useState(project?.author);
    const [projectDescription, setProjectDescription] = useState(project?.description);

    const useCraftOSPC = useAppStore(e => e.useCraftOSPC);
    const setCraftOSPC = useAppStore(e => e.setCraftOSPC);
    const saveApp = useAppStore(e => e.saveApp);

    const [editorCraftOSPC, setEditorCraftOSPC] = useState(useCraftOSPC);

    useEffect(() => {
        if (project) {
            if (projectName !== project.name || projectAuthor !== project.author || projectDescription !== project.description) {
                setNewChanges(true);
            }
        }
        if (useCraftOSPC !== editorCraftOSPC) {
            setNewChanges(true);
        }
    }, [projectName, projectAuthor, projectDescription, editorCraftOSPC]);

    function handleSave() {
        if (project) {
            if (projectName !== project.name || projectAuthor !== project.author || projectDescription !== project.description) {
                changeProjectInfo(projectName, projectAuthor, projectDescription)
            }
        }
        if (useCraftOSPC !== editorCraftOSPC) {
            setCraftOSPC(editorCraftOSPC);
            saveApp();
        }

        setNewChanges(false);
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Settings" width="max-w-2xl">
            <div className="space-y-5">
                {/* Navbar on left verticaly, with two sections (project settings (if project is loaded)) and app settings */}
                <div className="flex flex-col">
                    <div className="flex justify-evenly w-full p-1 mb-4 border-b border-app-border">
                        <button
                            className={`text-sm mb-2 ${settingsType === 'project' ? 'text-app-text' : 'text-app-text-dim'}`}
                            onClick={() => setSettingsType('project')}
                            disabled={!project}
                        >
                            Project Settings
                        </button>
                        <button
                            className={`text-sm mb-2 ${settingsType === 'app' ? 'text-app-text' : 'text-app-text-dim'}`}
                            onClick={() => setSettingsType('app')}
                        >
                            Application Settings
                        </button>
                    </div>

                    <div className="w-full p-4">
                        {settingsType === 'project' && (
                            <>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs text-app-text-dim mb-1">Project Name *</label>
                                        <input
                                            className="input-field"
                                            value={projectName}
                                            onChange={(e) => setProjectName(e.target.value)}
                                            placeholder="My Awesome Program"
                                            autoFocus
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-app-text-dim mb-1">Author</label>
                                        <input
                                            className="input-field"
                                            value={projectAuthor}
                                            onChange={(e) => setProjectAuthor(e.target.value)}
                                            placeholder="Your name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-app-text-dim mb-1">Description</label>
                                        <textarea
                                            className="input-field resize-none h-20"
                                            value={projectDescription}
                                            onChange={(e) => setProjectDescription(e.target.value)}
                                            placeholder="What does this program do?"
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                        {settingsType === 'app' && (
                            <div className="space-y-4">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <input
                                            id="craftospc-checkbox"
                                            type="checkbox"
                                            checked={editorCraftOSPC}
                                            onChange={(e) => setEditorCraftOSPC(e.target.checked)}
                                            className="checkbox-field"
                                        />
                                        <label className="flex gap-1 justify-center items-center text-sm text-app-text font-medium" htmlFor="craftospc-checkbox">
                                            <CraftOSPCIcon className='fill-app-text' /> Use CraftOS-PC app
                                        </label>
                                    </div>
                                    {editorCraftOSPC && (
                                        <div className="text-xs text-app-error bg-app-error/10 border border-app-error p-2 rounded">
                                            This is a 3rd party feature that we are not responsible for. Use it at your own risk.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        <div className="flex justify-end mt-6 pt-4 border-t border-app-border">
                            <button
                                onClick={() => handleSave()}
                                className="btn-primary"
                                disabled={!newChanges}
                            >Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
