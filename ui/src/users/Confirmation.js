import React, { useContext } from "react";
import { Flex, Text, Spinner, Stack, Image, Box, useBreakpoint } from "@chakra-ui/react";
import { Navigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import useConfirmUser from "../hooks/useConfirmUser";
import SiriusInTheSky from "../assets/images/sirius_in_the_sky.svg";
import FormError from "../Components/Form/FormError";

const Confirmation = () => {
  const { search } = useLocation();
  const token = new URLSearchParams(search).get("token");
  const [userContext] = useContext(UserContext);
  const [data, loading, error] = useConfirmUser(token);
  const breakpoint = useBreakpoint({ ssr: false });

  const isMobile = breakpoint === "base";

  if ((!userContext.loading && userContext.token) || !token)
    return <Navigate to="/campagnes/gestion" />;

  if (loading) return <Spinner />;

  return (
    <Flex flexDirection="column" justifyContent="center" alignItems="center" w="100%">
      <Stack
        spacing="64px"
        flexDir={isMobile ? "column" : "row"}
        justifyContent="center"
        alignItems="center"
      >
        <Image src={SiriusInTheSky} alt="" w="300px" />
        {data && data.success && !error ? (
          <Box w={isMobile ? "100%" : "400px"}>
            <Text color="brand.blue.700" fontSize="3xl" fontWeight="600" my="0">
              Inscription confirmée !
            </Text>
            <Text color="brand.blue.700" mt="15px">
              Votre adresse email a bien été confirmée. Notre équipe s’occupe de valider votre
              compte. Vous recevrez un mail dès qu’il sera activé.
            </Text>
          </Box>
        ) : (
          <FormError
            title="La validation de l'adresse email a échouée"
            hasError={error}
            errorMessages={[error]}
          />
        )}
      </Stack>
    </Flex>
  );
};

export default Confirmation;
