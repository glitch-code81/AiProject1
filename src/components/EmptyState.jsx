export default function EmptyState({ onCreate }) {
  return (
    <div className="flex-1 flex items-center justify-center parchment-bg">
      <div className="paper-card paper-stack rounded-xl p-12 max-w-md mx-4 text-center animate-fade-in">
        {/* Decorative quill icon */}
        <div className="mb-6 text-ink-200 dark:text-ink-700 empty-state-icon">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            <path d="M15 5l4 4" opacity="0.3" />
          </svg>
        </div>

        {/* Ornamental divider */}
        <div className="ornamental-divider mb-4">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1" fill="currentColor" />
          </svg>
        </div>

        <h2 className="text-2xl font-semibold text-ink-800 dark:text-ink-200 mb-3 font-display">
          A Blank Page
        </h2>
        <p className="text-ink-400 dark:text-ink-500 mb-8 max-w-sm text-sm font-serif leading-relaxed">
          The first word is always the hardest. Let your thoughts flow — they will be saved as you write.
        </p>

        <button
          onClick={onCreate}
          className="btn-classical inline-flex items-center justify-center h-11 px-8 bg-gradient-to-r from-sepia to-sepia-dark text-parchment rounded-lg hover:from-sepia-dark hover:to-sepia shadow-md hover:shadow-lg active:shadow-sm transition-all font-semibold cursor-pointer text-sm font-serif tracking-wide gap-2"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Begin Writing
        </button>

        <div className="mt-10 text-xs text-ink-300 dark:text-ink-600 font-serif space-y-1.5">
          <p>Press <kbd className="px-1.5 py-0.5 bg-ink-100 dark:bg-ink-800 rounded text-[10px] font-sans">N</kbd> for a new leaf</p>
          <p>Press <kbd className="px-1.5 py-0.5 bg-ink-100 dark:bg-ink-800 rounded text-[10px] font-sans">Ctrl+F</kbd> to search your pages</p>
        </div>
      </div>
    </div>
  );
}
