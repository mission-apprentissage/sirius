import React from "react";
import { Link } from "react-router-dom";
import Tooltip from "react-simple-tooltip";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import {
  FormationCardByDiplomeType,
  StyledBadge,
  HeaderCardContainer,
  Duration,
} from "../Accordions/accordions.style";
import { ToolTipContainer } from "../../styles/shared.style";
import { isPlural } from "../../utils";
import { DiplomeTypeCardBody, EtablissementCardBody } from "./FormationCardBody";
import { CAMPAGNES_DISPLAY_MODE } from "../../../constants";

const FormationCard = ({
  formation,
  isAlreadyCreated,
  isSelected,
  setSelectedFormations,
  displayMode,
}) => {
  const isGestionnaire =
    formation.etablissement_formateur_siret === formation.etablissement_gestionnaire_siret;

  return (
    <FormationCardByDiplomeType
      key={formation._id}
      isAlreadyCreated={isAlreadyCreated}
      isChecked={isSelected}
    >
      <HeaderCardContainer>
        <div>
          <StyledBadge small isAlreadyCreated={isAlreadyCreated}>
            {formation.tags.join(" - ")}
          </StyledBadge>
          {formation.duree && (
            <Duration>
              En {formation.duree} an{isPlural(parseInt(formation.duree))}
            </Duration>
          )}
        </div>
        {isAlreadyCreated ? (
          <Tooltip
            background="var(--background-default-grey)"
            border="var(--border-default-grey)"
            color="var(--text-default-grey)"
            placement="right"
            content={
              <ToolTipContainer>
                <p>
                  Une campagne a déjà été créée pour cette formation, vous ne pouvez donc pas la
                  sélectionner.
                </p>
              </ToolTipContainer>
            }
          >
            <span className="fr-icon-info-fill" />
          </Tooltip>
        ) : (
          <Checkbox
            key={formation._id}
            disabled={isAlreadyCreated}
            options={[
              {
                nativeInputProps: {
                  name: `campagne-${formation._id}`,
                  checked: isSelected,
                  onChange: () => {
                    setSelectedFormations((prevValue) =>
                      prevValue.includes(formation.id)
                        ? prevValue.filter((id) => id !== formation.id)
                        : [...prevValue, formation.id]
                    );
                  },
                },
              },
            ]}
          />
        )}
      </HeaderCardContainer>
      <h6>{formation.intitule_long}</h6>
      {displayMode === CAMPAGNES_DISPLAY_MODE.DIPLOME && (
        <DiplomeTypeCardBody isGestionnaire={isGestionnaire} formation={formation} />
      )}
      {displayMode === CAMPAGNES_DISPLAY_MODE.ETABLISSEMENT && (
        <EtablissementCardBody diplome={formation.diplome} />
      )}
      {displayMode === CAMPAGNES_DISPLAY_MODE.ALL && (
        <>
          <DiplomeTypeCardBody isGestionnaire={isGestionnaire} formation={formation} />
          <EtablissementCardBody diplome={formation.diplome} />
        </>
      )}
      <p>
        <Link
          to={`https://catalogue-apprentissage.intercariforef.org/formation/${formation._id}`}
          target="_blank"
        >
          Voir détail formation (CARIF OREF)
        </Link>
      </p>
    </FormationCardByDiplomeType>
  );
};

export default FormationCard;
