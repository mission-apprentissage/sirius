import React, { useContext } from "react";
import Tooltip from "react-simple-tooltip";
import { fr } from "@codegouvfr/react-dsfr";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { simpleEditionSubmitHandler } from "../submitHandlers";
import CellInput from "./CellInput/CellInput";
import CellInputSeats from "./CellInput/CellInputSeats";
import { isPlural } from "../utils";
import {
  TemoignagesCount,
  EtablissementLabelContainer,
} from "../Shared/CampagnesTable/campagnesTable.style";
import { FormationContainer, ToolTipContainer } from "../styles/shared.style";
import { DIPLOME_TYPE_MATCHER, campagnesDisplayMode } from "../../constants";
import { UserContext } from "../../context/UserContext";

const manageCampagneTableRows = ({
  displayedCampagnes,
  selectedCampagneIds,
  setSelectedCampagneIds,
  displayMode,
}) => {
  const [userContext] = useContext(UserContext);

  const handleCellUpdate = async (campagneId, payload) => {
    const updatedCampagne = await simpleEditionSubmitHandler(campagneId, payload, userContext);
    return updatedCampagne;
  };

  return displayedCampagnes.map((campagne) => {
    const formation = campagne.formation.data;
    const isSelected = selectedCampagneIds.includes(campagne._id);

    const handleOnChange = () => {
      setSelectedCampagneIds((prevValue) =>
        isSelected
          ? prevValue.filter((item) => item !== campagne._id)
          : [...prevValue, campagne._id]
      );
    };

    return [
      <Checkbox
        key={campagne._id}
        options={[
          {
            nativeInputProps: {
              name: `campagne-${campagne._id}`,
              checked: isSelected,
              onChange: handleOnChange,
            },
          },
        ]}
      />,
      <>
        <FormationContainer key={campagne._id}>
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
        </FormationContainer>
        {(displayMode === campagnesDisplayMode[0].value ||
          displayMode === campagnesDisplayMode[2].value) && (
          <EtablissementLabelContainer>
            <Tooltip
              background="var(--background-default-grey)"
              border="var(--border-default-grey)"
              color="var(--text-default-grey)"
              placement="right"
              content={
                <ToolTipContainer>
                  <p>
                    {formation.lieu_formation_adresse_computed ||
                      `${formation.lieu_formation_adresse}, ${formation.code_postal} ${formation.localite}`}
                  </p>
                  <p>N° Siret: {formation.etablissement_formateur_siret}</p>
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
          </EtablissementLabelContainer>
        )}
        {(displayMode === campagnesDisplayMode[1].value ||
          displayMode === campagnesDisplayMode[2].value) && (
          <p>{DIPLOME_TYPE_MATCHER[formation.diplome] || formation.diplome}</p>
        )}
      </>,
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
        id="endDate"
        name="endDate"
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

export default manageCampagneTableRows;
