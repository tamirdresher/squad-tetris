import { useEffect, useRef } from 'react';

interface UseGameLoopOptions {
  onTick: () => void;
  isActive: boolean;
  intervalMs: number;
}

export function useGameLoop({ onTick, isActive, intervalMs }: UseGameLoopOptions) {
  const savedCallback = useRef(onTick);

  useEffect(() => {
    savedCallback.current = onTick;
  }, [onTick]);

  useEffect(() => {
    if (!isActive) return;

    const tick = () => {
      savedCallback.current();
    };

    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [isActive, intervalMs]);
}
