import { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import NoteEditor from './components/NoteEditor';
import EmptyState from './components/EmptyState';
import Toast from './components/Toast';
import { useNotes } from './hooks/useNotes';

function ConfirmDialog({ message, onConfirm, onCancel, confirmLabel = 'Delete', danger = true }) {
  const cancelRef = useRef(null);

  useEffect(() => {
    cancelRef.current?.focus();
    const handler = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 content-fade-in">
      <div className="bg-white rounded-2xl shadow-xl shadow-black/10 p-6 max-w-sm w-full border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            danger ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'
          }`}>
            {danger ? (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            )}
          </div>
          <p className="text-gray-800 text-sm leading-relaxed">{message}</p>
        </div>
        <div className="flex justify-end gap-2.5">
          <button ref={cancelRef} onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2">
            Cancel
          </button>
          <button onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-xl transition-all cursor-pointer active:scale-95 ${
              danger
                ? 'bg-red-600 hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2'
                : 'bg-indigo-600 hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2'
            }`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const {
    notes, allNotes, showArchived, activeNote, activeNoteId, searchQuery, isSaving,
    sortNewest, setSortNewest,
    setActiveNoteId, setSearchQuery, setShowArchived, createNote, deleteNote, togglePin, updateNote,
    archiveNote, restoreNote, clearArchived,
    exportNotes, importNotes, clearAllNotes,
  } = useNotes();

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [toast, setToast] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    try { return localStorage.getItem('notes-app-dark') === 'true'; } catch { return false; }
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const importRef = useRef(null);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    try { localStorage.setItem('notes-app-dark', darkMode); } catch { /* */ }
  }, [darkMode]);

  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'n' && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        createNote();
        setSidebarOpen(false);
        showToast('Note created');
      }
      if (e.key === 'Escape' && sidebarOpen) setSidebarOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [createNote, showToast, sidebarOpen]);

  const handleCreateNote = useCallback(() => {
    createNote();
    setSidebarOpen(false);
    showToast('Note created', 'success');
  }, [createNote, showToast]);

  const handleDeleteRequest = useCallback((id) => setDeleteConfirmId(id), []);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteConfirmId) {
      deleteNote(deleteConfirmId);
      showToast('Note deleted', 'error');
      setDeleteConfirmId(null);
    }
  }, [deleteConfirmId, deleteNote, showToast]);

  const handlePinToggle = useCallback((id) => {
    togglePin(id);
    const note = allNotes.find((n) => n.id === id);
    showToast(note?.pinned ? 'Note unpinned' : 'Note pinned', 'info');
  }, [togglePin, allNotes, showToast]);

  const handleExport = useCallback(() => {
    exportNotes();
    showToast('Notes exported', 'success');
  }, [exportNotes, showToast]);

  const handleImportClick = useCallback(() => importRef.current?.click(), []);

  const handleImportFile = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const count = await importNotes(file);
      showToast(`Imported ${count} notes`, 'success');
    } catch (err) {
      showToast(`Import failed: ${err.message}`, 'error');
    }
    e.target.value = '';
  }, [importNotes, showToast]);

  const handleClearAll = useCallback(() => {
    clearAllNotes();
    showToast('All notes cleared', 'info');
    setConfirmClear(false);
  }, [clearAllNotes, showToast]);

  const hasNotes = allNotes.length > 0;

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <Sidebar
        notes={notes}
        activeNoteId={activeNoteId}
        searchQuery={searchQuery}
        noteCount={allNotes.length}
        showArchived={showArchived}
        onSelectNote={setActiveNoteId}
        onSearchChange={setSearchQuery}
        onToggleArchiveView={() => setShowArchived((prev) => !prev)}
        onCreateNote={handleCreateNote}
        onDeleteNote={handleDeleteRequest}
        onArchiveNote={archiveNote}
        onRestoreNote={restoreNote}
        onPinNote={handlePinToggle}
        onExport={handleExport}
        onImport={handleImportClick}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((prev) => !prev)}
        sortNewest={sortNewest}
        onSortToggle={() => setSortNewest((prev) => !prev)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-2.5 border-b border-gray-200 bg-white/80 backdrop-blur-md">
          <button onClick={() => setSidebarOpen(true)}
            className="p-1.5 -ml-1 rounded-lg hover:bg-gray-100 text-gray-500 active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            aria-label="Open sidebar">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <h1 className="text-base font-semibold text-gray-800 tracking-tight">Notes</h1>
          <div className="flex items-center gap-2 ml-auto">
            {isSaving && (
              <span className="text-[11px] text-indigo-500 font-medium flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                Saving
              </span>
            )}
            <span className="text-xs text-gray-400 font-medium tabular-nums">{allNotes.length}</span>
          </div>
        </div>

        {!hasNotes && !activeNote ? (
          <EmptyState onCreate={handleCreateNote} />
        ) : (
          <NoteEditor note={activeNote} onUpdate={updateNote} isSaving={isSaving} />
        )}
      </div>

      <input ref={importRef} type="file" accept=".json" onChange={handleImportFile}
        className="hidden" aria-hidden="true" />

      {/* Dark mode toggle */}
      <button onClick={() => setDarkMode((prev) => !prev)}
        className={`fixed bottom-6 left-6 z-40 w-10 h-10 rounded-xl shadow-lg shadow-black/10 flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 ${
          darkMode
            ? 'bg-indigo-600 text-yellow-300 hover:bg-indigo-500'
            : 'bg-white text-gray-500 hover:text-indigo-600 hover:shadow-xl hover:-translate-y-0.5'
        }`}
        aria-label="Toggle dark mode" title="Toggle dark mode">
        {darkMode ? (
          <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="20.78" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
          <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </button>

      {deleteConfirmId && (
        <ConfirmDialog message="Are you sure you want to delete this note? This cannot be undone."
          onConfirm={handleDeleteConfirm} onCancel={() => setDeleteConfirmId(null)} />
      )}
      {confirmClear && (
        <ConfirmDialog message="Delete all notes? This cannot be undone."
          confirmLabel="Clear All" danger={true}
          onConfirm={handleClearAll} onCancel={() => setConfirmClear(false)} />
      )}
      {toast && (
        <Toast key={toast.id} message={toast.message} type={toast.type}
          onClose={() => setToast(null)} />
      )}
    </div>
  );
}
