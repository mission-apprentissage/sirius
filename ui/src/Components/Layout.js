import React, { useContext } from "react";
import { Flex, Box, Spinner, useBreakpoint } from "@chakra-ui/react";
import Navbar from "./Navbar";
import UnauthNavbar from "./UnauthNavbar";
import { UserContext } from "../context/UserContext";

const Layout = ({ children }) => {
  const [userContext] = useContext(UserContext);
  const isAuthenticated = userContext?.token;
  const breakpoint = useBreakpoint();

  const isMobile = breakpoint === "base";

  if (userContext.loading) return <Spinner />;

  return (
    <>
      {isAuthenticated ? <Navbar /> : <UnauthNavbar />}
      <Box
        w="100%"
        bg="white"
        m="0"
        px={isMobile ? "16px" : "64px"}
        py="0"
        minHeight="100vh"
        display="flex"
        flexDirection="column"
      >
        <Flex>{children}</Flex>
      </Box>
    </>
  );
};

export default Layout;
