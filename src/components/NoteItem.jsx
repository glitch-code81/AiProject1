import { getNotePreview, formatDate } from '../utils/helpers';
import { getColorClasses } from './ColorPicker';

function highlightText(text, query) {
  if (!query || !text) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={i} className="bg-gold/20 text-ink-800 dark:text-ink-200 rounded-sm px-0.5">{part}</mark>
      : part
  );
}

export default function NoteItem({ note, isActive, onClick, onDelete, onPin, searchQuery, onTagClick, index = 0 }) {
  const preview = getNotePreview(note);
  const colors = getColorClasses(note.color);

  return (
    <div
      onClick={() => onClick(note.id)}
      className={`group relative px-4 py-3 cursor-pointer transition-all duration-150 note-curl-enter
        ${isActive
          ? 'note-classical-active'
          : 'hover:bg-ink-50/50 dark:hover:bg-ink-800/30 border-l-2 border-l-transparent'}`}
      style={{ animationDelay: `${index * 30}ms` }}
    >
      {/* Color accent gauge */}
      {note.color && note.color !== 'default' && (
        <div className={`absolute left-0 top-2 bottom-2 w-1 rounded-full ${note.color === 'red' ? 'bg-rust' : note.color === 'orange' ? 'bg-orange-400' : note.color === 'yellow' ? 'bg-gold' : note.color === 'green' ? 'bg-forest' : note.color === 'blue' ? 'bg-blue-400' : note.color === 'purple' ? 'bg-purple-400' : note.color === 'pink' ? 'bg-wine-light' : ''}`} />
      )}

      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            {note.pinned && (
              <svg className="w-3 h-3 text-gold shrink-0" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
              </svg>
            )}
            <h3 className="text-sm font-semibold text-ink-800 dark:text-ink-200 truncate leading-tight font-serif">
              {searchQuery ? highlightText(preview, searchQuery) : preview}
            </h3>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-[11px] text-ink-400 dark:text-ink-500 font-serif">{formatDate(note.updatedAt)}</p>
            {note.tags && note.tags.length > 0 && (
              <div className="flex gap-1">
                {note.tags.slice(0, 2).map((tag) => (
                  <button
                    key={tag}
                    onClick={(e) => { e.stopPropagation(); onTagClick?.(tag); }}
                    className="text-[10px] px-1.5 py-0.5 bg-ink-100 dark:bg-ink-800 text-ink-500 dark:text-ink-400 rounded-full hover:bg-gold/10 hover:text-gold-dark dark:hover:text-gold transition-colors cursor-pointer font-serif"
                  >
                    {tag}
                  </button>
                ))}
                {note.tags.length > 2 && (
                  <span className="text-[10px] text-ink-400 dark:text-ink-500 font-serif">+{note.tags.length - 2}</span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onPin(note.id); }}
            className="p-1.5 rounded hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-400 hover:text-gold-dark dark:hover:text-gold cursor-pointer"
            aria-label={note.pinned ? 'Unpin' : 'Pin'}
            title={note.pinned ? 'Unmark' : 'Mark'}
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
            className="p-1.5 rounded hover:bg-rust/10 text-ink-400 hover:text-rust cursor-pointer"
            aria-label="Delete note"
            title="Discard"
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
