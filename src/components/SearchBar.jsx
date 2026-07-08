import { useEffect, useRef } from 'react';

export default function SearchBar({ value, onChange }) {
  const inputRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="relative flex items-center">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300 dark:text-ink-500 pointer-events-none shrink-0"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search leaves... (⌘F)"
        className="w-full h-9 pl-9 pr-8 text-sm bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded-lg text-ink-700 dark:text-ink-300 placeholder-ink-300 dark:placeholder-ink-500 outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all font-serif input-inkwell"
        aria-label="Search notes"
      />
      {value && (
        <button
          onClick={() => {
            onChange('');
            inputRef.current?.focus();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-5 h-5 text-ink-300 dark:text-ink-500 hover:text-ink-600 dark:hover:text-ink-300 rounded hover:bg-ink-200 dark:hover:bg-ink-700 transition-colors cursor-pointer"
          aria-label="Clear search"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}
