import React from "react";
import { Link } from "react-router-dom";
import { fr } from "@codegouvfr/react-dsfr";
import Tooltip from "react-simple-tooltip";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { isPlural } from "../../utils";
import {
  FormationCardContainer,
  StyledBadge,
  Duration,
  HeaderCardContainer,
  FormationCardByDiplomeType,
} from "./accordions.style";
import { ToolTipContainer } from "../../styles/shared.style";
import { DIPLOME_TYPE_MATCHER } from "../../../constants";

const DisplayByAllCards = ({
  displayedFormations,
  selectedFormations,
  setSelectedFormations,
  existingFormationCatalogueIds,
}) => {
  const formationSelectedCount = selectedFormations.length;

  const checkboxLabel = (
    <b>
      {formationSelectedCount
        ? `${formationSelectedCount} formation${isPlural(
            formationSelectedCount
          )} sélectionnée${isPlural(formationSelectedCount)}`
        : "Tout sélectionner"}
    </b>
  );

  return (
    <>
      <Checkbox
        options={[
          {
            label: checkboxLabel,
            nativeInputProps: {
              name: `selectAll`,
              checked: !!formationSelectedCount,
              onChange: (e) => {
                setSelectedFormations((prevValues) => {
                  if (e.target.checked) {
                    return [
                      ...new Set([
                        ...prevValues,
                        ...displayedFormations
                          .filter(
                            (formation) => !existingFormationCatalogueIds.includes(formation._id)
                          )
                          .map((formation) => formation._id),
                      ]),
                    ];
                  } else {
                    return [];
                  }
                });
              },
            },
          },
        ]}
      />
      <FormationCardContainer>
        {displayedFormations.map((formation) => {
          const isAlreadyCreated = existingFormationCatalogueIds?.includes(formation._id);
          return (
            <FormationCardByDiplomeType
              key={formation._id}
              isAlreadyCreated={isAlreadyCreated}
              isChecked={selectedFormations.includes(formation.id)}
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
                <Checkbox
                  key={formation.id}
                  disabled={isAlreadyCreated}
                  options={[
                    {
                      nativeInputProps: {
                        name: `campagne-${formation.id}`,
                        checked: isAlreadyCreated
                          ? false
                          : selectedFormations.includes(formation.id),
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
              </HeaderCardContainer>
              <h6>{formation.intitule_long}</h6>
              <div>
                <p>
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
                  {formation.etablissement_formateur_entreprise_raison_sociale ||
                    formation.etablissement_formateur_enseigne}
                </p>
                <p>
                  {formation.etablissement_formateur_adresse} {formation.localite}
                </p>
                <p>N° SIRET : {formation.etablissement_formateur_siret}</p>
              </div>
              <p>{DIPLOME_TYPE_MATCHER[formation.diplome] || formation.diplome}</p>
              <p>
                <Link
                  to={`https://catalogue-apprentissage.intercariforef.org/formation/${formation.id}`}
                  target="_blank"
                >
                  Voir détail formation (CARIF OREF)
                </Link>
              </p>
            </FormationCardByDiplomeType>
          );
        })}
      </FormationCardContainer>
    </>
  );
};

export default DisplayByAllCards;
