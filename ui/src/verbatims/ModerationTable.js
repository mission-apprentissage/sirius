import React, { useEffect, useContext } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Tooltip,
  Box,
  Text,
  Select,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import useFetchVerbatims from "../hooks/useFetchVerbatims";
import { VERBATIM_STATUS } from "../constants";
import { _patch } from "../utils/httpClient";
import { UserContext } from "../context/UserContext";

const ModerationTable = ({
  questionnaireId,
  setEtablissementList,
  selectedEtablissement,
  setFormationList,
  selectedFormation,
}) => {
  const [verbatims, loadingVerbatims, errorVerbatims] = useFetchVerbatims(
    questionnaireId,
    selectedEtablissement,
    selectedFormation
  );
  const toast = useToast();
  const [userContext] = useContext(UserContext);

  useEffect(() => {
    if (!loadingVerbatims && !errorVerbatims && verbatims?.length) {
      const etablissementList = verbatims.map((verbatims) => {
        if (!verbatims.etablissement) return;
        return {
          value: verbatims.etablissementSiret,
          label: verbatims.etablissement,
        };
      });
      const formationList = verbatims.map((verbatims) => {
        if (!verbatims.formation) return;
        return {
          value: verbatims.formationId,
          label: verbatims.formation,
        };
      });

      etablissementList.push(
        { value: "", label: "Tous" },
        { value: "Non renseigné", label: "Non renseigné" }
      );

      formationList.push({ value: "", label: "Tous" });

      const uniqueEtablissementList = etablissementList
        .filter(Boolean)
        .filter(
          (etablissement, index, self) =>
            index === self.findIndex((t) => t.value === etablissement.value)
        );

      const uniqueFormationList = formationList
        .filter(Boolean)
        .filter(
          (formation, index, self) => index === self.findIndex((t) => t.value === formation.value)
        );

      setEtablissementList(uniqueEtablissementList);
      setFormationList(uniqueFormationList);
    }
  }, [verbatims]);

  const handleVerbatimStatusChange = async (e, verbatim, questionId, temoignageId) => {
    const status = e.target.value;
    const payload = {
      status,
      content: verbatim,
    };

    const response = await _patch(
      `/api/verbatims/${temoignageId}`,
      {
        questionId,
        payload,
      },
      userContext.token
    );
    if (response.acknowledged) {
      toast({
        title: "Statut du verbatim mis à jour",
        description: `Le statut du verbatim a été mis à jour avec succès`,
        status: "success",
        duration: 3000,
      });
    } else {
      toast({
        title: "Erreur lors de la mise à jour du statut du verbatim",
        status: "error",
        duration: 3000,
      });
    }
  };

  if (loadingVerbatims || errorVerbatims) return <Spinner />;

  return (
    <Box w="90%" m="25px auto">
      <TableContainer my={4} p={2} rounded="md" w="100%" boxShadow="md" bgColor="white">
        <Table size="md">
          <Thead>
            <Tr>
              <Th>Verbatim</Th>
              <Th>Status</Th>
              <Th>Établissement</Th>
              <Th>Formation</Th>
              <Th>Nom de la campagne</Th>
              <Th>Question</Th>
              <Th>Crée le</Th>
            </Tr>
          </Thead>
          <Tbody>
            {verbatims?.map((verbatim) => {
              const status = VERBATIM_STATUS[verbatim.value.status] || VERBATIM_STATUS.PENDING;
              return (
                <Tr key={verbatim.temoignageId + verbatim.key}>
                  <Td>
                    <Text sx={{ whiteSpace: "normal", wordWrap: "break-word", minWidth: "400px" }}>
                      {verbatim.value?.content || verbatim.value}
                    </Text>
                  </Td>
                  <Td>
                    <Select
                      size="sm"
                      onChange={(e) =>
                        handleVerbatimStatusChange(
                          e,
                          verbatim.value?.content || verbatim.value,
                          verbatim.key,
                          verbatim.temoignageId
                        )
                      }
                      defaultValue={VERBATIM_STATUS[status]}
                      minW="150px"
                    >
                      {Object.keys(VERBATIM_STATUS).map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </Select>
                  </Td>
                  <Td>{verbatim.etablissement}</Td>
                  <Td>{verbatim.formation}</Td>
                  <Td>{verbatim.campagneName}</Td>
                  <Td sx={{ whiteSpace: "normal", wordWrap: "break-word", minWidth: "500px" }}>
                    {verbatim.title}
                  </Td>
                  <Td>
                    <Tooltip
                      label={new Date(verbatim.createdAt).toLocaleString("fr-FR", {
                        timeZone: "Europe/Paris",
                      })}
                      hasArrow
                      arrowSize={15}
                    >
                      {new Date(verbatim.createdAt).toLocaleDateString("fr-FR")}
                    </Tooltip>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ModerationTable;
