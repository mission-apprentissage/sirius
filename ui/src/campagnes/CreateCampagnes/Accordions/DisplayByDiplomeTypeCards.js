import React from "react";
import { Link } from "react-router-dom";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import {
  orderFormationsByDiplomeType,
  getUniqueDiplomeTypesFromFormation,
  isPlural,
} from "../../utils";
import { DIPLOME_TYPE_MATCHER } from "../../../constants";
import {
  StyledAccordion,
  AccordionLabelByDiplomeTypeContainer,
  FormationCardContainer,
  FormationCardByDiplomeType,
  StyledBadge,
} from "./accordions.style";

const DisplayByDiplomeTypeCards = ({
  displayedFormations,
  selectedFormations,
  setSelectedFormations,
  existingFormationCatalogueIds,
}) => {
  const uniqueDiplomeTypesFromFormation = getUniqueDiplomeTypesFromFormation(displayedFormations);

  const orderedFormationByDiplomeType = orderFormationsByDiplomeType(displayedFormations);

  return uniqueDiplomeTypesFromFormation?.map((diplomeType) => {
    const formationsByDiplomeType = orderedFormationByDiplomeType[diplomeType];

    const formationSelectedCountByDiplomeType = selectedFormations.filter((id) =>
      formationsByDiplomeType.map((formation) => formation._id).includes(id)
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
                checked: !!formationSelectedCountByDiplomeType,
                onChange: (e) => {
                  setSelectedFormations((prevValues) => {
                    if (e.target.checked) {
                      return [
                        ...new Set([
                          ...prevValues,
                          ...formationsByDiplomeType.map((formation) => formation._id),
                        ]),
                      ];
                    } else {
                      return prevValues.filter(
                        (selectedFormation) =>
                          !formationsByDiplomeType
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
          {formationsByDiplomeType.map((formation) => {
            const isAlreadyCreated = existingFormationCatalogueIds?.includes(formation._id);
            return (
              <FormationCardByDiplomeType
                key={formation._id}
                isAlreadyCreated={isAlreadyCreated}
                isChecked={selectedFormations.includes(formation.id)}
              >
                <div>
                  <StyledBadge small isAlreadyCreated={isAlreadyCreated}>
                    {formation.tags.join(" - ")}
                  </StyledBadge>
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
                </div>
                <h6>{formation.intitule_long}</h6>
                <div>
                  <p>{formation.etablissement_gestionnaire_enseigne}</p>
                  <p>
                    {formation.etablissement_formateur_adresse} {formation.localite}
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
