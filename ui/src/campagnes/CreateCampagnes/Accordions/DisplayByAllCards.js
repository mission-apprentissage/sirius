import React from "react";
import { Link } from "react-router-dom";
import { fr } from "@codegouvfr/react-dsfr";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { Tooltip } from "react-tooltip";
import { formatDate, isPlural } from "../../utils";
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
import { DIPLOME_TYPE_MATCHER } from "../../../constants";

const DisplayByAllCards = ({
  displayedFormations,
  selectedFormations,
  setSelectedFormations,
  campagnes,
}) => {
  return (
    <FormationCardContainer>
      {displayedFormations.map((formation) => {
        const alreadyCreatedCampagnes = campagnes?.filter(
          (campagne) => campagne.formation.catalogueId === formation._id
        );
        const alreadyCreatedCount = alreadyCreatedCampagnes.length;
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
                <span
                  className={fr.cx("fr-icon--sm fr-icon-info-line")}
                  aria-hidden={true}
                  data-tooltip-id="tooltip-already-created"
                />
                <Tooltip
                  id="tooltip-already-created"
                  variant="light"
                  opacity={1}
                  style={{ zIndex: 99999, boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}
                >
                  <p>
                    Campagne{isPlural(alreadyCreatedCount)} créée{isPlural(alreadyCreatedCount)}{" "}
                    pour cette formation :
                  </p>
                  <ul>
                    {alreadyCreatedCampagnes.map((campagne) => (
                      <li key={campagne.id}>
                        {formatDate(campagne.startDate)} - {formatDate(campagne.endDate)}{" "}
                        {campagne.temoignagesCount} répondant{isPlural(campagne.temoignagesCount)}
                      </li>
                    ))}
                  </ul>
                </Tooltip>
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
                  <span
                    className={fr.cx("fr-icon-award-fill")}
                    aria-hidden={true}
                    data-tooltip-id="tooltip-gestionnaire-formateur"
                    data-tooltip-content="Cet établissement est gestionnaire et rattaché à votre compte Sirius"
                  />
                ) : (
                  <span
                    className={fr.cx("fr-icon-award-line")}
                    aria-hidden={true}
                    data-tooltip-id="tooltip-gestionnaire-formateur"
                    data-tooltip-content="Cet établissement est formateur et dispense des formations pour un établissement gestionnaire"
                  />
                )}
                <Tooltip
                  id="tooltip-gestionnaire-formateur"
                  variant="light"
                  opacity={1}
                  style={{ zIndex: 99999, boxShadow: "0 0 2px rgba(0, 0, 0, 0.1)" }}
                />
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
