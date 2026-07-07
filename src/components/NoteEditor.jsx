import { useState, useEffect, useRef } from 'react';
import { formatDate } from '../utils/helpers';

export default function NoteEditor({ note, onUpdate }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const titleRef = useRef(null);
  const isInitialMount = useRef(true);

  // Sync local state when switching notes
  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
    }
    isInitialMount.current = true;
  }, [note?.id]);

  // Debounced save
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (!note) return;
    const timer = setTimeout(() => {
      onUpdate(note.id, { title, content });
    }, 400);
    return () => clearTimeout(timer);
  }, [title, content, note?.id, onUpdate]);

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-400">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" />
          </svg>
          <p className="text-sm">Select a note or create a new one</p>
        </div>
      </div>
    );
  }

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  return (
    <main className="flex-1 flex flex-col h-full bg-white">
      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-8 py-6">
        <input
          ref={titleRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title..."
          className="w-full text-2xl font-semibold text-gray-800 outline-none placeholder:text-gray-300 mb-2"
          aria-label="Note title"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing..."
          className="flex-1 w-full resize-none outline-none text-base leading-relaxed text-gray-700 placeholder:text-gray-300"
          aria-label="Note content"
        />

        <div className="flex items-center justify-between pt-4 pb-2 text-xs text-gray-400 border-t border-gray-100 mt-4">
          <div className="flex gap-4">
            <span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
            <span>{charCount} {charCount === 1 ? 'char' : 'chars'}</span>
          </div>
          <div className="flex gap-4">
            <span>Created {formatDate(note.createdAt)}</span>
            <span>Edited {formatDate(note.updatedAt)}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
