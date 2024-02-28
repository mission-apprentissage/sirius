import React from "react";
import Tooltip from "react-simple-tooltip";
import { fr } from "@codegouvfr/react-dsfr";
import { Table } from "@codegouvfr/react-dsfr/Table";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { simpleEditionSubmitHandler } from "../../submitHandlers";
import CellInput from "../../CellInput/CellInput";
import CellInputSeats from "../../CellInput/CellInputSeats";
import { isPlural } from "../../utils";
import { etablissementLabelGetter, buildEtablissementAddress } from "../../../utils/etablissement";
import {
  HeaderItem,
  FormationContainer,
  TemoignagesCount,
  ToolTipContainer,
} from "./manageCampagneTable.style";

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
  <HeaderItem key="interrogées">
    <span className={fr.cx("fr-icon--sm fr-icon-quote-fill")} aria-hidden={true} />
    Interrogé·es
  </HeaderItem>,
];

const data = (displayedCampagnes, selectedCampagnes, setSelectedCampagnes, handleCellUpdate) => {
  return displayedCampagnes.map((campagne) => {
    const etablissement = campagne.etablissement.data;
    const formation = campagne.formation.data;

    return [
      <Checkbox
        key={campagne._id}
        options={[
          {
            nativeInputProps: {
              name: `campagne-${campagne._id}`,
              checked: selectedCampagnes.includes(campagne._id),
              onChange: () => {
                setSelectedCampagnes((prevValue) =>
                  prevValue.includes(campagne._id)
                    ? prevValue.filter((id) => id !== campagne._id)
                    : [...prevValue, campagne._id]
                );
              },
            },
          },
        ]}
      />,
      <FormationContainer key={campagne._id}>
        <p>
          <b>{formation.intitule_long}</b>
        </p>
        <div>
          <p>{formation.tags.join("-")} </p>
          {formation.duree && parseInt(formation.duree) && (
            <p>
              · En {formation.duree} an{isPlural(parseInt(formation.duree))}
            </p>
          )}
        </div>
        <Tooltip
          background="var(--background-default-grey)"
          border="var(--border-default-grey)"
          color="var(--text-default-grey)"
          content={
            <ToolTipContainer>
              <p>{buildEtablissementAddress(etablissement)}</p>
              <p>N° Siret: {etablissement.siret}</p>
            </ToolTipContainer>
          }
        >
          <p>{etablissementLabelGetter(etablissement)}</p>
        </Tooltip>
      </FormationContainer>,
      <CellInput
        key={campagne._id}
        id="nomCampagne"
        name="nomCampagne"
        campagne={campagne}
        handleCellUpdate={handleCellUpdate}
        type="text"
      />,
      <CellInput
        key={campagne._id}
        id="startDate"
        name="startDate"
        campagne={campagne}
        handleCellUpdate={handleCellUpdate}
        type="date"
      />,
      <CellInput
        key={campagne._id}
        id="startDate"
        name="startDate"
        campagne={campagne}
        handleCellUpdate={handleCellUpdate}
        type="date"
      />,
      <CellInputSeats
        key={campagne._id}
        id="seats"
        name="seats"
        campagne={campagne}
        handleCellUpdate={handleCellUpdate}
      />,
      <TemoignagesCount key={campagne._id}>
        {campagne.seats > 0
          ? Math.round((campagne.temoignagesCount * 100) / campagne.seats) + "%"
          : campagne.temoignagesCount}
      </TemoignagesCount>,
    ];
  });
};

const ManageCampagneTable = ({
  displayedCampagnes = [],
  selectedCampagnes,
  setSelectedCampagnes,
  userContext,
}) => {
  const handleCellUpdate = async (campagneId, payload) => {
    const updatedCampagne = await simpleEditionSubmitHandler(campagneId, payload, userContext);
    return updatedCampagne;
  };

  return (
    <Table
      headers={headers}
      data={data(displayedCampagnes, selectedCampagnes, setSelectedCampagnes, handleCellUpdate)}
    />
  );
};

export default ManageCampagneTable;
