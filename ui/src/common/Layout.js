import React from "react";
import { breakpoints } from "./FlexboxGrid";
import styled from "styled-components";
import { primary, secondary } from "./utils/colors";
import Logo from "./Logo";
import { Box } from "./Flexbox";

const LayoutBox = styled(Box).attrs(() => ({ className: "layout" }))`
  height: 100vh;
`;

const Header = styled(Box).attrs(() => ({ className: "header" }))`
  border-bottom: 1px solid #ccccd8;
  color: ${primary};
  padding: 8px 18px;
  @media (min-width: ${breakpoints.md.min}) {
    height: 64px;
    min-height: 64px;
  }
`;

const Main = styled("div").attrs(() => ({ className: "main" }))`
  height: 100%;
  position: relative;
  @media (min-width: ${breakpoints.md.min}) {
    margin-top: 56px;
    margin-bottom: 56px;
  }
`;

const Footer = styled("div").attrs(() => ({ className: "footer" }))`
  background-color: ${secondary};
  height: 64px;
  min-height: 64px;
  @media (max-width: ${breakpoints.sm.max}) {
    display: none;
  }
`;

export default (props) => {
  return (
    <LayoutBox direction={"column"}>
      <Header>
        <Logo />
      </Header>

      <Main>{props.children}</Main>

      <Footer />
    </LayoutBox>
  );
};
