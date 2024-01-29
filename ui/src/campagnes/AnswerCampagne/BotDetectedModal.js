import React from "react";
import { Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody } from "@chakra-ui/react";

const BotDetectedModal = ({ isOpen }) => {
  return (
    <Modal isOpen={isOpen} size="xl" isCentered closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent p="22px" bgColor="brand.blue.100" width="100%" borderRadius="20px">
        <ModalHeader color="brand.blue.700">
          <Text fontWeight="600" fontSize="30px" mb="16px">
            Nous avons détecté un comportement anormal
          </Text>
          <Text fontWeight="400" fontSize="16px" color="brand.black.500">
            Merci de réessayer plus tard ou de nos envoyer un email à :
          </Text>
          <Text fontWeight="400" fontSize="16px" color="brand.black.500" mt="10px">
            <a href="mailto:contact-sirius@inserjeunes.beta.gouv.fr">
              <u>contact-sirius@inserjeunes.beta.gouv.fr</u>
            </a>
          </Text>
        </ModalHeader>
        <ModalBody></ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default BotDetectedModal;
