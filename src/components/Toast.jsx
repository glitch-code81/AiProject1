import { useState, useEffect } from 'react';

const typeStyles = {
  success: 'bg-forest-dark dark:bg-forest text-parchment',
  error: 'bg-rust-dark dark:bg-rust text-parchment',
  info: 'bg-ink-700 dark:bg-ink-600 text-ink-50',
};

const typeIcons = {
  success: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  error: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  info: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
};

export default function Toast({ message, type = 'info', onClose }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onClose, 200);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-lg toast-classical ${
        typeStyles[type] || typeStyles.info
      } ${exiting ? 'toast-exit' : 'toast-enter'}`}
      role="alert"
    >
      {typeIcons[type] || typeIcons.info}
      <span className="text-sm font-medium font-serif">{message}</span>
      <button
        onClick={() => { setExiting(true); setTimeout(onClose, 200); }}
        className="inline-flex items-center justify-center w-5 h-5 ml-2 opacity-70 hover:opacity-100 transition-opacity cursor-pointer shrink-0"
        aria-label="Dismiss"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
