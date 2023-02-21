import { useEffect } from 'react';

export function useKeyPress(callback: () => void, keyCodes: string[], requireMetaKey: boolean = true): void {
  const handler = (e: KeyboardEvent) => {
    if ((requireMetaKey && e.metaKey && keyCodes.includes(e.code)) || (!requireMetaKey && keyCodes.includes(e.code))) {
      e.preventDefault();
      callback();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, []);
}
