import { useEffect, useState } from "react";

import { loadDynamicStyle, unloadStyle } from "../utils/style";

const DsfrIframeLayout = ({ children }) => {
  const [isCssLoaded, setIsCssLoaded] = useState(false);

  useEffect(() => {
    const styleLink = loadDynamicStyle("/dsfr/dsfr.min.css");
    setIsCssLoaded(true);

    return () => {
      unloadStyle(styleLink);
    };
  }, []);

  if (!isCssLoaded) {
    return null;
  }

  return <>{children}</>;
};

export default DsfrIframeLayout;
