export default function EmptyState({ onCreate }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 py-12 animate-fade-in">
      <div className="mb-6 text-6xl opacity-20 empty-state-icon">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-gray-600">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No notes yet</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm text-sm">
        Create your first note to get started. Your notes are saved automatically.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCreate}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all hover:shadow-md active:scale-[0.98] font-medium cursor-pointer text-sm"
        >
          + Create Note
        </button>
      </div>
      <div className="mt-10 text-xs text-gray-300 dark:text-gray-600 space-y-2">
        <p>💡 <span className="font-mono">N</span> to create · <span className="font-mono">Ctrl+F</span> to search</p>
        <p>Supports <span className="font-mono">**bold**</span>, <span className="font-mono">*italic*</span>, <span className="font-mono">`code`</span>, <span className="font-mono"># headings</span></p>
      </div>
    </div>
  );
}
