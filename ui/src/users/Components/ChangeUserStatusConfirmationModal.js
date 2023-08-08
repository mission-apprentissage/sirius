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

const ChangeUserStatusConfirmationModal = ({
  user,
  onClose,
  isOpen,
  selectedStatus,
  setRefetchData,
}) => {
  const [userContext] = useContext(UserContext);
  const toast = useToast();

  if (!user) return null;

  const handleChangeStatusConfirmation = async () => {
    const result = await _put(
      `/api/users/${user._id}`,
      { status: selectedStatus },
      userContext.token
    );
    if (result?.modifiedCount === 1) {
      toast({
        title: "Status modifié",
        description: "Le status a bien été modifié",
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
          <Button
            size="lg"
            variant="solid"
            colorScheme="purple"
            onClick={handleChangeStatusConfirmation}
          >
            Confirmer
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ChangeUserStatusConfirmationModal;
