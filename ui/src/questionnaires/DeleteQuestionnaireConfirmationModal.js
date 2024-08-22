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

const DeleteQuestionnaireConfirmationModal = ({
  questionnaire,
  onClose,
  isOpen,
  setDeletedQuestionnaireId,
}) => {
  if (!questionnaire) return null;
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">Confirmation de suppression de questionnaire</ModalHeader>
        <ModalCloseButton />
        <ModalBody textAlign="center" mt="15">
          Êtes-vous sûr de vouloir supprimer le questionnaire{" "}
          <Text fontWeight="semibold">{questionnaire.nom}</Text>
        </ModalBody>
        <ModalFooter alignItems="center" justifyContent="center" mt="15">
          <Button
            size="lg"
            variant="solid"
            colorScheme="purple"
            onClick={() => {
              setDeletedQuestionnaireId(questionnaire.id);
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

export default DeleteQuestionnaireConfirmationModal;
