import React, { useEffect, useState } from 'react';
import * as Blockly from 'blockly';
import { Modal } from '../shared/Modal';
import { useProjectStore } from '../../stores/projectStore';
import { useBlocklyStore } from '../../stores/blocklyStore';
import { luaGenerator } from '../../engine/blockly/luaGenerator';
import { exportProject } from '../../engine/luaExport/index';
import JSZip from "jszip";

interface UploadTempDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export const UploadTempDialog: React.FC<UploadTempDialogProps> = ({ isOpen, onClose }) => {
    const project = useProjectStore((s) => s.project);
    if (!project) return null;

    const [uploaded, setUploaded] = useState(false);
    const [failed, setFailed] = useState(false);
    const [projectUrl, setProjectUrl] = useState<string>("");

    const flushLiveWorkspace = () => {
        const { liveWorkspace, liveScreenId, setXml, setLuaCode } = useBlocklyStore.getState();
        if (liveWorkspace && liveScreenId) {
            const xml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(liveWorkspace));
            setXml(liveScreenId, xml);
            const code = luaGenerator.workspaceToCode(liveWorkspace);
            setLuaCode(liveScreenId, code);
        }
    };

    useEffect(() => {
        if (!isOpen) return;
        setUploaded(false);
        setFailed(false);
        setProjectUrl("");

        flushLiveWorkspace();
        const files = exportProject(project, { mode: 'full', minify: false });
        const zip = new JSZip();

        for (const file of files) {
            if (!file.path.includes("components/")){
                zip.file(file.path, file.content);
            }
        }
        zip.generateAsync({ type: "blob" }).then((blob) => {
            blob.arrayBuffer().then(buffer => {
                window.electronAPI.api.uploadTempProject({ buffer }).then((url) => {
                    if (url) {
                        setUploaded(true);
                        setFailed(false);
                        setProjectUrl(url);
                    } else {
                        setUploaded(false);
                        setFailed(true);
                        setProjectUrl("");
                    }
                });
            });
        }).catch((err) => {
            console.error("Error generating ZIP:", err);
            setFailed(true);
        });
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Upload Temporary Project" width="max-w-2xl max-h-screen">
            <div className="space-y-3">
                <p className="text-app-text text-lg font-medium text-center">{failed ? "Failed to upload the project." : (uploaded ? "Uploaded Successfully!" : "Uploading...")}</p>

                {uploaded && !failed && (
                    <p className="text-app-accent bg-app-accent/10 border border-app-accent text-sm p-2 rounded text-center">{`wget run ${projectUrl}`}</p>
                )}

                {failed && (
                    <p className="text-app-error bg-app-error/10 border border-app-error text-sm p-2 rounded text-center">Failed to upload the project. Please try again.</p>
                )}

                <div className="flex justify-end pt-4 border-t border-app-border">
                    <button onClick={onClose} className="btn-primary text-xs">
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
};
