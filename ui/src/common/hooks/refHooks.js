import { useCallback, useRef } from "react";

export function useRefCallback() {
  const ref = useRef(null);
  const setRef = useCallback((node) => {
    if (node) {
      ref.current = node;
    }
  }, []);

  return [ref, setRef];
}
