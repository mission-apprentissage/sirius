import { fr } from "@codegouvfr/react-dsfr";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { useContext } from "react";
import Tooltip from "react-simple-tooltip";

import { campagnesDisplayMode, DIPLOME_TYPE_MATCHER } from "../../constants";
import { UserContext } from "../../context/UserContext";
import { EtablissementLabelContainer, TemoignagesCount } from "../Shared/CampagnesTable/campagnesTable.style";
import { FormationContainer, ToolTipContainer } from "../styles/shared.style";
import { simpleEditionSubmitHandler } from "../submitHandlers";
import { isPlural } from "../utils";
import CellInput from "./CellInput/CellInput";
import CellInputSeats from "./CellInput/CellInputSeats";

const manageCampagneTableRows = ({ displayedCampagnes, selectedCampagneIds, setSelectedCampagneIds, displayMode }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [userContext] = useContext(UserContext);

  const handleCellUpdate = async (campagneId, payload) => {
    const updatedCampagne = await simpleEditionSubmitHandler(campagneId, payload, userContext);
    return updatedCampagne;
  };

  return displayedCampagnes.map((campagne) => {
    const formation = campagne.formation;
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
          <p>
            <b>{formation.intituleLong}</b>
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
        {(displayMode === campagnesDisplayMode[0].value || displayMode === campagnesDisplayMode[2].value) && (
          <EtablissementLabelContainer>
            <Tooltip
              background="var(--background-default-grey)"
              border="var(--border-default-grey)"
              color="var(--text-default-grey)"
              placement="right"
              content={
                <ToolTipContainer>
                  <p>
                    {formation.lieuFormationAdresseComputed ||
                      `${formation.lieuFormationAdresse}, ${formation.codePostal} ${formation.localite}`}
                  </p>
                  <p>N° Siret: {formation.etablissementFormateurSiret}</p>
                  {formation.etablissementFormateurSiret === formation.etablissementGestionnaireSiret ? (
                    <p>
                      <span className={fr.cx("fr-icon-award-fill")} aria-hidden={true} /> Cet établissement est
                      gestionnaire et rattaché à votre compte Sirius
                    </p>
                  ) : (
                    <p>
                      <span className={fr.cx("fr-icon-award-line")} aria-hidden={true} /> Cet établissement est
                      formateur et dispense des formations pour un établissement gestionnaire
                    </p>
                  )}
                </ToolTipContainer>
              }
            >
              <p>
                {formation.etablissementFormateurEntrepriseRaisonSociale || formation.etablissementFormateurEnseigne}
              </p>
            </Tooltip>
          </EtablissementLabelContainer>
        )}
        {(displayMode === campagnesDisplayMode[1].value || displayMode === campagnesDisplayMode[2].value) && (
          <p>{DIPLOME_TYPE_MATCHER[formation.diplome] || formation.diplome}</p>
        )}
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
