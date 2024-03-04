import React, { useRef } from "react";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import {
  orderFormationsByDiplomeType,
  getUniqueDiplomeTypesFromFormation,
  isPlural,
} from "../../utils";
import { DIPLOME_TYPE_MATCHER } from "../../../constants";
import {
  StyledAccordion,
  AccordionLabelByDiplomeTypeContainer,
  ButtonContainer,
} from "./accordions.style";
import CreateCampagneTable from "../CreateCampagneTable";
import RemoveFormationModal from "../RemoveFormationModal";

const modal = createModal({
  id: "remove-formation-modal",
  isOpenedByDefault: false,
});

const DisplayByDiplomeTypeTable = ({
  selectedFormations,
  setSelectedFormations,
  selectedFormationsAction,
  setSelectedFormationsAction,
  formik,
}) => {
  const dateInputRef = useRef(null);
  const uniqueDiplomeTypesFromFormation = getUniqueDiplomeTypesFromFormation(selectedFormations);

  const orderedFormationByDiplomeType = orderFormationsByDiplomeType(selectedFormations);

  const openDatePicker = () => {
    dateInputRef.current.showPicker();
  };

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
      <>
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

export default DisplayByDiplomeTypeTable;
