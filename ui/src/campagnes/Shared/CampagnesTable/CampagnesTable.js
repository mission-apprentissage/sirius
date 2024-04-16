import React from "react";
import { fr } from "@codegouvfr/react-dsfr";
import { Table } from "@codegouvfr/react-dsfr/Table";
import { TableContainer } from "./campagnesTable.style";
import { HeaderItem } from "../../styles/shared.style";
import manageCampagneTableRows from "../../ManageCampagne/manageCampagneTableRows";
import resultsCampagneTableRows from "../../ResultsCampagnes/resultsCampagnesTableRows";
import createCampagneTableRows from "../../CreateCampagnes/createCampagneTableRows";
import { CAMPAGNE_TABLE_TYPES } from "../../../constants";

const headers = [
  "",
  "Formation",
  <HeaderItem key="campagneName">Nom d'usage</HeaderItem>,
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
  <HeaderItem key="interrogées">
    <span className={fr.cx("fr-icon--sm fr-icon-quote-fill")} aria-hidden={true} />
    Interrogé·es
  </HeaderItem>,
];

const CampagnesTable = ({
  displayedCampagnes = [],
  selectedCampagneIds,
  setSelectedCampagneIds,
  displayMode,
  campagneTableType,
  formik = {},
  selectedFormations = [],
  selectedFormationsAction = [],
  setSelectedFormationsAction = () => {},
}) => {
  if (campagneTableType === CAMPAGNE_TABLE_TYPES.MANAGE) {
    return (
      <TableContainer>
        <Table
          headers={headers}
          data={manageCampagneTableRows({
            displayedCampagnes,
            selectedCampagneIds,
            setSelectedCampagneIds,
            displayMode,
          })}
        />
      </TableContainer>
    );
  }
  if (campagneTableType === CAMPAGNE_TABLE_TYPES.RESULTS) {
    return (
      <TableContainer>
        <Table
          headers={headers}
          data={resultsCampagneTableRows({
            displayedCampagnes,
            selectedCampagneIds,
            setSelectedCampagneIds,
            displayMode,
          })}
        />
      </TableContainer>
    );
  }
  if (campagneTableType === CAMPAGNE_TABLE_TYPES.CREATE) {
    return (
      <TableContainer>
        <Table
          headers={headers.pop()}
          data={createCampagneTableRows({
            selectedFormations,
            selectedFormationsAction,
            setSelectedFormationsAction,
            formik,
            displayMode,
          })}
        />
      </TableContainer>
    );
  }
};

export default CampagnesTable;
