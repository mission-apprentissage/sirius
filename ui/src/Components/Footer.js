import { Box, Image, Text, Link, useBreakpoint } from "@chakra-ui/react";
import gouv from "../assets/images/gouv.svg";
const Footer = () => {
  const breakpoint = useBreakpoint({ ssr: false });
  const isMobile = breakpoint === "base";
  return (
    <Box w="100%" display="flex" flexDirection="column" px={isMobile ? "2" : "28"}>
      <Box
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
        alignItems="center"
        justifyContent="flex-start"
        borderBottom="1px solid #1A365D"
        w="100%"
        m={isMobile ? "auto" : "0"}
        pb="4"
      >
        <Image src={gouv} alt="" w="150px" />
        <Text color="purple.900">
          <Link
            href="https://travail-emploi.gouv.fr/"
            target="_blank"
            rel="noreferrer"
            textDecoration="underline"
            fontWeight="semibold"
            color="purple.900"
          >
            Sirius
          </Link>{" "}
          est proposé par les services suivants :
        </Text>
        <Box
          display="flex"
          flexDirection={isMobile ? "column" : "row"}
          justifyContent={isMobile ? "flex-start" : "space-between"}
          w="100%"
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
              color="purple.900"
            >
              onisep.fr
            </Link>
          </Box>
          <Box mx={isMobile ? "0" : "1"}>
            <Link
              href="https://beta.gouv.fr/startups/?incubateur=mission-inserjeunes"
              target="_blank"
              rel="noreferrer"
              textDecoration="underline"
              fontWeight="semibold"
              color="purple.900"
            >
              Mission interministérielle InserJeunes
            </Link>
          </Box>
          <Box mx={isMobile ? "0" : "1"}>
            <Link
              href="https://travail-emploi.gouv.fr/"
              target="_blank"
              rel="noreferrer"
              textDecoration="underline"
              fontWeight="semibold"
              color="purple.900"
            >
              Ministère du travail
            </Link>
          </Box>
        </Box>
      </Box>
      <Box
        display="flex"
        w="100%"
        justifyContent={isMobile ? "center" : "flex-start"}
        alignItems={isMobile ? "center" : "flex-start"}
        my="2"
      >
        <Link href="/cgu" fontSize={isMobile ? "xs" : "inherit"}>
          CGU
        </Link>
        <Text mx={isMobile ? "1" : "4"}>|</Text>
        <Link href="/politique-confidentialite" fontSize={isMobile ? "xs" : "inherit"}>
          Politique de confidentialité
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;
