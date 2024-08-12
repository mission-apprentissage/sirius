import React, { useContext } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  Text,
  useToast,
} from "@chakra-ui/react";
import { _put } from "../../utils/httpClient";
import { UserContext } from "../../context/UserContext";

const ChangeUserRoleConfirmationModal = ({
  user,
  onClose,
  isOpen,
  selectedRole,
  setRefetchData,
}) => {
  const [userContext] = useContext(UserContext);
  const toast = useToast();

  if (!user) return null;

  const handleChangeRoleConfirmation = async () => {
    const result = await _put(`/api/users/${user.id}`, { role: selectedRole }, userContext.token);
    if (result?.modifiedCount === 1) {
      toast({
        title: "Role modifié",
        description: "Le role a bien été modifié",
        status: "success",
        duration: 5000,
      });
      setRefetchData(true);
    } else {
      toast({
        title: "Une erreur est survenue",
        status: "error",
        duration: 5000,
      });
    }
    onClose();
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">Confirmation de changement de role</ModalHeader>
        <ModalCloseButton />
        <ModalBody textAlign="center" mt="15">
          Le role de
          <Text fontWeight="semibold">
            {user.firstName} {user.lastName}
          </Text>
          sera modifié de{" "}
          <Text as="span" fontWeight="semibold">
            {user.role}
          </Text>{" "}
          à{" "}
          <Text as="span" fontWeight="semibold">
            {selectedRole}
          </Text>
        </ModalBody>
        <ModalFooter alignItems="center" justifyContent="center" mt="15">
          <Button
            size="lg"
            variant="solid"
            colorScheme="brand.blue"
            onClick={handleChangeRoleConfirmation}
          >
            Confirmer
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ChangeUserRoleConfirmationModal;
