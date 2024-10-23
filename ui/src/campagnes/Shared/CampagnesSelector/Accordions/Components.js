import { fr } from "@codegouvfr/react-dsfr";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import Tooltip from "react-simple-tooltip";

import { DIPLOME_TYPE_MATCHER } from "../../../../constants";
import { ToolTipContainer } from "../../../styles/shared.style";
import { isPlural } from "../../../utils";
import {
  AccordionLabelByDiplomeTypeContainer,
  AccordionLabelByEtablissementContainer,
  ButtonContainer,
} from "./accordions.style";

const CheckboxLabel = ({ count }) => (
  <b>{count ? `${count} campagne${isPlural(count)} sélectionnée${isPlural(count)}` : "Tout sélectionner"}</b>
);

export const SelectAllCampagnesCheckbox = ({
  count,
  campagneIds,
  name,
  setSelectedCampagneIds,
  search,
  searchedCampagnes,
}) => {
  const handleSelectAll = (e, campagneIds) => {
    setSelectedCampagneIds((prevValues) => {
      if (e.target.checked && search) {
        return searchedCampagnes.map((campagne) => campagne.id);
      } else if (e.target.checked) {
        return [...new Set([...prevValues, ...campagneIds])];
      }
      return prevValues.filter((selectedCampagne) => !campagneIds.includes(selectedCampagne));
    });
  };

  return (
    <ButtonContainer>
      <Checkbox
        options={[
          {
            label: <CheckboxLabel count={count} />,
            nativeInputProps: {
              name: `selectAll${name}`,
              checked: search ? searchedCampagnes.length === count : count === campagneIds.length,
              onChange: (e) => handleSelectAll(e, campagneIds),
            },
          },
        ]}
      />
    </ButtonContainer>
  );
};

export const AccordionLabel = ({ diplome = null, etablissementFormateur = null, departement = null, count }) => {
  if (diplome) {
    return (
      <AccordionLabelByDiplomeTypeContainer>
        <h5>{DIPLOME_TYPE_MATCHER[diplome] || diplome}</h5>
        <p>
          {count} campagne
          {isPlural(count)} sélectionnée
          {isPlural(count)}
        </p>
      </AccordionLabelByDiplomeTypeContainer>
    );
  } else if (etablissementFormateur) {
    return (
      <AccordionLabelByEtablissementContainer>
        <div>
          {etablissementFormateur.etablissementFormateurSiret ===
          etablissementFormateur.etablissementGestionnaireSiret ? (
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
                  Cet établissement est formateur et dispense des formations pour un établissement gestionnaire
                </ToolTipContainer>
              }
            >
              <span className={fr.cx("fr-icon-award-line")} aria-hidden={true} />
            </Tooltip>
          )}
          <h5>
            {etablissementFormateur.etablissementFormateurEntrepriseRaisonSociale ||
              etablissementFormateur.etablissementFormateurEnseigne}
          </h5>
        </div>
        <p>
          {etablissementFormateur.lieuFormationAdresseComputed ||
            `${etablissementFormateur.lieuFormationAdresse}, ${etablissementFormateur.codePostal} ${etablissementFormateur.localite}`}
        </p>
        <p>N° SIRET : {etablissementFormateur.etablissementFormateurSiret}</p>
        <p>
          {count} campagne
          {isPlural(count)} sélectionnée
          {isPlural(count)}
        </p>
      </AccordionLabelByEtablissementContainer>
    );
  } else if (departement) {
    return (
      <AccordionLabelByDiplomeTypeContainer>
        <h5>{departement}</h5>
        <p>
          {count} campagne
          {isPlural(count)} sélectionnée
          {isPlural(count)}
        </p>
      </AccordionLabelByDiplomeTypeContainer>
    );
  }
};
