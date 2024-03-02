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
import CreateCampagneTable from "../CreateCampagneTable";

const DisplayByDiplomeTypeTable = ({ selectedFormations, setSelectedFormations }) => {
  const uniqueDiplomeTypesFromFormation = getUniqueDiplomeTypesFromFormation(selectedFormations);

  const orderedFormationByDiplomeType = orderFormationsByDiplomeType(selectedFormations);

  return uniqueDiplomeTypesFromFormation?.map((diplomeType) => {
    const formationsByDiplomeType = orderedFormationByDiplomeType[diplomeType];
    const isEveryFormationsSelected = formationsByDiplomeType.every((formation) =>
      selectedFormations.includes(formation._id)
    );

    const formationSelectedCountByDiplomeType = selectedFormations.filter((id) =>
      formationsByDiplomeType.map((formation) => formation._id).includes(id)
    ).length;

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
                {formationSelectedCountByDiplomeType} formation
                {isPlural(formationSelectedCountByDiplomeType)} sélectionnée
                {isPlural(formationSelectedCountByDiplomeType)}
              </p>
            </AccordionLabelByDiplomeTypeContainer>
          </>
        }
      >
        <CreateCampagneTable
          key={diplomeType}
          selectedFormations={selectedFormations}
          setSelectedFormations={setSelectedFormations}
        />
      </StyledAccordion>
    );
  });
};

export default DisplayByDiplomeTypeTable;
