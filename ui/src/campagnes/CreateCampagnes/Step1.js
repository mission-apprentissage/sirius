import React, { useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { fr } from "@codegouvfr/react-dsfr";
import { LoaderContainer, StepContainer } from "../styles/createCampagnes.style";
import SortButtons from "../ManageCampagne/SortButtons/SortButtons";
import { campagnesDisplayMode, campagnesSortingOptions } from "../../constants";
import DisplayByDiplomeType from "../CreateCampagnes/Accordions/DisplayByDiplomeType";
import DisplayByEtablissement from "../CreateCampagnes/Accordions/DisplayByEtablissement";

const Step1 = ({
  isLoading,
  localFormations,
  displayedFormations,
  selectedFormations,
  setSelectedFormations,
}) => {
  const [displayMode, setDisplayMode] = useState(campagnesDisplayMode[1].value);
  const [sortingMode, setSortingMode] = useState(campagnesSortingOptions[0].value);
  const [search, setSearch] = useState("");

  const existingFormationCatalogueIds = localFormations?.map((formation) => formation.data._id);

  const accordionComponentGetter = () => {
    if (displayMode === campagnesDisplayMode[0].value) {
      return (
        <DisplayByDiplomeType
          displayedFormations={displayedFormations}
          selectedFormations={selectedFormations}
          setSelectedFormations={setSelectedFormations}
          existingFormationCatalogueIds={existingFormationCatalogueIds}
        />
      );
    } else if (displayMode === campagnesDisplayMode[1].value) {
      return (
        <DisplayByEtablissement
          displayedFormations={displayedFormations}
          selectedFormations={selectedFormations}
          setSelectedFormations={setSelectedFormations}
          existingFormationCatalogueIds={existingFormationCatalogueIds}
        />
      );
    }
  };

  return (
    <StepContainer>
      <SortButtons
        displayMode={displayMode}
        setDisplayMode={setDisplayMode}
        sortingMode={sortingMode}
        setSortingMode={setSortingMode}
        search={search}
        setSearch={setSearch}
        organizeLabel="Organiser mes formations par"
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
      {displayedFormations?.length && !isLoading ? (
        <div className={fr.cx("fr-accordions-group")}>{accordionComponentGetter()}</div>
      ) : null}
    </StepContainer>
  );
};

export default Step1;
