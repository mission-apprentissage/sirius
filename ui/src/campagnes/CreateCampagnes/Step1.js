import React, { useState, useEffect } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import Alert from "@codegouvfr/react-dsfr/Alert";
import SortButtons from "../Shared/SortButtons/SortButtons";
import { CAMPAGNES_DISPLAY_MODE } from "../../constants";
import { StepContainer } from "../styles/createCampagnes.style";
import { SearchNoResultsContainer, LoaderContainer } from "../styles/shared.style";
import FormationsAccordions from "./Accordions/FormationsAccordions";
import {
  getUniqueDiplomeTypesFromFormation,
  getUniqueEtablissementFromFormation,
  orderFormationByEtablissement,
  orderFormationsByDiplomeType,
} from "../utils";
import FormationCard from "./Card/FormationCard";
import { FormationCardContainer } from "./Accordions/accordions.style";
import SelectAllCheckbox from "./Accordions/SelectAllCheckbox";

const Step1 = ({
  isLoading,
  hasError,
  existingFormationIdsFromCampagnes,
  remoteFormations,
  displayedFormations,
  setDisplayedFormations,
  selectedFormations,
  setSelectedFormations,
}) => {
  const [displayMode, setDisplayMode] = useState(CAMPAGNES_DISPLAY_MODE.DIPLOME);
  const [search, setSearch] = useState("");

  const isAccordionDisplayMode =
    displayMode === CAMPAGNES_DISPLAY_MODE.DIPLOME ||
    displayMode === CAMPAGNES_DISPLAY_MODE.ETABLISSEMENT;

  const shouldDisplayData = displayedFormations?.length && !isLoading && !hasError;

  useEffect(() => {
    if (remoteFormations?.length && search === "") {
      setDisplayedFormations(remoteFormations);
    } else {
      const filteredFormations = displayedFormations.filter((formation) => {
        return (
          formation.intitule_long.toLowerCase().includes(search) ||
          formation.localite.toLowerCase().includes(search) ||
          formation.etablissement_gestionnaire_enseigne.toLowerCase().includes(search) ||
          formation.etablissement_formateur_adresse.toLowerCase().includes(search) ||
          formation.etablissement_formateur_siret.toLowerCase().includes(search) ||
          formation.tags.join("-").toLowerCase().includes(search)
        );
      });
      setDisplayedFormations(filteredFormations);
    }
  }, [search]);

  let uniqueAccordionElements = [];
  let orderedFormationByElement = [];

  if (displayMode === CAMPAGNES_DISPLAY_MODE.DIPLOME) {
    uniqueAccordionElements = getUniqueDiplomeTypesFromFormation(displayedFormations);
    orderedFormationByElement = orderFormationsByDiplomeType(displayedFormations);
  } else if (displayMode === CAMPAGNES_DISPLAY_MODE.ETABLISSEMENT) {
    uniqueAccordionElements = getUniqueEtablissementFromFormation(displayedFormations);
    orderedFormationByElement = orderFormationByEtablissement(displayedFormations);
  }

  return (
    <StepContainer>
      <SortButtons
        displayMode={displayMode}
        setDisplayMode={setDisplayMode}
        search={search}
        setSearch={setSearch}
        organizeLabel="Organiser mes formations par"
        mode="creation"
      />
      {isLoading && (
        <LoaderContainer>
          <BeatLoader
            color="var(--background-action-high-blue-france)"
            size={20}
            aria-label="Loading Spinner"
          />
        </LoaderContainer>
      )}
      {hasError && (
        <Alert
          title="Une erreur s'est produite"
          description="Merci de réessayer ultérieurement"
          severity="error"
        />
      )}
      {!displayedFormations?.length && search ? (
        <SearchNoResultsContainer>
          <h3>Aucun résultats pour votre recherche</h3>
          <p onClick={() => setSearch("")}>Réinitialiser ?</p>
        </SearchNoResultsContainer>
      ) : null}
      {isAccordionDisplayMode && shouldDisplayData ? (
        <FormationsAccordions
          displayMode={displayMode}
          selectedFormations={selectedFormations}
          setSelectedFormations={setSelectedFormations}
          existingFormationIdsFromCampagnes={existingFormationIdsFromCampagnes}
          uniqueAccordionElements={uniqueAccordionElements}
          orderedFormationByElement={orderedFormationByElement}
        />
      ) : null}
      {!isAccordionDisplayMode && shouldDisplayData ? (
        <>
          <SelectAllCheckbox
            element="all"
            isChecked={!!selectedFormations.length}
            setSelectedFormations={setSelectedFormations}
            formationsByElement={displayedFormations}
            existingFormationIdsFromCampagnes={existingFormationIdsFromCampagnes}
            count={selectedFormations.length}
          />
          <FormationCardContainer>
            {displayedFormations.map((displayedFormation) => (
              <FormationCard
                key={displayedFormation._id}
                formation={displayedFormation}
                isAlreadyCreated={existingFormationIdsFromCampagnes?.includes(
                  displayedFormation._id
                )}
                isSelected={selectedFormations.includes(displayedFormation._id)}
                setSelectedFormations={setSelectedFormations}
                displayMode={displayMode}
              />
            ))}
          </FormationCardContainer>
        </>
      ) : null}
    </StepContainer>
  );
};

export default Step1;
