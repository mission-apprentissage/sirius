import { fr } from "@codegouvfr/react-dsfr";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import React from "react";
import { Tooltip } from "react-tooltip";

import { DIPLOME_TYPE_MATCHER } from "../../constants";
import { DiplomeLabel } from "../Shared/CampagnesTable/campagnesTable.style";
import { CampagnesCreatedCount, EtablissementLabelContainer } from "../styles/createCampagnes.style";
import { Duration, FormationContainer, IntituleFormation, StyledBadge } from "../styles/shared.style";
import { formatDate, isPlural } from "../utils";

const pickFormationTableRows = ({ remoteFormations, selectedFormations, setSelectedFormations, campagnes }) => {
  return remoteFormations?.map((formation) => {
    const alreadyCreatedCampagnes = campagnes?.filter((campagne) => campagne.formation.catalogueId === formation._id);
    const alreadyCreatedCount = alreadyCreatedCampagnes.length;
    const isSelected = selectedFormations.some((selectedFormation) => selectedFormation._id === formation._id);
    const selectedFormationIds = selectedFormations.map((selectedFormation) => selectedFormation._id);

    return [
      <Checkbox
        key={formation.id}
        options={[
          {
            nativeInputProps: {
              name: `campagne-${formation.id}`,
              checked: isSelected,
              onChange: () => {
                setSelectedFormations((prevValue) =>
                  isSelected
                    ? prevValue.filter((selectedFormation) => selectedFormation._id !== formation._id)
                    : [...prevValue, formation]
                );
              },
            },
          },
        ]}
      />,
      <>
        <FormationContainer key={formation._id}>
          <div>
            <StyledBadge small>{formation.tags.join("-")}</StyledBadge>
            {formation?.duree && parseInt(formation?.duree) && (
              <Duration>
                · En {formation.duree} an{isPlural(parseInt(formation.duree))}
              </Duration>
            )}
          </div>
          <IntituleFormation>{formation.intitule_long}</IntituleFormation>
        </FormationContainer>
        <EtablissementLabelContainer>
          <p data-tooltip-id={`tooltip-gestionnaire-formateur-${formation._id}`}>
            {formation.etablissement_formateur_entreprise_raison_sociale || formation.etablissement_formateur_enseigne}
          </p>
          <Tooltip
            id={`tooltip-gestionnaire-formateur-${formation._id}`}
            variant="light"
            opacity={1}
            style={{ zIndex: 99999, boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", maxWidth: "500px" }}
          >
            <p>
              {`${formation.lieu_formation_adresse}, ${formation.code_postal} ${formation.localite}` ||
                formation.lieu_formation_adresse_computed}
            </p>
            <p>N° Siret: {formation.etablissement_formateur_siret}</p>
            {formation.etablissement_formateur_siret === formation.etablissement_gestionnaire_siret ? (
              <p>
                <span className={fr.cx("fr-icon-award-fill")} aria-hidden={true} /> Cet établissement est gestionnaire
                et rattaché à votre compte Sirius
              </p>
            ) : (
              <p>
                <span className={fr.cx("fr-icon-award-line")} aria-hidden={true} /> Cet établissement est formateur et
                dispense des formations pour un établissement gestionnaire
              </p>
            )}
          </Tooltip>
        </EtablissementLabelContainer>
        <DiplomeLabel>{DIPLOME_TYPE_MATCHER[formation.diplome] || formation.diplome}</DiplomeLabel>
      </>,
      <>
        <CampagnesCreatedCount data-tooltip-id={`tooltip-already-created-${formation._id}`}>
          {alreadyCreatedCount}
        </CampagnesCreatedCount>
        {alreadyCreatedCount > 0 && (
          <Tooltip
            id={`tooltip-already-created-${formation._id}`}
            variant="light"
            opacity={1}
            style={{ zIndex: 99999, boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)" }}
          >
            <p>
              Campagne{isPlural(alreadyCreatedCount)} créée{isPlural(alreadyCreatedCount)} pour cette formation :
            </p>
            <ul>
              {alreadyCreatedCampagnes.map((campagne) => (
                <li key={campagne.id}>
                  {formatDate(campagne.startDate)} - {formatDate(campagne.endDate)} {campagne.temoignagesCount}{" "}
                  répondant{isPlural(campagne.temoignagesCount)}
                </li>
              ))}
            </ul>
          </Tooltip>
        )}
      </>,
    ];
  });
};

export default pickFormationTableRows;
