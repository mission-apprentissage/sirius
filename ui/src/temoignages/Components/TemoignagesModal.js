import {
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  CardFooter,
  Button,
} from "@chakra-ui/react";

const TemoignagesModal = ({ question, responses }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!responses.length) return null;

  return (
    <>
      <CardFooter>
        <Button onClick={onOpen}>Voir plus</Button>
      </CardFooter>
      <Modal onClose={onClose} isOpen={isOpen} size="xl" isCentered scrollBehavior="inside">
        <ModalOverlay bg="blackAlpha.300" />
        <ModalContent>
          <ModalHeader p={4}>{question}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {responses?.map((response, index) => (
              <Text key={index} fontSize="xl" pl={4} mb={6}>
                {response}
              </Text>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TemoignagesModal;
