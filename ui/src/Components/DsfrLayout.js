import React from "react";
import OfficialFooter from "./OfficialFooter";
import DsfrNavbar from "./DsfrNavbar";

const DsfrLayout = ({ children }) => {
  return (
    <>
      <DsfrNavbar />
      {children}
      <OfficialFooter />
    </>
  );
};

export default DsfrLayout;
