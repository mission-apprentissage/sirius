import React from "react";
import styled from "styled-components";
import { primary } from "./common/utils/colors";
import Layout from "./common/Layout";
import { Box, Item } from "./common/Flexbox";
import background from "./common/icons/background.svg";

const Pitch = styled(Item)`
  font-weight: 900;
  font-size: 48px;
  line-height: 50px;
  text-align: center;
  color: ${primary};
`;

const Background = styled("img").attrs(() => ({ src: background, alt: "background" }))`
  width: 400px;
  display: block;
`;

export default () => {
  return (
    <Layout>
      <Box justify={"center"} height={"100%"} direction={"column"}>
        <Pitch>
          Aidez les futurs apprentis <br /> à choisir leur formation{" "}
        </Pitch>
        <Item alignSelf={"center"} className={"pt-1"}>
          <Background />
        </Item>
      </Box>
    </Layout>
  );
};
