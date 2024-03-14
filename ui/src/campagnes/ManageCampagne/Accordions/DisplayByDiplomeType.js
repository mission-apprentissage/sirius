import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import CampagnesTable from "../../Shared/CampagnesTable/CampagnesTable";
import {
  orderCampagnesByDiplomeType,
  getUniqueDiplomeTypesFromCampagne,
  isPlural,
} from "../../utils";
import { DIPLOME_TYPE_MATCHER, CAMPAGNES_DISPLAY_MODE } from "../../../constants";
import { StyledAccordion, AccordionLabelByDiplomeTypeContainer } from "./accordions.style";

const DisplayByDiplomeType = ({
  displayedCampagnes,
  selectedCampagnes,
  setSelectedCampagnes,
  userContext,
}) => {
  const uniqueDiplomeTypesFromCampagne = getUniqueDiplomeTypesFromCampagne(displayedCampagnes);

  const orderedCampagnesByDiplomeType = orderCampagnesByDiplomeType(displayedCampagnes);

  return uniqueDiplomeTypesFromCampagne?.map((diplomeType) => {
    const campagnesByDiplomeType = orderedCampagnesByDiplomeType[diplomeType];

    const isCampagnesPlural = isPlural(campagnesByDiplomeType.length);

    const isEveryCampagnesSelected = campagnesByDiplomeType.every((campagne) =>
      selectedCampagnes.includes(campagne._id)
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
            <AccordionLabelByDiplomeTypeContainer>
              <h5>{DIPLOME_TYPE_MATCHER[diplomeType] || diplomeType}</h5>
              <p>
                {campagnesByDiplomeType.length} campagne
                {isCampagnesPlural} créée{isCampagnesPlural}
              </p>
            </AccordionLabelByDiplomeTypeContainer>
          </>
        }
      >
        <CampagnesTable
          key={diplomeType}
          displayedCampagnes={campagnesByDiplomeType}
          selectedCampagnes={selectedCampagnes}
          setSelectedCampagnes={setSelectedCampagnes}
          userContext={userContext}
          displayMode={CAMPAGNES_DISPLAY_MODE.DIPLOME}
        />
      </StyledAccordion>
    );
  });
};

export default DisplayByDiplomeType;
