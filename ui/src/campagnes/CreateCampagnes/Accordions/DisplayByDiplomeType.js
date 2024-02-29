import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import {
  orderFormationsByDiplomeType,
  getUniqueDiplomeTypesFromFormation,
  isPlural,
} from "../../utils";
import { DIPLOME_TYPE_MATCHER } from "../../../constants";
import { StyledAccordion, AccordionLabelByDiplomeTypeContainer } from "./accordions.style";

const DisplayByDiplomeType = ({
  displayedFormations,
  selectedFormations,
  setSelectedFormations,
}) => {
  const uniqueDiplomeTypesFromFormation = getUniqueDiplomeTypesFromFormation(displayedFormations);

  const orderedFormationByDiplomeType = orderFormationsByDiplomeType(displayedFormations);

  return uniqueDiplomeTypesFromFormation?.map((diplomeType) => {
    const formationsByDiplomeType = orderedFormationByDiplomeType[diplomeType];

    const isFormationsPlural = isPlural(formationsByDiplomeType.length);

    const isEveryFormationsSelected = formationsByDiplomeType.every((formation) =>
      selectedFormations.includes(formation._id)
    );

    return (
      <StyledAccordion
        key={diplomeType}
        label={
          <>
            <Checkbox
              small
              options={[
                {
                  nativeInputProps: {
                    name: `selectAll${diplomeType}`,
                    checked: isEveryFormationsSelected,
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
            <AccordionLabelByDiplomeTypeContainer>
              <h5>{DIPLOME_TYPE_MATCHER[diplomeType] || diplomeType}</h5>
              <p>
                {formationsByDiplomeType.length} formation
                {isFormationsPlural} créée{isFormationsPlural}
              </p>
            </AccordionLabelByDiplomeTypeContainer>
          </>
        }
      >
        {/*<ManageFormationTable
          key={diplomeType}
          displayedFormations={formationsByDiplomeType}
          selectedFormations={selectedFormations}
          setSelectedFormations={setSelectedFormations}
          userContext={userContext}
      />*/}
      </StyledAccordion>
    );
  });
};

export default DisplayByDiplomeType;
