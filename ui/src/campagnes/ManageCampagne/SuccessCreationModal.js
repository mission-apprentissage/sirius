import React from "react";
import { fr } from "@codegouvfr/react-dsfr";
import UnderConstruction from "../../assets/images/under_construction.svg";

const SuccessCreationModal = ({ modal }) => {
  return (
    <modal.Component
      title={
        <>
          <span className={fr.cx("fr-icon-arrow-right-line")} />
          Bravo ! Vous venez de créer des campagnes
        </>
      }
      size="small"
      buttons={[
        {
          doClosesModal: true,
          children: "Fermer",
        },
      ]}
    >
      <p>Vous pouvez maintenant gérer leur diffusion depuis cette page.</p>
      <img src={UnderConstruction} alt="" />
    </modal.Component>
  );
};

export default SuccessCreationModal;
