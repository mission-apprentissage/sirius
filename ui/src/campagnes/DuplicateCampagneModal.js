import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import CampagneForm from "./CampagneForm";

const DuplicateModalCampagne = ({ campagne, onClose, isOpen }) => {
  if (!campagne) return null;
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Dupliquer {campagne.nomCampagne}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <CampagneForm campagne={campagne} isDuplicating={true} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DuplicateModalCampagne;
