import React, { useContext } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { USER_STATUS } from "../constants";

const PendingAccount = () => {
  const [userContext] = useContext(UserContext);
  const navigate = useNavigate();

  if (userContext.currentUserStatus === USER_STATUS.ACTIVE) {
    navigate("/");
  }

  return (
    <Flex direction="column" w="100%" m="auto">
      <Flex direction="column" w="80%" m="auto" bgColor="white" borderRadius="12px" mt="12">
        <Text align="center" color="purple.500" p="8">
          Votre compte est en cours de validation, un email vous sera envoyé une fois votre demande
          confirmée.
        </Text>
      </Flex>
    </Flex>
  );
};

export default PendingAccount;
