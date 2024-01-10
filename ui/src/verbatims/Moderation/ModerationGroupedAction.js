import React from "react";
import { useToast } from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { VERBATIM_STATUS, VERBATIM_STATUS_LABELS } from "../../constants";
import { _patch } from "../../utils/httpClient";

const ModerationGroupedAction = ({
  verbatims,
  selectedVerbatims,
  setSelectedVerbatims,
  setShouldRefresh,
  userContext,
}) => {
  const toast = useToast();

  const handleVerbatimsStatusChange = async (e) => {
    const status = e.value;

    const updatedVerbatims = verbatims
      .filter((verbatim) => selectedVerbatims.includes(`${verbatim.temoignageId}_${verbatim.key}`))
      .map((verbatim) => ({
        temoignageId: verbatim.temoignageId,
        questionId: verbatim.key,
        payload: {
          status,
          content: typeof verbatim.value === "string" ? verbatim.value : verbatim.value.content,
        },
      }));

    const response = await _patch(`/api/verbatims/multi`, updatedVerbatims, userContext.token);
    const acknowledgedCount = response.filter((res) => res.acknowledged).length;

    if (
      response.length === selectedVerbatims.length &&
      acknowledgedCount === selectedVerbatims.length
    ) {
      toast({
        title: "Statut des verbatism mis à jour",
        description: `Le statut des verbatims a été mis à jour avec succès`,
        status: "success",
        duration: 3000,
      });
      setSelectedVerbatims([]);
    } else {
      toast({
        title: "Erreur lors de la mise à jour du statut des verbatim",
        status: "error",
        duration: 3000,
      });
    }
    setShouldRefresh(true);
  };
  return (
    <Select
      size="lg"
      onChange={handleVerbatimsStatusChange}
      placeholder="Action"
      isDisabled={!selectedVerbatims.length}
      options={Object.keys(VERBATIM_STATUS).map((status) => ({
        label: VERBATIM_STATUS_LABELS[status],
        value: status,
      }))}
    />
  );
};

export default ModerationGroupedAction;
