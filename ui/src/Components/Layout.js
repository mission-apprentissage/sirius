import { Box, Flex, Spinner, useBreakpoint } from "@chakra-ui/react";
import { useContext } from "react";

import { UserContext } from "../context/UserContext";
import Footer from "./Footer";
import Navbar from "./Navbar";
import UnauthNavbar from "./UnauthNavbar";

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
      <Footer />
    </>
  );
};

export default Layout;
