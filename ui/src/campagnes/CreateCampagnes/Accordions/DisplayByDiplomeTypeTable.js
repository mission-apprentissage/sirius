import React from "react";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import {
  orderFormationsByDiplomeType,
  getUniqueDiplomeTypesFromFormation,
  isPlural,
} from "../../utils";
import { DIPLOME_TYPE_MATCHER, campagnesDisplayMode } from "../../../constants";
import {
  StyledAccordion,
  AccordionLabelByDiplomeTypeContainer,
  ButtonContainer,
} from "./accordions.style";
import CreateCampagneTable from "../CreateCampagneTable";
import RemoveFormationModal from "../RemoveFormationModal";
import CommonEndDateModal from "../CommonEndDateModal";

const modal = createModal({
  id: "remove-formation-modal",
  isOpenedByDefault: false,
});

const commonEndDateModal = createModal({
  id: "common-endDate-modal",
  isOpenedByDefault: false,
});

const DisplayByDiplomeTypeTable = ({
  selectedFormations,
  setSelectedFormations,
  setSearchedDiplayedFormations,
  selectedFormationsAction,
  setSelectedFormationsAction,
  formik,
}) => {
  const uniqueDiplomeTypesFromFormation = getUniqueDiplomeTypesFromFormation(selectedFormations);

  const orderedFormationByDiplomeType = orderFormationsByDiplomeType(selectedFormations);

  return uniqueDiplomeTypesFromFormation?.map((diplomeType) => {
    const formationsByDiplomeType = orderedFormationByDiplomeType[diplomeType];

    const formationSelectedCountByDiplomeType = selectedFormationsAction.filter((id) =>
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
      <div key={diplomeType}>
        <StyledAccordion
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
          <ButtonContainer>
            <Checkbox
              options={[
                {
                  label: checkboxLabel,
                  nativeInputProps: {
                    name: `selectAll${diplomeType}`,
                    checked:
                      selectedFormationsAction.length > 0 &&
                      formationSelectedCountByDiplomeType === selectedFormationsAction.length,
                    onChange: (e) =>
                      setSelectedFormationsAction(
                        e.target.checked
                          ? [...formationsByDiplomeType.map((formation) => formation._id)]
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
              onClick={() => commonEndDateModal.open()}
              disabled={!selectedFormationsAction.length}
            >
              Choisir une date de fin commune
            </Button>
          </ButtonContainer>
          <CreateCampagneTable
            selectedFormations={formationsByDiplomeType}
            selectedFormationsAction={selectedFormationsAction}
            setSelectedFormationsAction={setSelectedFormationsAction}
            formik={formik}
            displayMode={campagnesDisplayMode[0].value}
          />
        </StyledAccordion>
        <RemoveFormationModal
          modal={modal}
          selectedFormationsAction={selectedFormationsAction}
          setSelectedFormationsAction={setSelectedFormationsAction}
          setSelectedFormations={setSelectedFormations}
          setSearchedDiplayedFormations={setSearchedDiplayedFormations}
        />
        <CommonEndDateModal
          modal={commonEndDateModal}
          selectedFormationsAction={selectedFormationsAction}
          setSelectedFormationsAction={setSelectedFormationsAction}
          formik={formik}
        />
      </div>
    );
  });
};

export default DisplayByDiplomeTypeTable;
