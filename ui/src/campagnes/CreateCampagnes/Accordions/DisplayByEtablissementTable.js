import React from "react";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import {
  getUniqueEtablissementFromFormation,
  orderFormationByEtablissement,
  isPlural,
} from "../../utils";
import {
  StyledAccordion,
  AccordionLabelByEtablissementContainer,
  ButtonContainer,
} from "./accordions.style";
import CreateCampagneTable from "../CreateCampagneTable";
import RemoveFormationModal from "../RemoveFormationModal";

const modal = createModal({
  id: "remove-formation-modal",
  isOpenedByDefault: false,
});

const DisplayByEtablissementTable = ({
  selectedFormations,
  setSelectedFormations,
  selectedFormationsAction,
  setSelectedFormationsAction,
  formik,
}) => {
  const uniqueEtablissementFromFormation = getUniqueEtablissementFromFormation(selectedFormations);

  const orderedFormationsByEtablissement = orderFormationByEtablissement(selectedFormations);
  return uniqueEtablissementFromFormation.map((siret) => {
    const formationsByEtablissement = orderedFormationsByEtablissement[siret];

    const formationSelectedCountByEtablissement = selectedFormationsAction.filter((id) =>
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
      <>
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
          <ButtonContainer>
            <Checkbox
              options={[
                {
                  label: checkboxLabel,
                  nativeInputProps: {
                    name: `selectAll${siret}`,
                    checked:
                      selectedFormationsAction.length > 0 &&
                      formationSelectedCountByEtablissement === selectedFormationsAction.length,
                    onChange: (e) =>
                      setSelectedFormationsAction(
                        e.target.checked
                          ? [...formationsByEtablissement.map((formation) => formation._id)]
                          : []
                      ),
                  },
                },
              ]}
            />
            <Button
              priority="secondary"
              iconId="fr-icon-delete-line"
              onClick={() => modal.open()}
              disabled={!selectedFormationsAction.length}
            >
              Retirer
            </Button>
            <Button
              priority="secondary"
              iconId="fr-icon--sm fr-icon-calendar-2-fill"
              disabled={!selectedFormationsAction.length}
            >
              Choisir date de fin commune
            </Button>
          </ButtonContainer>
          <CreateCampagneTable
            selectedFormations={selectedFormations}
            selectedFormationsAction={selectedFormationsAction}
            setSelectedFormationsAction={setSelectedFormationsAction}
            formik={formik}
          />
        </StyledAccordion>
        <RemoveFormationModal
          modal={modal}
          selectedFormationsAction={selectedFormationsAction}
          setSelectedFormationsAction={setSelectedFormationsAction}
          setSelectedFormations={setSelectedFormations}
        />
      </>
    );
  });
};

export default DisplayByEtablissementTable;
