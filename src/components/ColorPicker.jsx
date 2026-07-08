import { useState } from 'react';

const NOTE_COLORS = {
  default: { label: 'Default', dot: 'bg-ink-300' },
  red: { label: 'Red', dot: 'bg-rust' },
  orange: { label: 'Orange', dot: 'bg-orange-500' },
  yellow: { label: 'Gold', dot: 'bg-gold' },
  green: { label: 'Forest', dot: 'bg-forest' },
  blue: { label: 'Blue', dot: 'bg-blue-500' },
  purple: { label: 'Purple', dot: 'bg-purple-500' },
  pink: { label: 'Wine', dot: 'bg-wine-light' },
};

export { NOTE_COLORS };

export default function ColorPicker({ currentColor = 'default', onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-ink-400 dark:text-ink-500 font-serif mr-1">Shade</span>
      <div className="flex gap-1.5 flex-wrap">
        {Object.entries(NOTE_COLORS).map(([key, color]) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`w-[18px] h-[18px] rounded-full transition-all cursor-pointer ${
              color.dot
            } ${
              currentColor === key
                ? 'ring-2 ring-offset-2 ring-gold dark:ring-offset-ink-900 scale-110'
                : 'hover:scale-125 ring-1 ring-ink-200 dark:ring-ink-600'
            }`}
            aria-label={color.label}
            title={color.label}
          />
        ))}
      </div>
    </div>
  );
}

export function getColorClasses(colorKey) {
  return NOTE_COLORS[colorKey] || NOTE_COLORS.default;
}
