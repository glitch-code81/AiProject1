const NOTE_COLORS = {
  default: { label: 'Default', bg: 'bg-white dark:bg-slate-800', border: 'border-gray-200 dark:border-slate-700', dot: 'bg-gray-400' },
  red: { label: 'Red', bg: 'bg-red-50 dark:bg-red-950/30', border: 'border-red-200 dark:border-red-800', dot: 'bg-red-400' },
  orange: { label: 'Orange', bg: 'bg-orange-50 dark:bg-orange-950/30', border: 'border-orange-200 dark:border-orange-800', dot: 'bg-orange-400' },
  yellow: { label: 'Yellow', bg: 'bg-yellow-50 dark:bg-yellow-950/30', border: 'border-yellow-200 dark:border-yellow-800', dot: 'bg-yellow-400' },
  green: { label: 'Green', bg: 'bg-green-50 dark:bg-green-950/30', border: 'border-green-200 dark:border-green-800', dot: 'bg-green-400' },
  blue: { label: 'Blue', bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-200 dark:border-blue-800', dot: 'bg-blue-400' },
  purple: { label: 'Purple', bg: 'bg-purple-50 dark:bg-purple-950/30', border: 'border-purple-200 dark:border-purple-800', dot: 'bg-purple-400' },
  pink: { label: 'Pink', bg: 'bg-pink-50 dark:bg-pink-950/30', border: 'border-pink-200 dark:border-pink-800', dot: 'bg-pink-400' },
};

export { NOTE_COLORS };

export default function ColorPicker({ currentColor = 'default', onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400 mr-1">Color</span>
      <div className="flex gap-1.5 flex-wrap">
        {Object.entries(NOTE_COLORS).map(([key, color]) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`w-5 h-5 rounded-full transition-all cursor-pointer ${
              color.dot
            } ${
              currentColor === key
                ? 'ring-2 ring-offset-1 ring-indigo-500 dark:ring-offset-slate-800 scale-110'
                : 'hover:scale-110 ring-1 ring-gray-300 dark:ring-gray-600'
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
