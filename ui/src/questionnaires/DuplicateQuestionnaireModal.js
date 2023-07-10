import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import QuestionnaireForm from "./QuestionnaireForm";

const DuplicateModalQuestionnaire = ({ questionnaire, onClose, isOpen }) => {
  if (!questionnaire) return null;
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Dupliquer {questionnaire.nom}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <QuestionnaireForm duplicatedQuestionnaire={questionnaire} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DuplicateModalQuestionnaire;
