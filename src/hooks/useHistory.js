import { useState, useCallback, useRef } from 'react';

export function useHistory(initialState, maxHistory = 50) {
  const [state, setState] = useState(initialState);
  const historyRef = useRef([initialState]);
  const pointerRef = useRef(0);

  const push = useCallback((newState) => {
    const history = historyRef.current;
    const pointer = pointerRef.current;

    const trimmed = history.slice(0, pointer + 1);
    trimmed.push(newState);
    if (trimmed.length > maxHistory) trimmed.shift();

    historyRef.current = trimmed;
    pointerRef.current = trimmed.length - 1;
    setState(newState);
  }, [maxHistory]);

  const undo = useCallback(() => {
    if (pointerRef.current <= 0) return null;
    pointerRef.current -= 1;
    const s = historyRef.current[pointerRef.current];
    setState(s);
    return s;
  }, []);

  const redo = useCallback(() => {
    if (pointerRef.current >= historyRef.current.length - 1) return null;
    pointerRef.current += 1;
    const s = historyRef.current[pointerRef.current];
    setState(s);
    return s;
  }, []);

  const reset = useCallback((newState) => {
    historyRef.current = [newState];
    pointerRef.current = 0;
    setState(newState);
  }, []);

  return {
    current: state,
    push,
    undo,
    redo,
    reset,
    canUndo: pointerRef.current > 0,
    canRedo: pointerRef.current < historyRef.current.length - 1,
  };
}
