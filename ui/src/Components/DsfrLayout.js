import React, { useEffect, useState } from "react";
import { loadDynamicStyle, unloadStyle } from "../utils/style";
import DsfrFooter from "./DsfrFooter";
import DsfrNavbar from "./DsfrNavbar";

const DsfrLayout = ({ children }) => {
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

  return (
    <>
      <DsfrNavbar />
      {children}
      <DsfrFooter />
    </>
  );
};

export default DsfrLayout;
