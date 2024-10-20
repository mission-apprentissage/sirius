import { fr } from "@codegouvfr/react-dsfr";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";

import { UserContext } from "../../context/UserContext";
import useDeleteCampagnes from "../../hooks/useDeleteCampagnes";
import { isPlural } from "../utils";

const DeleteCampagneConfirmationModal = ({ modal, selectedCampagnes, setSelectedCampagnes }) => {
  const [userContext] = useContext(UserContext);
  const queryClient = useQueryClient();

  const persistedEtablissement = userContext.user?.etablissements?.length ? userContext.user?.etablissements[0] : "";

  const { mutate: deleteCampagnes, isLoading, error } = useDeleteCampagnes();

  const handleOnClick = () => {
    deleteCampagnes(
      { campagneIds: selectedCampagnes, siret: persistedEtablissement.siret },
      {
        onSuccess: () => {
          setSelectedCampagnes([]);
          queryClient.invalidateQueries(["campagnes", "campagnesSorted", "fetchCampagnesStatistics"]);
          modal.close();
        },
      }
    );
  };

  return (
    <modal.Component
      title={
        <>
          <span className={fr.cx("fr-icon-arrow-right-line")} />
          Supprimer des campagnes
        </>
      }
      size="small"
      buttons={[
        {
          doClosesModal: true,
          children: "Annuler",
          disabled: isLoading,
        },
        {
          doClosesModal: false,
          children: "Supprimer",
          type: "button",
          onClick: handleOnClick,
          disabled: isLoading,
        },
      ]}
    >
      <p>
        Vous vous apprêtez à supprimer{" "}
        <b>
          {selectedCampagnes.length} campagne
          {isPlural(selectedCampagnes.length)}
        </b>
        . Certaines d’entre elles regroupent peut-être déjà des témoignages
      </p>
      <p>Êtes-vous certain·e de vouloir {selectedCampagnes.length > 1 ? "les" : "la"} supprimer ?</p>
      {error && <Alert closable description={error.message || "Une erreur est survenue."} severity="error" />}
    </modal.Component>
  );
};

export default DeleteCampagneConfirmationModal;
