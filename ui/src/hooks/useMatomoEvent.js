/* eslint-disable no-undef */
import { useCallback } from "react";

const useMatomoEvent = () => {
  return useCallback((category, action, name, value) => {
    if (window._mtm) {
      window._mtm.push({
        event: "customEvent",
        category,
        action,
        name,
        value,
      });
    } else {
      console.warn("Matomo is not initialized yet.");
    }
  }, []);
};

export default useMatomoEvent;
