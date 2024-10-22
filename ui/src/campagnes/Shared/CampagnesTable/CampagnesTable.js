import { fr } from "@codegouvfr/react-dsfr";
import { Table } from "@codegouvfr/react-dsfr/Table";

import { CAMPAGNE_TABLE_TYPES } from "../../../constants";
import createCampagneTableRows from "../../CreateCampagnes/createCampagneTableRows";
import manageCampagneTableRows from "../../ManageCampagne/manageCampagneTableRows";
import resultsCampagneTableRows from "../../ResultsCampagnes/resultsCampagnesTableRows";
import { HeaderItem } from "../../styles/shared.style";
import { TableContainer } from "./campagnesTable.style";

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

const createHeaders = [
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
          headers={createHeaders}
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
