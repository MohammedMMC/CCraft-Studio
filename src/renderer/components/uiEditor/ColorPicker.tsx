import React from 'react';
import { CCColor, CC_COLORS, CC_COLOR_NAMES } from '../../models/CCColors';

interface ColorPickerProps {
  value: CCColor;
  onChange: (color: CCColor) => void;
  label?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange, label }) => {
  return (
    <div>
      {label && <label className="block text-[10px] text-ide-text-dim mb-1">{label}</label>}
      <div className="grid grid-cols-8 gap-0.5">
        {CC_COLOR_NAMES.map((color) => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className={`w-5 h-5 rounded-sm border transition-all ${
              color === value
                ? 'border-ide-accent ring-1 ring-ide-accent scale-110'
                : 'border-transparent hover:border-ide-text-dim'
            }`}
            style={{ backgroundColor: CC_COLORS[color].hex }}
            title={color}
          />
        ))}
      </div>
    </div>
  );
};
