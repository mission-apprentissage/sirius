import React, { useState, useEffect, useContext } from "react";
import {
  IconButton,
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
import { DeleteIcon, ViewIcon } from "@chakra-ui/icons";
import { _delete } from "../../utils/httpClient";
import { UserContext } from "../../context/UserContext";
import ReponsesModal from "./ReponsesModal";
import DeleteTemoignageConfirmationModal from "./DeleteTemoignageConfirmationModal";
import { msToTime } from "../../utils/temoignage";

const TemoignagesTable = ({ temoignages }) => {
  const [userContext] = useContext(UserContext);
  const [selectedTemoignageToShow, setSelectedTemoignageToShow] = useState(null);
  const [deletedTemoignageId, setDeletedTemoignageId] = useState(null);
  const [temoignageToDelete, setTemoignageToDelete] = useState(null);
  const [displayedTemoignages, setDisplayedTemoignages] = useState(null);

  const {
    isOpen: isOpenReponses,
    onOpen: onOpenReponses,
    onClose: onCloseReponses,
  } = useDisclosure();
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();

  const toast = useToast();

  useEffect(() => {
    if (temoignages.length > 0) {
      setDisplayedTemoignages(temoignages.reverse());
    }
  }, [temoignages]);

  useEffect(() => {
    const deleteTemoignage = async () => {
      const result = await _delete(`/api/temoignages/${deletedTemoignageId}`, userContext.token);

      if (result?.modifiedCount === 1) {
        toast({
          title: "Témoignage supprimé",
          description: "Le témoignage a bien été supprimée",
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
      const filteredDisplayedTemoignage = temoignages.filter(
        (temoignage) => temoignage._id !== deletedTemoignageId
      );
      setDisplayedTemoignages(filteredDisplayedTemoignage);
      setDeletedTemoignageId(null);
    };
    if (deletedTemoignageId) {
      deleteTemoignage();
    }
  }, [deletedTemoignageId, toast]);

  return (
    <Box w="60%" m="25px auto">
      <TableContainer my={4} p={2} rounded="md" w="100%" boxShadow="md" bg="white">
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Durée</Th>
              <Th>Date de création</Th>
              <Th>Date mis à jour</Th>
              <Th># de réponses</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {displayedTemoignages?.map((temoignage) => {
              const duration = msToTime(
                new Date(temoignage.updatedAt).getTime() - new Date(temoignage.createdAt).getTime()
              );
              return (
                <Tr key={temoignage._id}>
                  <Td>{duration}</Td>
                  <Td>
                    <Tooltip
                      label={new Date(temoignage.createdAt).toLocaleString("fr-FR", {
                        timeZone: "Europe/Paris",
                      })}
                      hasArrow
                      arrowSize={15}
                    >
                      {new Date(temoignage.createdAt).toLocaleString("fr-FR")}
                    </Tooltip>
                  </Td>
                  <Td>
                    <Tooltip
                      label={new Date(temoignage.updatedAt).toLocaleString("fr-FR", {
                        timeZone: "Europe/Paris",
                      })}
                      hasArrow
                      arrowSize={15}
                    >
                      {new Date(temoignage.updatedAt).toLocaleString("fr-FR")}
                    </Tooltip>
                  </Td>
                  <Td>{Object.keys(temoignage.reponses).length}</Td>
                  <Td>
                    <IconButton
                      aria-label="Voir le témoignage"
                      variant="outline"
                      colorScheme="purple"
                      icon={<ViewIcon />}
                      mx={2}
                      onClick={() => {
                        setSelectedTemoignageToShow(temoignage.reponses);
                        onOpenReponses();
                      }}
                    />
                    <IconButton
                      aria-label="Supprimer le témoignage"
                      variant="outline"
                      colorScheme="purple"
                      icon={<DeleteIcon />}
                      mx={2}
                      onClick={() => {
                        setTemoignageToDelete(temoignage);
                        onOpenDelete();
                      }}
                    />
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
      <ReponsesModal
        onClose={onCloseReponses}
        isOpen={isOpenReponses}
        rawResponses={selectedTemoignageToShow}
      />
      <DeleteTemoignageConfirmationModal
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        temoignage={temoignageToDelete}
        setDeletedTemoignageId={setDeletedTemoignageId}
      />
    </Box>
  );
};

export default TemoignagesTable;
