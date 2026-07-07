import { useState, useCallback, useRef, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { generateId } from '../utils/helpers';

export function useNotes() {
  const [notes, setNotes] = useLocalStorage('notes-app-notes', []);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
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
      setIsSaving(true);
      saveTimer.current = setTimeout(() => {
        setNotes((prev) =>
          prev.map((n) =>
            n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n
          )
        );
        setIsSaving(false);
      }, 400);
    },
    [setNotes]
  );

  // Export all notes as JSON
  const exportNotes = useCallback(() => {
    const data = JSON.stringify(notes, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [notes]);

  // Import notes from JSON file
  const importNotes = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          if (!Array.isArray(imported)) throw new Error('Invalid format');
          // Validate each note has required fields
          const valid = imported.every(
            (n) => n.id && typeof n.title === 'string' && typeof n.content === 'string'
          );
          if (!valid) throw new Error('Invalid note structure');
          setNotes((prev) => {
            const existing = new Set(prev.map((n) => n.id));
            const merged = [...prev];
            let added = 0;
            for (const note of imported) {
              if (!existing.has(note.id)) {
                merged.push(note);
                added++;
              }
            }
            return merged.sort((a, b) => b.updatedAt - a.updatedAt);
          });
          resolve(imported.length);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }, [setNotes]);

  // Clear all notes
  const clearAllNotes = useCallback(() => {
    setNotes([]);
    setActiveNoteId(null);
  }, [setNotes]);

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
    isSaving,
    setActiveNoteId,
    setSearchQuery,
    createNote,
    deleteNote,
    togglePin,
    updateNote,
    exportNotes,
    importNotes,
    clearAllNotes,
  };
}
