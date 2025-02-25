import { fr } from "@codegouvfr/react-dsfr";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import React from "react";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";

import { DIPLOME_TYPE_MATCHER } from "../../constants";
import {
  BodyCardContainer,
  EtablissementLabelContainer,
  ExistingCampagnesContainer,
  FormationCardByDiplomeType,
  FormationCardContainer,
  HeaderCardContainer,
  MiscellaneousInformationContainer,
} from "../styles/createCampagnes.style";
import { Duration, IntituleFormation, StyledBadge } from "../styles/shared.style";
import { formatDate, isPlural } from "../utils";

const FormationsGrid = ({ displayedFormations, selectedFormations, setSelectedFormations, campagnes }) => {
  return (
    <FormationCardContainer>
      {displayedFormations?.map((formation) => {
        const alreadyCreatedCampagnes = campagnes?.filter(
          (campagne) => campagne.formation.catalogueId === formation._id
        );
        const alreadyCreatedCount = alreadyCreatedCampagnes.length;
        const isSelected = selectedFormations.some((selectedFormation) => selectedFormation._id === formation._id);
        const selectedFormationIds = selectedFormations.map((selectedFormation) => selectedFormation._id);

        return (
          <FormationCardByDiplomeType key={formation._id} isChecked={selectedFormationIds.includes(formation._id)}>
            {!!alreadyCreatedCount && (
              <ExistingCampagnesContainer>
                <p>
                  {alreadyCreatedCount} campagne{isPlural(alreadyCreatedCount)} déjà créée
                  {isPlural(alreadyCreatedCount)}
                </p>
                <span
                  className={fr.cx("fr-icon--sm fr-icon-info-line")}
                  aria-hidden={true}
                  data-tooltip-id={`tooltip-already-created-${formation._id}`}
                />
                <Tooltip
                  id={`tooltip-already-created-${formation._id}`}
                  variant="light"
                  opacity={1}
                  style={{ zIndex: 99999, boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)" }}
                >
                  <p>
                    Campagne{isPlural(alreadyCreatedCount)} créée{isPlural(alreadyCreatedCount)} pour cette formation :
                  </p>
                  <ul>
                    {alreadyCreatedCampagnes.map((campagne) => (
                      <li key={campagne.id}>
                        {formatDate(campagne.startDate)} - {formatDate(campagne.endDate)} {campagne.temoignagesCount}{" "}
                        répondant{isPlural(campagne.temoignagesCount)}
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
                            ? prevValue.filter((selectedFormation) => selectedFormation._id !== formation._id)
                            : [...prevValue, formation]
                        );
                      },
                    },
                  },
                ]}
              />
            </HeaderCardContainer>
            <BodyCardContainer>
              <IntituleFormation>{formation.intitule_long}</IntituleFormation>
              <EtablissementLabelContainer>
                {formation.etablissement_formateur_siret === formation.etablissement_gestionnaire_siret ? (
                  <span
                    className={fr.cx("fr-icon-award-fill")}
                    aria-hidden={true}
                    data-tooltip-id={`tooltip-gestionnaire-formateur-${formation.id}`}
                    data-tooltip-content="Cet établissement est gestionnaire et rattaché à votre compte Sirius"
                  />
                ) : (
                  <span
                    className={fr.cx("fr-icon-award-line")}
                    aria-hidden={true}
                    data-tooltip-id={`tooltip-gestionnaire-formateur-${formation.id}`}
                    data-tooltip-content="Cet établissement est formateur et dispense des formations pour un établissement gestionnaire"
                  />
                )}
                <Tooltip
                  id={`tooltip-gestionnaire-formateur-${formation.id}`}
                  variant="light"
                  opacity={1}
                  style={{
                    zIndex: 99999,
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                    maxWidth: "500px",
                  }}
                />
                <p>
                  {formation.etablissement_formateur_entreprise_raison_sociale ||
                    formation.etablissement_formateur_enseigne}
                </p>
              </EtablissementLabelContainer>
              <MiscellaneousInformationContainer>
                <p>
                  {`${formation.lieu_formation_adresse}, ${formation.code_postal} ${formation.localite}` ||
                    formation.lieu_formation_adresse_computed}
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

export default FormationsGrid;
