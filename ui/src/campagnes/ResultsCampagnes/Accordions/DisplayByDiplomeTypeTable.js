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

    const isEveryCampagnesSelected = campagnesByDiplomeType?.every((campagne) =>
      selectedCampagnes.includes(campagne._id)
    );

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
      <StyledAccordion
        key={diplomeType}
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
                  checked: isEveryCampagnesSelected,
                  onChange: (e) => {
                    setSelectedCampagnes((prevValues) => {
                      if (e.target.checked) {
                        return [
                          ...new Set([
                            ...prevValues,
                            ...campagnesByDiplomeType.map((campagne) => campagne._id),
                          ]),
                        ];
                      } else {
                        return prevValues.filter(
                          (selectedCampagne) =>
                            !campagnesByDiplomeType
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
        </ButtonContainer>
        <CampagnesTable
          displayedCampagnes={campagnesByDiplomeType}
          selectedCampagnes={selectedCampagnes}
          setSelectedCampagnes={setSelectedCampagnes}
          displayMode={displayMode}
        />
      </StyledAccordion>
    );
  });
};

export default DisplayByDiplomeTypeTable;
