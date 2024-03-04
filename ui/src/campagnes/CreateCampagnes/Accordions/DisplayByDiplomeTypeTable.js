import React from "react";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import {
  orderFormationsByDiplomeType,
  getUniqueDiplomeTypesFromFormation,
  isPlural,
} from "../../utils";
import { DIPLOME_TYPE_MATCHER } from "../../../constants";
import { StyledAccordion, AccordionLabelByDiplomeTypeContainer } from "./accordions.style";
import CreateCampagneTable from "../CreateCampagneTable";

const DisplayByDiplomeTypeTable = ({ selectedFormations, setSelectedFormations, formik }) => {
  const uniqueDiplomeTypesFromFormation = getUniqueDiplomeTypesFromFormation(selectedFormations);

  const orderedFormationByDiplomeType = orderFormationsByDiplomeType(selectedFormations);

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
          <>
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
        <CreateCampagneTable
          key={diplomeType}
          selectedFormations={formationsByDiplomeType}
          setSelectedFormations={setSelectedFormations}
          formik={formik}
        />
      </StyledAccordion>
    );
  });
};

export default DisplayByDiplomeTypeTable;
