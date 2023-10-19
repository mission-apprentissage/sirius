import React, { useContext } from "react";
import { Flex, Text, Box, Image, Stack, useBreakpoint } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { USER_STATUS } from "../constants";
import SiriusInTheSky from "../assets/images/sirius_in_the_sky.svg";

const PendingAccount = () => {
  const [userContext] = useContext(UserContext);
  const navigate = useNavigate();
  const breakpoint = useBreakpoint({ ssr: false });
  const isMobile = breakpoint === "base";
  if (userContext.currentUserStatus === USER_STATUS.ACTIVE) {
    navigate("/");
  }

  return (
    <Flex flexDirection="column" justifyContent="center" alignItems="center" w="100%" h="80vh">
      <Stack
        spacing="64px"
        flexDir={isMobile ? "column" : "row"}
        justifyContent="center"
        alignItems="center"
      >
        <Image src={SiriusInTheSky} alt="" w="300px" />
        <Box w={isMobile ? "100%" : "400px"}>
          <Text color="brand.blue.700">
            Votre compte est en cours de validation, un email vous sera envoyé une fois votre
            demande confirmée.
          </Text>
        </Box>
      </Stack>
    </Flex>
  );
};

export default PendingAccount;
