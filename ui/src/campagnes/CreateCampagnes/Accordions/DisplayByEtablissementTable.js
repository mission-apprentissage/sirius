import React from "react";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import {
  getUniqueEtablissementFromFormation,
  orderFormationByEtablissement,
  isPlural,
} from "../../utils";
import { StyledAccordion, AccordionLabelByEtablissementContainer } from "./accordions.style";
import CreateCampagneTable from "../CreateCampagneTable";

const DisplayByEtablissementTable = ({ selectedFormations, setSelectedFormations, formik }) => {
  const uniqueEtablissementFromFormation = getUniqueEtablissementFromFormation(selectedFormations);

  const orderedFormationsByEtablissement = orderFormationByEtablissement(selectedFormations);
  return uniqueEtablissementFromFormation.map((siret) => {
    const formationsByEtablissement = orderedFormationsByEtablissement[siret];

    const formationSelectedCountByEtablissement = selectedFormations.filter((id) =>
      formationsByEtablissement.map((formation) => formation._id).includes(id)
    ).length;

    const checkboxLabel = (
      <b>
        {formationSelectedCountByEtablissement
          ? `${formationSelectedCountByEtablissement} formation${isPlural(
              formationSelectedCountByEtablissement
            )} sélectionnée${isPlural(formationSelectedCountByEtablissement)}`
          : "Tout sélectionner"}
      </b>
    );

    return (
      <StyledAccordion
        key={siret}
        label={
          <AccordionLabelByEtablissementContainer>
            <h5>{formationsByEtablissement[0].etablissement_formateur_enseigne}</h5>
            <p>
              {formationsByEtablissement[0].etablissement_formateur_adresse}{" "}
              {formationsByEtablissement[0].localite}
            </p>
            <p>N° SIRET : {formationsByEtablissement[0].etablissement_formateur_siret}</p>
            <p>
              {formationSelectedCountByEtablissement} formation
              {isPlural(formationSelectedCountByEtablissement)} sélectionnée
              {isPlural(formationSelectedCountByEtablissement)}
            </p>
          </AccordionLabelByEtablissementContainer>
        }
      >
        <Checkbox
          options={[
            {
              label: checkboxLabel,
              nativeInputProps: {
                name: `selectAll${siret}`,
                checked: !!formationSelectedCountByEtablissement,
                onChange: (e) => {
                  setSelectedFormations((prevValues) => {
                    if (e.target.checked) {
                      return [
                        ...new Set([
                          ...prevValues,
                          ...formationsByEtablissement.map((formation) => formation._id),
                        ]),
                      ];
                    } else {
                      return prevValues.filter(
                        (selectedFormation) =>
                          !formationsByEtablissement
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
          selectedFormations={formationsByEtablissement}
          setSelectedFormations={setSelectedFormations}
          formik={formik}
        />
      </StyledAccordion>
    );
  });
};

export default DisplayByEtablissementTable;
