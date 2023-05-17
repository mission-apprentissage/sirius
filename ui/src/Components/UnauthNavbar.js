import React from "react";
import { Box, Flex, Text, HStack, Link, useBreakpoint } from "@chakra-ui/react";
import Logo from "../assets/images/logo.svg";

const UnauthNavbar = () => {
  const breakpoint = useBreakpoint({ ssr: false });
  const isMobile = breakpoint === "base";

  return (
    <>
      <Box bg="purple.50" px={4}>
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <HStack spacing={8} alignItems="center">
            <Box>
              <Link href="/">
                <img src={Logo} alt="Logo Sirius" />
              </Link>
            </Box>
            <Text display={isMobile ? "none" : "inherit"} color="purple.500">
              recueillir les témoignages d’apprenti·es pour aider les plus jeunes à choisir une
              formation en apprentissage
            </Text>
          </HStack>
        </Flex>
      </Box>
    </>
  );
};

export default UnauthNavbar;
