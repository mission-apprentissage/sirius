import React from "react";
import Tooltip from "react-simple-tooltip";
import { fr } from "@codegouvfr/react-dsfr";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { formatDate, isPlural } from "../utils";
import {
  TemoignagesCount,
  EtablissementLabelContainer,
} from "../Shared/CampagnesTable/campagnesTable.style";
import { FormationContainer, ToolTipContainer } from "../styles/shared.style";
import { DIPLOME_TYPE_MATCHER } from "../../constants";

const resultsCampagneTableRows = ({
  displayedCampagnes,
  selectedCampagneIds,
  setSelectedCampagneIds,
}) => {
  return displayedCampagnes.map((campagne) => {
    const formation = campagne.formation;
    const isSelected = selectedCampagneIds.includes(campagne.id);

    const handleOnChange = () => {
      setSelectedCampagneIds((prevValue) =>
        isSelected ? prevValue.filter((item) => item !== campagne.id) : [...prevValue, campagne.id]
      );
    };

    return [
      <Checkbox
        key={`${campagne.id}-id`}
        options={[
          {
            nativeInputProps: {
              name: `campagne-${campagne.id}`,
              checked: isSelected,
              onChange: handleOnChange,
            },
          },
        ]}
      />,
      <>
        <FormationContainer key={`${campagne.id}-formation`}>
          <p>
            <b>{formation.intituleLong}</b>
          </p>
          <div>
            <p>{formation.tags.join("-")} </p>
            {formation?.duree && parseInt(formation?.duree) && (
              <p>
                · En {formation.duree} an{isPlural(parseInt(formation.duree))}
              </p>
            )}
          </div>
        </FormationContainer>
        <EtablissementLabelContainer>
          <Tooltip
            background="var(--background-default-grey)"
            border="var(--border-default-grey)"
            color="var(--text-default-grey)"
            placement="right"
            content={
              <ToolTipContainer>
                <p>
                  {formation.lieuFormationAdresseComputed ||
                    `${formation.lieuFormationAdresse}, ${formation.codePostal} ${formation.localite}`}
                </p>
                <p>N° Siret: {formation.etablissementFormateurSiret}</p>
                {formation.etablissementFormateurSiret ===
                formation.etablissementGestionnaireSiret ? (
                  <p>
                    <span className={fr.cx("fr-icon-award-fill")} aria-hidden={true} /> Cet
                    établissement est gestionnaire et rattaché à votre compte Sirius
                  </p>
                ) : (
                  <p>
                    <span className={fr.cx("fr-icon-award-line")} aria-hidden={true} /> Cet
                    établissement est formateur et dispense des formations pour un établissement
                    gestionnaire
                  </p>
                )}
              </ToolTipContainer>
            }
          >
            <p>
              {formation.etablissementFormateurEntrepriseRaisonSociale ||
                formation.etablissementFormateurEnseigne}
            </p>
          </Tooltip>
        </EtablissementLabelContainer>

        <p>{DIPLOME_TYPE_MATCHER[formation.diplome] || formation.diplome}</p>
      </>,
      campagne.nomCampagne,
      formatDate(campagne.startDate),
      formatDate(campagne.endDate),
      campagne.seats === 0 ? "Illimité" : campagne.seats,
      <TemoignagesCount key={`${campagne.id}-temoignageCount`}>
        {campagne.seats > 0
          ? Math.round((campagne.temoignagesCount * 100) / campagne.seats) + "%"
          : campagne.temoignagesCount}
      </TemoignagesCount>,
    ];
  });
};

export default resultsCampagneTableRows;
