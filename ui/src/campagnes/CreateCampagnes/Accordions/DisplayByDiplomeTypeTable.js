import { Button } from "@codegouvfr/react-dsfr/Button";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { createModal } from "@codegouvfr/react-dsfr/Modal";

import { CAMPAGNE_TABLE_TYPES, campagnesDisplayMode, DIPLOME_TYPE_MATCHER } from "../../../constants";
import CampagnesTable from "../../Shared/CampagnesTable/CampagnesTable";
import { getUniqueDiplomeTypesFromFormation, isPlural, orderFormationsByDiplomeType } from "../../utils";
import CommonEndDateModal from "../CommonEndDateModal";
import RemoveFormationModal from "../RemoveFormationModal";
import { AccordionLabelByDiplomeTypeContainer, ButtonContainer, StyledAccordion } from "./accordions.style";

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
                        e.target.checked ? [...formationsByDiplomeType.map((formation) => formation._id)] : []
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
          <CampagnesTable
            selectedFormations={formationsByDiplomeType}
            selectedFormationsAction={selectedFormationsAction}
            setSelectedFormationsAction={setSelectedFormationsAction}
            formik={formik}
            displayMode={campagnesDisplayMode[0].value}
            campagneTableType={CAMPAGNE_TABLE_TYPES.CREATE}
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
