import { useEffect, useCallback } from 'react';

export type GameAction = 'moveLeft' | 'moveRight' | 'softDrop' | 'hardDrop' | 'rotate' | 'pause';

interface UseGameControlsOptions {
  onAction: (action: GameAction) => void;
  isActive: boolean;
}

export function useGameControls({ onAction, isActive }: UseGameControlsOptions) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isActive) return;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          onAction('moveLeft');
          break;
        case 'ArrowRight':
          event.preventDefault();
          onAction('moveRight');
          break;
        case 'ArrowDown':
          event.preventDefault();
          onAction('softDrop');
          break;
        case 'ArrowUp':
        case 'z':
        case 'Z':
          event.preventDefault();
          onAction('rotate');
          break;
        case ' ':
          event.preventDefault();
          onAction('hardDrop');
          break;
        case 'p':
        case 'P':
        case 'Escape':
          event.preventDefault();
          onAction('pause');
          break;
      }
    },
    [onAction, isActive]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}
