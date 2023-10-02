import React from "react";
import { Flex, Container } from "@chakra-ui/react";

const AnonymousLayout = ({ children }) => {
  return (
    <Container
      maxW="container.xl"
      bg="white"
      p="0"
      m="0"
      maxWidth="100%"
      minHeight="100vh"
      alignItems="center"
      justifyContent="center"
      display="flex"
    >
      <Flex w="100%">{children}</Flex>
    </Container>
  );
};

export default AnonymousLayout;
