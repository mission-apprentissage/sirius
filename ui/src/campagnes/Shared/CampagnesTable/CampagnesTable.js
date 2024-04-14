import React from "react";
import Tooltip from "react-simple-tooltip";
import { fr } from "@codegouvfr/react-dsfr";
import { Table } from "@codegouvfr/react-dsfr/Table";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { simpleEditionSubmitHandler } from "../../submitHandlers";
import CellInput from "../../ManageCampagne/CellInput/CellInput";
import CellInputSeats from "../../ManageCampagne/CellInput/CellInputSeats";
import { isPlural } from "../../utils";
import {
  TemoignagesCount,
  EtablissementLabelContainer,
  TableContainer,
} from "./campagnesTable.style";
import { HeaderItem, FormationContainer, ToolTipContainer } from "../../styles/shared.style";
import { DIPLOME_TYPE_MATCHER, campagnesDisplayMode } from "../../../constants";
import manageCampagneTableRows from "../../ManageCampagne/manageCampagneTableRows";
import resultsCampagneTableRows from "../../ResultsCampagnes/resultsCampagnesTableRows";

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
}) => {
  if (campagneTableType === "MANAGE") {
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
  if (campagneTableType === "RESULTS") {
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
};

export default CampagnesTable;
