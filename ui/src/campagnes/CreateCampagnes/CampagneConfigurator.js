import React, { useState, useEffect } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import SortButtons from "../Shared/SortButtons/SortButtons";
import { StepContainer } from "../styles/createCampagnes.style";
import { campagnesDisplayMode, campagnesSortingOptions } from "../../constants";
import { orderFormationsByDiplomeType } from "../utils";
import DisplayByDiplomeTypeTable from "./Accordions/DisplayByDiplomeTypeTable";
import DisplayByEtablissementTable from "./Accordions/DisplayByEtablissementTable";
import { SearchNoResultsContainer } from "../styles/shared.style";
import DisplayByAllTable from "./Accordions/DisplayByAllTable";

const AccordionComponentGetter = ({ displayMode, ...props }) => {
  if (displayMode === campagnesDisplayMode[0].value) {
    return (
      <div className={fr.cx("fr-accordions-group")}>
        <DisplayByDiplomeTypeTable {...props} />
      </div>
    );
  } else if (displayMode === campagnesDisplayMode[1].value) {
    return (
      <div className={fr.cx("fr-accordions-group")}>
        <DisplayByEtablissementTable {...props} />
      </div>
    );
  } else if (displayMode === campagnesDisplayMode[2].value) {
    return <DisplayByAllTable {...props} />;
  }
};

const CampagneConfigurator = ({ selectedFormations, setSelectedFormations, formik }) => {
  const [selectedFormationsAction, setSelectedFormationsAction] = useState([]);
  const [searchedDiplayedFormations, setSearchedDiplayedFormations] = useState([]);
  const [displayMode, setDisplayMode] = useState(campagnesDisplayMode[0].value);
  const [sortingMode, setSortingMode] = useState(campagnesSortingOptions[0].value);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (selectedFormations?.length) {
      setSearchedDiplayedFormations(selectedFormations);
    }
  }, []);

  useEffect(() => {
    if (selectedFormations?.length && search === "") {
      setSearchedDiplayedFormations(selectedFormations);
    } else {
      const filteredFormations = searchedDiplayedFormations.filter((formation) => {
        return (
          formation.intitule_long.toLowerCase().includes(search) ||
          formation.localite.toLowerCase().includes(search) ||
          formation.etablissement_gestionnaire_enseigne.toLowerCase().includes(search) ||
          formation.etablissement_formateur_adresse.toLowerCase().includes(search) ||
          formation.etablissement_formateur_siret.toLowerCase().includes(search) ||
          formation.tags.join("-").toLowerCase().includes(search)
        );
      });
      setSearchedDiplayedFormations(filteredFormations);
    }
  }, [search]);

  const orderedFormationByDiplomeType = orderFormationsByDiplomeType(selectedFormations);
  const formationCountByDiplomeType = {};

  for (const key in orderedFormationByDiplomeType) {
    if (orderedFormationByDiplomeType.hasOwnProperty(key)) {
      const value = orderedFormationByDiplomeType[key];
      formationCountByDiplomeType[key] = value.length;
    }
  }

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
        mode="creation"
      />
      {!searchedDiplayedFormations?.length && search ? (
        <SearchNoResultsContainer>
          <h3>Aucun résultats pour votre recherche</h3>
          <p onClick={() => setSearch("")}>Réinitialiser ?</p>
        </SearchNoResultsContainer>
      ) : null}
      {searchedDiplayedFormations?.length ? (
        <AccordionComponentGetter
          displayMode={displayMode}
          selectedFormations={searchedDiplayedFormations}
          setSearchedDiplayedFormations={setSearchedDiplayedFormations}
          setSelectedFormations={setSelectedFormations}
          selectedFormationsAction={selectedFormationsAction}
          setSelectedFormationsAction={setSelectedFormationsAction}
          formik={formik}
        />
      ) : null}
    </StepContainer>
  );
};

export default CampagneConfigurator;