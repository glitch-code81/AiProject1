import { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import NoteEditor from './components/NoteEditor';
import EmptyState from './components/EmptyState';
import Toast from './components/Toast';
import { useNotes } from './hooks/useNotes';

function ConfirmDialog({ message, onConfirm, onCancel, confirmLabel = 'Delete', danger = true }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-black/50 px-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 max-w-sm w-full animate-fade-in">
        <p className="text-gray-800 dark:text-gray-200 mb-6 text-sm">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer">
            Cancel
          </button>
          <button onClick={onConfirm}
            className={`px-4 py-2 text-sm text-white rounded-lg transition-colors cursor-pointer ${
              danger ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'
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
    notes, allNotes, activeNote, activeNoteId, searchQuery, isSaving,
    sortNewest, setSortNewest,
    setActiveNoteId, setSearchQuery, createNote, deleteNote, togglePin, updateNote,
    exportNotes, importNotes, clearAllNotes,
  } = useNotes();

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [toast, setToast] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    try { return localStorage.getItem('notes-app-dark') === 'true'; } catch { return false; }
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTag, setActiveTag] = useState(null);
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
        showToast('Note created', 'success');
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

  const handleTagSelect = useCallback((tag) => {
    setActiveTag((prev) => prev === tag ? null : tag);
    if (tag) showToast(`Filtered by: ${tag}`, 'info');
  }, [showToast]);

  // Filter notes by active tag
  const tagFilteredNotes = activeTag
    ? allNotes.filter((n) => n.tags?.includes(activeTag))
    : allNotes;

  // Collect all unique tags
  const allUniqueTags = [...new Set(allNotes.flatMap((n) => n.tags || []))].sort();

  const hasNotes = allNotes.length > 0;
  const hasActiveNote = activeNoteId !== null && activeNote !== null;

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50 dark:bg-slate-900">
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
        onExport={handleExport}
        onImport={handleImportClick}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((prev) => !prev)}
        sortNewest={sortNewest}
        onSortToggle={() => setSortNewest((prev) => !prev)}
        activeTag={activeTag}
        onTagSelect={handleTagSelect}
        allTags={allUniqueTags}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-2.5 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <button onClick={() => setSidebarOpen(true)}
            className="p-1.5 -ml-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400 cursor-pointer"
            aria-label="Open sidebar">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <h1 className="text-base font-semibold text-gray-800 dark:text-gray-100">
            Notes{activeTag ? `: #${activeTag}` : ''}
          </h1>
          <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">{allNotes.length}</span>
          {isSaving && <span className="text-xs text-indigo-500 dark:text-indigo-400 animate-pulse">Saving...</span>}
        </div>

        {/* Active tag indicator bar */}
        {activeTag && (
          <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 bg-indigo-50/50 dark:bg-indigo-950/30 border-b border-indigo-100 dark:border-indigo-900/50">
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Filtered by tag:</span>
            <span className="text-xs px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full">
              #{activeTag}
            </span>
            <button
              onClick={() => setActiveTag(null)}
              className="ml-1 text-xs text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 underline cursor-pointer"
            >
              Clear filter
            </button>
            <span className="text-xs text-gray-400 ml-auto">{tagFilteredNotes.length} notes</span>
          </div>
        )}

        {/* Tag filter bar (desktop) — only show when no active tag */}
        {!activeTag && allUniqueTags.length > 0 && (
          <div className="hidden lg:flex items-center gap-1.5 px-4 py-1.5 border-b border-gray-100 dark:border-slate-700/50 bg-gray-50/50 dark:bg-slate-800/30 overflow-x-auto">
            <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
            {allUniqueTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagSelect(tag)}
                className="text-[11px] px-2 py-0.5 bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/40 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors cursor-pointer shrink-0"
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Main content */}
        {!hasNotes && !hasActiveNote ? (
          <EmptyState onCreate={handleCreateNote} />
        ) : !hasActiveNote ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <p className="text-sm">Select a note or create a new one</p>
            </div>
          </div>
        ) : (
          <NoteEditor note={activeNote} onUpdate={updateNote} isSaving={isSaving} />
        )}
      </div>

      <input ref={importRef} type="file" accept=".json" onChange={handleImportFile}
        className="hidden" aria-hidden="true" />

      {/* Dark mode toggle */}
      <button onClick={() => setDarkMode((prev) => !prev)}
        className="fixed bottom-6 left-6 z-40 w-9 h-9 bg-white dark:bg-slate-700 rounded-full shadow-md flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer"
        aria-label="Toggle dark mode" title="Toggle dark mode">
        {darkMode ? (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="20.78" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
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
