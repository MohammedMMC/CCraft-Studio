import React from 'react';

interface GridOverlayProps {
  width: number;
  height: number;
  charWidth: number;
  charHeight: number;
}

export const GridOverlay: React.FC<GridOverlayProps> = ({ width, height, charWidth, charHeight }) => {
  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={width * charWidth}
      height={height * charHeight}
      style={{ opacity: 0.15 }}
    >
      <defs>
        <pattern
          id="grid"
          width={charWidth}
          height={charHeight}
          patternUnits="userSpaceOnUse"
        >
          <rect width={charWidth} height={charHeight} fill="none" stroke="#888" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
};
