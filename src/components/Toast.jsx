import { useState } from 'react';

export default function Toast({ message, type = 'info', onClose }) {
  const [exiting, setExiting] = useState(false);

  const handleClose = () => {
    setExiting(true);
    setTimeout(onClose, 200);
  };

  const colors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-gray-800',
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-lg shadow-lg text-white text-sm
        ${colors[type] || colors.info}
        transition-all duration-200
        ${exiting ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}
      role="alert"
    >
      <span>{message}</span>
      <button
        onClick={handleClose}
        className="ml-2 opacity-70 hover:opacity-100 cursor-pointer text-lg leading-none"
        aria-label="Dismiss"
      >
        &times;
      </button>
    </div>
  );
}
