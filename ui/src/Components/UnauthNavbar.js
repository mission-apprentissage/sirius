import React from "react";
import { Box, Flex, Text, Link, useBreakpoint } from "@chakra-ui/react";
import Logo from "../assets/images/logo.svg";

const UnauthNavbar = () => {
  const breakpoint = useBreakpoint({ ssr: false });
  const isMobile = breakpoint === "base";

  return (
    <>
      <Box bg="white" px={4}>
        <Flex h={16} alignItems="center" justifyContent={isMobile ? "center" : "flex-start"}>
          <Link href="/">
            <img src={Logo} alt="Logo Sirius" />
          </Link>
          <Text display={isMobile ? "none" : "inherit"} color="purple.500" ml="5">
            recueillir les témoignages d’apprenti·es pour aider les plus jeunes à choisir une
            formation en apprentissage
          </Text>
        </Flex>
      </Box>
    </>
  );
};

export default UnauthNavbar;
