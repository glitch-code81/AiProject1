import SearchBar from './SearchBar';
import NoteItem from './NoteItem';

export default function Sidebar({
  notes, activeNoteId, searchQuery, noteCount,
  allTags, activeTag,
  onSelectNote, onSearchChange, onTagFilter, onCreateNote, onDeleteNote, onPinNote,
  onExport, onImport, isOpen, onToggle, sortNewest, onSortToggle,
}) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 lg:hidden content-fade-in" onClick={onToggle} />
      )}
      <aside
        className={`w-72 shrink-0 bg-white border-r border-gray-200 flex flex-col h-full sidebar-shadow
          transition-transform duration-200 ease-in-out
          fixed lg:static inset-y-0 left-0 z-30
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Sidebar header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <button onClick={onToggle}
                className="p-1 -ml-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 lg:hidden cursor-pointer active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                aria-label="Close sidebar">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              <h1 className="text-lg font-semibold text-gray-800 tracking-tight">Notes</h1>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={onSortToggle}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-colors cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                aria-label="Toggle sort order" title={sortNewest ? 'Sort: newest first' : 'Sort: oldest first'}>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round">
                  {sortNewest ? (
                    <><path d="M12 5v14M8 9l4-4 4 4"/></>
                  ) : (
                    <><path d="M12 5v14M8 15l4 4 4-4"/></>
                  )}
                </svg>
              </button>
              <span className="text-xs text-gray-400 font-medium tabular-nums min-w-[1.5rem] text-center">{noteCount}</span>
            </div>
          </div>
          <SearchBar value={searchQuery} onChange={onSearchChange} />
        </div>

        {/* New Note button */}
        <button onClick={onCreateNote}
          className="mx-4 mt-3 mb-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-600 transition-all text-sm font-medium flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-indigo-200 hover:shadow-md hover:shadow-indigo-200 hover:-translate-y-0.5 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Note
        </button>

        {/* Import/Export buttons */}
        <div className="flex gap-1.5 mx-4 mb-2 mt-2">
          <button onClick={onExport}
            className="flex-1 px-2 py-1.5 text-xs font-medium text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            title="Export notes as JSON">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export
          </button>
          <button onClick={onImport}
            className="flex-1 px-2 py-1.5 text-xs font-medium text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            title="Import notes from JSON">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Import
          </button>
        </div>

        {/* Tag filter chips */}
        {allTags.length > 0 && (
          <div className="mx-4 mb-2 flex flex-wrap gap-1">
            {activeTag && (
              <button onClick={() => onTagFilter(null)}
                className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300 transition-colors cursor-pointer active:scale-95">
                Clear filter
              </button>
            )}
            {allTags.map((tag) => (
              <button key={tag}
                onClick={() => onTagFilter(tag === activeTag ? null : tag)}
                className={`px-2 py-0.5 text-[10px] font-medium rounded-full transition-all cursor-pointer active:scale-95 ${
                  tag === activeTag
                    ? 'bg-indigo-600 text-white'
                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* Note list */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {notes.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <p className="text-sm text-gray-400 mt-2">
                {searchQuery ? 'No notes match your search' : 'No notes yet'}
              </p>
              {searchQuery && (
                <p className="text-xs text-gray-300 mt-1">Try a different keyword</p>
              )}
            </div>
          ) : (
            <div className="py-1">
              {notes.map((note) => (
                <NoteItem
                  key={note.id}
                  note={note}
                  isActive={note.id === activeNoteId}
                  onClick={(id) => { onSelectNote(id); onToggle(); }}
                  onDelete={onDeleteNote}
                  onPin={onPinNote}
                  searchQuery={searchQuery}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer with keyboard shortcuts */}
        <div className="p-3 border-t border-gray-100 text-center">
          <div className="flex items-center justify-center gap-3 text-[10px] text-gray-400 tracking-wider uppercase font-medium">
            <span><kbd className="px-1 py-0.5 rounded bg-gray-100 text-gray-500 font-mono text-[9px]">N</kbd> New</span>
            <span><kbd className="px-1 py-0.5 rounded bg-gray-100 text-gray-500 font-mono text-[9px]">Esc</kbd> Close</span>
            <span><kbd className="px-1 py-0.5 rounded bg-gray-100 text-gray-500 font-mono text-[9px]">⌘F</kbd> Search</span>
          </div>
        </div>
      </aside>
    </>
  );
}
