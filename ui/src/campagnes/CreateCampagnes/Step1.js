import React, { useState, useEffect } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import SortButtons from "../Shared/SortButtons/SortButtons";
import DisplayByDiplomeTypeCards from "./Accordions/DisplayByDiplomeTypeCards";
import DisplayByEtablissementCards from "./Accordions/DisplayByEtablissementCards";
import { campagnesDisplayMode } from "../../constants";
import { StepContainer } from "../styles/createCampagnes.style";
import { SearchNoResultsContainer, LoaderContainer } from "../styles/shared.style";
import DisplayByAllCards from "./Accordions/DisplayByAllCards";

const AccordionComponentGetter = ({ displayMode, ...props }) => {
  if (displayMode === campagnesDisplayMode[0].value) {
    return (
      <div className={fr.cx("fr-accordions-group")}>
        <DisplayByDiplomeTypeCards {...props} />
      </div>
    );
  } else if (displayMode === campagnesDisplayMode[1].value) {
    return (
      <div className={fr.cx("fr-accordions-group")}>
        <DisplayByEtablissementCards {...props} />
      </div>
    );
  } else if (displayMode === campagnesDisplayMode[2].value) {
    return <DisplayByAllCards {...props} />;
  }
};

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
  const [displayMode, setDisplayMode] = useState(campagnesDisplayMode[0].value);
  const [search, setSearch] = useState("");

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
      {displayedFormations?.length && !isLoading && !hasError ? (
        <AccordionComponentGetter
          displayMode={displayMode}
          displayedFormations={displayedFormations}
          selectedFormations={selectedFormations}
          setSelectedFormations={setSelectedFormations}
          existingFormationIdsFromCampagnes={existingFormationIdsFromCampagnes}
        />
      ) : null}
    </StepContainer>
  );
};

export default Step1;
