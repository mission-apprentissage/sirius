import { Button } from "@codegouvfr/react-dsfr/Button";
import { Select } from "@codegouvfr/react-dsfr/SelectNext";
import { ToggleSwitch } from "@codegouvfr/react-dsfr/ToggleSwitch";
import Tooltip from "react-simple-tooltip";
import { VERBATIM_STATUS, VERBATIM_STATUS_LABELS } from "../../constants";
import { ModerationActionsContainer } from "../moderationPage.style";

const verbatimsStatusOptions = Object.keys(VERBATIM_STATUS).map((status) => ({
  value: status,
  label: VERBATIM_STATUS_LABELS[status],
}));

const ModerationActions = ({
  selectedVerbatims,
  showOnlyDiscrepancies,
  setShowOnlyDiscrepancies,
  patchVerbatims,
}) => {
  const handleAcceptClassification = () => {
    if (!selectedVerbatims.length) return;
    const updatedVerbatims = selectedVerbatims.map((verbatim) => {
      const highestScore = Object.entries(verbatim.scores)
        .filter(([key]) => key !== "NOT_VALIDATED")
        .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)[0];

      const isGem = verbatim.scores.GEM.avis === "oui";
      const status = isGem ? VERBATIM_STATUS.GEM : highestScore[0];

      return {
        _id: verbatim._id,
        status: status,
      };
    });
    patchVerbatims(updatedVerbatims);
  };

  const handleArbitraryClassification = (status) => {
    if (!selectedVerbatims.length) return;
    const updatedVerbatims = selectedVerbatims.map((verbatim) => {
      return {
        _id: verbatim._id,
        status: status,
      };
    });
    patchVerbatims(updatedVerbatims);
  };

  return (
    <ModerationActionsContainer>
      <ToggleSwitch
        label="Afficher uniquement les verbatims avec une différence de classification"
        onChange={() => setShowOnlyDiscrepancies(!showOnlyDiscrepancies)}
        checked={showOnlyDiscrepancies}
        inputTitle="the-title"
        labelPosition="right"
        showCheckedHint={false}
      />
      <div>
        <Tooltip
          background="var(--background-default-grey)"
          border="var(--border-default-grey)"
          color="var(--text-default-grey)"
          placement="bottom"
          content={
            <p>
              Valider le premier choix de classification dans l'ordre affiché pour tous les
              verbatims sélectionnés
            </p>
          }
        >
          <Button disabled={!selectedVerbatims?.length} onClick={handleAcceptClassification}>
            Accepter la classification{" "}
            {selectedVerbatims?.length ? `(${selectedVerbatims?.length})` : null}{" "}
          </Button>
        </Tooltip>
        <Select
          label="Classifier la sélection en"
          disabled={!selectedVerbatims?.length}
          nativeSelectProps={{
            onChange: (event) => handleArbitraryClassification(event.target.value),
          }}
          options={verbatimsStatusOptions}
        />
      </div>
    </ModerationActionsContainer>
  );
};

export default ModerationActions;
