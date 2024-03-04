import React, { useState } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import SortButtons from "../ManageCampagne/SortButtons/SortButtons";
import { StepContainer } from "../styles/createCampagnes.style";
import { campagnesDisplayMode, campagnesSortingOptions } from "../../constants";
import { orderFormationsByDiplomeType } from "../utils";
import DisplayByDiplomeTypeTable from "./Accordions/DisplayByDiplomeTypeTable";
import DisplayByEtablissementTable from "./Accordions/DisplayByEtablissementTable";

const Step2 = ({ selectedFormations, setSelectedFormations, formik }) => {
  const [selectedFormationsAction, setSelectedFormationsAction] = useState([]);
  const [displayMode, setDisplayMode] = useState(campagnesDisplayMode[0].value);
  const [sortingMode, setSortingMode] = useState(campagnesSortingOptions[0].value);
  const [search, setSearch] = useState("");

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
          selectedFormations={selectedFormations}
          setSelectedFormations={setSelectedFormations}
          selectedFormationsAction={selectedFormationsAction}
          setSelectedFormationsAction={setSelectedFormationsAction}
          formik={formik}
        />
      );
    } else if (displayMode === campagnesDisplayMode[1].value) {
      return (
        <DisplayByEtablissementTable
          selectedFormations={selectedFormations}
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
      />
      {selectedFormations?.length ? (
        <div className={fr.cx("fr-accordions-group")}>{accordionComponentGetter()}</div>
      ) : null}
    </StepContainer>
  );
};

export default Step2;
