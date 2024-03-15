import React from "react";
import Tooltip from "react-simple-tooltip";
import { fr } from "@codegouvfr/react-dsfr";
import { DIPLOME_TYPE_MATCHER } from "../../../constants";
import { ToolTipContainer } from "../../styles/shared.style";

export const EtablissementCardBody = ({ diplome }) => (
  <p>{DIPLOME_TYPE_MATCHER[diplome] || diplome}</p>
);

export const DiplomeTypeCardBody = ({ isGestionnaire, formation }) => (
  <div>
    <p>
      {isGestionnaire ? (
        <Tooltip
          background="var(--background-default-grey)"
          border="var(--border-default-grey)"
          color="var(--text-default-grey)"
          placement="right"
          content={
            <ToolTipContainer>
              Cet établissement est gestionnaire et rattaché à votre compte Sirius
            </ToolTipContainer>
          }
        >
          <span className={fr.cx("fr-icon-award-fill")} aria-hidden={true} />
        </Tooltip>
      ) : (
        <Tooltip
          background="var(--background-default-grey)"
          border="var(--border-default-grey)"
          color="var(--text-default-grey)"
          placement="right"
          content={
            <ToolTipContainer>
              Cet établissement est formateur et dispense des formations pour un établissement
              gestionnaire
            </ToolTipContainer>
          }
        >
          <span className={fr.cx("fr-icon-award-line")} aria-hidden={true} />
        </Tooltip>
      )}
      {formation.etablissement_formateur_entreprise_raison_sociale ||
        formation.etablissement_formateur_enseigne}
    </p>
    <p>
      {formation.etablissement_formateur_adresse} {formation.localite}
    </p>
    <p>N° SIRET : {formation.etablissement_formateur_siret}</p>
  </div>
);
