/* eslint-disable no-undef */
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

const useSetAndTrackPageTitle = ({ title }) => {
  useEffect(() => {
    if (window._paq) {
      window._paq.push(["setDocumentTitle", title || document.title]);
      window._paq.push(["setCustomUrl", window.location.href]);
      window._paq.push(["trackPageView"]);
    }
  }, [title]);

  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  );
};

export default useSetAndTrackPageTitle;
