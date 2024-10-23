import { fr } from "@codegouvfr/react-dsfr";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { Link } from "react-router-dom";
import Tooltip from "react-simple-tooltip";

import { DIPLOME_TYPE_MATCHER } from "../../../constants";
import { ToolTipContainer } from "../../styles/shared.style";
import { getUniqueDiplomeTypesFromFormation, isPlural, orderFormationsByDiplomeType } from "../../utils";
import {
  AccordionLabelByDiplomeTypeContainer,
  Duration,
  FormationCardByDiplomeType,
  FormationCardContainer,
  HeaderCardContainer,
  StyledAccordion,
  StyledBadge,
} from "./accordions.style";

const DisplayByDiplomeTypeCards = ({
  displayedFormations,
  selectedFormations,
  setSelectedFormations,
  existingFormationIds,
}) => {
  const uniqueDiplomeTypesFromFormation = getUniqueDiplomeTypesFromFormation(displayedFormations);

  const orderedFormationByDiplomeType = orderFormationsByDiplomeType(displayedFormations);

  return uniqueDiplomeTypesFromFormation?.map((diplomeType) => {
    const formationsByDiplomeType = orderedFormationByDiplomeType[diplomeType];

    const formationSelectedCountByDiplomeType = selectedFormations.filter((selectedFormation) =>
      formationsByDiplomeType.map((formation) => formation._id).includes(selectedFormation._id)
    ).length;

    const checkboxLabel = (
      <b>
        {formationSelectedCountByDiplomeType
          ? `${formationSelectedCountByDiplomeType} formation${isPlural(
              formationSelectedCountByDiplomeType
            )} sélectionnée${isPlural(formationSelectedCountByDiplomeType)}`
          : "Tout sélectionner"}
      </b>
    );

    return (
      <StyledAccordion
        key={diplomeType}
        label={
          <AccordionLabelByDiplomeTypeContainer>
            <h5>{DIPLOME_TYPE_MATCHER[diplomeType] || diplomeType}</h5>
            <p>
              {formationSelectedCountByDiplomeType} formation
              {isPlural(formationSelectedCountByDiplomeType)} sélectionnée
              {isPlural(formationSelectedCountByDiplomeType)}
            </p>
          </AccordionLabelByDiplomeTypeContainer>
        }
      >
        <Checkbox
          options={[
            {
              label: checkboxLabel,
              nativeInputProps: {
                name: `selectAll${diplomeType}`,
                checked:
                  formationSelectedCountByDiplomeType ===
                  formationsByDiplomeType.filter((formation) => !existingFormationIds.includes(formation._id)).length,
                onChange: (e) => {
                  setSelectedFormations((prevValues) => {
                    if (e.target.checked) {
                      return [
                        ...new Set([
                          ...prevValues,
                          ...formationsByDiplomeType.filter(
                            (formation) => !existingFormationIds.includes(formation._id)
                          ),
                        ]),
                      ];
                    } else {
                      return prevValues.filter(
                        (selectedFormation) => !formationsByDiplomeType.includes(selectedFormation)
                      );
                    }
                  });
                },
              },
            },
          ]}
        />
        <FormationCardContainer>
          {formationsByDiplomeType.map((formation) => {
            const isAlreadyCreated = existingFormationIds?.includes(formation._id);
            const isSelected = selectedFormations.some((selectedFormation) => selectedFormation._id === formation._id);

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
                  {isAlreadyCreated ? (
                    <Tooltip
                      background="var(--background-default-grey)"
                      border="var(--border-default-grey)"
                      color="var(--text-default-grey)"
                      placement="right"
                      content={
                        <ToolTipContainer>
                          <p>
                            Une campagne a déjà été créée pour cette formation, vous ne pouvez donc pas la sélectionner.
                          </p>
                        </ToolTipContainer>
                      }
                    >
                      <span className={fr.cx("fr-icon-info-fill")} />
                    </Tooltip>
                  ) : (
                    <Checkbox
                      key={formation.id}
                      disabled={isAlreadyCreated}
                      options={[
                        {
                          nativeInputProps: {
                            name: `campagne-${formation.id}`,
                            checked: isSelected,
                            onChange: () => {
                              setSelectedFormations((prevValue) =>
                                isSelected
                                  ? prevValue.filter((selectedFormation) => selectedFormation._id !== formation._id)
                                  : [...prevValue, formation]
                              );
                            },
                          },
                        },
                      ]}
                    />
                  )}
                </HeaderCardContainer>
                <h6>{formation.intitule_long}</h6>
                <div>
                  <p>
                    {formation.etablissement_formateur_siret === formation.etablissement_gestionnaire_siret ? (
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
                            Cet établissement est formateur et dispense des formations pour un établissement
                            gestionnaire
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
                    {formation.lieu_formation_adresse_computed ||
                      `${formation.lieu_formation_adresse}, ${formation.code_postal} ${formation.localite}`}
                  </p>
                  <p>N° SIRET : {formation.etablissement_formateur_siret}</p>
                </div>
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
      </StyledAccordion>
    );
  });
};

export default DisplayByDiplomeTypeCards;
