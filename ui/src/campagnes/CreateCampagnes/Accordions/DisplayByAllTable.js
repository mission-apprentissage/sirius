import React, { useRef } from "react";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import Button from "@codegouvfr/react-dsfr/Button";
import { campagnesDisplayMode } from "../../../constants";
import CreateCampagneTable from "../CreateCampagneTable";
import { ButtonContainer } from "./accordions.style";
import RemoveFormationModal from "../RemoveFormationModal";
import { isPlural } from "../../utils";

const modal = createModal({
  id: "remove-formation-modal",
  isOpenedByDefault: false,
});

const DisplayByAllTable = ({
  selectedFormations,
  setSelectedFormations,
  setSearchedDiplayedFormations,
  selectedFormationsAction,
  setSelectedFormationsAction,
  formik,
}) => {
  const dateInputRef = useRef(null);
  const selectedFormationsActionCount = selectedFormationsAction.length;

  const openDatePicker = () => {
    dateInputRef.current.showPicker();
  };

  const checkboxLabel = (
    <b>
      {selectedFormationsActionCount
        ? `${selectedFormationsActionCount} formation${isPlural(
            selectedFormationsActionCount
          )} sélectionnée${isPlural(selectedFormationsActionCount)}`
        : "Tout sélectionner"}
    </b>
  );

  return (
    <>
      <ButtonContainer>
        <Checkbox
          options={[
            {
              label: checkboxLabel,
              nativeInputProps: {
                name: `selectAll`,
                checked:
                  selectedFormationsAction.length > 0 &&
                  selectedFormationsActionCount === selectedFormationsAction.length,
                onChange: (e) =>
                  setSelectedFormationsAction(
                    e.target.checked
                      ? [...selectedFormations.map((formation) => formation._id)]
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
        displayMode={campagnesDisplayMode[2].value}
      />
      <RemoveFormationModal
        modal={modal}
        selectedFormationsAction={selectedFormationsAction}
        setSelectedFormationsAction={setSelectedFormationsAction}
        setSelectedFormations={setSelectedFormations}
        setSearchedDiplayedFormations={setSearchedDiplayedFormations}
      />
    </>
  );
};

export default DisplayByAllTable;
