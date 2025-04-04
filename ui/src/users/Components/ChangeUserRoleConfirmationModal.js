import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useContext } from "react";

import { UserContext } from "../../context/UserContext";
import { apiPut } from "../../utils/api.utils";

const ChangeUserRoleConfirmationModal = ({ user, onClose, isOpen, selectedRole, setRefetchData }) => {
  const [userContext] = useContext(UserContext);
  const toast = useToast();

  if (!user) return null;

  const handleChangeRoleConfirmation = async () => {
    const result = await apiPut(`/api/users/:id`, {
      params: { id: user.id },
      body: {
        role: selectedRole,
      },
      headers: {
        Authorization: `Bearer ${userContext.token}`,
      },
    });
    if (result === true) {
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
          <Button size="lg" variant="solid" colorScheme="brand.blue" onClick={handleChangeRoleConfirmation}>
            Confirmer
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ChangeUserRoleConfirmationModal;
