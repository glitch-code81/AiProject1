# Notes App

A modern, responsive note-taking application built with React, Vite, and Tailwind CSS. Features a clean sidebar-based interface with local storage persistence, search, pinning, and dark mode.

![Build](https://img.shields.io/badge/build-passing-brightgreen) ![React](https://img.shields.io/badge/React-19-61DAFB) ![Vite](https://img.shields.io/badge/Vite-6-646CFF)

---

## Features

- **Create, edit, delete notes** — Full CRUD with confirmation dialogs
- **Pin/Unpin notes** — Pinned notes always appear at the top
- **Search notes** — Real-time filtering with highlighted matches
- **Auto-save** — Automatically saves as you type (with saving indicator)
- **Word & character count** — Live stats in the editor header
- **Dark mode** — Toggle with a button, preference persisted in localStorage
- **Responsive layout** — Collapsible sidebar with hamburger menu on mobile
- **Import/Export** — Save/load notes as JSON files
- **Sort toggle** — Switch between newest-first and oldest-first ordering
- **Keyboard shortcuts** — `N` for new note, `Esc` to close sidebar, `Ctrl+F` to search
- **Animated UI** — Toast notifications, slide-in list items, floating empty state, content fade-in transitions
- **Data persistence** — All notes stored in browser localStorage
- **Polished design** — Gradient buttons, backdrop blur, card hover effects, scrollbar styling, refined typography
- **Focus-visible states** — Keyboard-friendly focus rings on all interactive elements
- **Button animations** — Scale press effects, hover lift shadows, smooth dark mode toggle

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Build tool | Vite 6 |
| Styling | Tailwind CSS v4 |
| Storage | Web localStorage |
| Icons | Inline SVGs |
| Font | Inter (Google Fonts) |

---

## Project Structure

```
notes-app/
├── index.html                    # HTML shell with Inter font
├── package.json
├── vite.config.js                # Vite config: React + Tailwind plugins
├── src/
│   ├── main.jsx                  # React entry point
│   ├── App.jsx                   # Main orchestrator (state, layout, toasts, dialogs)
│   ├── index.css                 # Tailwind imports, theme variables, dark mode, animations
│   ├── components/
│   │   ├── Sidebar.jsx           # Note list, search, create, import/export, sort, shortcuts footer
│   │   ├── NoteEditor.jsx        # Title + content editor with auto-save and word count
│   │   ├── NoteItem.jsx          # Single note card with pin/delete and search highlighting
│   │   ├── SearchBar.jsx         # Search input with clear button and Ctrl+F focus
│   │   ├── EmptyState.jsx        # Empty state illustration with create prompt
│   │   └── Toast.jsx             # Animated notification toast
│   ├── hooks/
│   │   ├── useNotes.js           # Core business logic: CRUD, search, sort, import/export
│   │   └── useLocalStorage.js    # localStorage persistence hook
│   └── utils/
│       └── helpers.js            # generateId, formatDate, getNotePreview
```

---

## Architecture

### Component Tree

```
App
├── Sidebar
│   ├── SearchBar
│   └── NoteItem[] (mapped)
├── NoteEditor / EmptyState
└── Toast
```

### Data Flow

1. **`useNotes()` hook** manages all state — notes array, active note, search query, sort order
2. **`useLocalStorage()`** persists the notes array to localStorage on every change
3. **`App.jsx`** orchestrates everything: passes handlers down to Sidebar and NoteEditor
4. **User actions** (create, delete, pin, edit) call `useNotes()` methods which update state → re-render → auto-save to localStorage
5. **Auto-save** triggers on every keystroke with a debounced 800ms saving indicator

### State Ownership

| State | Owner | Persistence |
|-------|-------|-------------|
| Notes array | `useLocalStorage` → `useNotes` | localStorage |
| Active note ID | `useNotes` | Session only |
| Search query | `useNotes` | Session only |
| Dark mode | `App.jsx` | localStorage |
| Sidebar open | `App.jsx` | Session only |
| Sort order | `useNotes` | Session only |

---

## Getting Started — Step-by-Step Local Setup

### Prerequisites

Make sure you have these installed on your machine:

- **Node.js** version 18 or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js) or **yarn** (optional)
- **Git** ([Download](https://git-scm.com/))

### 1. Clone the Repository

Open your terminal (or command prompt / PowerShell on Windows) and run:

```bash
git clone https://github.com/glitch-code81/AiProject1.git
cd AiProject1
```

This downloads the project to a folder called `AiProject1` and moves into it.

### 2. Install Dependencies

```bash
npm install
```

This reads `package.json` and downloads all required packages (React, Vite, Tailwind CSS, etc.) into a `node_modules/` folder.

### 3. Start the Development Server

```bash
npm run dev
```

You'll see output like:

```
  VITE v6.4.3  ready in 2632 ms

  ➜  Local:   http://localhost:5173/
```

Open **http://localhost:5173/** in your browser. The app loads immediately, and any code changes you make will auto-reload the page (Hot Module Replacement).

### 4. Build for Production

When you're ready to deploy or share:

```bash
npm run build
```

This creates an optimized `dist/` folder with minified HTML, CSS, and JS files. You can serve the `dist/` folder with any static file server.

```bash
npm run preview
```

This starts a local server at `http://localhost:4173/` to preview the production build.

### Troubleshooting

- **`vite: command not found`** after `npm install` — try `node node_modules/vite/bin/vite.js build` or run `npx vite`
- **Blank page in browser** — open DevTools (F12) → Console tab to check for JavaScript errors
- **Port already in use** — Vite will prompt to enter a different port, or set `--port 3000` via `npm run dev -- --port 3000`
- **Build fails with unexpected error** — delete `node_modules/` and `package-lock.json`, then run `npm install` again

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `N` | Create a new note |
| `Esc` | Close the sidebar (mobile) / Dismiss dialog |
| `Ctrl+F` / `Cmd+F` | Focus the search bar |
| `Enter` | Open a focused note in the list |
| Click sort icon | Toggle newest/oldest order |

---

## Usage Guide

1. **Create a note** — Click the "New Note" button or press `N`
2. **Edit** — Click any note in the sidebar to open it; start typing — auto-save handles the rest
3. **Search** — Type in the search bar; matching notes are highlighted with yellow background
4. **Pin** — Hover over a note and click the pin icon to keep it at the top
5. **Delete** — Hover over a note and click the trash icon; confirm the dialog
6. **Dark mode** — Click the moon/sun button in the bottom-left corner
7. **Export** — Click "Export" in the sidebar to download all notes as a JSON file
8. **Import** — Click "Import" in the sidebar to load notes from a previously exported JSON file
9. **Sort** — Click the sort icon next to the note count to toggle newest/oldest first

---

## Development Workflow

This project follows a feature-branch workflow:

```
main (stable) ← merge from feature branches
├── feat/core-layout        # Responsive sidebar, dark mode toggle
├── feat/notes-crud         # Import/export, auto-save indicator, word count
├── feat/pin-search         # Search highlighting, clear button, Ctrl+F
├── feat/ui-enhancements    # Animations, dark mode polish, toast transitions
└── feat/docs               # README and documentation
```

Each feature is developed on its own branch, build-verified, and merged into `main`. Commits use humanized messages (no conventional-commit prefixes).

---

## Future Improvements

- [ ] Markdown preview support in the editor
- [ ] Note categories/tags with filtering
- [ ] Rich text formatting toolbar
- [ ] Drag-and-drop note reordering
- [ ] Multi-device sync (via cloud storage)
- [ ] Search within note content with scroll-to-match
- [ ] Undo/redo for note edits
- [ ] Archive (soft-delete) instead of permanent delete
- [ ] Customizable accent color
- [ ] Note templates
