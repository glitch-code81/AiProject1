import { useState, useCallback, useRef, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { generateId } from '../utils/helpers';

export function useNotes() {
  const [notes, setNotes] = useLocalStorage('notes-app-notes', []);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const saveTimer = useRef(null);
  const [sortNewest, setSortNewest] = useState(true);

  const filtered = notes
    .filter((n) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        (n.title || '').toLowerCase().includes(q) ||
        (n.content || '').toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      const diff = new Date(b.updatedAt) - new Date(a.updatedAt);
      return sortNewest ? diff : -diff;
    });

  const createNote = useCallback(() => {
    const now = new Date().toISOString();
    const note = {
      id: generateId(),
      title: '',
      content: '',
      pinned: false,
      color: null,
      createdAt: now,
      updatedAt: now,
    };
    setNotes((prev) => [note, ...prev]);
    setActiveNoteId(note.id);
    return note;
  }, [setNotes]);

  const deleteNote = useCallback(
    (id) => {
      setNotes((prev) => prev.filter((n) => n.id !== id));
      setActiveNoteId((prev) => (prev === id ? null : prev));
    },
    [setNotes]
  );

  const togglePin = useCallback(
    (id) => {
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
      );
    },
    [setNotes]
  );

  const setNoteColor = useCallback(
    (id, color) => {
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, color, updatedAt: new Date().toISOString() } : n))
      );
    },
    [setNotes]
  );

  const updateNote = useCallback(
    (id, updates) => {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
        )
      );
      setIsSaving(true);
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => setIsSaving(false), 800);
    },
    [setNotes]
  );

  useEffect(() => {
    return () => clearTimeout(saveTimer.current);
  }, []);

  const exportNotes = useCallback(() => {
    const blob = new Blob([JSON.stringify(notes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [notes]);

  const importNotes = useCallback(
    async (file) => {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!Array.isArray(data)) throw new Error('Invalid format: expected an array of notes');
      const existingIds = new Set(notes.map((n) => n.id));
      const imported = data
        .filter((n) => n.id && n.title !== undefined && !existingIds.has(n.id))
        .map((n) => ({
          ...n,
          createdAt: n.createdAt || new Date().toISOString(),
          updatedAt: n.updatedAt || new Date().toISOString(),
        }));
      if (imported.length === 0) throw new Error('No new notes to import');
      setNotes((prev) => [...imported, ...prev]);
      return imported.length;
    },
    [notes, setNotes]
  );

  const clearAllNotes = useCallback(() => {
    setNotes([]);
    setActiveNoteId(null);
  }, [setNotes]);

  const activeNote = notes.find((n) => n.id === activeNoteId) || null;

  return {
    notes: filtered,
    allNotes: notes,
    activeNote,
    activeNoteId,
    searchQuery,
    isSaving,
    sortNewest,
    setSortNewest,
    setActiveNoteId,
    setSearchQuery,
    createNote,
    deleteNote,
    togglePin,
    setNoteColor,
    updateNote,
    exportNotes,
    importNotes,
    clearAllNotes,
  };
}
