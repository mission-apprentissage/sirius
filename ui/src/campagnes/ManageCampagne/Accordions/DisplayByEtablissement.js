import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { fr } from "@codegouvfr/react-dsfr";
import Tooltip from "react-simple-tooltip";
import CampagnesTable from "../../Shared/CampagnesTable/CampagnesTable";
import {
  getUniqueEtablissementFromCampagne,
  orderCampagnesByEtablissement,
  isPlural,
} from "../../utils";
import { StyledAccordion, AccordionLabelByEtablissementContainer } from "./accordions.style";
import { ToolTipContainer } from "../../styles/shared.style";
import { campagnesDisplayMode } from "../../../constants";

const DisplayByEtablissement = ({
  displayedCampagnes,
  selectedCampagnes,
  setSelectedCampagnes,
  userContext,
}) => {
  const uniqueEtablissementFromCampagne = getUniqueEtablissementFromCampagne(displayedCampagnes);

  const orderedCampagnesByEtablissement = orderCampagnesByEtablissement(displayedCampagnes);

  return uniqueEtablissementFromCampagne.map((siret) => {
    const campagnesByEtablissement = orderedCampagnesByEtablissement[siret];

    const isCampagnesPlural = isPlural(campagnesByEtablissement.length);

    const isEveryCampagnesSelected = campagnesByEtablissement?.every((campagne) =>
      selectedCampagnes.includes(campagne._id)
    );

    return (
      <StyledAccordion
        key={siret}
        label={
          <>
            <Checkbox
              small
              options={[
                {
                  nativeInputProps: {
                    name: `selectAll${siret}`,
                    checked: isEveryCampagnesSelected,
                    onChange: (e) => {
                      setSelectedCampagnes((prevValues) => {
                        if (e.target.checked) {
                          return [
                            ...new Set([
                              ...prevValues,
                              ...campagnesByEtablissement.map((campagne) => campagne._id),
                            ]),
                          ];
                        } else {
                          return prevValues.filter(
                            (selectedCampagne) =>
                              !campagnesByEtablissement
                                .map((campagne) => campagne._id)
                                .includes(selectedCampagne)
                          );
                        }
                      });
                    },
                  },
                },
              ]}
            />
            <AccordionLabelByEtablissementContainer>
              <div>
                {campagnesByEtablissement[0].formation.data.etablissement_formateur_siret ===
                campagnesByEtablissement[0].formation.data.etablissement_gestionnaire_siret ? (
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
                <h5>
                  {campagnesByEtablissement[0].formation.data
                    .etablissement_formateur_entreprise_raison_sociale ||
                    campagnesByEtablissement[0].formation.data.etablissement_formateur_enseigne}
                </h5>
              </div>
              <p>
                {" "}
                {campagnesByEtablissement[0].formation.data.etablissement_formateur_adresse}{" "}
                {campagnesByEtablissement[0].formation.data.localite}
              </p>
              <p>
                N° SIRET :{" "}
                {campagnesByEtablissement[0].formation.data.etablissement_formateur_siret}
              </p>
              <p>
                {campagnesByEtablissement.length} campagne
                {isCampagnesPlural} créée{isCampagnesPlural}
              </p>
            </AccordionLabelByEtablissementContainer>
          </>
        }
      >
        <CampagnesTable
          key={siret}
          displayedCampagnes={campagnesByEtablissement}
          selectedCampagnes={selectedCampagnes}
          setSelectedCampagnes={setSelectedCampagnes}
          userContext={userContext}
          displayMode={campagnesDisplayMode[1].value}
        />
      </StyledAccordion>
    );
  });
};

export default DisplayByEtablissement;
