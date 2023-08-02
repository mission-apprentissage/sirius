import React from "react";
import {
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  VStack,
  Link,
} from "@chakra-ui/react";
import QRCode from "react-qr-code";

const LinkCampagneModal = ({ isOpen, onClose, campagne }) => {
  if (!campagne) return null;
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Lien et QR code</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {campagne && (
            <Center>
              <VStack spacing={6}>
                {campagne.formation?.data?.intitule_long ? (
                  <>
                    <Text fontSize="lg">
                      {campagne.etablissement?.data?.onisep_nom ||
                        campagne.etablissement?.data?.enseigne}
                    </Text>
                    <Text fontSize="lg">{campagne.formation?.data?.intitule_long}</Text>
                  </>
                ) : (
                  <Text fontSize="lg">{campagne.nomCampagne}</Text>
                )}
                <QRCode
                  value={`${window.location.protocol}//${window.location.hostname}/campagnes/${campagne._id}`}
                  fgColor="#6B46C1"
                />
                <Link
                  href={`/campagnes/${campagne._id}`}
                  isExternal
                  mt={4}
                  fontSize="sm"
                  wordBreak="break-all"
                  maxW="100%"
                >{`${window.location.protocol}//${window.location.hostname}/campagnes/${campagne._id}`}</Link>
              </VStack>
            </Center>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LinkCampagneModal;
