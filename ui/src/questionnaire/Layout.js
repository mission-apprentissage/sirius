import React from "react";
import { breakpoints } from "../common/FlexboxGrid";
import styled from "styled-components";
import { primary, secondary } from "../common/utils/colors";
import Logo from "../common/Logo";
import { Box, Item } from "../common/Flexbox";

const LayoutBox = styled(Box).attrs(() => ({ className: "layout" }))`
  height: 100vh;
`;

const Header = styled(Item).attrs(() => ({ className: "header" }))`
  border-bottom: 1px solid #ccccd8;
  color: ${primary};
  padding: 8rem 18rem;
  @media (min-width: ${breakpoints.md.min}) {
    height: 64rem;
    min-height: 64rem;
  }
`;

const Main = styled(Item).attrs(() => ({ className: "main" }))`
  height: 100%;
  @media (min-width: ${breakpoints.md.min}) {
    margin-top: 56rem;
    margin-bottom: 56rem;
  }
`;

const Footer = styled(Item).attrs(() => ({ className: "footer" }))`
  background-color: ${secondary};
  height: 64rem;
  min-height: 64rem;
  @media (max-width: ${breakpoints.sm.max}) {
    display: none;
  }
`;

const HeaderItem = styled.span`
  padding-left: 20px;
  font-weight: 600;
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
