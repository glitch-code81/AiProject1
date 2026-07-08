import { parseMarkdown } from '../utils/markdown';

function renderInline(tokens) {
  return tokens.map((token, i) => {
    switch (token.type) {
      case 'text':
        return <span key={i}>{token.text}</span>;
      case 'bold':
        return <strong key={i} className="font-semibold text-ink-900 dark:text-ink-100">{token.text}</strong>;
      case 'italic':
        return <em key={i} className="italic text-ink-800 dark:text-ink-200">{token.text}</em>;
      case 'boldItalic':
        return <strong key={i}><em className="text-ink-900 dark:text-ink-100">{token.text}</em></strong>;
      case 'code':
        return <code key={i} className="bg-ink-100 dark:bg-ink-800 text-rust dark:text-gold px-1.5 py-0.5 rounded text-sm font-mono text-[13px]">{token.text}</code>;
      case 'link':
        return <a key={i} href={token.href} target="_blank" rel="noopener noreferrer" className="text-forest-dark dark:text-forest-light underline decoration-dotted hover:decoration-solid hover:text-forest transition-colors">{token.text}</a>;
      case 'image':
        return <img key={i} src={token.src} alt={token.alt} className="max-w-full rounded-lg my-3 border border-ink-200 dark:border-ink-700" />;
      case 'strikethrough':
        return <span key={i} className="line-through text-ink-400 dark:text-ink-500">{token.text}</span>;
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
          <p key={children.length} className="mb-4 text-ink-700 dark:text-ink-300 leading-[1.75] font-serif text-base">
            {renderInline(el.content)}
          </p>
        );
        break;
      case 'heading': {
        const Tag = `h${el.level}`;
        const sizes = {
          1: 'text-3xl font-bold mb-4 mt-6 font-display',
          2: 'text-2xl font-bold mb-3 mt-5 font-display',
          3: 'text-xl font-semibold mb-2 mt-4 font-display',
          4: 'text-lg font-semibold mb-2 mt-3 font-serif',
        };
        children.push(
          <Tag key={children.length} className={`${sizes[el.level] || 'text-xl font-bold'} text-ink-900 dark:text-ink-100 leading-tight`}>
            {renderInline(el.content)}
          </Tag>
        );
        break;
      }
      case 'blockquote':
        children.push(
          <blockquote key={children.length} className="border-l-[3px] border-gold dark:border-gold pl-5 py-2 my-4 text-ink-600 dark:text-ink-400 italic font-serif bg-gold/5 dark:bg-gold/5 rounded-r-lg text-sm leading-relaxed">
            {renderInline(el.content)}
          </blockquote>
        );
        break;
      case 'listStart':
        listItems = [];
        break;
      case 'listItem':
        listItems.push(
          <li key={listItems.length} className="text-ink-700 dark:text-ink-300 leading-relaxed mb-1.5 font-serif pl-1">
            {renderInline(el.content)}
          </li>
        );
        break;
      case 'listEnd':
        if (listItems.length > 0) {
          children.push(
            <ul key={children.length} className="list-disc list-inside mb-4 space-y-1 text-ink-700 dark:text-ink-300 marker:text-gold">
              {listItems}
            </ul>
          );
          listItems = [];
        }
        break;
      case 'hr':
        children.push(
          <div key={children.length} className="ornamental-divider my-8">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1" fill="currentColor" />
            </svg>
          </div>
        );
        break;
      default:
        break;
    }
  }

  if (children.length === 0) {
    return (
      <div className="px-8 py-12 text-center">
        <p className="text-ink-300 dark:text-ink-600 italic font-serif">A blank page awaits your words...</p>
      </div>
    );
  }

  return (
    <div className="max-w-none px-8 py-8 overflow-y-auto">
      {children}
    </div>
  );
}
