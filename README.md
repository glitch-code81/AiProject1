# Notes App

A modern, responsive note-taking application built with React, Vite, and Tailwind CSS. Features a clean sidebar-based interface with local storage persistence, search, pinning, and dark mode.

## Features

- **Create, Edit, Delete** — Full CRUD operations with auto-save
- **Search** — Real-time filtering with highlighted matches (Ctrl+F)
- **Pin / Unpin** — Pin important notes to the top
- **Dark Mode** — Toggle with a floating button, persists across sessions
- **Responsive** — Collapsible sidebar with hamburger menu on mobile
- **Auto-save** — Debounced saving with visual indicator
- **Import / Export** — Backup and restore notes as JSON files
- **Word & Character Count** — Shown in the editor header
- **Toast Notifications** — Animated alerts for create, delete, pin actions
- **Keyboard Shortcuts** — `N` for new note, `Esc` to close sidebar
- **Delete Confirmation** — Prevents accidental deletion
- **Timestamps** — Creation and last-edited time for every note

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS 4 |
| Language | JavaScript (JSX) |
| Storage | Browser Local Storage |
| Font | Inter (via Google Fonts) |

## Project Structure

```
notes-app/
├── index.html                 # Entry HTML with Inter font
├── vite.config.js             # Vite + React + Tailwind config
├── package.json
├── src/
│   ├── main.jsx               # React entry point
│   ├── App.jsx                # Root component, state orchestration
│   ├── index.css              # Tailwind imports, dark mode, animations
│   ├── components/
│   │   ├── Sidebar.jsx        # Note list, search, create button
│   │   ├── NoteItem.jsx       # Individual note row with actions
│   │   ├── NoteEditor.jsx     # Title/content editor with stats
│   │   ├── SearchBar.jsx      # Search input with clear button
│   │   ├── EmptyState.jsx     # Shown when no notes exist
│   │   └── Toast.jsx          # Animated notification component
│   ├── hooks/
│   │   ├── useLocalStorage.js # Generic localStorage hook
│   │   └── useNotes.js        # All note CRUD logic & state
│   └── utils/
│       └── helpers.js         # Date formatting, ID generation
└── dist/                      # Build output (gitignored)
```

## Architecture

### Component Tree

```
App
├── Sidebar
│   ├── SearchBar
│   └── NoteItem[] (sorted & filtered)
├── NoteEditor (conditional)
├── EmptyState (conditional)
├── Toast (conditional)
└── ConfirmDialog (conditional)
```

### Data Flow

1. **`useNotes`** hook manages all note state via `useLocalStorage`
2. Notes are persisted to `localStorage` under the key `notes-app-notes`
3. The hook provides sorted (pinned first, then by updatedAt) and filtered (by search query) note lists
4. `App.jsx` orchestrates state and passes callbacks down to components
5. `NoteEditor` debounces updates (400ms) to avoid excessive re-renders
6. Dark mode preference is stored in `localStorage` as `notes-app-dark`

### Key Design Decisions

- **No external state library** — hooks + localStorage is sufficient for this scale
- **Debounced auto-save** — 400ms delay prevents write contention while keeping data safe
- **CSS variables for theming** — dark mode uses custom variables and utility overrides
- **Modular components** — each component has a single responsibility
- **Self-contained hooks** — business logic lives in hooks, not components

## Installation

```bash
# Clone the repository
git clone https://github.com/glitch-code81/AiProject1.git
cd AiProject1

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage

1. Open the app in your browser (default: `http://localhost:5173`)
2. Click **+ New Note** or press `N` to create a note
3. Type a title and content — saves automatically after 400ms
4. Use the **sidebar** to browse, search, pin, or delete notes
5. Click the **moon/sun icon** (bottom-left) to toggle dark mode
6. Use **Export / Import** to backup or restore your notes

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `N` | Create new note |
| `Ctrl+F` / `Cmd+F` | Focus search bar |
| `Esc` | Close sidebar (mobile) |

## Future Improvements

- Markdown preview support
- Note categories / tags
- Rich text formatting (bold, italic, lists)
- Drag-and-drop note reordering
- Cloud sync (optional)
- Multiple notebooks
- Note sharing
- Collaborative editing
- PWA support with offline mode

## Development

### Branch Workflow

This project uses feature branches:

```
main          → Stable, production-ready
feat/*        → Feature branches (core-layout, notes-crud, etc.)
```

### Build & Verify

```bash
npm run build     # Production build
npm run dev       # Dev server with HMR
```

## License

MIT — feel free to use, modify, and distribute.
