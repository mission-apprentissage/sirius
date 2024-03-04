import React from "react";
import { fr } from "@codegouvfr/react-dsfr";
import { Table } from "@codegouvfr/react-dsfr/Table";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import CellInputConfigure from "./CellInputConfigure";
import { isPlural } from "../../campagnes/utils";
import {
  HeaderItem,
  FormationContainer,
} from "../ManageCampagne/ManageCampagnesTable/manageCampagneTable.style";
import { DIPLOME_TYPE_MATCHER } from "../../constants";
import CellInputSeatsConfigure from "./CellInputSeatsConfigure";

const headers = [
  "",
  "Formation",
  <HeaderItem key="debut">Nom d'usage</HeaderItem>,
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

const data = (selectedFormations, setSelectedFormations, formik) => {
  return selectedFormations?.map((formation) => {
    return [
      <Checkbox
        key={formation._id}
        options={[
          {
            nativeInputProps: {
              name: `formation-${formation._id}`,
              checked: selectedFormations.includes(formation._id),
              onChange: () => {
                setSelectedFormations((prevValue) =>
                  prevValue.includes(formation._id)
                    ? prevValue.filter((id) => id !== formation._id)
                    : [...prevValue, formation._id]
                );
              },
            },
          },
        ]}
      />,
      <FormationContainer key={formation._id}>
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
        <p>{DIPLOME_TYPE_MATCHER[formation.diplome] || formation.diplome}</p>
      </FormationContainer>,
      <CellInputConfigure
        key={formation._id}
        id={formation._id}
        name="nomCampagne"
        formik={formik}
        type="text"
        placeholder="Ex: BAC PRO MV"
      />,
      <CellInputConfigure
        key={formation._id}
        id={formation._id}
        name="startDate"
        type="date"
        formik={formik}
      />,
      <CellInputConfigure
        key={formation._id}
        id={formation._id}
        name="endDate"
        type="date"
        formik={formik}
      />,
      <CellInputSeatsConfigure
        key={formation._id}
        id={formation._id}
        name="seats"
        formik={formik}
      />,
    ];
  });
};

const CreateCampagneTable = ({ selectedFormations, setSelectedFormations, formik }) => {
  if (!selectedFormations.length) return null;
  return <Table headers={headers} data={data(selectedFormations, setSelectedFormations, formik)} />;
};

export default CreateCampagneTable;
