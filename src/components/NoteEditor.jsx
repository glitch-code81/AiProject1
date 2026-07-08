import { useState, useEffect, useRef } from 'react';
import { formatDate } from '../utils/helpers';
import MarkdownPreview from './MarkdownPreview';
import ColorPicker from './ColorPicker';
import TagInput from './TagInput';

export default function NoteEditor({ note, onUpdate, isSaving }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [preview, setPreview] = useState(false);
  const [showColors, setShowColors] = useState(false);
  const titleRef = useRef(null);
  const titleTimer = useRef(null);
  const contentTimer = useRef(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
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

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  if (!note) {
    return null;
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Editor header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-400 dark:text-gray-500">
            Created {formatDate(note.createdAt)}
          </div>
          {note.updatedAt !== note.createdAt && (
            <>
              <span className="text-gray-300 dark:text-gray-600">·</span>
              <div className="text-xs text-gray-400 dark:text-gray-500">
                Edited {formatDate(note.updatedAt)}
              </div>
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          {/* Markdown preview toggle */}
          <button
            onClick={() => setPreview((p) => !p)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-md transition-colors cursor-pointer ${
              preview
                ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
            }`}
            title={preview ? 'Edit mode' : 'Preview mode'}
            aria-label={preview ? 'Switch to edit mode' : 'Switch to preview mode'}
          >
            {preview ? (
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            )}
            {preview ? 'Edit' : 'Preview'}
          </button>

          {/* Color picker toggle */}
          <div className="relative">
            <button
              onClick={() => setShowColors((p) => !p)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-md transition-colors cursor-pointer ${
                showColors
                  ? 'bg-gray-200 dark:bg-slate-600 text-gray-600 dark:text-gray-300'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
              title="Note color"
              aria-label="Choose note color"
            >
              <span className={`w-3 h-3 rounded-full ${note.color ? `bg-${note.color}-400` : 'bg-gray-400'}`} />
              Color
            </button>
            {showColors && (
              <div className="absolute right-0 top-full mt-1 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg shadow-lg z-10 p-3">
                <ColorPicker
                  currentColor={note.color || 'default'}
                  onChange={(color) => {
                    onUpdate(note.id, { color });
                    setShowColors(false);
                  }}
                />
              </div>
            )}
          </div>

          <span className="hidden sm:inline text-xs text-gray-400 dark:text-gray-500">{wordCount} words</span>
          <span className="hidden sm:inline text-xs text-gray-400 dark:text-gray-500">{charCount} chars</span>
          {isSaving && (
            <span className="text-xs text-indigo-500 dark:text-indigo-400 animate-pulse flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-indigo-500 dark:bg-indigo-400 rounded-full" />
              Saving
            </span>
          )}
        </div>
      </div>

      {/* Tags bar */}
      {note.tags && note.tags.length > 0 && (
        <div className="px-6 py-2 border-b border-gray-100 dark:border-slate-700/50 bg-gray-50/50 dark:bg-slate-800/50">
          <TagInput
            tags={note.tags || []}
            onChange={(newTags) => onUpdate(note.id, { tags: newTags })}
          />
        </div>
      )}

      {/* Editor body */}
      <div className="flex-1 overflow-y-auto">
        {preview ? (
          <div className="max-w-3xl mx-auto">
            <div className="px-6 pt-8 pb-2">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                {note.title || 'Untitled'}
              </h2>
              {note.tags && note.tags.length > 0 && (
                <div className="flex gap-1.5 mb-4">
                  {note.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 rounded-full text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <MarkdownPreview content={note.content} />
          </div>
        ) : (
          <div className="max-w-3xl mx-auto px-6 py-8">
            <div className="flex items-center gap-2 mb-4">
              {!showColors && (
                <ColorPicker
                  currentColor={note.color || 'default'}
                  onChange={(color) => onUpdate(note.id, { color })}
                />
              )}
              {note.tags && note.tags.length === 0 && (
                <TagInput
                  tags={note.tags || []}
                  onChange={(newTags) => onUpdate(note.id, { tags: newTags })}
                />
              )}
            </div>
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Untitled"
              className="w-full text-3xl font-bold text-gray-800 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-600 border-none outline-none bg-transparent mb-6 focus:ring-0"
              aria-label="Note title"
            />
            <textarea
              value={content}
              onChange={handleContentChange}
              placeholder="Start writing... (markdown supported: **bold**, *italic*, `code`, # headings, [links](url), - lists, > quotes)"
              className="w-full min-h-[calc(100vh-380px)] text-base text-gray-700 dark:text-gray-300 placeholder-gray-300 dark:placeholder-gray-600 border-none outline-none bg-transparent resize-none focus:ring-0 leading-relaxed"
              aria-label="Note content"
            />
          </div>
        )}
      </div>
    </div>
  );
}
