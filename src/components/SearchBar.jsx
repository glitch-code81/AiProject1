export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        type="text"
        placeholder="Search notes..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-300 transition-all placeholder:text-gray-400"
        aria-label="Search notes"
      />
    </div>
  );
}
