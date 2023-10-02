import React from "react";
import { Flex, Box } from "@chakra-ui/react";
import Footer from "./Footer";

const AnonymousLayout = ({ children }) => {
  return (
    <>
      <Box
        w="100%"
        bg="white"
        p="0"
        m="0"
        maxWidth="100%"
        minHeight="100vh"
        alignItems="center"
        justifyContent="center"
        display="flex"
        flexDirection="column"
      >
        <Flex w="100%">{children}</Flex>
      </Box>
      <Footer />
    </>
  );
};

export default AnonymousLayout;
