import React from "react";
import { StyledAccordion, FormationCardContainer } from "./accordions.style";
import AccordionLabel from "./AccordionLabel";
import FormationCard from "../Card/FormationCard";
import SelectAllCheckbox from "./SelectAllCheckbox";

const FormationsAccordions = ({
  displayMode,
  selectedFormations,
  setSelectedFormations,
  existingFormationIdsFromCampagnes,
  uniqueAccordionElements,
  orderedFormationByElement,
}) => {
  return uniqueAccordionElements?.map((element) => {
    const formationsByElement = orderedFormationByElement[element];

    const formationSelectedCountByDiplomeType = selectedFormations.filter((id) =>
      formationsByElement.map((formation) => formation._id).includes(id)
    ).length;

    return (
      <StyledAccordion
        key={element}
        label={
          <AccordionLabel
            displayMode={displayMode}
            element={element}
            firstFormation={formationsByElement[0]}
            formationSelectedCountByDiplomeType={formationSelectedCountByDiplomeType}
          />
        }
      >
        <SelectAllCheckbox
          element={element}
          isChecked={!!formationSelectedCountByDiplomeType}
          setSelectedFormations={setSelectedFormations}
          formationsByElement={formationsByElement}
          existingFormationIdsFromCampagnes={existingFormationIdsFromCampagnes}
          count={formationSelectedCountByDiplomeType}
        />
        <FormationCardContainer>
          {formationsByElement.map((formation) => {
            const isAlreadyCreated = existingFormationIdsFromCampagnes?.includes(formation._id);
            return (
              <FormationCard
                key={formation._id}
                formation={formation}
                isAlreadyCreated={isAlreadyCreated}
                isSelected={selectedFormations.includes(formation._id)}
                setSelectedFormations={setSelectedFormations}
                displayMode={displayMode}
              />
            );
          })}
        </FormationCardContainer>
      </StyledAccordion>
    );
  });
};

export default FormationsAccordions;
