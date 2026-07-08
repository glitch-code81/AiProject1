import { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import NoteEditor from './components/NoteEditor';
import EmptyState from './components/EmptyState';
import Toast from './components/Toast';
import { useNotes } from './hooks/useNotes';

function ConfirmDialog({ message, onConfirm, onCancel, confirmLabel = 'Delete', danger = true }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/30 dark:bg-ink-950/60 px-4">
      <div className="paper-card shadow-float rounded-xl p-6 max-w-sm w-full animate-fade-in">
        <p className="text-ink-800 dark:text-ink-200 mb-6 text-sm font-serif">{message}</p>
        <div className="flex items-center justify-end gap-3">
          <button onClick={onCancel}
            className="btn-classical inline-flex items-center justify-center h-9 px-4 text-sm text-ink-600 dark:text-ink-400 hover:text-ink-800 dark:hover:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-lg transition-colors cursor-pointer font-serif">
            Cancel
          </button>
          <button onClick={onConfirm}
            className={`btn-classical inline-flex items-center justify-center h-9 px-4 text-sm text-white rounded-lg transition-colors cursor-pointer font-serif ${
              danger
                ? 'bg-rust hover:bg-rust-dark shadow-sm hover:shadow-md'
                : 'bg-sepia hover:bg-sepia-dark shadow-sm hover:shadow-md'
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
        showToast('New leaf created', 'success');
      }
      if (e.key === 'Escape' && sidebarOpen) setSidebarOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [createNote, showToast, sidebarOpen]);

  const handleCreateNote = useCallback(() => {
    createNote();
    setSidebarOpen(false);
    showToast('New leaf created', 'success');
  }, [createNote, showToast]);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteConfirmId) {
      deleteNote(deleteConfirmId);
      showToast('Note discarded', 'error');
      setDeleteConfirmId(null);
    }
  }, [deleteConfirmId, deleteNote, showToast]);

  const handlePinToggle = useCallback((id) => {
    togglePin(id);
    const note = allNotes.find((n) => n.id === id);
    showToast(note?.pinned ? 'Note unmarked' : 'Note marked', 'info');
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
      showToast(`Bound ${count} notes`, 'success');
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
    if (tag) showToast(`Showing: #${tag}`, 'info');
  }, [showToast]);

  const tagFilteredNotes = activeTag
    ? allNotes.filter((n) => n.tags?.includes(activeTag))
    : allNotes;

  const allUniqueTags = [...new Set(allNotes.flatMap((n) => n.tags || []))].sort();

  const hasNotes = allNotes.length > 0;
  const hasActiveNote = activeNoteId !== null && activeNote !== null;

  return (
    <div className="h-screen flex overflow-hidden parchment-bg">
      <Sidebar
        notes={notes}
        activeNoteId={activeNoteId}
        searchQuery={searchQuery}
        noteCount={allNotes.length}
        onSelectNote={setActiveNoteId}
        onSearchChange={setSearchQuery}
        onCreateNote={handleCreateNote}
        onDeleteNote={(id) => setDeleteConfirmId(id)}
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
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-ink-200 dark:border-ink-700 bg-ink-50/80 dark:bg-ink-900/80 backdrop-blur-sm shadow-paper">
          <button
            onClick={() => setSidebarOpen(true)}
            className="inline-flex items-center justify-center w-8 h-8 -ml-1 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-500 dark:text-ink-400 cursor-pointer shrink-0"
            aria-label="Open sidebar">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <h1 className="text-base font-semibold text-ink-800 dark:text-ink-200 font-display leading-none">
            Quill{activeTag ? `: #${activeTag}` : ''}
          </h1>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-ink-400 dark:text-ink-500 font-serif leading-none">{allNotes.length}</span>
            {isSaving && (
              <span className="flex items-center gap-1 text-xs text-gold animate-pulse font-serif">
                <span className="w-1.5 h-1.5 bg-gold rounded-full" />
                Quill moving...
              </span>
            )}
          </div>
        </div>

        {/* Active tag indicator */}
        {activeTag && (
          <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 bg-gold/5 border-b border-gold/20">
            <svg className="w-3.5 h-3.5 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
            </svg>
            <span className="text-xs text-gold-dark dark:text-gold-light font-semibold font-sans">Filtered by:</span>
            <span className="text-xs px-2 py-0.5 bg-gold/10 text-gold-dark dark:text-gold rounded-full font-serif italic">
              #{activeTag}
            </span>
            <button
              onClick={() => setActiveTag(null)}
              className="ml-1 text-xs text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 underline font-serif cursor-pointer"
            >
              Clear
            </button>
            <span className="text-xs text-ink-400 ml-auto font-serif">{tagFilteredNotes.length} notes</span>
          </div>
        )}

        {/* Tag filter bar */}
        {!activeTag && allUniqueTags.length > 0 && (
          <div className="hidden lg:flex items-center gap-1.5 px-4 py-1.5 border-b border-ink-100 dark:border-ink-800 bg-ink-50/30 dark:bg-ink-900/20 overflow-x-auto">
            <svg className="w-3.5 h-3.5 text-ink-300 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
            {allUniqueTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagSelect(tag)}
                className="text-[11px] px-2 py-0.5 bg-ink-100 dark:bg-ink-800 text-ink-500 dark:text-ink-400 rounded-full hover:bg-gold/10 hover:text-gold-dark dark:hover:text-gold transition-colors cursor-pointer shrink-0 font-serif"
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
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center animate-fade-in">
              <svg className="w-20 h-20 mx-auto mb-4 text-ink-200 dark:text-ink-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <p className="text-ink-400 dark:text-ink-500 text-sm font-serif italic">Select a leaf to read, or quill a new one</p>
            </div>
          </div>
        ) : (
          <NoteEditor key={activeNote.id} note={activeNote} onUpdate={updateNote} isSaving={isSaving} />
        )}
      </div>

      <input ref={importRef} type="file" accept=".json" onChange={handleImportFile}
        className="hidden" aria-hidden="true" />

      {deleteConfirmId && (
        <ConfirmDialog message="Discard this leaf? The words will be lost to the wind."
          onConfirm={handleDeleteConfirm} onCancel={() => setDeleteConfirmId(null)} />
      )}
      {confirmClear && (
        <ConfirmDialog message="Tear out every page? This cannot be undone."
          confirmLabel="Burn All" danger={true}
          onConfirm={handleClearAll} onCancel={() => setConfirmClear(false)} />
      )}
      {toast && (
        <Toast key={toast.id} message={toast.message} type={toast.type}
          onClose={() => setToast(null)} />
      )}
    </div>
  );
}
