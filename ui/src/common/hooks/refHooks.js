import { useCallback, useRef } from "react";

export function useRefCallback() {
  //see https://medium.com/@teh_builder/ref-objects-inside-useeffect-hooks-eb7c15198780
  const ref = useRef(null);
  const setRef = useCallback((node) => {
    if (node) {
      ref.current = node;
    }
  }, []);

  return [ref, setRef];
}
