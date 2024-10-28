import { Button } from "@codegouvfr/react-dsfr/Button";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import React from "react";

import { CAMPAGNE_TABLE_TYPES } from "../../constants";
import CampagnesTable from "../Shared/CampagnesTable/CampagnesTable";
import { ButtonContainer } from "../styles/shared.style";
import CommonEndDateModal from "./CommonEndDateModal";
import RemoveFormationModal from "./RemoveFormationModal";

const modal = createModal({
  id: "remove-formation-modal",
  isOpenedByDefault: false,
});

const commonEndDateModal = createModal({
  id: "common-endDate-modal",
  isOpenedByDefault: false,
});

const Table = ({
  selectedFormations,
  setSelectedFormations,
  setSearchedDiplayedFormations,
  selectedFormationsAction,
  setSelectedFormationsAction,
  formik,
}) => {
  return (
    <>
      <ButtonContainer>
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
      <CampagnesTable
        selectedFormations={selectedFormations}
        selectedFormationsAction={selectedFormationsAction}
        setSelectedFormationsAction={setSelectedFormationsAction}
        formik={formik}
        campagneTableType={CAMPAGNE_TABLE_TYPES.CREATE}
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

export default Table;
