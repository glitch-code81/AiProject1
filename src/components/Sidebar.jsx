import SearchBar from './SearchBar';
import NoteItem from './NoteItem';

function TagFilter({ allTags, activeTag, onTagSelect }) {
  if (!allTags || allTags.length === 0) return null;

  return (
    <div className="px-4 pb-2">
      <div className="flex flex-wrap gap-1">
        <button
          onClick={() => onTagSelect(null)}
          className={`text-[11px] px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
            !activeTag
              ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-medium'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
          }`}
        >
          All
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => onTagSelect(tag)}
            className={`text-[11px] px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
              activeTag === tag
                ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-medium'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Sidebar({
  notes, activeNoteId, searchQuery, noteCount,
  onSelectNote, onSearchChange, onCreateNote, onDeleteNote, onPinNote,
  onExport, onImport, isOpen, onToggle, sortNewest, onSortToggle,
  activeTag, onTagSelect, allTags,
}) {

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 z-20 lg:hidden" onClick={onToggle} />
      )}
      <aside
        className={`w-72 shrink-0 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex flex-col h-full
          transition-transform duration-200 ease-in-out
          fixed lg:static inset-y-0 left-0 z-30
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <button onClick={onToggle}
                className="p-1 -ml-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400 lg:hidden cursor-pointer"
                aria-label="Close sidebar">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Notes</h1>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={onSortToggle}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
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
              <span className="text-xs text-gray-400 dark:text-gray-500">{noteCount}</span>
            </div>
          </div>
          <SearchBar value={searchQuery} onChange={onSearchChange} />
        </div>

        <button onClick={onCreateNote}
          className="mx-4 mt-3 mb-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center justify-center gap-2 cursor-pointer">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Note
        </button>

        <div className="flex gap-1 mx-4 mb-2">
          <button onClick={onExport}
            className="flex-1 px-2 py-1.5 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md transition-colors flex items-center justify-center gap-1 cursor-pointer"
            title="Export notes as JSON">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export
          </button>
          <button onClick={onImport}
            className="flex-1 px-2 py-1.5 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md transition-colors flex items-center justify-center gap-1 cursor-pointer"
            title="Import notes from JSON">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Import
          </button>
        </div>

        {/* Tag filter */}
        <TagFilter allTags={allTags} activeTag={activeTag} onTagSelect={onTagSelect} />

        <div className="flex-1 overflow-y-auto">
          {notes.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-400 dark:text-gray-500">
              {searchQuery ? 'No notes match your search' : 'No notes yet'}
            </div>
          ) : (
            notes.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                isActive={note.id === activeNoteId}
                onClick={(id) => { onSelectNote(id); onToggle(); }}
                onDelete={onDeleteNote}
                onPin={onPinNote}
                searchQuery={searchQuery}
                onTagClick={onTagSelect}
              />
            ))
          )}
        </div>

        <div className="p-3 border-t border-gray-100 dark:border-slate-700 text-center">
          <span className="text-[10px] text-gray-300 dark:text-gray-600 tracking-wider uppercase">
            N + New · Esc · Ctrl+F Search
          </span>
        </div>
      </aside>
    </>
  );
}
