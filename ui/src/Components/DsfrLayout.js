import React from "react";
import DsfrFooter from "./DsfrFooter";
import DsfrNavbar from "./DsfrNavbar";

const DsfrLayout = ({ children }) => {
  return (
    <>
      <DsfrNavbar />
      {children}
      <DsfrFooter />
    </>
  );
};

export default DsfrLayout;
