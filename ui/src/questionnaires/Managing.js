import React, { useState, useEffect, useContext } from "react";
import {
  IconButton,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useDisclosure,
  useToast,
  Tooltip,
  Box,
} from "@chakra-ui/react";
import { DeleteIcon, ViewIcon, EditIcon, CopyIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

import { _delete } from "../utils/httpClient";
import { useGet } from "../common/hooks/httpHooks";
import { UserContext } from "../context/UserContext";
import DuplicateQuestionnaireModal from "./DuplicateQuestionnaireModal";
import DeleteQuestionnaireConfirmationModal from "./DeleteQuestionnaireConfirmationModal";

const QuestionnaireTable = ({
  questionnaires,
  navigate,
  setQuestionnaireToDuplicate,
  onOpenDuplication,
  setQuestionnaireToDelete,
  onOpenDeletion,
}) => {
  return (
    <>
      <TableContainer my={4} p={2} rounded="md" w="100%" boxShadow="md" bg="white">
        <Table size="md">
          <Thead>
            <Tr>
              <Th>Nom</Th>
              <Th>Crée le</Th>
              <Th>Modifié le</Th>
              <Th>Crée par</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {questionnaires?.map((questionnaire) => (
              <Tr key={questionnaire._id}>
                <Td sx={{ maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis" }}>
                  <Tooltip label={questionnaire.nom} hasArrow arrowSize={15}>
                    {questionnaire.nom}
                  </Tooltip>
                </Td>
                <Td>
                  <Tooltip
                    label={new Date(questionnaire.createdAt).toLocaleString("fr-FR", {
                      timeZone: "Europe/Paris",
                    })}
                    hasArrow
                    arrowSize={15}
                  >
                    {new Date(questionnaire.createdAt).toLocaleDateString("fr-FR")}
                  </Tooltip>
                </Td>
                <Td>
                  <Tooltip
                    label={new Date(questionnaire.updatedAt).toLocaleString("fr-FR", {
                      timeZone: "Europe/Paris",
                    })}
                    hasArrow
                    arrowSize={15}
                  >
                    {new Date(questionnaire.updatedAt).toLocaleDateString("fr-FR")}
                  </Tooltip>
                </Td>
                <Td sx={{ maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {questionnaire.createdBy[0].firstName} {questionnaire.createdBy[0].lastName}
                </Td>
                <Td>
                  <IconButton
                    aria-label="Aperçu du questionnaire"
                    variant="outline"
                    colorScheme="purple"
                    icon={<ViewIcon />}
                    onClick={() =>
                      window.open(
                        `/questionnaires/${questionnaire._id}/apercu`,
                        "_blank",
                        "noreferrer"
                      )
                    }
                    mx={2}
                  />
                  <IconButton
                    aria-label="Dupliquer le questionnaire"
                    variant="outline"
                    colorScheme="purple"
                    icon={<CopyIcon />}
                    onClick={() => {
                      setQuestionnaireToDuplicate(questionnaire);
                      onOpenDuplication();
                    }}
                    mx={2}
                  />
                  <IconButton
                    aria-label="Modifier le questionnaire"
                    variant="outline"
                    colorScheme="purple"
                    icon={<EditIcon />}
                    onClick={() => navigate(`/questionnaires/${questionnaire._id}/edition`)}
                    mx={2}
                  />
                  <IconButton
                    aria-label="Supprimer le questionnaire"
                    variant="outline"
                    colorScheme="purple"
                    icon={<DeleteIcon />}
                    onClick={() => {
                      setQuestionnaireToDelete(questionnaire);
                      onOpenDeletion();
                    }}
                    mx={2}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

const Managing = () => {
  const [userContext] = useContext(UserContext);
  const [deletedQuestionnaireId, setDeletedQuestionnaireId] = useState(null);
  const [displayedQuestionnaires, setDisplayedQuestionnaires] = useState([]);
  const [questionnaireToDuplicate, setQuestionnaireToDuplicate] = useState(null);
  const [questionnaireToDelete, setQuestionnaireToDelete] = useState(null);

  const navigate = useNavigate();
  const toast = useToast();

  const {
    isOpen: isOpenDuplication,
    onOpen: onOpenDuplication,
    onClose: onCloseDuplication,
  } = useDisclosure();
  const {
    isOpen: isOpenDeletion,
    onOpen: onOpenDeletion,
    onClose: onCloseDeletion,
  } = useDisclosure();

  const [questionnaires, loading, error] = useGet(`/api/questionnaires/`);

  useEffect(() => {
    if (questionnaires.length > 0) {
      setDisplayedQuestionnaires(questionnaires.reverse());
    }
  }, [questionnaires]);

  useEffect(() => {
    const deleteQuestionnaire = async () => {
      const result = await _delete(
        `/api/questionnaires/${deletedQuestionnaireId}`,
        userContext.token
      );

      if (result?.modifiedCount === 1) {
        toast({
          title: "Questionnaire supprimé",
          description: "Le questionnaire a bien été supprimé",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Une erreur est survenue",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
      const filteredDisplayedQuestionnaire = displayedQuestionnaires.filter(
        (questionnaire) => questionnaire._id !== deletedQuestionnaireId
      );
      setDisplayedQuestionnaires(filteredDisplayedQuestionnaire);
      setDeletedQuestionnaireId(null);
    };
    if (deletedQuestionnaireId) {
      deleteQuestionnaire();
    }
  }, [deletedQuestionnaireId, displayedQuestionnaires, toast]);

  if (loading || error) return <Spinner size="xl" />;

  return (
    <Box display="flex" flexDirection="column" width="80%" m="auto">
      {displayedQuestionnaires.length ? (
        <>
          <QuestionnaireTable
            questionnaires={displayedQuestionnaires}
            navigate={navigate}
            onOpenDuplication={onOpenDuplication}
            setDeletedQuestionnaireId={setDeletedQuestionnaireId}
            setQuestionnaireToDuplicate={setQuestionnaireToDuplicate}
            setQuestionnaireToDelete={setQuestionnaireToDelete}
            onOpenDeletion={onOpenDeletion}
          />
          <DuplicateQuestionnaireModal
            isOpen={isOpenDuplication}
            onOpen={onOpenDuplication}
            onClose={onCloseDuplication}
            questionnaire={questionnaireToDuplicate}
          />
          <DeleteQuestionnaireConfirmationModal
            isOpen={isOpenDeletion}
            onOpen={onOpenDeletion}
            onClose={onCloseDeletion}
            questionnaire={questionnaireToDelete}
            setDeletedQuestionnaireId={setDeletedQuestionnaireId}
          />
        </>
      ) : null}
    </Box>
  );
};

export default Managing;
