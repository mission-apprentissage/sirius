import { fr } from "@codegouvfr/react-dsfr";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import React from "react";
import { Tooltip } from "react-tooltip";

import { DIPLOME_TYPE_MATCHER } from "../../constants";
import CellInputConfigure from "../ManageCampagne/CellInput/CellInputConfigure";
import CellInputSeatsConfigure from "../ManageCampagne/CellInput/CellInputSeatsConfigure";
import { DiplomeLabel } from "../Shared/CampagnesTable/campagnesTable.style";
import { EtablissementLabelContainer } from "../styles/createCampagnes.style";
import { Duration, FormationContainer, IntituleFormation, StyledBadge } from "../styles/shared.style";
import { isPlural } from "../utils";

const createCampagneTableRows = ({
  selectedFormations,
  selectedFormationsAction,
  setSelectedFormationsAction,
  formik,
}) => {
  return selectedFormations?.map((formation) => {
    return [
      <Checkbox
        key={`${formation._id}-checkbox`}
        options={[
          {
            nativeInputProps: {
              name: `formation-${formation._id}`,
              checked: selectedFormationsAction.includes(formation._id),
              onChange: () => {
                setSelectedFormationsAction((prevValue) =>
                  prevValue.includes(formation._id)
                    ? prevValue.filter((id) => id !== formation._id)
                    : [...prevValue, formation._id]
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
          <p data-tooltip-id={`tooltip-already-created-${formation._id}`}>
            {formation.etablissement_formateur_entreprise_raison_sociale || formation.etablissement_formateur_enseigne}
          </p>
          <Tooltip
            id={`tooltip-already-created-${formation._id}`}
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
      <CellInputConfigure
        key={`${formation._id}-nomCampagne`}
        id={formation._id}
        name="nomCampagne"
        formik={formik}
        type="text"
        placeholder="Ex: BAC PRO MV"
        width="170px"
      />,
      <CellInputConfigure
        key={`${formation._id}-startDate`}
        id={formation._id}
        name="startDate"
        type="date"
        formik={formik}
        width="170px"
      />,
      <CellInputConfigure
        key={`${formation._id}-endDate`}
        id={formation._id}
        name="endDate"
        type="date"
        formik={formik}
        width="170px"
      />,
      <CellInputSeatsConfigure
        key={`${formation._id}-seats`}
        id={formation._id}
        name="seats"
        formik={formik}
        width="100px"
      />,
    ];
  });
};

export default createCampagneTableRows;
