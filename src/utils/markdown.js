/**
 * Simple markdown parser — renders a subset of markdown to React elements.
 * Supports: headings, bold, italic, inline code, links, unordered lists, blockquotes, horizontal rules.
 */
export function parseMarkdown(text) {
  if (!text) return [];
  const lines = text.split('\n');
  const elements = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Horizontal rule
    if (/^[-*]{3,}\s*$/.test(line)) {
      if (inList) { elements.push({ type: 'listEnd' }); inList = false; }
      elements.push({ type: 'hr' });
      continue;
    }

    // Heading
    const headingMatch = line.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      if (inList) { elements.push({ type: 'listEnd' }); inList = false; }
      elements.push({ type: 'heading', level: headingMatch[1].length, content: inlineParse(headingMatch[2]) });
      continue;
    }

    // Blockquote
    const bqMatch = line.match(/^>\s?(.*)$/);
    if (bqMatch) {
      if (inList) { elements.push({ type: 'listEnd' }); inList = false; }
      elements.push({ type: 'blockquote', content: inlineParse(bqMatch[1]) });
      continue;
    }

    // Unordered list item
    const liMatch = line.match(/^[*-]\s+(.+)$/);
    if (liMatch) {
      if (!inList) { elements.push({ type: 'listStart' }); inList = true; }
      elements.push({ type: 'listItem', content: inlineParse(liMatch[1]) });
      continue;
    }

    // Empty line
    if (line.trim() === '') {
      if (inList) { elements.push({ type: 'listEnd' }); inList = false; }
      elements.push({ type: 'paragraph', content: [] });
      continue;
    }

    // Regular paragraph
    if (inList) { elements.push({ type: 'listEnd' }); inList = false; }
    elements.push({ type: 'paragraph', content: inlineParse(line) });
  }

  if (inList) elements.push({ type: 'listEnd' });
  return elements;
}

function inlineParse(text) {
  const tokens = [];
  let remaining = text;

  while (remaining.length > 0) {
    // Inline code
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      tokens.push({ type: 'code', text: codeMatch[1] });
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // Image
    const imgMatch = remaining.match(/^!\[([^\]]*)\]\(([^)]+)\)/);
    if (imgMatch) {
      tokens.push({ type: 'image', alt: imgMatch[1], src: imgMatch[2] });
      remaining = remaining.slice(imgMatch[0].length);
      continue;
    }

    // Link
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      tokens.push({ type: 'link', text: linkMatch[1], href: linkMatch[2] });
      remaining = remaining.slice(linkMatch[0].length);
      continue;
    }

    // Bold + italic
    const biMatch = remaining.match(/^\*\*\*([^*]+)\*\*\*/);
    if (biMatch) {
      tokens.push({ type: 'boldItalic', text: biMatch[1] });
      remaining = remaining.slice(biMatch[0].length);
      continue;
    }

    // Bold
    const bMatch = remaining.match(/^\*\*([^*]+)\*\*/);
    if (bMatch) {
      tokens.push({ type: 'bold', text: bMatch[1] });
      remaining = remaining.slice(bMatch[0].length);
      continue;
    }

    // Italic
    const iMatch = remaining.match(/^\*([^*]+)\*/);
    if (iMatch) {
      tokens.push({ type: 'italic', text: iMatch[1] });
      remaining = remaining.slice(iMatch[0].length);
      continue;
    }

    // Strikethrough
    const sMatch = remaining.match(/^~~([^~]+)~~/);
    if (sMatch) {
      tokens.push({ type: 'strikethrough', text: sMatch[1] });
      remaining = remaining.slice(sMatch[0].length);
      continue;
    }

    // Regular text (greedy up to next special char)
    const textMatch = remaining.match(/^[^*`[!~]+/);
    if (textMatch) {
      tokens.push({ type: 'text', text: textMatch[0] });
      remaining = remaining.slice(textMatch[0].length);
      continue;
    }

    // Single special character (e.g. unmatched *, `, etc.)
    tokens.push({ type: 'text', text: remaining[0] });
    remaining = remaining.slice(1);
  }

  return tokens;
}
