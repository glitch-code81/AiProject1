import { getNotePreview, formatDate } from '../utils/helpers';

function highlightText(text, query) {
  if (!query || !text) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={i} className="bg-yellow-200 dark:bg-yellow-800 rounded-sm px-0.5 text-inherit">{part}</mark>
      : part
  );
}

export default function NoteItem({ note, isActive, onClick, onDelete, onPin, searchQuery }) {
  const preview = getNotePreview(note);

  return (
    <div
      onClick={() => onClick(note.id)}
      className={`group relative mx-2 my-0.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 note-item-enter
        ${isActive
          ? 'bg-indigo-50 dark:bg-indigo-900/30 shadow-sm'
          : 'hover:bg-gray-50 dark:hover:bg-gray-800/40 active:scale-[0.98]'
        }`}
      style={note.color ? { borderLeft: `3px solid ${note.color}` } : {}}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick(note.id); }}
    >
      {isActive && (
        <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-indigo-500 rounded-full" />
      )}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            {note.pinned && (
              <svg className="w-3 h-3 text-indigo-500 shrink-0" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
              </svg>
            )}
            <h3 className={`text-sm font-medium truncate leading-tight ${
              isActive ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-800'
            }`}>
              {searchQuery ? highlightText(preview, searchQuery) : preview}
            </h3>
          </div>
          <p className="text-[11px] text-gray-400">{formatDate(note.updatedAt)}</p>
        </div>

        <div className={`flex gap-0.5 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-150`}>
          <button
            onClick={(e) => { e.stopPropagation(); onPin(note.id); }}
            className="p-1.5 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors active:scale-90"
            aria-label={note.pinned ? 'Unpin' : 'Pin'}
            title={note.pinned ? 'Unpin' : 'Pin'}
          >
            {note.pinned ? (
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="20" x2="12" y2="4" /><line x1="4" y1="12" x2="20" y2="12" />
              </svg>
            )}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
            className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-600 dark:hover:text-red-400 cursor-pointer transition-colors active:scale-90"
            aria-label="Delete note"
            title="Delete"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
