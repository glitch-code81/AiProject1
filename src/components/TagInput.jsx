import { useState, useRef } from 'react';

const PRESET_TAGS = ['personal', 'work', 'ideas', 'journal', 'poetry', 'draft', 'reference', 'archive', 'letter'];

export default function TagInput({ tags = [], onChange }) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  const addTag = (tag) => {
    const trimmed = tag.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput('');
    setShowSuggestions(false);
  };

  const removeTag = (tag) => {
    onChange(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const suggestions = PRESET_TAGS.filter(
    (t) => !tags.includes(t) && t.startsWith(input.toLowerCase())
  );

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300 rounded-full text-xs font-serif italic group"
        >
          {tag}
          <button
            onClick={() => removeTag(tag)}
            className="opacity-40 group-hover:opacity-100 hover:text-rust transition-all cursor-pointer"
            aria-label={`Remove tag ${tag}`}
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </span>
      ))}
      <div className="relative inline-block">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder={tags.length === 0 ? 'Add tag...' : ''}
          className="text-xs border-none outline-none bg-transparent text-ink-500 dark:text-ink-400 placeholder-ink-300 dark:placeholder-ink-600 w-20 font-serif"
          aria-label="Add tag"
        />
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 mt-1 paper-card paper-stack rounded-lg z-10 py-1 min-w-[130px]">
            {suggestions.map((s) => (
              <button
                key={s}
                onMouseDown={(e) => { e.preventDefault(); addTag(s); }}
                className="block w-full text-left px-3 py-1.5 text-xs text-ink-700 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-800 cursor-pointer transition-colors font-serif"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
