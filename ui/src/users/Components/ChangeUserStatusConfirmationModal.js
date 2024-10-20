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
import { _put } from "../../utils/httpClient";

const ChangeUserStatusConfirmationModal = ({ user, onClose, isOpen, selectedStatus, setRefetchData }) => {
  const [userContext] = useContext(UserContext);
  const toast = useToast();

  if (!user) return null;

  const handleChangeStatusConfirmation = async () => {
    const userResult = await _put(`/api/users/${user.id}`, { status: selectedStatus }, userContext.token);
    if (userResult === true) {
      toast({
        title: "Status modifié",
        description: `Le status a bien été modifié.`,
        status: "success",
        duration: 5000,
      });
    } else {
      toast({
        title: "Une erreur est survenue",
        status: "error",
        duration: 5000,
      });
    }

    setRefetchData(true);
    onClose();
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">Confirmation de changement de status</ModalHeader>
        <ModalCloseButton />
        <ModalBody textAlign="center" mt="15">
          Le status de
          <Text fontWeight="semibold">
            {user.firstName} {user.lastName}
          </Text>
          sera modifié de{" "}
          <Text as="span" fontWeight="semibold">
            {user.status}
          </Text>{" "}
          à{" "}
          <Text as="span" fontWeight="semibold">
            {selectedStatus}
          </Text>
        </ModalBody>
        <ModalFooter alignItems="center" justifyContent="center" mt="15">
          <Button size="lg" variant="solid" colorScheme="brand.blue" onClick={handleChangeStatusConfirmation}>
            Confirmer
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ChangeUserStatusConfirmationModal;
