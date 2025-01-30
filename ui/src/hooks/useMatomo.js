/* eslint-disable no-undef */
import { useEffect, useRef } from "react";

const useMatomo = (enabled = true) => {
  const matomoInitializedRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    if (!matomoInitializedRef.current) {
      var _paq = (window._paq = window._paq || []);
      _paq.push(["enableLinkTracking"]);

      (function () {
        var u = "https://stats.beta.gouv.fr/";
        _paq.push(["setTrackerUrl", u + "matomo.php"]);
        _paq.push(["setSiteId", "121"]);

        var d = document;
        var g = d.createElement("script");
        var s = d.getElementsByTagName("script")[0];
        g.async = true;
        g.src = u + "matomo.js";
        s.parentNode.insertBefore(g, s);
      })();

      matomoInitializedRef.current = true;
    }
  }, [enabled]);
};

export default useMatomo;
