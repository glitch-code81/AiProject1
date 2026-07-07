import { useState, useCallback, useRef, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { generateId } from '../utils/helpers';

export function useNotes() {
  const [notes, setNotes] = useLocalStorage('notes-app-notes', []);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const saveTimer = useRef(null);

  const activeNote = notes.find((n) => n.id === activeNoteId) || null;

  const sortedNotes = [...notes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.updatedAt - a.updatedAt;
  });

  const filteredNotes = searchQuery
    ? sortedNotes.filter((n) => {
        const q = searchQuery.toLowerCase();
        return (
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q)
        );
      })
    : sortedNotes;

  const createNote = useCallback(() => {
    const now = Date.now();
    const note = {
      id: generateId(),
      title: '',
      content: '',
      pinned: false,
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
        prev.map((n) =>
          n.id === id ? { ...n, pinned: !n.pinned, updatedAt: Date.now() } : n
        )
      );
    },
    [setNotes]
  );

  const updateNote = useCallback(
    (id, updates) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        setNotes((prev) =>
          prev.map((n) =>
            n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n
          )
        );
      }, 300);
    },
    [setNotes]
  );

  const updateNoteImmediate = useCallback(
    (id, updates) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      setNotes((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n
        )
      );
    },
    [setNotes]
  );

  // Save any pending changes on unmount
  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  return {
    notes: filteredNotes,
    allNotes: notes,
    activeNote,
    activeNoteId,
    searchQuery,
    setActiveNoteId,
    setSearchQuery,
    createNote,
    deleteNote,
    togglePin,
    updateNote,
    updateNoteImmediate,
  };
}
