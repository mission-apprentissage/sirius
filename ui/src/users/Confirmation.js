import React, { useContext } from "react";
import { Flex, Link, Text, Spinner } from "@chakra-ui/react";
import { Navigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import useConfirmUser from "../hooks/useConfirmUser";

const Confirmation = () => {
  const { search } = useLocation();
  const token = new URLSearchParams(search).get("token");
  const [userContext] = useContext(UserContext);
  const [data, loading, error] = useConfirmUser(token);

  if ((!userContext.loading && userContext.token) || !token)
    return <Navigate to="/campagnes/gestion" />;

  if (loading) return <Spinner />;

  return (
    <Flex direction="column" w="100%" m="auto">
      <Flex direction="column" m="auto" bgColor="white" borderRadius="12px" mt="12">
        {data && data.success && !error ? (
          <Text align="center" color="purple.500" p="8">
            Votre compte a bien été confirmé. Vous pouvez désormais vous connecter en cliquant{" "}
            <Link href="/connexion" textDecoration="underline">
              ici
            </Link>
            .
          </Text>
        ) : (
          <Text align="center" color="purple.500" p="8">
            Une erreur est survenue lors de la confirmation de votre compte. Veuillez réessayer.
          </Text>
        )}
      </Flex>
    </Flex>
  );
};

export default Confirmation;
