import { useState, useEffect, useRef } from 'react';
import { formatDate } from '../utils/helpers';
import MarkdownPreview from './MarkdownPreview';
import TagInput from './TagInput';
import ColorPicker from './ColorPicker';

export default function NoteEditor({ note, onUpdate, isSaving, onAddTag, onRemoveTag, onSetColor }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [preview, setPreview] = useState(false);
  const titleRef = useRef(null);
  const titleTimer = useRef(null);
  const contentTimer = useRef(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      setPreview(false);
    }
  }, [note?.id]);

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    if (titleTimer.current) clearTimeout(titleTimer.current);
    titleTimer.current = setTimeout(() => {
      onUpdate(note.id, { title: val });
    }, 400);
  };

  const handleContentChange = (e) => {
    const val = e.target.value;
    setContent(val);
    if (contentTimer.current) clearTimeout(contentTimer.current);
    contentTimer.current = setTimeout(() => {
      onUpdate(note.id, { content: val });
    }, 400);
  };

  // Word and character counts
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
          {/* Preview toggle */}
          <button
            onClick={() => setPreview((p) => !p)}
            className={`p-1.5 rounded-lg transition-all cursor-pointer active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
              preview
                ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400'
                : 'text-gray-400 hover:text-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            aria-label={preview ? 'Edit mode' : 'Preview mode'}
            title={preview ? 'Switch to edit' : 'Preview markdown'}
          >
            {preview ? (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
          <ColorPicker color={note.color || null} onChange={(c) => onSetColor(note.id, c)} />
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
        {preview ? (
          <MarkdownPreview content={content} />
        ) : (
          <div className="max-w-3xl mx-auto px-6 sm:px-10 py-8 sm:py-12">
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Untitled"
              className="w-full text-3xl sm:text-4xl font-bold text-gray-800 placeholder-gray-300 border-none outline-none bg-transparent mb-6 focus:ring-0 leading-tight tracking-tight"
              aria-label="Note title"
            />
            <div className="h-px bg-gradient-to-r from-gray-100 via-gray-200 to-transparent mb-4" />
            <TagInput tags={note.tags || []} onAdd={(t) => onAddTag(note.id, t)} onRemove={(t) => onRemoveTag(note.id, t)} />
            <div className="h-px bg-gradient-to-r from-gray-100 via-gray-200 to-transparent mb-6 mt-4" />
            <textarea
              value={content}
              onChange={handleContentChange}
              placeholder="Start writing..."
              className="w-full min-h-[calc(100vh-300px)] text-base sm:text-lg text-gray-700 placeholder-gray-300 border-none outline-none bg-transparent resize-none focus:ring-0 leading-relaxed"
              aria-label="Note content"
            />
          </div>
        )}
      </div>
    </div>
  );
}
