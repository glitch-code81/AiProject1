import { useState, useEffect, useRef } from 'react';
import { formatDate } from '../utils/helpers';

export default function NoteEditor({ note, onUpdate, isSaving }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
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

  // Word and character counts
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  if (!note) {
    return null;
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Editor header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-400">
            Created {formatDate(note.createdAt)}
          </div>
          {note.updatedAt !== note.createdAt && (
            <>
              <span className="text-gray-300">·</span>
              <div className="text-xs text-gray-400">
                Edited {formatDate(note.updatedAt)}
              </div>
            </>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span>{wordCount} words</span>
          <span>{charCount} chars</span>
          {isSaving && (
            <span className="text-indigo-500 animate-pulse flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
              Saving
            </span>
          )}
        </div>
      </div>

      {/* Editor body */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Untitled"
            className="w-full text-3xl font-bold text-gray-800 placeholder-gray-300 border-none outline-none bg-transparent mb-6 focus:ring-0"
            aria-label="Note title"
          />
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="Start writing..."
            className="w-full min-h-[calc(100vh-280px)] text-base text-gray-700 placeholder-gray-300 border-none outline-none bg-transparent resize-none focus:ring-0 leading-relaxed"
            aria-label="Note content"
          />
        </div>
      </div>
    </div>
  );
}
