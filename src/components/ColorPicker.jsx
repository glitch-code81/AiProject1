const NOTE_COLORS = [
  null,
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
];

export default function ColorPicker({ color, onChange }) {
  return (
    <div className="flex items-center gap-1.5">
      {NOTE_COLORS.map((c) => (
        <button
          key={c || 'default'}
          onClick={() => onChange(c)}
          className={`w-5 h-5 rounded-full transition-all cursor-pointer active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
            c === color
              ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110'
              : 'hover:scale-110'
          } ${c ? 'shadow-sm' : 'border border-dashed border-gray-300 dark:border-gray-600'}`}
          style={c ? { backgroundColor: c } : {}}
          aria-label={c || 'No color'}
          title={c || 'Default'}
        >
          {!c && (
            <svg className="w-3 h-3 mx-auto text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          )}
        </button>
      ))}
    </div>
  );
}
