import React, { useRef } from "react";
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
import { campagnesDisplayMode } from "../../../constants";

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
  const dateInputRef = useRef(null);
  const uniqueEtablissementFromFormation = getUniqueEtablissementFromFormation(selectedFormations);

  const orderedFormationsByEtablissement = orderFormationByEtablissement(selectedFormations);

  const openDatePicker = () => {
    dateInputRef.current.showPicker();
  };

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
              onClick={openDatePicker}
              disabled={!selectedFormationsAction.length}
            >
              <input
                type="date"
                ref={dateInputRef}
                style={{ visibility: "hidden", width: "0" }}
                onChange={(e) => {
                  selectedFormationsAction.forEach((id) =>
                    formik.setFieldValue(`${id}.endDate`, e.target.value)
                  );
                  setSelectedFormationsAction([]);
                }}
              />
              Choisir date de fin commune
            </Button>
          </ButtonContainer>
          <CreateCampagneTable
            selectedFormations={formationsByEtablissement}
            selectedFormationsAction={selectedFormationsAction}
            setSelectedFormationsAction={setSelectedFormationsAction}
            formik={formik}
            displayMode={campagnesDisplayMode[1].value}
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
