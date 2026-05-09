import React, { useEffect, useRef, useState } from 'react';
import { Modal } from '../shared/Modal';
import { useProjectStore } from '../../stores/projectStore';
import { CloudIcon, CraftOSPCIcon } from './Icons';
import { useAppStore } from '@/stores/appStore';
import { PLUGINS, PluginStore } from '@/models/Project';

const normalizePlugins = (plugins?: PluginStore[]) =>
    (plugins ?? []).map((plugin) => `${plugin.id}:${plugin.version}`).sort();

const hasPluginChanges = (current: PluginStore[], original?: PluginStore[]) => {
    const currentList = normalizePlugins(current);
    const originalList = normalizePlugins(original);

    if (currentList.length !== originalList.length) return true;

    return currentList.some((value, index) => value !== originalList[index]);
};

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
    const [isPluginsOpen, setIsPluginsOpen] = useState(false);
    const pluginsRef = useRef<HTMLDivElement | null>(null);

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
            if (
                projectName !== project.name ||
                projectAuthor !== project.author ||
                projectDescription !== project.description ||
                hasPluginChanges(projectPlugins, project.plugins)
            ) {
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

    useEffect(() => {
        if (!isPluginsOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (!pluginsRef.current) return;
            if (!pluginsRef.current.contains(event.target as Node)) {
                setIsPluginsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isPluginsOpen]);

    async function checkToken() {
        const result = await window.electronAPI.api.checkToken(token, typeof tokenData.lastFetch === "undefined");

        if (result.valid) {
            setNewChanges(true);
            setTokenData({ lastFetch: new Date(), valid: true, userId: result.userId, firstName: result.firstName });
        } else {
            setTokenData({ lastFetch: new Date(), valid: false, userId: undefined, firstName: undefined });
        }
    }

    const isPluginSelected = (plugin: PluginStore) =>
        projectPlugins.some((selected) => selected.id === plugin.id && selected.version === plugin.version);

    const addPlugin = (plugin: PluginStore) => {
        if (isPluginSelected(plugin)) return;
        setProjectPlugins((prev) => [...prev, plugin]);
    };

    const removePlugin = (plugin: PluginStore) => {
        setProjectPlugins((prev) =>
            prev.filter((selected) => !(selected.id === plugin.id && selected.version === plugin.version))
        );
    };

    const getPluginLabel = (plugin: PluginStore) => {
        const match = PLUGINS.find((item) => item.id === plugin.id && item.version === plugin.version);
        return match ? `${match.name} (v${match.version})` : `${plugin.id} (v${plugin.version})`;
    };

    function handleSave() {
        if (project) {
            if (
                projectName !== project.name ||
                projectAuthor !== project.author ||
                projectDescription !== project.description ||
                hasPluginChanges(projectPlugins, project.plugins)
            ) {
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
                                        <div className="relative" ref={pluginsRef}>
                                            <button
                                                type="button"
                                                className="input-field flex flex-wrap items-center gap-2 text-left min-h-[2.5rem]"
                                                onClick={() => setIsPluginsOpen((open) => !open)}
                                                aria-haspopup="listbox"
                                                aria-expanded={isPluginsOpen}
                                            >
                                                {projectPlugins.length === 0 ? (
                                                    <span className="text-app-text-dim">Click to select plugins</span>
                                                ) : (
                                                    <span className="text-app-text">{projectPlugins.map(getPluginLabel).join(', ')}</span>
                                                )}
                                            </button>
                                            {isPluginsOpen && (
                                                <div className="absolute z-10 mt-1 w-full rounded border border-app-border bg-app-bg shadow-lg">
                                                    <div className="max-h-56 overflow-auto">
                                                        {PLUGINS.map((plugin) => {
                                                            const selected = isPluginSelected({ id: plugin.id, version: plugin.version });
                                                            return (
                                                                <button
                                                                    key={`${plugin.id}:${plugin.version}`}
                                                                    type="button"
                                                                    className={`flex w-full items-center justify-between px-3 py-2 text-sm text-left hover:bg-app-hover ${selected ? 'text-app-text' : 'text-app-text-dim'}`}
                                                                    onClick={() =>
                                                                        selected
                                                                            ? removePlugin({ id: plugin.id, version: plugin.version })
                                                                            : addPlugin({ id: plugin.id, version: plugin.version })
                                                                    }
                                                                    role="option"
                                                                    aria-selected={selected}
                                                                >
                                                                    <span>{plugin.name} (v{plugin.version})</span>
                                                                    {selected && <span className="text-xs text-app-text-dim">Added</span>}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
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
