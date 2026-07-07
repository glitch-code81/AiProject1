import SearchBar from './SearchBar';
import NoteItem from './NoteItem';

export default function Sidebar({
  notes,
  activeNoteId,
  searchQuery,
  noteCount,
  onSelectNote,
  onSearchChange,
  onCreateNote,
  onDeleteNote,
  onPinNote,
  isOpen,
  onToggle,
}) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`
          w-72 shrink-0 bg-white border-r border-gray-200 flex flex-col h-full
          transition-transform duration-200 ease-in-out
          fixed lg:static inset-y-0 left-0 z-30
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={onToggle}
                className="p-1 -ml-1 rounded-lg hover:bg-gray-100 text-gray-500 lg:hidden cursor-pointer"
                aria-label="Close sidebar"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              <h1 className="text-lg font-semibold text-gray-800">Notes</h1>
            </div>
            <span className="text-xs text-gray-400">{noteCount}</span>
          </div>
          <SearchBar value={searchQuery} onChange={onSearchChange} />
        </div>

        <button
          onClick={onCreateNote}
          className="mx-4 mt-3 mb-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Note
        </button>

        <div className="flex-1 overflow-y-auto">
          {notes.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-400">
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
              />
            ))
          )}
        </div>
      </aside>
    </>
  );
}
