import React from "react";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import Button from "@codegouvfr/react-dsfr/Button";
import { CAMPAGNES_DISPLAY_MODE } from "../../../constants";
import CreateCampagneTable from "../CreateCampagneTable";
import { ButtonContainer } from "./accordions.style";
import RemoveFormationModal from "../RemoveFormationModal";
import { isPlural } from "../../utils";
import CommonEndDateModal from "../CommonEndDateModal";

const modal = createModal({
  id: "remove-formation-modal",
  isOpenedByDefault: false,
});

const commonEndDateModal = createModal({
  id: "common-endDate-modal",
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
  const selectedFormationsActionCount = selectedFormationsAction.length;

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
          onClick={() => commonEndDateModal.open()}
          disabled={!selectedFormationsAction.length}
        >
          Choisir une date de fin commune
        </Button>
      </ButtonContainer>
      <CreateCampagneTable
        selectedFormations={selectedFormations}
        selectedFormationsAction={selectedFormationsAction}
        setSelectedFormationsAction={setSelectedFormationsAction}
        formik={formik}
        displayMode={CAMPAGNES_DISPLAY_MODE.ALL}
      />
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
    </>
  );
};

export default DisplayByAllTable;
