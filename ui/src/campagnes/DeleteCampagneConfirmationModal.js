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

const DeleteCampagneConfirmationModal = ({ campagne, onClose, isOpen, setDeletedCampagneId }) => {
  if (!campagne) return null;
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">Confirmation de suppression de campagne</ModalHeader>
        <ModalCloseButton />
        <ModalBody textAlign="center" mt="15">
          Êtes-vous sûr de vouloir supprimer la campagne{" "}
          <Text fontWeight="semibold">{campagne.nomCampagne}</Text>
        </ModalBody>
        <ModalFooter alignItems="center" justifyContent="center" mt="15">
          <Button
            size="lg"
            variant="solid"
            colorScheme="purple"
            onClick={() => {
              setDeletedCampagneId(campagne._id);
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

export default DeleteCampagneConfirmationModal;
