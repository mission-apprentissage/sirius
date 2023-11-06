import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Text,
  Stack,
  Button,
  ModalCloseButton,
} from "@chakra-ui/react";
import parse from "html-react-parser";

const VerbatimsModal = ({ question, verbatims, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent py="8" px="4" bgColor="brand.blue.100" width="90%" borderRadius="20px">
        <ModalCloseButton />
        <ModalHeader textAlign="center" color="brand.blue.700">
          <Text fontWeight="600" fontSize="md">
            {parse(question)}
          </Text>
        </ModalHeader>
        <ModalBody>
          <Stack textAlign="center">
            {verbatims?.map((verbatim, index) => (
              <Text key={index} fontWeight="400" fontSize="sm">
                «
                {typeof verbatim === "object"
                  ? verbatim?.content
                  : verbatim?.content || verbatim || ""}
                »
              </Text>
            ))}
          </Stack>
        </ModalBody>
        <ModalFooter display="flex" justifyContent="center" alignItems="center">
          <Button
            size="lg"
            variant="solid"
            onClick={onClose}
            bgColor="brand.blue.700"
            color="white"
            colorScheme="brand.blue"
          >
            Fermer
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default VerbatimsModal;
