import React from "react";
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
} from "@chakra-ui/react";

const DeleteTemoignageConfirmationModal = ({
  temoignage,
  onClose,
  isOpen,
  setDeletedTemoignageId,
}) => {
  if (!temoignage) return null;
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">Confirmation de suppression de témoignage</ModalHeader>
        <ModalCloseButton />
        <ModalBody textAlign="center" mt="15">
          Êtes-vous sûr de vouloir supprimer le témoignage{" "}
          <Text fontWeight="semibold">{temoignage._id}</Text>
        </ModalBody>
        <ModalFooter alignItems="center" justifyContent="center" mt="15">
          <Button
            size="lg"
            variant="solid"
            colorScheme="purple"
            onClick={() => {
              setDeletedTemoignageId(temoignage._id);
              onClose();
            }}
          >
            Supprimer
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteTemoignageConfirmationModal;
