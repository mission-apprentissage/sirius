import React, { useContext } from "react";
import { Tooltip } from "react-tooltip";
import { fr } from "@codegouvfr/react-dsfr";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { simpleEditionSubmitHandler } from "../submitHandlers";
import CellInput from "./CellInput/CellInput";
import CellInputSeats from "./CellInput/CellInputSeats";
import { isPlural } from "../utils";
import {
  TemoignagesCount,
  EtablissementLabelContainer,
  DiplomeLabel,
} from "../Shared/CampagnesTable/campagnesTable.style";
import {
  FormationContainer,
  IntituleFormation,
  Duration,
  StyledBadge,
} from "../styles/shared.style";
import { DIPLOME_TYPE_MATCHER } from "../../constants";
import { UserContext } from "../../context/UserContext";
import { etablissementLabelGetter } from "../../utils/etablissement";

const manageCampagneTableRows = ({
  displayedCampagnes,
  selectedCampagneIds,
  setSelectedCampagneIds,
}) => {
  const [userContext] = useContext(UserContext);

  const handleCellUpdate = async (campagneId, payload) => {
    const updatedCampagne = await simpleEditionSubmitHandler(campagneId, payload, userContext);
    return updatedCampagne;
  };

  return displayedCampagnes.map((campagne) => {
    const formation = campagne.formation;
    const etablissement = campagne.etablissement;
    const isSelected = selectedCampagneIds.includes(campagne.id);

    const handleOnChange = () => {
      setSelectedCampagneIds((prevValue) =>
        isSelected ? prevValue.filter((item) => item !== campagne.id) : [...prevValue, campagne.id]
      );
    };

    return [
      <Checkbox
        key={campagne.id}
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
        <FormationContainer key={campagne.id}>
          <div>
            <StyledBadge small>{formation.tags.join("-")}</StyledBadge>
            {formation?.duree && parseInt(formation?.duree) && (
              <Duration>
                · En {formation.duree} an{isPlural(parseInt(formation.duree))}
              </Duration>
            )}
          </div>
          <IntituleFormation>{formation.intituleLong}</IntituleFormation>
        </FormationContainer>
        <EtablissementLabelContainer>
          <p data-tooltip-id={`tooltip-formateur-gestionnaire-${campagne.id}`}>
            {etablissementLabelGetter(etablissement)}
          </p>
          <Tooltip
            id={`tooltip-formateur-gestionnaire-${campagne.id}`}
            variant="light"
            opacity={1}
            style={{ zIndex: 99999, boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)", maxWidth: "500px" }}
          >
            <p>
              {formation.lieuFormationAdresseComputed ||
                `${formation.lieuFormationAdresse}, ${formation.codePostal} ${formation.localite}`}
            </p>
            <p>N° Siret: {formation.etablissementFormateurSiret}</p>
            {formation.etablissementFormateurSiret === formation.etablissementGestionnaireSiret ? (
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
          </Tooltip>
        </EtablissementLabelContainer>
        <DiplomeLabel>{DIPLOME_TYPE_MATCHER[formation.diplome] || formation.diplome}</DiplomeLabel>
      </>,
      <CellInput
        key={campagne.id}
        id="nomCampagne"
        name="nomCampagne"
        campagne={campagne}
        handleCellUpdate={handleCellUpdate}
        type="text"
      />,
      <CellInput
        key={campagne.id}
        id="startDate"
        name="startDate"
        campagne={campagne}
        handleCellUpdate={handleCellUpdate}
        type="date"
      />,
      <CellInput
        key={campagne.id}
        id="endDate"
        name="endDate"
        campagne={campagne}
        handleCellUpdate={handleCellUpdate}
        type="date"
      />,
      <CellInputSeats
        key={campagne.id}
        id="seats"
        name="seats"
        campagne={campagne}
        handleCellUpdate={handleCellUpdate}
      />,
      <TemoignagesCount key={campagne.id}>
        {campagne.seats > 0
          ? Math.round((campagne.temoignagesCount * 100) / campagne.seats) + "%"
          : campagne.temoignagesCount}
      </TemoignagesCount>,
    ];
  });
};

export default manageCampagneTableRows;
