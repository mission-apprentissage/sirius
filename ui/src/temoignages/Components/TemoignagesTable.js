import React, { useState } from "react";
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
  Tooltip,
} from "@chakra-ui/react";
import { DeleteIcon, ViewIcon } from "@chakra-ui/icons";
import ReponsesModal from "./ReponsesModal";

const TemoignagesTable = ({ temoignages }) => {
  const [selectedTemoignageToShow, setSelectedTemoignageToShow] = useState(null);
  const {
    isOpen: isOpenReponses,
    onOpen: onOpenReponses,
    onClose: onCloseReponses,
  } = useDisclosure();

  return (
    <>
      <TableContainer my={4} p={2} rounded="md" w="100%" boxShadow="md" bg="white">
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Id</Th>
              <Th>Date de création</Th>
              <Th>Date mis à jour</Th>
              <Th># de réponses</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {temoignages?.map((temoignage, index) => (
              <Tr key={temoignage._id}>
                <Td>{temoignage._id}</Td>
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
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <ReponsesModal
        onClose={onCloseReponses}
        isOpen={isOpenReponses}
        rawResponses={selectedTemoignageToShow}
      />
    </>
  );
};

export default TemoignagesTable;
