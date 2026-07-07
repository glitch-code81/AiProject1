export default function EmptyState({ onCreate }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8">
      <div className="mb-6 text-6xl opacity-20">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">No notes yet</h2>
      <p className="text-gray-500 mb-6 max-w-sm">
        Create your first note to get started. Your notes are saved automatically.
      </p>
      <button
        onClick={onCreate}
        className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium cursor-pointer"
      >
        + Create Note
      </button>
    </div>
  );
}
