import { useMemo } from 'react';
import { marked } from 'marked';

marked.setOptions({
  breaks: true,
  gfm: true,
});

export default function MarkdownPreview({ content }) {
  const html = useMemo(() => {
    if (!content) return '<p class="text-gray-400 italic">Nothing to preview</p>';
    try {
      return marked.parse(content);
    } catch {
      return '<p class="text-red-400">Failed to render markdown</p>';
    }
  }, [content]);

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-10 py-8 sm:py-12">
      <div
        className="prose prose-sm sm:prose-base dark:prose-invert max-w-none
          prose-headings:text-gray-800 dark:prose-headings:text-gray-100
          prose-p:text-gray-700 dark:prose-p:text-gray-300
          prose-a:text-indigo-600 dark:prose-a:text-indigo-400
          prose-code:text-indigo-700 dark:prose-code:text-indigo-300
          prose-code:bg-gray-100 dark:prose-code:bg-gray-800
          prose-code:px-1 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950
          prose-pre:text-gray-100 prose-pre:rounded-xl
          prose-blockquote:border-l-indigo-500 prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400
          prose-img:rounded-xl prose-img:shadow-md
          prose-hr:border-gray-200 dark:prose-hr:border-gray-700"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
