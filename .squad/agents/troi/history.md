# Project Context

- **Project:** squad-tetris — Multiplayer Tetris game
- **Stack:** TypeScript monorepo, React frontend, Node.js API, shared game engine package, Azure infrastructure
- **Teams:** UI, Backend, Mobile — working in parallel across Codespaces
- **User:** Tamir Dresher
- **Created:** 2026-03-04

## Core Context

Agent Troi initialized as Frontend Dev. Owns the React frontend — game board UI, components, animations, and player interactions.

## Recent Updates

📌 Team initialized on 2026-03-04

## Learnings

Initial setup complete.

**Theme Toggle Implementation (Issue #10):**
- Created `hooks/useTheme.ts` hook for theme state management (dark/light toggle)
- Persists theme preference to localStorage with key `squad-tetris-theme`
- Respects system preference (`prefers-color-scheme`) as default if no saved preference
- MediaQuery listener updates theme when system preference changes (only if no manual preference set)
- Created `ThemeToggle.tsx` component with sun/moon SVG icons
- Fixed position in top-right corner with smooth hover animations (scale + rotate)
- CSS custom properties in `index.css` define theme variables for both dark and light modes
- Dark theme: dark blue gradient backgrounds (#1a1a2e → #16213e), light text
- Light theme: light blue gradient backgrounds (#f0f4f8 → #d9e2ec), dark text
- Both themes maintain purple gradient for headings (#667eea → #764ba2)
- Smooth 0.3s transitions on theme switch for professional feel
- Successfully built and committed to branch `squad/10-theme-toggle`
