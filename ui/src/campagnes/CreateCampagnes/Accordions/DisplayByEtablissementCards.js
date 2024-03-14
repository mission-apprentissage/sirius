import React from "react";
import { Link } from "react-router-dom";
import { fr } from "@codegouvfr/react-dsfr";
import Tooltip from "react-simple-tooltip";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import {
  getUniqueEtablissementFromFormation,
  orderFormationByEtablissement,
  isPlural,
} from "../../utils";
import {
  StyledAccordion,
  AccordionLabelByEtablissementContainer,
  FormationCardContainer,
  FormationCardByEtablissement,
  StyledBadge,
  Duration,
  HeaderCardContainer,
} from "./accordions.style";
import { ToolTipContainer } from "../../styles/shared.style";
import { DIPLOME_TYPE_MATCHER } from "../../../constants";

const DisplayByEtablissementCards = ({
  displayedFormations,
  selectedFormations,
  setSelectedFormations,
  existingFormationCatalogueIds,
}) => {
  const uniqueEtablissementFromFormation = getUniqueEtablissementFromFormation(displayedFormations);

  const orderedFormationsByEtablissement = orderFormationByEtablissement(displayedFormations);

  return uniqueEtablissementFromFormation?.map((siret) => {
    const formationsByEtablissement = orderedFormationsByEtablissement[siret];

    const formationSelectedCountByEtablissement = selectedFormations.filter((id) =>
      formationsByEtablissement.map((formation) => formation._id).includes(id)
    ).length;

    const checkboxLabel = (
      <b>
        {formationSelectedCountByEtablissement
          ? `${formationSelectedCountByEtablissement} formation${isPlural(
              formationSelectedCountByEtablissement
            )} sélectionnée${isPlural(formationSelectedCountByEtablissement)}`
          : "Tout sélectionner"}
      </b>
    );

    return (
      <StyledAccordion
        key={siret}
        label={
          <AccordionLabelByEtablissementContainer>
            <div>
              {formationsByEtablissement[0].etablissement_formateur_siret ===
              formationsByEtablissement[0].etablissement_gestionnaire_siret ? (
                <Tooltip
                  background="var(--background-default-grey)"
                  border="var(--border-default-grey)"
                  color="var(--text-default-grey)"
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
              <h5>
                {formationsByEtablissement[0].etablissement_formateur_entreprise_raison_sociale ||
                  formationsByEtablissement[0].etablissement_formateur_enseigne}
              </h5>
            </div>
            <p>
              {formationsByEtablissement[0].etablissement_formateur_adresse}{" "}
              {formationsByEtablissement[0].localite}
            </p>
            <p>N° SIRET : {formationsByEtablissement[0].etablissement_formateur_siret}</p>
            <p>
              {formationSelectedCountByEtablissement} formation
              {isPlural(formationSelectedCountByEtablissement)} sélectionnée
              {isPlural(formationSelectedCountByEtablissement)}
            </p>
          </AccordionLabelByEtablissementContainer>
        }
      >
        <Checkbox
          options={[
            {
              label: checkboxLabel,

              nativeInputProps: {
                name: `selectAll${siret}`,
                checked: !!formationSelectedCountByEtablissement,
                onChange: (e) => {
                  setSelectedFormations((prevValues) => {
                    if (e.target.checked) {
                      return [
                        ...new Set([
                          ...prevValues,
                          ...formationsByEtablissement
                            .filter(
                              (formation) => !existingFormationCatalogueIds.includes(formation._id)
                            )
                            .map((formation) => formation._id),
                        ]),
                      ];
                    } else {
                      return prevValues.filter(
                        (selectedFormation) =>
                          !formationsByEtablissement
                            .map((formation) => formation._id)
                            .includes(selectedFormation)
                      );
                    }
                  });
                },
              },
            },
          ]}
        />
        <FormationCardContainer>
          {formationsByEtablissement.map((formation) => {
            const isAlreadyCreated = existingFormationCatalogueIds?.includes(formation._id);
            return (
              <FormationCardByEtablissement
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
                <p>{DIPLOME_TYPE_MATCHER[formation.diplome] || formation.diplome}</p>
                <p>
                  <Link
                    to={`https://catalogue-apprentissage.intercariforef.org/formation/${formation.id}`}
                    target="_blank"
                  >
                    Voir détail formation (CARIF OREF)
                  </Link>
                </p>
              </FormationCardByEtablissement>
            );
          })}
        </FormationCardContainer>
      </StyledAccordion>
    );
  });
};

export default DisplayByEtablissementCards;
