export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

export function formatDate(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

export function truncate(text, maxLen = 60) {
  if (!text) return '';
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > maxLen ? clean.slice(0, maxLen) + '…' : clean;
}

export function getNotePreview(note) {
  if (note.title) return note.title;
  const plain = note.content.replace(/[#*`>\[\]]/g, '').trim();
  return truncate(plain, 50) || 'Untitled';
}
