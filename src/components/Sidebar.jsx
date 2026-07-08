import SearchBar from './SearchBar';
import NoteItem from './NoteItem';

function TagFilterBar({ allTags, activeTag, onTagSelect }) {
  if (!allTags || allTags.length === 0) return null;

  return (
    <div className="px-4 pb-2">
      <div className="ornamental-divider mb-2">
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        </svg>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => onTagSelect(null)}
          className={`inline-flex items-center h-[26px] text-[11px] px-2.5 rounded-full transition-all cursor-pointer font-serif ${
            !activeTag
              ? 'bg-gold/15 text-gold-dark dark:text-gold border border-gold/30 shadow-sm'
              : 'text-ink-400 dark:text-ink-500 hover:text-ink-600 dark:hover:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 border border-transparent'
          }`}
        >
          All
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => onTagSelect(tag)}
            className={`inline-flex items-center h-[26px] text-[11px] px-2.5 rounded-full transition-all cursor-pointer font-serif ${
              activeTag === tag
                ? 'bg-gold/15 text-gold-dark dark:text-gold border border-gold/30 shadow-sm'
                : 'text-ink-400 dark:text-ink-500 hover:text-ink-600 dark:hover:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 border border-transparent'
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
  activeTag, onTagSelect, allTags, darkMode, setDarkMode,
}) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-ink-900/40 z-20 lg:hidden" onClick={onToggle} />
      )}
      <aside
        className={`w-72 shrink-0 paper-card book-spine flex flex-col h-full
          transition-transform duration-200 ease-in-out
          fixed lg:static inset-y-0 left-0 z-30
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Sidebar header — aligned items */}
        <div className="p-4 border-b border-ink-200 dark:border-ink-700">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <button onClick={onToggle}
                className="inline-flex items-center justify-center w-7 h-7 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-400 dark:text-ink-500 lg:hidden cursor-pointer shrink-0"
                aria-label="Close sidebar">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gold shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                <h1 className="text-lg font-semibold text-ink-800 dark:text-ink-200 font-display tracking-wide leading-none">Quill</h1>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={onSortToggle}
                className="inline-flex items-center justify-center w-7 h-7 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-400 dark:text-ink-500 hover:text-gold-dark dark:hover:text-gold transition-colors cursor-pointer"
                aria-label="Toggle sort order" title={sortNewest ? 'Sort: newest first' : 'Sort: oldest first'}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round">
                  {sortNewest ? (
                    <><path d="M12 5v14M8 9l4-4 4 4"/></>
                  ) : (
                    <><path d="M12 5v14M8 15l4 4 4-4"/></>
                  )}
                </svg>
              </button>
              <span className="text-xs text-ink-400 dark:text-ink-500 font-serif w-5 text-center leading-none">{noteCount}</span>
            </div>
          </div>
          <SearchBar value={searchQuery} onChange={onSearchChange} />
        </div>

        {/* New Leaf button — properly centered with shadow */}
        <div className="px-4 pt-3 pb-1">
          <button onClick={onCreateNote}
            className="btn-classical w-full h-10 bg-gradient-to-r from-sepia to-sepia-dark text-parchment rounded-lg hover:from-sepia-dark hover:to-sepia shadow-stack hover:shadow-lift active:shadow-stack transition-all text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer font-serif tracking-wide pulse-glow"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Leaf
          </button>
        </div>

        {/* Export / Import buttons — same height, aligned */}
        <div className="flex gap-2 mx-4 mb-2 mt-1">
          <button onClick={onExport}
            className="btn-classical flex-1 inline-flex items-center justify-center gap-1.5 h-8 text-xs text-ink-500 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-md transition-colors cursor-pointer font-serif border border-transparent hover:border-ink-200 dark:hover:border-ink-700"
            title="Export notes as JSON">
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export
          </button>
          <button onClick={onImport}
            className="btn-classical flex-1 inline-flex items-center justify-center gap-1.5 h-8 text-xs text-ink-500 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-md transition-colors cursor-pointer font-serif border border-transparent hover:border-ink-200 dark:hover:border-ink-700"
            title="Import notes from JSON">
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Import
          </button>
        </div>

        {/* Tag filter */}
        <TagFilterBar allTags={allTags} activeTag={activeTag} onTagSelect={onTagSelect} />

        {/* Scrollable note list */}
        <div className="flex-1 overflow-y-auto">
          {notes.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="w-10 h-10 mx-auto mb-3 text-ink-200 dark:text-ink-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              <p className="text-sm text-ink-400 dark:text-ink-500 font-serif italic">
                {searchQuery ? 'No leaves match your search' : 'The pages are blank'}
              </p>
            </div>
          ) : (
            <div className="paper-texture">
              {notes.map((note, idx) => (
                <NoteItem
                  key={note.id}
                  note={note}
                  isActive={note.id === activeNoteId}
                  onClick={(id) => { onSelectNote(id); onToggle(); }}
                  onDelete={onDeleteNote}
                  onPin={onPinNote}
                  searchQuery={searchQuery}
                  onTagClick={onTagSelect}
                  index={idx}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer — aligned items properly */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-ink-200 dark:border-ink-700">
          <span className="text-[10px] text-ink-300 dark:text-ink-600 tracking-widest uppercase font-sans leading-none">
            N · Esc · ⌘F
          </span>
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className="inline-flex items-center justify-center w-7 h-7 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-400 dark:text-ink-500 hover:text-gold-dark dark:hover:text-gold transition-colors cursor-pointer"
            aria-label="Toggle dark mode"
            title={darkMode ? 'Switch to parchment' : 'Switch to dark'}
          >
            {darkMode ? (
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
