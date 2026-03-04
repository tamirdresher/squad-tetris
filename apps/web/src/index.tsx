import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { useTheme } from './hooks/useTheme';
import { ThemeToggle } from './components/ThemeToggle';

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
      <h1>🎮 Squad Tetris</h1>
      <p>Multiplayer Tetris — coming soon!</p>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
