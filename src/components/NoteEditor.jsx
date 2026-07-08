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
  const titleTimer = useRef(null);
  const contentTimer = useRef(null);
  const editorRef = useRef(null);

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

  if (!note) return null;

  return (
    <div className="flex-1 flex flex-col h-full parchment-bg">
      {/* Editor header bar */}
      <div className="flex items-center justify-between px-6 py-2.5 border-b border-ink-200 dark:border-ink-700 bg-parchment dark:bg-ink-900 shrink-0 paper-card">
        <div className="flex items-center gap-3">
          <svg className="w-4 h-4 text-ink-300 dark:text-ink-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          <div className="text-[11px] text-ink-400 dark:text-ink-500 font-serif">
            <span className="hidden sm:inline">Penned </span>{formatDate(note.createdAt)}
          </div>
          {note.updatedAt !== note.createdAt && (
            <>
              <span className="text-ink-200 dark:text-ink-700">·</span>
              <div className="text-[11px] text-ink-400 dark:text-ink-500 font-serif">
                <span className="hidden sm:inline">Revised </span>{formatDate(note.updatedAt)}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Preview toggle */}
          <button
            onClick={() => setPreview((p) => !p)}
            className={`btn-classical flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-colors cursor-pointer font-serif ${
              preview
                ? 'bg-gold/10 text-gold-dark dark:text-gold border border-gold/20'
                : 'text-ink-400 dark:text-ink-500 hover:text-ink-600 dark:hover:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 border border-transparent'
            }`}
            title={preview ? 'Edit mode' : 'Preview mode'}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {preview ? (
                <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></>
              ) : (
                <><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></>
              )}
            </svg>
            <span className="hidden sm:inline">{preview ? 'Compose' : 'Read'}</span>
          </button>

          {/* Color picker */}
          <div className="relative">
            <button
              onClick={() => setShowColors((p) => !p)}
              className={`btn-classical flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-md transition-colors cursor-pointer ${
                showColors
                  ? 'bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300'
                  : 'text-ink-400 dark:text-ink-500 hover:text-ink-600 dark:hover:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800'
              }`}
              title="Note color"
            >
              <span className={`w-3 h-3 rounded-full ${note.color === 'red' ? 'bg-rust' : note.color === 'orange' ? 'bg-orange-400' : note.color === 'yellow' ? 'bg-gold' : note.color === 'green' ? 'bg-forest' : note.color === 'blue' ? 'bg-blue-400' : note.color === 'purple' ? 'bg-purple-400' : note.color === 'pink' ? 'bg-wine-light' : 'bg-ink-300'}`} />
              <span className="hidden sm:inline">Shade</span>
            </button>
            {showColors && (
              <div className="absolute right-0 top-full mt-1 paper-card paper-stack rounded-lg z-10 p-3 min-w-[200px]">
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

          {/* Stats */}
          <span className="hidden md:inline text-[11px] text-ink-400 dark:text-ink-500 font-serif ml-1">{wordCount} words</span>
          <span className="hidden md:inline text-[11px] text-ink-400 dark:text-ink-500 font-serif">{charCount} chars</span>
          {isSaving && (
            <span className="text-xs text-gold animate-pulse flex items-center gap-1 font-serif">
              <span className="w-1.5 h-1.5 bg-gold rounded-full" />
              <span className="hidden sm:inline">Quill...</span>
            </span>
          )}
        </div>
      </div>

      {/* Editor body */}
      <div ref={editorRef} className="flex-1 overflow-y-auto">
        {preview ? (
          <div className="max-w-4xl mx-auto">
            {/* Title in preview */}
            <div className="border-b border-ink-100 dark:border-ink-800 px-8 pt-10 pb-4">
              <h2 className="text-3xl font-bold text-ink-800 dark:text-ink-100 font-display leading-tight mb-3">
                {note.title || 'Untitled'}
              </h2>
              {note.tags && note.tags.length > 0 && (
                <div className="flex gap-1.5">
                  {note.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-0.5 bg-ink-100 dark:bg-ink-800 text-ink-500 dark:text-ink-400 rounded-full text-xs font-serif italic">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="ornamental-divider mt-4" />
            </div>
            <MarkdownPreview content={note.content} />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto px-8 py-8">
            {/* Color & tags (compact row) */}
            <div className="flex items-center gap-4 mb-5">
              <ColorPicker
                currentColor={note.color || 'default'}
                onChange={(color) => onUpdate(note.id, { color })}
              />
              <div className="h-4 w-px bg-ink-200 dark:bg-ink-700" />
              <TagInput
                tags={note.tags || []}
                onChange={(newTags) => onUpdate(note.id, { tags: newTags })}
              />
            </div>

            {/* Title */}
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Title..."
              className="w-full text-3xl font-bold text-ink-800 dark:text-ink-100 placeholder-ink-300 dark:placeholder-ink-600 border-none outline-none bg-transparent mb-6 focus:ring-0 font-display"
              aria-label="Note title"
            />

            {/* Decorative line */}
            <div className="h-px bg-gradient-to-r from-ink-200 via-ink-100 to-transparent dark:from-ink-700 dark:via-ink-800 mb-6" />

            {/* Content */}
            <textarea
              value={content}
              onChange={handleContentChange}
              placeholder="Write your words here... **bold**, *italic*, `code`, # headings, [links](url)"
              className="w-full min-h-[calc(100vh-420px)] text-base text-ink-700 dark:text-ink-300 placeholder-ink-300 dark:placeholder-ink-600 border-none outline-none bg-transparent resize-none focus:ring-0 leading-relaxed font-serif"
              aria-label="Note content"
            />
          </div>
        )}
      </div>
    </div>
  );
}
