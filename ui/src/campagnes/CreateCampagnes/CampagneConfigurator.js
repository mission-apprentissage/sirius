import React, { useState, useEffect } from "react";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import SortButtons from "../Shared/SortButtons/SortButtons";
import { StepContainer } from "../styles/createCampagnes.style";
import { campagnesSortingOptions } from "../../constants";
import { orderFormationsByDiplomeType } from "../utils";
import Table from "./Table";

const CampagneConfigurator = ({ selectedFormations, setSelectedFormations, formik }) => {
  const [selectedFormationsAction, setSelectedFormationsAction] = useState([]);
  const [searchedDiplayedFormations, setSearchedDiplayedFormations] = useState([]);
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
          formation.intitule_long?.toLowerCase().includes(search) ||
          formation.lieu_formation_adresse_computed?.toLowerCase().includes(search) ||
          formation.lieu_formation_adresse?.toLowerCase().includes(search) ||
          formation.localite?.toLowerCase().includes(search) ||
          formation.etablissement_gestionnaire_enseigne?.toLowerCase().includes(search) ||
          formation.etablissement_formateur_adresse?.toLowerCase().includes(search) ||
          formation.etablissement_formateur_siret?.toLowerCase().includes(search) ||
          formation.tags?.join("-").toLowerCase().includes(search)
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
        sortingMode={sortingMode}
        setSortingMode={setSortingMode}
        search={search}
        setSearch={setSearch}
        organizeLabel="Organiser mes formations par"
        mode="creation"
      />
      {!searchedDiplayedFormations?.length && search ? (
        <Alert
          title={`Aucun résultats pour votre recherche « ${search} »`}
          description={
            <Button priority="secondary" onClick={() => setSearch("")}>
              Réinitialiser la recherche
            </Button>
          }
          severity="info"
        />
      ) : null}
      {searchedDiplayedFormations?.length ? (
        <Table
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
