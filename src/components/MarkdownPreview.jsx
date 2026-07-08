import { parseMarkdown } from '../utils/markdown';

function renderInline(tokens) {
  return tokens.map((token, i) => {
    switch (token.type) {
      case 'text':
        return <span key={i}>{token.text}</span>;
      case 'bold':
        return <strong key={i}>{token.text}</strong>;
      case 'italic':
        return <em key={i}>{token.text}</em>;
      case 'boldItalic':
        return <strong key={i}><em>{token.text}</em></strong>;
      case 'code':
        return <code key={i} className="bg-gray-100 dark:bg-gray-700 text-pink-600 dark:text-pink-300 px-1.5 py-0.5 rounded text-sm font-mono">{token.text}</code>;
      case 'link':
        return <a key={i} href={token.href} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-800">{token.text}</a>;
      case 'image':
        return <img key={i} src={token.src} alt={token.alt} className="max-w-full rounded-lg my-2" />;
      case 'strikethrough':
        return <span key={i} className="line-through">{token.text}</span>;
      default:
        return <span key={i}>{token.text || ''}</span>;
    }
  });
}

export default function MarkdownPreview({ content }) {
  const elements = parseMarkdown(content || '');
  const children = [];
  let listItems = [];

  for (const el of elements) {
    switch (el.type) {
      case 'paragraph':
        children.push(
          <p key={children.length} className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">
            {renderInline(el.content)}
          </p>
        );
        break;
      case 'heading':
        const Tag = `h${el.level}`;
        const headingSizes = { 1: 'text-2xl font-bold mb-4 mt-2', 2: 'text-xl font-bold mb-3 mt-2', 3: 'text-lg font-semibold mb-2 mt-2', 4: 'text-base font-semibold mb-1 mt-1' };
        children.push(
          <Tag key={children.length} className={`${headingSizes[el.level] || 'text-lg font-bold'} text-gray-800 dark:text-gray-100`}>
            {renderInline(el.content)}
          </Tag>
        );
        break;
      case 'blockquote':
        children.push(
          <blockquote key={children.length} className="border-l-4 border-indigo-300 dark:border-indigo-600 pl-4 py-1 my-3 text-gray-600 dark:text-gray-400 italic bg-indigo-50/50 dark:bg-indigo-950/30 rounded-r-lg">
            {renderInline(el.content)}
          </blockquote>
        );
        break;
      case 'listStart':
        listItems = [];
        break;
      case 'listItem':
        listItems.push(
          <li key={listItems.length} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-1">
            <span className="-ml-1">{renderInline(el.content)}</span>
          </li>
        );
        break;
      case 'listEnd':
        if (listItems.length > 0) {
          children.push(
            <ul key={children.length} className="list-disc list-inside mb-3 space-y-1 text-gray-700 dark:text-gray-300">
              {listItems}
            </ul>
          );
          listItems = [];
        }
        break;
      case 'hr':
        children.push(<hr key={children.length} className="my-6 border-gray-200 dark:border-gray-700" />);
        break;
      default:
        break;
    }
  }

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none px-6 py-6 overflow-y-auto">
      {children.length > 0 ? children : (
        <p className="text-gray-400 dark:text-gray-500 italic">Nothing to preview — start writing in markdown!</p>
      )}
    </div>
  );
}
