import React, { useState, useContext } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { _delete } from "../../utils/httpClient";
import { UserContext } from "../../context/UserContext";
import { isPlural } from "../utils";

const DeleteCampagneConfirmationModal = ({
  modal,
  selectedCampagnes,
  setSelectedCampagnes,
  setDisplayedCampagnes,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [userContext] = useContext(UserContext);
  const persistedEtablissement = JSON.parse(localStorage.getItem("etablissements"));

  const handleOnClick = async () => {
    try {
      setIsSubmitting(true);
      const response = await _delete(
        `/api/campagnes?ids=${selectedCampagnes}&siret=${persistedEtablissement.siret}`,
        userContext.token
      );

      if (response.acknowledged) {
        setSelectedCampagnes([]);
        setDisplayedCampagnes((prevValues) =>
          prevValues.filter((campagne) => !selectedCampagnes.includes(campagne._id))
        );
        modal.close();
      } else {
        setError("Une erreur est survenue.");
      }
    } catch (error) {
      setError("Une erreur est survenue.");
    }
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
          disabled: isSubmitting,
        },
        {
          doClosesModal: false,
          children: "Supprimer",
          type: "button",
          onClick: handleOnClick,
          disabled: isSubmitting,
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
      <p>
        Êtes-vous certain·e de vouloir {selectedCampagnes.length > 1 ? "les" : "la"} supprimer ?
      </p>
      {error && <Alert closable description={error} severity="error" />}
    </modal.Component>
  );
};

export default DeleteCampagneConfirmationModal;
