export default function EmptyState({ onCreate }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 py-12 content-fade-in">
      <div className="mb-8 text-gray-300 dark:text-gray-600 empty-state-icon">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2 tracking-tight">No notes yet</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm text-sm leading-relaxed">
        Create your first note to get started. Your notes are saved automatically as you type.
      </p>
      <button
        onClick={onCreate}
        className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-600 transition-all font-medium cursor-pointer text-sm shadow-sm shadow-indigo-200 hover:shadow-md hover:shadow-indigo-200 hover:-translate-y-0.5 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
      >
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Create Note
        </span>
      </button>
    </div>
  );
}
