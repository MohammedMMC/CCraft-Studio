import React from 'react';
import { CCColor, CC_COLORS, CC_COLOR_NAMES } from '../../models/CCColors';

interface ColorPickerProps {
  value: CCColor;
  onChange: (color: CCColor) => void;
  label?: string;
  exclude?: CCColor[];
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange, label, exclude }) => {
  const colors = exclude ? CC_COLOR_NAMES.filter(c => !exclude.includes(c)) : CC_COLOR_NAMES;
  return (
    <div>
      {label && <label className="block text-[10px] text-app-text-dim mb-1">{label}</label>}
      <div className="grid grid-cols-8 gap-0.5">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className={`w-5 h-5 rounded-sm border transition-all ${
              color === value
                ? 'border-app-accent ring-1 ring-app-accent scale-110'
                : 'border-transparent hover:border-app-text-dim'
            }`}
            style={color === 'transparent' ? {
              background: 'repeating-conic-gradient(#808080 0% 25%, #c0c0c0 0% 50%) 50% / 8px 8px',
            } : { backgroundColor: CC_COLORS[color].hex }}
            title={color}
          />
        ))}
      </div>
    </div>
  );
};
