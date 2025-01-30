/* eslint-disable no-undef */
import { useCallback } from "react";

const useMatomoEvent = () => {
  return useCallback((category, action, name, value, inituleFormation) => {
    if (window._paq) {
      window._paq.push(["setCustomDimension", 1, inituleFormation]);
      window._paq.push(["trackEvent", category, action, name, value]);
    } else {
      console.warn("Matomo is not initialized yet.");
    }
  }, []);
};

export default useMatomoEvent;
