import React from "react";
import Tooltip from "react-simple-tooltip";
import { fr } from "@codegouvfr/react-dsfr";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import {
  getUniqueEtablissementFromCampagne,
  orderCampagnesByEtablissement,
  isPlural,
} from "../../utils";
import {
  StyledAccordion,
  AccordionLabelByEtablissementContainer,
  ButtonContainer,
} from "./accordions.style";
import { ToolTipContainer } from "../../styles/shared.style";
import CampagnesTable from "../CampagnesTable";

const DisplayByEtablissementTable = ({
  displayedCampagnes,
  selectedCampagnes,
  setSelectedCampagnes,
  displayMode,
}) => {
  const uniqueEtablissementFromCampagnes = getUniqueEtablissementFromCampagne(displayedCampagnes);

  const orderedCampagnessByEtablissement = orderCampagnesByEtablissement(displayedCampagnes);

  return uniqueEtablissementFromCampagnes.map((siret) => {
    const campagnesByEtablissement = orderedCampagnessByEtablissement[siret];
    const campagnesSelectedCountByEtablissement = selectedCampagnes.filter((id) =>
      campagnesByEtablissement.map((formation) => formation._id).includes(id)
    ).length;

    const isEveryCampagnesSelected = campagnesByEtablissement?.every((campagne) =>
      selectedCampagnes.includes(campagne._id)
    );

    const checkboxLabel = (
      <b>
        {campagnesSelectedCountByEtablissement
          ? `${campagnesSelectedCountByEtablissement} formation${isPlural(
              campagnesSelectedCountByEtablissement
            )} sélectionnée${isPlural(campagnesSelectedCountByEtablissement)}`
          : "Tout sélectionner"}
      </b>
    );

    return (
      <StyledAccordion
        key={siret}
        label={
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
              {campagnesByEtablissement[0].formation.data.etablissement_formateur_adresse}{" "}
              {campagnesByEtablissement[0].formation.data.localite}
            </p>
            <p>
              N° SIRET : {campagnesByEtablissement[0].formation.data.etablissement_formateur_siret}
            </p>
            <p>
              {campagnesSelectedCountByEtablissement} campagne
              {isPlural(campagnesSelectedCountByEtablissement)} sélectionnée
              {isPlural(campagnesSelectedCountByEtablissement)}
            </p>
          </AccordionLabelByEtablissementContainer>
        }
      >
        <ButtonContainer>
          <Checkbox
            options={[
              {
                label: checkboxLabel,
                nativeInputProps: {
                  name: `selectAll${siret}`,
                  checked: isEveryCampagnesSelected,
                  onChange: (e) =>
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
                    }),
                },
              },
            ]}
          />
        </ButtonContainer>
        <CampagnesTable
          displayedCampagnes={campagnesByEtablissement}
          selectedCampagnes={selectedCampagnes}
          setSelectedCampagnes={setSelectedCampagnes}
          displayMode={displayMode}
        />
      </StyledAccordion>
    );
  });
};

export default DisplayByEtablissementTable;
