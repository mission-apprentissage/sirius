import React, { useRef } from "react";
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
import CreateCampagneTable from "../CreateCampagneTable";
import RemoveFormationModal from "../RemoveFormationModal";
import { campagnesDisplayMode } from "../../../constants";
import { ToolTipContainer } from "../../styles/shared.style";

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
              <div>
                {formationsByEtablissement[0].etablissement_formateur_siret ===
                formationsByEtablissement[0].etablissement_gestionnaire_siret ? (
                  <Tooltip
                    background="var(--background-default-grey)"
                    border="var(--border-default-grey)"
                    color="var(--text-default-grey)"
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
