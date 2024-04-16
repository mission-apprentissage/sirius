import React from "react";
import Tooltip from "react-simple-tooltip";
import { fr } from "@codegouvfr/react-dsfr";
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
import RemoveFormationModal from "../RemoveFormationModal";
import { CAMPAGNE_TABLE_TYPES, campagnesDisplayMode } from "../../../constants";
import { ToolTipContainer } from "../../styles/shared.style";
import CommonEndDateModal from "../CommonEndDateModal";
import CampagnesTable from "../../Shared/CampagnesTable/CampagnesTable";

const modal = createModal({
  id: "remove-formation-modal",
  isOpenedByDefault: false,
});

const commonEndDateModal = createModal({
  id: "common-endDate-modal",
  isOpenedByDefault: false,
});

const DisplayByEtablissementTable = ({
  selectedFormations,
  setSelectedFormations,
  setSearchedDiplayedFormations,
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
      <div key={siret}>
        <StyledAccordion
          label={
            <AccordionLabelByEtablissementContainer>
              <div>
                {formationsByEtablissement[0].etablissement_formateur_siret ===
                formationsByEtablissement[0].etablissement_gestionnaire_siret ? (
                  <Tooltip
                    background="var(--background-default-grey)"
                    border="var(--border-default-grey)"
                    color="var(--text-default-grey)"
                    placement="right"
                    content={
                      <ToolTipContainer>
                        Cet établissement est gestionnaire et rattaché à votre compte Sirius
                      </ToolTipContainer>
                    }
                  >
                    <span className={fr.cx("fr-icon-award-fill")} aria-hidden={true} />
                  </Tooltip>
                ) : (
                  <Tooltip
                    background="var(--background-default-grey)"
                    border="var(--border-default-grey)"
                    color="var(--text-default-grey)"
                    placement="right"
                    content={
                      <ToolTipContainer>
                        Cet établissement est formateur et dispense des formations pour un
                        établissement gestionnaire
                      </ToolTipContainer>
                    }
                  >
                    <span className={fr.cx("fr-icon-award-line")} aria-hidden={true} />
                  </Tooltip>
                )}
                <h5>
                  {formationsByEtablissement[0].etablissement_formateur_entreprise_raison_sociale ||
                    formationsByEtablissement[0].etablissement_formateur_enseigne}
                </h5>
              </div>
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
              onClick={() => commonEndDateModal.open()}
              disabled={!selectedFormationsAction.length}
            >
              Choisir une date de fin commune
            </Button>
          </ButtonContainer>
          <CampagnesTable
            selectedFormations={formationsByEtablissement}
            selectedFormationsAction={selectedFormationsAction}
            setSelectedFormationsAction={setSelectedFormationsAction}
            formik={formik}
            displayMode={campagnesDisplayMode[1].value}
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

export default DisplayByEtablissementTable;
