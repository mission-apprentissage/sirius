import React from "react";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import {
  getUniqueDiplomeTypesFromCampagne,
  orderCampagnesByDiplomeType,
  isPlural,
} from "../../utils";
import {
  StyledAccordion,
  AccordionLabelByDiplomeTypeContainer,
  ButtonContainer,
} from "./accordions.style";
import CampagnesTable from "../CampagnesTable";
import { DIPLOME_TYPE_MATCHER } from "../../../constants";

const DisplayByDiplomeTypeTable = ({
  displayedCampagnes,
  selectedCampagnes,
  setSelectedCampagnes,
  displayMode,
}) => {
  const uniqueDiplomeTypeFromCampagnes = getUniqueDiplomeTypesFromCampagne(displayedCampagnes);

  const orderedCampagnessByDiplomeType = orderCampagnesByDiplomeType(displayedCampagnes);

  return uniqueDiplomeTypeFromCampagnes.map((diplomeType) => {
    const campagnesByDiplomeType = orderedCampagnessByDiplomeType[diplomeType];
    const campagnesSelectedCountByDiplomeType = selectedCampagnes.filter((id) =>
      campagnesByDiplomeType.map((formation) => formation._id).includes(id)
    ).length;

    const checkboxLabel = (
      <b>
        {campagnesSelectedCountByDiplomeType
          ? `${campagnesSelectedCountByDiplomeType} formation${isPlural(
              campagnesSelectedCountByDiplomeType
            )} sélectionnée${isPlural(campagnesSelectedCountByDiplomeType)}`
          : "Tout sélectionner"}
      </b>
    );

    return (
      <>
        <StyledAccordion
          key={DIPLOME_TYPE_MATCHER[diplomeType]}
          label={
            <AccordionLabelByDiplomeTypeContainer>
              <h5>{DIPLOME_TYPE_MATCHER[diplomeType] || diplomeType}</h5>
              <p>
                {campagnesSelectedCountByDiplomeType} formation
                {isPlural(campagnesSelectedCountByDiplomeType)} sélectionnée
                {isPlural(campagnesSelectedCountByDiplomeType)}
              </p>
            </AccordionLabelByDiplomeTypeContainer>
          }
        >
          <ButtonContainer>
            <Checkbox
              options={[
                {
                  label: checkboxLabel,
                  nativeInputProps: {
                    name: `selectAll${diplomeType}`,
                    checked:
                      selectedCampagnes.length > 0 &&
                      campagnesSelectedCountByDiplomeType === campagnesByDiplomeType.length,
                    onChange: (e) =>
                      setSelectedCampagnes((prevValues) =>
                        e.target.checked
                          ? [
                              ...prevValues,
                              ...campagnesByDiplomeType.map((formation) => formation._id),
                            ]
                          : []
                      ),
                  },
                },
              ]}
            />
          </ButtonContainer>
          <CampagnesTable
            displayedCampagnes={campagnesByDiplomeType}
            selectedCampagnes={selectedCampagnes}
            setSelectedCampagnes={setSelectedCampagnes}
            displayMode={displayMode}
          />
        </StyledAccordion>
      </>
    );
  });
};

export default DisplayByDiplomeTypeTable;
