export default function EmptyState({ onCreate }) {
  return (
    <div className="flex-1 flex items-center justify-center parchment-bg">
      <div className="paper-card shadow-float rounded-xl p-10 sm:p-14 max-w-md mx-4 text-center animate-fade-in relative overflow-hidden">
        {/* Decorative corner flourishes */}
        <svg className="absolute top-3 left-3 w-10 h-10 text-gold/10 pointer-events-none" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="0.8">
          <path d="M2 38 V30 Q2 20 10 12 Q18 4 28 4 H38" fill="none" />
          <path d="M6 36 V30 Q6 22 13 15 Q20 8 28 8 H34" fill="none" opacity="0.5" />
        </svg>
        <svg className="absolute top-3 right-3 w-10 h-10 text-gold/10 pointer-events-none scale-x-[-1]" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="0.8">
          <path d="M2 38 V30 Q2 20 10 12 Q18 4 28 4 H38" fill="none" />
          <path d="M6 36 V30 Q6 22 13 15 Q20 8 28 8 H34" fill="none" opacity="0.5" />
        </svg>
        <svg className="absolute bottom-3 left-3 w-10 h-10 text-gold/10 pointer-events-none scale-y-[-1]" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="0.8">
          <path d="M2 38 V30 Q2 20 10 12 Q18 4 28 4 H38" fill="none" />
          <path d="M6 36 V30 Q6 22 13 15 Q20 8 28 8 H34" fill="none" opacity="0.5" />
        </svg>
        <svg className="absolute bottom-3 right-3 w-10 h-10 text-gold/10 pointer-events-none scale-[-1]" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="0.8">
          <path d="M2 38 V30 Q2 20 10 12 Q18 4 28 4 H38" fill="none" />
          <path d="M6 36 V30 Q6 22 13 15 Q20 8 28 8 H34" fill="none" opacity="0.5" />
        </svg>

        {/* Quill icon */}
        <div className="mb-6 text-ink-200 dark:text-ink-700 empty-state-icon">
          <svg width="90" height="90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            <path d="M15 5l4 4" opacity="0.3" />
          </svg>
        </div>

        {/* Ornamental divider */}
        <div className="ornamental-divider mb-5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-gold/30">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>

        <h2 className="text-2xl font-semibold text-ink-800 dark:text-ink-100 mb-3 font-display tracking-wide">
          ABlankPage
        </h2>
        <p className="text-ink-400 dark:text-ink-500 mb-8 text-sm font-serif leading-relaxed max-w-xs mx-auto">
          The first word is always the hardest. Let your thoughts flow — every scratch of the quill is saved.
        </p>

        <button
          onClick={onCreate}
          className="btn-classical inline-flex items-center justify-center h-11 px-8 bg-gradient-to-r from-sepia to-sepia-dark text-parchment rounded-lg hover:from-sepia-dark hover:to-sepia shadow-stack hover:shadow-lift active:shadow-stack transition-all font-semibold cursor-pointer text-sm font-serif tracking-wide gap-2"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          BeginWriting
        </button>

        {/* Decorative bottom ornament */}
        <div className="ornamental-divider mt-10">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-gold/20">
            <circle cx="12" cy="12" r="1" fill="currentColor" />
          </svg>
        </div>

        <div className="mt-6 text-xs text-ink-300 dark:text-ink-600 font-serif space-y-1.5">
          <p>Press <kbd className="px-1.5 py-0.5 bg-ink-100 dark:bg-ink-800 rounded text-[10px] font-sans border border-ink-200 dark:border-ink-700">N</kbd> for a new leaf</p>
          <p>Press <kbd className="px-1.5 py-0.5 bg-ink-100 dark:bg-ink-800 rounded text-[10px] font-sans border border-ink-200 dark:border-ink-700">⌘F</kbd> to search your pages</p>
        </div>
      </div>
    </div>
  );
}
