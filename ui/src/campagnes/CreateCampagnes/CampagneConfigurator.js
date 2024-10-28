import { fr } from "@codegouvfr/react-dsfr";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { useEffect, useState } from "react";

import { DIPLOME_TYPE_MATCHER } from "../../constants";
import { remoteEtablissementLabelGetterFromFormation } from "../../utils/etablissement";
import SortButtons from "../Shared/SortButtons/SortButtons";
import { SelectAllFormationContainer } from "../styles/shared.style";
import { isPlural } from "../utils";
import Table from "./Table";

const CampagneConfigurator = ({ selectedFormations, setSelectedFormations, formik }) => {
  const [selectedFormationsAction, setSelectedFormationsAction] = useState([]);
  const [searchedDiplayedFormations, setSearchedDiplayedFormations] = useState([]);
  const [selectedEtablissementsSiret, setSelectedEtablissementsSiret] = useState(null);
  const [selectedDiplomesIntitule, setSelectedDiplomesIntitule] = useState(null);
  const [diplomesOptions, setDiplomesOptions] = useState([]);
  const [etablissementsOptions, setEtablissementsOptions] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (selectedFormations?.length) {
      setSearchedDiplayedFormations(selectedFormations);
    }
  }, []);

  useEffect(() => {
    let displayedFormations = selectedFormations || [];

    if (search !== "") {
      displayedFormations = displayedFormations.filter((formation) => {
        return (
          formation.intitule_long?.toLowerCase().includes(search.toLowerCase()) ||
          formation.lieu_formation_adresse_computed?.toLowerCase().includes(search.toLowerCase()) ||
          formation.lieu_formation_adresse?.toLowerCase().includes(search.toLowerCase()) ||
          formation.localite?.toLowerCase().includes(search.toLowerCase()) ||
          formation.etablissement_gestionnaire_enseigne?.toLowerCase().includes(search.toLowerCase()) ||
          formation.etablissement_formateur_adresse?.toLowerCase().includes(search.toLowerCase()) ||
          formation.etablissement_formateur_siret?.toLowerCase().includes(search.toLowerCase()) ||
          formation.tags?.join("-").toLowerCase().includes(search.toLowerCase())
        );
      });
    }

    if (selectedDiplomesIntitule?.length) {
      displayedFormations = displayedFormations.filter((formation) =>
        selectedDiplomesIntitule.includes(formation.diplome)
      );
    }

    if (selectedEtablissementsSiret?.length) {
      displayedFormations = displayedFormations.filter((formation) =>
        selectedEtablissementsSiret.includes(formation.etablissement_gestionnaire_siret)
      );
    }

    setSearchedDiplayedFormations(displayedFormations);
  }, [search, selectedFormations, selectedDiplomesIntitule, selectedEtablissementsSiret]);

  if (!etablissementsOptions?.length && !diplomesOptions?.length && selectedFormations?.length) {
    const etablissements = selectedFormations
      .map((formation) => {
        const uniqueFormations = selectedFormations.filter(
          (remoteFormation) => remoteFormation.etablissement_formateur_siret === formation.etablissement_formateur_siret
        );
        return {
          label: remoteEtablissementLabelGetterFromFormation(formation),
          value: formation.etablissement_gestionnaire_siret,
          hintText: `${uniqueFormations.length} formation${isPlural(uniqueFormations.length)}`,
        };
      })
      .filter((formation, index, self) => index === self.findIndex((t) => t.value === formation.value));

    const diplomes = selectedFormations
      .map((formation) => {
        const uniqueFormations = selectedFormations.filter(
          (remoteFormation) => remoteFormation.diplome === formation.diplome
        );
        return {
          label: DIPLOME_TYPE_MATCHER[formation.diplome] || formation.diplome,
          value: formation.diplome,
          hintText: `${uniqueFormations.length} formation${isPlural(uniqueFormations.length)}`,
        };
      })
      .filter((formation, index, self) => index === self.findIndex((t) => t.value === formation.value));

    setEtablissementsOptions(etablissements);
    setDiplomesOptions(diplomes);
  }

  const checkboxLabel = (
    <b>
      {selectedFormations.length === selectedFormationsAction?.length
        ? "Désélectionner toutes les formations"
        : "Sélectionner toutes les formations"}
    </b>
  );

  return (
    <>
      <>
        <SortButtons
          search={search}
          setSearch={setSearch}
          selectedEtablissementsSiret={selectedEtablissementsSiret}
          setSelectedEtablissementsSiret={setSelectedEtablissementsSiret}
          selectedDiplomesIntitule={selectedDiplomesIntitule}
          setSelectedDiplomesIntitule={setSelectedDiplomesIntitule}
          etablissementsOptions={etablissementsOptions}
          diplomesOptions={diplomesOptions}
        />
        <SelectAllFormationContainer>
          <Checkbox
            disabled={!selectedFormations?.length}
            options={[
              {
                label: checkboxLabel,
                hintText: selectedFormations?.length
                  ? `${selectedFormationsAction.length}/${
                      selectedFormations?.length
                    } formation${isPlural(selectedFormationsAction.length)} sélectionnée${isPlural(
                      selectedFormationsAction.length
                    )}`
                  : "",
                nativeInputProps: {
                  name: `selectAll`,
                  checked: selectedFormations?.length === selectedFormationsAction?.length,
                  onChange: () => {
                    if (selectedFormations.length === selectedFormationsAction.length) {
                      setSelectedFormationsAction([]);
                    } else {
                      setSelectedFormationsAction(selectedFormations);
                    }
                  },
                },
              },
            ]}
          />
        </SelectAllFormationContainer>
      </>
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
    </>
  );
};

export default CampagneConfigurator;
