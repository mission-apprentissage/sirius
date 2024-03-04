import React, { useState, useEffect } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import SortButtons from "../ManageCampagne/SortButtons/SortButtons";
import { StepContainer } from "../styles/createCampagnes.style";
import { campagnesDisplayMode, campagnesSortingOptions } from "../../constants";
import { orderFormationsByDiplomeType } from "../utils";
import DisplayByDiplomeTypeTable from "./Accordions/DisplayByDiplomeTypeTable";
import DisplayByEtablissementTable from "./Accordions/DisplayByEtablissementTable";

const Step2 = ({ selectedFormations, setSelectedFormations, formik }) => {
  const [selectedFormationsAction, setSelectedFormationsAction] = useState([]);
  const [searchedDiplayedFormations, setSearchedDiplayedFormations] = useState([]);
  const [displayMode, setDisplayMode] = useState(campagnesDisplayMode[0].value);
  const [sortingMode, setSortingMode] = useState(campagnesSortingOptions[0].value);
  const [search, setSearch] = useState("");

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

  const accordionComponentGetter = () => {
    if (displayMode === campagnesDisplayMode[0].value) {
      return (
        <DisplayByDiplomeTypeTable
          selectedFormations={searchedDiplayedFormations}
          setSelectedFormations={setSelectedFormations}
          selectedFormationsAction={selectedFormationsAction}
          setSelectedFormationsAction={setSelectedFormationsAction}
          formik={formik}
        />
      );
    } else if (displayMode === campagnesDisplayMode[1].value) {
      return (
        <DisplayByEtablissementTable
          selectedFormations={searchedDiplayedFormations}
          setSelectedFormations={setSelectedFormations}
          selectedFormationsAction={selectedFormationsAction}
          setSelectedFormationsAction={setSelectedFormationsAction}
          formik={formik}
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
        mode="creation"
      />
      {selectedFormations?.length ? (
        <div className={fr.cx("fr-accordions-group")}>{accordionComponentGetter()}</div>
      ) : null}
    </StepContainer>
  );
};

export default Step2;
