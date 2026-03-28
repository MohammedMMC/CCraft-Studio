import { useEffect, useRef, useState } from "react";


export const PanelDiv: React.FC<{ resizeable?: boolean; hidden?: boolean; children: React.ReactNode }> = ({ resizeable = false, hidden = false, children }) => {
    const [panelWidth, setPanelWidth] = useState(300);
    const isResizing = useRef(false);
    const startX = useRef(0);
    const startWidth = useRef(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!resizeable) return;
        isResizing.current = true;
        startX.current = e.clientX;
        startWidth.current = panelWidth;
        e.preventDefault();
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isResizing.current) return;
        const delta = startX.current - e.clientX;
        const newWidth = startWidth.current + delta;
        setPanelWidth(Math.max(300, Math.min(700, newWidth)));
    };

    const handleMouseUp = () => {
        isResizing.current = false;
    };

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    return (
        <div
            style={{ width: panelWidth }}
            className={(hidden ? "hidden " : "") + "relative border-l border-app-border bg-app-panel flex flex-col overflow-hidden"}
        >
            {resizeable && (
                <div
                    onMouseDown={handleMouseDown}
                    className="absolute left-0 top-0 bottom-0 w-0.5 cursor-ew-resize hover:bg-blue-500/50 active:bg-blue-500"
                />
            )}
            {children}
        </div>
    );
};
