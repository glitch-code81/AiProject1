import { useState, useEffect, useRef, useCallback } from 'react';
import { formatDate } from '../utils/helpers';
import { useHistory } from '../hooks/useHistory';

export default function NoteEditor({ note, onUpdate, isSaving }) {
  const history = useHistory({ title: '', content: '' });
  const titleRef = useRef(null);
  const titleTimer = useRef(null);
  const contentTimer = useRef(null);

  useEffect(() => {
    if (note) {
      history.reset({ title: note.title || '', content: note.content || '' });
    }
  }, [note?.id]);

  const scheduleSave = useCallback((title, content) => {
    if (titleTimer.current) clearTimeout(titleTimer.current);
    if (contentTimer.current) clearTimeout(contentTimer.current);
    titleTimer.current = setTimeout(() => {
      onUpdate(note.id, { title });
    }, 400);
    contentTimer.current = setTimeout(() => {
      onUpdate(note.id, { content });
    }, 400);
  }, [note?.id, onUpdate]);

  const handleTitleChange = (e) => {
    const val = e.target.value;
    history.push({ title: val, content: history.current.content });
    scheduleSave(val, history.current.content);
  };

  const handleContentChange = (e) => {
    const val = e.target.value;
    history.push({ title: history.current.title, content: val });
    scheduleSave(history.current.title, val);
  };

  const handleUndo = useCallback(() => {
    const prev = history.undo();
    if (prev) {
      onUpdate(note.id, { title: prev.title, content: prev.content });
    }
  }, [history, note?.id, onUpdate]);

  const handleRedo = useCallback(() => {
    const next = history.redo();
    if (next) {
      onUpdate(note.id, { title: next.title, content: next.content });
    }
  }, [history, note?.id, onUpdate]);

  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') return;
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleUndo, handleRedo]);

  // Word and character counts
  const content = history.current.content;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  if (!note) {
    return null;
  }

  return (
    <div className="flex-1 flex flex-col h-full content-fade-in">
      {/* Editor header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white/80 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>Created {formatDate(note.createdAt)}</span>
          {note.updatedAt !== note.createdAt && (
            <>
              <span className="text-gray-300">·</span>
              <span>Edited {formatDate(note.updatedAt)}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          {/* Undo/Redo buttons */}
          <div className="flex items-center gap-0.5 mr-1">
            <button
              onClick={handleUndo}
              disabled={!history.canUndo}
              className={`p-1.5 rounded-lg transition-all cursor-pointer active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                history.canUndo
                  ? 'text-gray-500 hover:text-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-800'
                  : 'text-gray-300 cursor-not-allowed'
              }`}
              aria-label="Undo (Ctrl+Z)"
              title="Undo (Ctrl+Z)"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
            </button>
            <button
              onClick={handleRedo}
              disabled={!history.canRedo}
              className={`p-1.5 rounded-lg transition-all cursor-pointer active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                history.canRedo
                  ? 'text-gray-500 hover:text-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-800'
                  : 'text-gray-300 cursor-not-allowed'
              }`}
              aria-label="Redo (Ctrl+Y)"
              title="Redo (Ctrl+Y)"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="tabular-nums font-medium">{wordCount} <span className="font-normal text-gray-300">words</span></span>
            <span className="hidden sm:inline tabular-nums font-medium">{charCount} <span className="font-normal text-gray-300">chars</span></span>
          </div>
          {isSaving && (
            <span className="text-[11px] text-indigo-500 font-medium flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
              Saving
            </span>
          )}
        </div>
      </div>

      {/* Editor body */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 sm:px-10 py-8 sm:py-12">
          <input
            ref={titleRef}
            type="text"
            value={history.current.title}
            onChange={handleTitleChange}
            placeholder="Untitled"
            className="w-full text-3xl sm:text-4xl font-bold text-gray-800 placeholder-gray-300 border-none outline-none bg-transparent mb-6 focus:ring-0 leading-tight tracking-tight"
            aria-label="Note title"
          />
          <div className="h-px bg-gradient-to-r from-gray-100 via-gray-200 to-transparent mb-6" />
          <textarea
            value={history.current.content}
            onChange={handleContentChange}
            placeholder="Start writing..."
            className="w-full min-h-[calc(100vh-300px)] text-base sm:text-lg text-gray-700 placeholder-gray-300 border-none outline-none bg-transparent resize-none focus:ring-0 leading-relaxed"
            aria-label="Note content"
          />
        </div>
      </div>
    </div>
  );
}
