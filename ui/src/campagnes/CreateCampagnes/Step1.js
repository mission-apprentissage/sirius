import React, { useState, useEffect } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { fr } from "@codegouvfr/react-dsfr";
import { LoaderContainer, StepContainer } from "../styles/createCampagnes.style";
import SortButtons from "../ManageCampagne/SortButtons/SortButtons";
import { campagnesDisplayMode } from "../../constants";
import DisplayByDiplomeTypeCards from "./Accordions/DisplayByDiplomeTypeCards";
import DisplayByEtablissementCards from "./Accordions/DisplayByEtablissementCards";
import Alert from "@codegouvfr/react-dsfr/Alert";

const Step1 = ({
  isLoading,
  hasError,
  localFormations,
  remoteFormations,
  displayedFormations,
  setDisplayedFormations,
  selectedFormations,
  setSelectedFormations,
}) => {
  const [displayMode, setDisplayMode] = useState(campagnesDisplayMode[0].value);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (displayedFormations?.length && search === "") {
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

  const existingFormationCatalogueIds = localFormations?.map((formation) => formation.data._id);

  const accordionComponentGetter = () => {
    if (displayMode === campagnesDisplayMode[0].value) {
      return (
        <DisplayByDiplomeTypeCards
          displayedFormations={displayedFormations}
          selectedFormations={selectedFormations}
          setSelectedFormations={setSelectedFormations}
          existingFormationCatalogueIds={existingFormationCatalogueIds}
        />
      );
    } else if (displayMode === campagnesDisplayMode[1].value) {
      return (
        <DisplayByEtablissementCards
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
      {displayedFormations?.length && !isLoading && !hasError ? (
        <div className={fr.cx("fr-accordions-group")}>{accordionComponentGetter()}</div>
      ) : null}
    </StepContainer>
  );
};

export default Step1;
