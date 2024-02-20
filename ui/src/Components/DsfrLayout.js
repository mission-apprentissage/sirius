import React, { useEffect } from "react";
import { loadDynamicStyle, unloadStyle } from "../utils/style";
import DsfrFooter from "./DsfrFooter";
import DsfrNavbar from "./DsfrNavbar";

const DsfrLayout = ({ children }) => {
  useEffect(() => {
    const styleLink = loadDynamicStyle("./dsfr/dsfr.min.css");

    return () => {
      unloadStyle(styleLink);
    };
  }, []);

  return (
    <>
      <DsfrNavbar />
      {children}
      <DsfrFooter />
    </>
  );
};

export default DsfrLayout;
