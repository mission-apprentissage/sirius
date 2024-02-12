import React from "react";
import Footer from "./Footer";
import UnauthNavbar from "./UnauthNavbar";

const AnonymousLayout = ({ children }) => {
  return (
    <>
      <UnauthNavbar />
      {children}
      <Footer />
    </>
  );
};

export default AnonymousLayout;
