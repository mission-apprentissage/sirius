import React from "react";
import { fr } from "@codegouvfr/react-dsfr";
import Tooltip from "react-simple-tooltip";
import { isPlural } from "../../utils";
import {
  AccordionLabelByDiplomeTypeContainer,
  AccordionLabelByEtablissementContainer,
} from "./accordions.style";
import { ToolTipContainer } from "../../styles/shared.style";
import { CAMPAGNES_DISPLAY_MODE, DIPLOME_TYPE_MATCHER } from "../../../constants";

const EtablissementTitleAccordion = ({ isGestionnaire, firstFormation, selectedCount }) => (
  <AccordionLabelByEtablissementContainer>
    <div>
      {isGestionnaire ? (
        <Tooltip
          background="var(--background-default-grey)"
          border="var(--border-default-grey)"
          color="var(--text-default-grey)"
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
      <h5>
        {firstFormation.etablissement_formateur_entreprise_raison_sociale ||
          firstFormation.etablissement_formateur_enseigne}
      </h5>
    </div>
    <p>
      {firstFormation.etablissement_formateur_adresse} {firstFormation.localite}
    </p>
    <p>N° SIRET : {firstFormation.etablissement_formateur_siret}</p>
    <p>
      {selectedCount} formation
      {isPlural(selectedCount)} sélectionnée
      {isPlural(selectedCount)}
    </p>
  </AccordionLabelByEtablissementContainer>
);

const DiplomeTypeTitleAccordion = ({ diplomeType, selectedCount }) => (
  <AccordionLabelByDiplomeTypeContainer>
    <h5>{DIPLOME_TYPE_MATCHER[diplomeType] || diplomeType}</h5>
    <p>
      {selectedCount} formation
      {isPlural(selectedCount)} sélectionnée
      {isPlural(selectedCount)}
    </p>
  </AccordionLabelByDiplomeTypeContainer>
);

const AccordionLabel = ({
  displayMode,
  element,
  firstFormation,
  formationSelectedCountByDiplomeType,
}) => {
  if (displayMode === CAMPAGNES_DISPLAY_MODE.DIPLOME) {
    return (
      <DiplomeTypeTitleAccordion
        diplomeType={element}
        selectedCount={formationSelectedCountByDiplomeType}
      />
    );
  }
  if (displayMode === CAMPAGNES_DISPLAY_MODE.ETABLISSEMENT) {
    const isGestionnaire =
      firstFormation.etablissement_formateur_siret ===
      firstFormation.etablissement_gestionnaire_siret;
    return (
      <EtablissementTitleAccordion
        isGestionnaire={isGestionnaire}
        firstFormation={firstFormation}
        selectedCount={formationSelectedCountByDiplomeType}
      />
    );
  }

  return null;
};

export default AccordionLabel;
