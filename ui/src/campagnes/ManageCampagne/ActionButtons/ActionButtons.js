import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Tooltip from "react-simple-tooltip";
import BeatLoader from "react-spinners/BeatLoader";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import DeleteCampagneConfirmationModal from "../DeleteCampagneConfirmationModal";
import { _get } from "../../../utils/httpClient";
import { isPlural } from "../../utils";
import { ActionButtonsContainer, ToolTipContainer } from "./actionButtons.style";

const modal = createModal({
  id: "delete-campagne-modal",
  isOpenedByDefault: true,
});

const ActionButtons = ({
  displayedCampagnes,
  setDisplayedCampagnes,
  selectedCampagnes,
  setSelectedCampagnes,
  userContext,
}) => {
  const [isLoadingDownload, setIsLoadingDownload] = useState(false);

  const navigate = useNavigate();

  const handleDownload = async () => {
    setIsLoadingDownload(true);
    const persistedEtablissement = JSON.parse(localStorage.getItem("etablissements"));

    const response = await _get(
      `/api/campagnes/export/pdf/multi?ids=${selectedCampagnes}&siret=${persistedEtablissement.siret}`,
      userContext.token
    );

    const base64Data = `data:application/pdf;base64,${response.data}`;

    const a = document.createElement("a");
    a.href = base64Data;
    a.download = response.fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(base64Data);
    setIsLoadingDownload(false);
  };

  return (
    <>
      <ActionButtonsContainer>
        <Checkbox
          disabled={!displayedCampagnes.length}
          options={[
            {
              label: selectedCampagnes.length
                ? `${selectedCampagnes.length} sélectionnée${isPlural(selectedCampagnes.length)}`
                : "Tout sélectionner",
              nativeInputProps: {
                name: "selectAll",
                checked:
                  selectedCampagnes.length === displayedCampagnes.length &&
                  displayedCampagnes.length > 0,
                onChange: (e) => {
                  if (e.target.checked) {
                    setSelectedCampagnes(displayedCampagnes.map((campagne) => campagne._id));
                  } else {
                    setSelectedCampagnes([]);
                  }
                },
              },
            },
          ]}
        />
        <Tooltip
          background="var(--background-default-grey)"
          border="var(--border-default-grey)"
          color="var(--text-default-grey)"
          placement="right"
          content={
            <ToolTipContainer>
              Générez un PDF à partir de votre sélection pour partager le questionnaire aux
              apprenti·es associé·es. Plus d’infos via le <b>Guide de diffusion</b> en haut de cette
              page
            </ToolTipContainer>
          }
        >
          <Button
            iconId="fr-icon-file-download-line"
            onClick={handleDownload}
            disabled={!selectedCampagnes.length || isLoadingDownload}
          >
            {!isLoadingDownload ? (
              "Partager"
            ) : (
              <BeatLoader
                color="var(--background-action-high-blue-france)"
                size={10}
                aria-label="Loading Spinner"
              />
            )}
          </Button>
        </Tooltip>
        <Tooltip
          background="var(--background-default-grey)"
          border="var(--border-default-grey)"
          color="var(--text-default-grey)"
          placement="right"
          content={
            <ToolTipContainer>
              Consultez les témoignages recueillis pour la/les campagne(s) sélectionnée(s).
            </ToolTipContainer>
          }
        >
          <Button
            priority="secondary"
            iconId="fr-icon-quote-fill"
            onClick={() => navigate("/campagnes/resultats")}
            disabled={!selectedCampagnes.length}
          >
            Voir les résultats
          </Button>
        </Tooltip>
        <Button
          priority="secondary"
          iconId="fr-icon-delete-line"
          onClick={() => modal.open()}
          disabled={!selectedCampagnes.length}
        >
          Supprimer
        </Button>
      </ActionButtonsContainer>
      <DeleteCampagneConfirmationModal
        modal={modal}
        selectedCampagnes={selectedCampagnes}
        setSelectedCampagnes={setSelectedCampagnes}
        setDisplayedCampagnes={setDisplayedCampagnes}
      />
    </>
  );
};

export default ActionButtons;
