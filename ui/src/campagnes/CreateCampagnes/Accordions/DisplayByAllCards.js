import React from "react";
import { Link } from "react-router-dom";
import { fr } from "@codegouvfr/react-dsfr";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import Tooltip from "react-simple-tooltip";
import { isPlural } from "../../utils";
import {
  FormationCardContainer,
  StyledBadge,
  Duration,
  HeaderCardContainer,
  FormationCardByDiplomeType,
  ExistingCampagnesContainer,
  BodyCardContainer,
  EtablissementLabelContainer,
  MiscellaneousInformationContainer,
} from "./accordions.style";
import { ToolTipContainer } from "../../styles/shared.style";
import { DIPLOME_TYPE_MATCHER } from "../../../constants";

const DisplayByAllCards = ({
  displayedFormations,
  selectedFormations,
  setSelectedFormations,
  existingFormationIds,
}) => {
  return (
    <FormationCardContainer>
      {displayedFormations.map((formation) => {
        const alreadyCreatedCount = existingFormationIds?.filter(
          (existingFormationId) => existingFormationId === formation._id
        ).length;
        const isSelected = selectedFormations.some(
          (selectedFormation) => selectedFormation._id === formation._id
        );
        const selectedFormationIds = selectedFormations.map(
          (selectedFormation) => selectedFormation._id
        );

        return (
          <FormationCardByDiplomeType
            key={formation._id}
            isChecked={selectedFormationIds.includes(formation._id)}
          >
            {!!alreadyCreatedCount && (
              <ExistingCampagnesContainer>
                <p>
                  {alreadyCreatedCount} campagne{isPlural(alreadyCreatedCount)} déjà créée
                  {isPlural(alreadyCreatedCount)}
                </p>
                <span className={fr.cx("fr-icon--sm fr-icon-info-line")} aria-hidden={true} />
              </ExistingCampagnesContainer>
            )}
            <HeaderCardContainer isAlreadyCreated={!!alreadyCreatedCount}>
              <div>
                <StyledBadge small>{formation.tags.join(" - ")}</StyledBadge>
                {formation.duree && (
                  <Duration>
                    En {formation.duree} an{isPlural(parseInt(formation.duree))}
                  </Duration>
                )}
              </div>
              <Checkbox
                key={formation.id}
                options={[
                  {
                    nativeInputProps: {
                      name: `campagne-${formation.id}`,
                      checked: isSelected,
                      onChange: () => {
                        setSelectedFormations((prevValue) =>
                          isSelected
                            ? prevValue.filter(
                                (selectedFormation) => selectedFormation._id !== formation._id
                              )
                            : [...prevValue, formation]
                        );
                      },
                    },
                  },
                ]}
              />
            </HeaderCardContainer>
            <BodyCardContainer>
              <h6>{formation.intitule_long}</h6>
              <EtablissementLabelContainer>
                {formation.etablissement_formateur_siret ===
                formation.etablissement_gestionnaire_siret ? (
                  <Tooltip
                    background="var(--background-default-grey)"
                    border="var(--border-default-grey)"
                    color="var(--text-default-grey)"
                    placement="right"
                    content={
                      <ToolTipContainer>
                        Cet établissement est gestionnaire et rattaché à votre compte Sirius
                      </ToolTipContainer>
                    }
                  >
                    <span className={fr.cx("fr-icon-award-fill")} aria-hidden={true} />
                  </Tooltip>
                ) : (
                  <Tooltip
                    background="var(--background-default-grey)"
                    border="var(--border-default-grey)"
                    color="var(--text-default-grey)"
                    placement="right"
                    content={
                      <ToolTipContainer>
                        Cet établissement est formateur et dispense des formations pour un
                        établissement gestionnaire
                      </ToolTipContainer>
                    }
                  >
                    <span className={fr.cx("fr-icon-award-line")} aria-hidden={true} />
                  </Tooltip>
                )}
                <p>
                  {formation.etablissement_formateur_entreprise_raison_sociale ||
                    formation.etablissement_formateur_enseigne}
                </p>
              </EtablissementLabelContainer>
              <MiscellaneousInformationContainer>
                <p>
                  {formation.lieu_formation_adresse_computed ||
                    `${formation.lieu_formation_adresse}, ${formation.code_postal} ${formation.localite}`}
                </p>
                <p>N° SIRET : {formation.etablissement_formateur_siret}</p>
                <p>{DIPLOME_TYPE_MATCHER[formation.diplome] || formation.diplome}</p>
              </MiscellaneousInformationContainer>
              <p>
                <Link
                  to={`https://catalogue-apprentissage.intercariforef.org/formation/${formation.id}`}
                  target="_blank"
                >
                  Voir détail formation (CARIF OREF)
                </Link>
              </p>
            </BodyCardContainer>
          </FormationCardByDiplomeType>
        );
      })}
    </FormationCardContainer>
  );
};

export default DisplayByAllCards;
