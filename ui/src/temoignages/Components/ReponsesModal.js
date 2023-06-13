import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import MonacoEditor from "@monaco-editor/react";

const ReponsesModal = ({ rawResponses, onClose, isOpen }) => {
  return (
    <>
      <Modal onClose={onClose} isOpen={isOpen} size="4xl" isCentered scrollBehavior="inside">
        <ModalOverlay bg="blackAlpha.300" />
        <ModalContent>
          <ModalHeader p={4}>Réponses brutes</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {rawResponses && (
              <MonacoEditor
                id="questionnaire"
                name="questionnaire"
                language="json"
                theme="vs-light"
                height="50vh"
                defaultValue={JSON.stringify(rawResponses, null, 2)}
                options={{
                  minimap: {
                    enabled: false,
                  },
                  automaticLayout: true,
                  readOnly: true,
                }}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ReponsesModal;
