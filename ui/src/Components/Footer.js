import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Box, Image, Text, Link, useBreakpoint } from "@chakra-ui/react";
import gouv from "../assets/images/gouv.svg";

const Footer = () => {
  const breakpoint = useBreakpoint({ ssr: false });
  const isMobile = breakpoint === "base";
  const [userContext] = useContext(UserContext);

  const isConnected = !!userContext?.token;

  return (
    <Box
      display="flex"
      flexDirection={isMobile ? "column" : "row"}
      alignItems="center"
      justifyContent="center"
      px={isMobile ? "2" : "6"}
      bgColor="brand.blue.100"
      w="100%"
    >
      <Box
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
        alignItems="center"
        justifyContent="flex-start"
        borderBottom={isMobile ? "1px solid #1A365D" : "none"}
        w="80%"
        m={isMobile ? "auto" : "0"}
        py="2"
      >
        <Image src={gouv} alt="" w="80px" />
        <Text color="brand.black.500">Sirius est proposé par :</Text>
        <Box
          display="flex"
          flexDirection={isMobile ? "column" : "row"}
          justifyContent="flex-start"
          w="70%"
          m={isMobile ? "auto" : "0"}
          mt={isMobile ? "2" : "0"}
          px={isMobile ? "4" : "0"}
        >
          <Box mx={isMobile ? "0" : "1"}>
            <Link
              href="https://www.onisep.fr/"
              target="_blank"
              rel="noreferrer"
              textDecoration="underline"
              fontWeight="semibold"
              color="brand.black.500"
            >
              → onisep.fr
            </Link>
          </Box>
          <Box mx={isMobile ? "0" : "1"}>
            <Link
              href="https://travail-emploi.gouv.fr/"
              target="_blank"
              rel="noreferrer"
              textDecoration="underline"
              fontWeight="semibold"
              color="brand.black.500"
            >
              → Ministère du travail
            </Link>
          </Box>
        </Box>
      </Box>
      <Box
        display="flex"
        justifyContent={isMobile ? "center" : "flex-start"}
        alignItems={isMobile ? "center" : "flex-start"}
        my="2"
        w={isMobile ? "100%" : "20%"}
      >
        <Link href="/cgu" fontSize={isMobile ? "xs" : "inherit"}>
          CGU
        </Link>
        <Text mx={isMobile ? "1" : "4"}>|</Text>
        <Link
          href={
            isConnected ? "/mentions-information-backoffice" : "/mentions-information-questionnaire"
          }
          fontSize={isMobile ? "xs" : "inherit"}
        >
          Mentions d’information
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;
