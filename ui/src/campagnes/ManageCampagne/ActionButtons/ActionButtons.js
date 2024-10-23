/* eslint-disable no-undef */
import { Button } from "@codegouvfr/react-dsfr/Button";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Tooltip from "react-simple-tooltip";
import BeatLoader from "react-spinners/BeatLoader";

import { USER_ROLES } from "../../../constants";
import { UserContext } from "../../../context/UserContext";
import { apiGet } from "../../../utils/api.utils";
import DeleteCampagneConfirmationModal from "../DeleteCampagneConfirmationModal";
import { ActionButtonsContainer, ToolTipContainer } from "./actionButtons.style";

const modal = createModal({
  id: "delete-campagne-modal",
  isOpenedByDefault: false,
});

const ActionButtons = ({ selectedCampagneIds, setSelectedCampagneIds }) => {
  const [isLoadingDownload, setIsLoadingDownload] = useState(false);
  const [userContext] = useContext(UserContext);
  const navigate = useNavigate();

  const handleDownload = async () => {
    setIsLoadingDownload(true);
    const persistedEtablissement = userContext.user?.etablissements?.length ? userContext.user?.etablissements[0] : "";

    const response = await apiGet("/api/campagnes/export/pdf/multi", {
      querystring: {
        ids: selectedCampagneIds,
        siret: userContext.user?.role === USER_ROLES.ADMIN ? "" : persistedEtablissement?.siret,
      },
      headers: {
        Authorization: `Bearer ${userContext.token}`,
      },
    });

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
        <Tooltip
          background="var(--background-default-grey)"
          border="var(--border-default-grey)"
          color="var(--text-default-grey)"
          placement="right"
          content={
            <ToolTipContainer>
              Générez un PDF à partir de votre sélection pour partager le questionnaire aux apprenti·es associé·es. Plus
              d’infos via le <b>Guide de diffusion</b> en haut de cette page
            </ToolTipContainer>
          }
        >
          <Button
            iconId="fr-icon-file-download-line"
            onClick={handleDownload}
            disabled={!selectedCampagneIds.length || isLoadingDownload}
          >
            {!isLoadingDownload ? (
              "Partager"
            ) : (
              <BeatLoader color="var(--background-action-high-blue-france)" size={10} aria-label="Loading Spinner" />
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
            onClick={() => navigate(`/campagnes/resultats?campagneIds=${selectedCampagneIds.join(",")}`)}
            disabled={!selectedCampagneIds.length}
          >
            Voir les résultats
          </Button>
        </Tooltip>
        <Button
          priority="secondary"
          iconId="fr-icon-delete-line"
          onClick={() => modal.open()}
          disabled={!selectedCampagneIds.length}
        >
          Supprimer
        </Button>
      </ActionButtonsContainer>
      <DeleteCampagneConfirmationModal
        modal={modal}
        selectedCampagnes={selectedCampagneIds}
        setSelectedCampagnes={setSelectedCampagneIds}
      />
    </>
  );
};

export default ActionButtons;
