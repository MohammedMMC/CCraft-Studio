import React, { useEffect, useState } from 'react';
import { Modal } from '../shared/Modal';
import { useProjectStore } from '../../stores/projectStore';
import { CloudIcon, CraftOSPCIcon } from './Icons';
import { useAppStore } from '@/stores/appStore';
import { PLUGINS, PluginStore } from '@/models/Project';

interface SettingsDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ isOpen, onClose }) => {
    const project = useProjectStore((s) => s.project);
    const changeProjectInfo = useProjectStore((s) => s.changeProjectInfo);
    const [settingsType, setSettingsType] = useState<'project' | 'app'>(project ? 'project' : 'app');
    const [newChanges, setNewChanges] = useState(false);

    const [projectName, setProjectName] = useState<string>(project?.name ?? "");
    const [projectAuthor, setProjectAuthor] = useState<string | undefined>(project?.author ?? "");
    const [projectDescription, setProjectDescription] = useState<string>(project?.description ?? "");
    const [projectPlugins, setProjectPlugins] = useState<PluginStore[]>(project?.plugins ?? []);

    const useCraftOSPC = useAppStore(e => e.useCraftOSPC);
    const setCraftOSPC = useAppStore(e => e.setCraftOSPC);
    const cloudEnabled = useAppStore(e => e.cloudEnabled);
    const setCloudEnabled = useAppStore(e => e.setCloudEnabled);
    const saveApp = useAppStore(e => e.saveApp);

    const [editorCraftOSPC, setEditorCraftOSPC] = useState(useCraftOSPC);
    const [editorCloudEnabled, setEditorCloudEnabled] = useState(cloudEnabled);
    const [token, setToken] = useState("");
    const [tokenData, setTokenData] = useState<{ lastFetch: Date | undefined; valid: boolean; userId: string | undefined; firstName: string | undefined }>({ lastFetch: undefined, valid: false, userId: undefined, firstName: undefined });

    useEffect(() => {
        if (project) {
            if (projectName !== project.name || projectAuthor !== project.author || projectDescription !== project.description || projectPlugins?.length !== project.plugins?.length) {
                setNewChanges(true);
            }
        }
        if (useCraftOSPC !== editorCraftOSPC) {
            setNewChanges(true);
        }
        if (cloudEnabled !== editorCloudEnabled) {
            setNewChanges(true);
        }
    }, [projectName, projectAuthor, projectDescription, projectPlugins, editorCraftOSPC, editorCloudEnabled]);

    useEffect(() => {
        if (editorCloudEnabled) {
            checkToken();
        }
    }, [editorCloudEnabled, token]);

    async function checkToken() {
        const result = await window.electronAPI.api.checkToken(token, typeof tokenData.lastFetch === "undefined");

        if (result.valid) {
            setNewChanges(true);
            setTokenData({ lastFetch: new Date(), valid: true, userId: result.userId, firstName: result.firstName });
        } else {
            setTokenData({ lastFetch: new Date(), valid: false, userId: undefined, firstName: undefined });
        }
    }

    function handleSave() {
        if (project) {
            if (projectName !== project.name || projectAuthor !== project.author || projectDescription !== project.description || projectPlugins?.length !== project.plugins?.length) {
                changeProjectInfo({ newName: projectName, newAuthor: projectAuthor, newDescription: projectDescription, newPlugins: projectPlugins });
            }
        }
        if (useCraftOSPC !== editorCraftOSPC) {
            setCraftOSPC(editorCraftOSPC);
        }
        if (cloudEnabled !== editorCloudEnabled) {
            setCloudEnabled(editorCloudEnabled);
        }
        if (tokenData.valid && token.length > 0) {
            window.electronAPI.secret.setToken(token);
        }

        saveApp();

        setNewChanges(false);
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Settings" width="max-w-2xl">
            <div className="space-y-5">
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
                                    <div>
                                        <label className="block text-xs text-app-text-dim mb-1">Plugins</label>
                                        <select
                                            name="plugins"
                                            id="plugins"
                                            multiple
                                            value={projectPlugins.map((p) => `${p.id}:${p.version}`)}
                                            onChange={(e) => {
                                                const selectedOptions = Array.from(e.target.selectedOptions).map(option => {
                                                    const [id, version] = option.value.split(':');
                                                    return { id, version };
                                                });
                                                setProjectPlugins(selectedOptions);
                                            }}
                                        >
                                            {PLUGINS.map((plugin) => (
                                                <option key={plugin.id} value={`${plugin.id}:${plugin.version}`}>
                                                    {plugin.name} (v{plugin.version})
                                                </option>
                                            ))}
                                        </select>
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
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <input
                                            id="cloud-checkbox"
                                            type="checkbox"
                                            checked={editorCloudEnabled}
                                            onChange={(e) => setEditorCloudEnabled(e.target.checked)}
                                            className="checkbox-field"
                                        />
                                        <label className="flex gap-1 justify-center items-center text-sm text-app-text font-medium" htmlFor="cloud-checkbox">
                                            <CloudIcon className='fill-app-text' /> Enable Cloud features
                                        </label>
                                    </div>
                                    {editorCloudEnabled && (<>
                                        <div className="flex flex-col gap-1">
                                            <input
                                                className="input-field"
                                                value={token}
                                                onChange={(e) => setToken(e.target.value)}
                                                placeholder="Token"
                                            />
                                            <p className="text-xs text-app-text-dim">
                                                Get your token by logging into <a href="https://ccraft.studio" target="_blank" className="text-app-link text-app-accent/80">ccraft.studio</a> and copying it from the dashboard.
                                            </p>
                                        </div>
                                        {typeof tokenData.lastFetch !== "undefined" && (
                                            <div className={"text-xs p-2 rounded" + (tokenData.valid ? " text-app-success bg-app-success/10 border border-app-success" : " text-app-error bg-app-error/10 border border-app-error")}>
                                                {tokenData.valid ? `The provided token is valid, "${tokenData.firstName}".` : "The provided token is invalid. Please check it and try again."}
                                            </div>
                                        )}
                                    </>)}
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
