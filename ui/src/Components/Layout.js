import React, { useContext } from "react";
import { Flex, Container, Spinner } from "@chakra-ui/react";
import Navbar from "./Navbar";
import { UserContext } from "../context/UserContext";

const Layout = ({ children }) => {
  const [userContext] = useContext(UserContext);
  const isAuthenticated = userContext?.token;

  if (userContext.loading) return <Spinner />;

  return (
    <>
      {isAuthenticated && <Navbar />}
      <Container maxW="container.lg" bg="gray.100">
        <Flex py={20}>{children}</Flex>
      </Container>
    </>
  );
};

export default Layout;
