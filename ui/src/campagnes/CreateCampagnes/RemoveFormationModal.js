import React from "react";
import { fr } from "@codegouvfr/react-dsfr";

const RemoveFormationModal = ({
  modal,
  selectedFormationsAction,
  setSelectedFormationsAction,
  setSelectedFormations,
}) => {
  const handleClickedRemoveFormation = () => {
    setSelectedFormations((prevValue) =>
      prevValue.filter((formationId) => !selectedFormationsAction.includes(formationId))
    );
    setSelectedFormationsAction([]);

    modal.close();
  };

  return (
    <modal.Component
      title={
        <>
          <span className={fr.cx("fr-icon-arrow-right-line")} />
          Retirer des formations
        </>
      }
      size="small"
      buttons={[
        {
          doClosesModal: true,
          children: "Annuler",
        },
        {
          doClosesModal: false,
          children: "Retirer",
          onClick: handleClickedRemoveFormation,
        },
      ]}
    >
      <p>
        Vous vous apprêtez à retirer ces formations de votre sélection. Vous ne souhaitez plus créer
        de campagnes pour ces formations ?
      </p>
      <p>
        <b>Pas d’inquiétude vous pourrez toujours les créer plus tard.</b>
      </p>
    </modal.Component>
  );
};

export default RemoveFormationModal;
