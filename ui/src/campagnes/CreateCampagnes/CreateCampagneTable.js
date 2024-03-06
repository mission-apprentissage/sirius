import React from "react";
import Tooltip from "react-simple-tooltip";
import { fr } from "@codegouvfr/react-dsfr";
import { Table } from "@codegouvfr/react-dsfr/Table";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import CellInputConfigure from "../Shared/CellInput/CellInputConfigure";
import CellInputSeatsConfigure from "../Shared/CellInput/CellInputSeatsConfigure";
import { isPlural } from "../../campagnes/utils";
import { ToolTipContainer, HeaderItem, FormationContainer } from "../styles/shared.style";
import { DIPLOME_TYPE_MATCHER, campagnesDisplayMode } from "../../constants";

const headers = [
  "",
  "Formation",
  <HeaderItem key="nomCampagne">Nom d'usage</HeaderItem>,
  <HeaderItem key="debut">
    <span className={fr.cx("fr-icon--sm fr-icon-calendar-event-fill")} aria-hidden={true} />
    Début
  </HeaderItem>,
  <HeaderItem key="fin">
    <span className={fr.cx("fr-icon--sm fr-icon-calendar-2-fill")} aria-hidden={true} />
    Fin
  </HeaderItem>,
  <HeaderItem key="apprenties">
    <span className={fr.cx("fr-icon--sm fr-icon-team-fill")} aria-hidden={true} />
    Apprenti·es
  </HeaderItem>,
];

const data = (
  selectedFormations,
  selectedFormationsAction,
  setSelectedFormationsAction,
  formik,
  displayMode
) => {
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
      <FormationContainer key={`${formation._id}-formation`}>
        <p>
          <b>{formation.intitule_long}</b>
        </p>
        <div>
          <p>{formation.tags.join("-")} </p>
          {formation?.duree && parseInt(formation?.duree) && (
            <p>
              · En {formation.duree} an{isPlural(parseInt(formation.duree))}
            </p>
          )}
        </div>
        {displayMode === campagnesDisplayMode[0].value && (
          <Tooltip
            background="var(--background-default-grey)"
            border="var(--border-default-grey)"
            color="var(--text-default-grey)"
            placement="right"
            content={
              <ToolTipContainer>
                <p>
                  {formation.etablissement_formateur_adresse} {formation.localite}
                </p>
                <p>N° SIRET : {formation.etablissement_formateur_siret}</p>
                {formation.etablissement_formateur_siret ===
                formation.etablissement_gestionnaire_siret ? (
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
              {formation.etablissement_formateur_entreprise_raison_sociale ||
                formation.etablissement_formateur_enseigne}
            </p>
          </Tooltip>
        )}
        {displayMode === campagnesDisplayMode[1].value && (
          <p>{DIPLOME_TYPE_MATCHER[formation.diplome] || formation.diplome}</p>
        )}
      </FormationContainer>,
      <CellInputConfigure
        key={`${formation._id}-nomCampagne`}
        id={formation._id}
        name="nomCampagne"
        formik={formik}
        type="text"
        placeholder="Ex: BAC PRO MV"
      />,
      <CellInputConfigure
        key={`${formation._id}-startDate`}
        id={formation._id}
        name="startDate"
        type="date"
        formik={formik}
      />,
      <CellInputConfigure
        key={`${formation._id}-endDate`}
        id={formation._id}
        name="endDate"
        type="date"
        formik={formik}
      />,
      <CellInputSeatsConfigure
        key={`${formation._id}-seats`}
        id={formation._id}
        name="seats"
        formik={formik}
      />,
    ];
  });
};

const CreateCampagneTable = ({
  selectedFormations,
  selectedFormationsAction,
  setSelectedFormationsAction,
  formik,
  displayMode,
}) => {
  if (!selectedFormations.length) return null;
  return (
    <Table
      headers={headers}
      data={data(
        selectedFormations,
        selectedFormationsAction,
        setSelectedFormationsAction,
        formik,
        displayMode
      )}
    />
  );
};

export default CreateCampagneTable;
