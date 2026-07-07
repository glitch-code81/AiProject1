import { getNotePreview, formatDate } from '../utils/helpers';

export default function NoteItem({ note, isActive, onClick, onDelete, onPin }) {
  return (
    <div
      onClick={() => onClick(note.id)}
      className={`group relative px-4 py-3 border-b border-gray-100 cursor-pointer transition-colors
        ${isActive ? 'bg-indigo-50 border-l-2 border-l-indigo-500' : 'hover:bg-gray-50 border-l-2 border-l-transparent'}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {note.pinned && (
              <svg className="w-3.5 h-3.5 text-indigo-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
              </svg>
            )}
            <h3 className="text-sm font-medium text-gray-800 truncate">
              {getNotePreview(note)}
            </h3>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{formatDate(note.updatedAt)}</p>
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onPin(note.id); }}
            className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-indigo-600 cursor-pointer"
            aria-label={note.pinned ? 'Unpin' : 'Pin'}
            title={note.pinned ? 'Unpin' : 'Pin'}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20" />
              <path d="M2 12h20" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
            className="p-1 rounded hover:bg-red-100 text-gray-400 hover:text-red-600 cursor-pointer"
            aria-label="Delete note"
            title="Delete"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
