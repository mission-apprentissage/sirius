import React, { useContext } from "react";
import { Flex, Container, Spinner } from "@chakra-ui/react";
import Navbar from "./Navbar";
import UnauthNavbar from "./UnauthNavbar";
import { UserContext } from "../context/UserContext";

const Layout = ({ children }) => {
  const [userContext] = useContext(UserContext);
  const isAuthenticated = userContext?.token;

  if (userContext.loading) return <Spinner />;

  return (
    <>
      {isAuthenticated ? <Navbar /> : <UnauthNavbar />}
      <Container maxW="container.xl" bg="brand.blue.100" p="0" m="0" maxWidth="100%">
        <Flex w="100%">{children}</Flex>
      </Container>
    </>
  );
};

export default Layout;
