import { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import NoteEditor from './components/NoteEditor';
import EmptyState from './components/EmptyState';
import Toast from './components/Toast';
import { useNotes } from './hooks/useNotes';

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-xl p-6 mx-4 max-w-sm w-full">
        <p className="text-gray-800 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const {
    notes,
    allNotes,
    activeNote,
    activeNoteId,
    searchQuery,
    setActiveNoteId,
    setSearchQuery,
    createNote,
    deleteNote,
    togglePin,
    updateNote,
  } = useNotes();

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [toast, setToast] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'n' || (e.key === 'N' && !e.shiftKey)) {
        e.preventDefault();
        const note = createNote();
        showToast('Note created');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [createNote, showToast]);

  const handleCreateNote = useCallback(() => {
    createNote();
    showToast('Note created', 'success');
  }, [createNote, showToast]);

  const handleDeleteRequest = useCallback((id) => {
    setDeleteConfirmId(id);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteConfirmId) {
      deleteNote(deleteConfirmId);
      showToast('Note deleted', 'error');
      setDeleteConfirmId(null);
    }
  }, [deleteConfirmId, deleteNote, showToast]);

  const handlePinToggle = useCallback(
    (id) => {
      togglePin(id);
      const note = allNotes.find((n) => n.id === id);
      showToast(note?.pinned ? 'Note unpinned' : 'Note pinned', 'info');
    },
    [togglePin, allNotes, showToast]
  );

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
    document.documentElement.classList.toggle('dark');
  }, []);

  const hasNotes = allNotes.length > 0;
  const showEmpty = !hasNotes && !activeNote;

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <Sidebar
        notes={notes}
        activeNoteId={activeNoteId}
        searchQuery={searchQuery}
        noteCount={allNotes.length}
        onSelectNote={setActiveNoteId}
        onSearchChange={setSearchQuery}
        onCreateNote={handleCreateNote}
        onDeleteNote={handleDeleteRequest}
        onPinNote={handlePinToggle}
      />

      {showEmpty ? (
        <EmptyState onCreate={handleCreateNote} />
      ) : (
        <NoteEditor note={activeNote} onUpdate={updateNote} />
      )}

      {/* Dark mode toggle */}
      <button
        onClick={toggleDarkMode}
        className="fixed bottom-6 left-6 z-40 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
        aria-label="Toggle dark mode"
        title="Toggle dark mode"
      >
        {darkMode ? (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </button>

      {/* Keyboard shortcut hint */}
      <div className="fixed bottom-6 left-16 z-40 text-xs text-gray-400 bg-white/80 px-3 py-2 rounded-md shadow-sm">
        Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono">N</kbd> for new note
      </div>

      {/* Delete confirmation dialog */}
      {deleteConfirmId && (
        <ConfirmDialog
          message="Are you sure you want to delete this note? This action cannot be undone."
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteConfirmId(null)}
        />
      )}

      {/* Toast notifications */}
      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
