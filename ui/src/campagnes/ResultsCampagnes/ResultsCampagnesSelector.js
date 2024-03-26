import React, { useState, useEffect } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { fr } from "@codegouvfr/react-dsfr";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import Button from "@codegouvfr/react-dsfr/Button";
import { ButtonContainer, ResultsCampagneContainer } from "../styles/resultsCampagnes.style";
import SortButtons from "../Shared/SortButtons/SortButtons";
import DisplayByDiplomeTypeTable from "./Accordions/DisplayByDiplomeTypeTable";
import DisplayByEtablissementTable from "./Accordions/DisplayByEtablissementTable";
import CampagnesTable from "./CampagnesTable";
import { LoaderContainer, SearchNoResultsContainer } from "../styles/shared.style";
import useFetchCampagnes from "../../hooks/useFetchCampagnes";
import { campagnesDisplayMode, campagnesSortingOptions } from "../../constants";
import { isPlural, sortingKeys } from "../utils";

const AccordionComponentGetter = (props) => {
  if (props.displayMode === campagnesDisplayMode[0].value) {
    return <DisplayByDiplomeTypeTable {...props} />;
  } else if (props.displayMode === campagnesDisplayMode[1].value) {
    return <DisplayByEtablissementTable {...props} />;
  } else if (props.displayMode === campagnesDisplayMode[2].value) {
    return <CampagnesTable {...props} />;
  }
};

const ResultsCampagnesSelector = ({
  selectedCampagnes,
  setSelectedCampagnes,
  paramsCampagneIds,
}) => {
  const [displayedCampagnes, setDisplayedCampagnes] = useState([]);
  const [displayMode, setDisplayMode] = useState(campagnesDisplayMode[0].value);
  const [sortingMode, setSortingMode] = useState(campagnesSortingOptions[0].value);
  const [search, setSearch] = useState("");
  const [isOpened, setIsOpened] = useState(false);

  const [campagnes, loadingCampagnes, errorCampagnes] = useFetchCampagnes();

  useEffect(() => {
    if (campagnes?.length) {
      setDisplayedCampagnes(campagnes);
      const filteredCampagnes = campagnes.filter((campagne) =>
        paramsCampagneIds.includes(campagne._id)
      );
      setSelectedCampagnes(paramsCampagneIds.length ? filteredCampagnes : campagnes);
    }
  }, [campagnes]);

  useEffect(() => {
    let sortedCampagnes = [...displayedCampagnes];
    if (sortedCampagnes.length > 0) {
      sortedCampagnes.sort((a, b) => {
        return sortingKeys(a, b)[sortingMode]();
      });
    }
    if (JSON.stringify(sortedCampagnes) !== JSON.stringify(displayedCampagnes)) {
      setDisplayedCampagnes(sortedCampagnes);
    }
  }, [sortingMode, displayedCampagnes]);

  useEffect(() => {
    if (campagnes?.length && search === "") {
      setDisplayedCampagnes(campagnes);
    } else {
      const filteredCampagnes = displayedCampagnes.filter((campagne) => {
        return (
          campagne.formation.data.intitule_long.toLowerCase().includes(search) ||
          campagne.formation.data.localite.toLowerCase().includes(search) ||
          campagne.formation.data.tags.join("-").toLowerCase().includes(search) ||
          campagne.nomCampagne.toLowerCase().includes(search)
        );
      });
      setDisplayedCampagnes(filteredCampagnes);
    }
  }, [search]);

  const checkboxLabel = (
    <b>
      {selectedCampagnes.length
        ? `${selectedCampagnes.length} campagne${isPlural(
            selectedCampagnes.length
          )} sélectionnée${isPlural(selectedCampagnes.length)}`
        : "Tout sélectionner"}
    </b>
  );

  return (
    <ResultsCampagneContainer>
      <SortButtons
        displayMode={displayMode}
        setDisplayMode={setDisplayMode}
        sortingMode={sortingMode}
        setSortingMode={setSortingMode}
        search={search}
        setSearch={setSearch}
        mode="results"
        organizeLabel="Sélectionner les résultats à afficher"
      />
      {loadingCampagnes && (
        <LoaderContainer>
          <BeatLoader
            color="var(--background-action-high-blue-france)"
            size={20}
            aria-label="Loading Spinner"
          />
        </LoaderContainer>
      )}
      {errorCampagnes && !campagnes?.length ? (
        <Alert
          title="Une erreur s'est produite dans le chargement des campagnes"
          description="Merci de réessayer ultérieurement"
          severity="error"
        />
      ) : null}
      {displayedCampagnes?.length ? (
        <>
          <Checkbox
            options={[
              {
                label: checkboxLabel,
                nativeInputProps: {
                  name: `selectAllCampagnes`,
                  checked: selectedCampagnes.length === displayedCampagnes.length,
                  onChange: (e) => {
                    setSelectedCampagnes(() => {
                      if (e.target.checked) {
                        return campagnes;
                      } else {
                        return [];
                      }
                    });
                  },
                },
              },
            ]}
          />
          <div className={fr.cx("fr-accordions-group")}>
            <div style={{ display: isOpened ? "inherit" : "none" }}>
              <AccordionComponentGetter
                displayMode={displayMode}
                displayedCampagnes={displayedCampagnes}
                selectedCampagnes={selectedCampagnes}
                setSelectedCampagnes={setSelectedCampagnes}
              />
            </div>
          </div>
          <ButtonContainer>
            <Button
              priority="secondary"
              iconId={isOpened ? "fr-icon-arrow-up-s-line" : "fr-icon-arrow-down-s-line"}
              onClick={() => setIsOpened((prevValue) => !prevValue)}
            />
          </ButtonContainer>
        </>
      ) : null}
      {!displayedCampagnes?.length && search ? (
        <SearchNoResultsContainer>
          <h3>Aucun résultats pour votre recherche</h3>
          <p onClick={() => setSearch("")}>Réinitialiser ?</p>
        </SearchNoResultsContainer>
      ) : null}
    </ResultsCampagneContainer>
  );
};

export default ResultsCampagnesSelector;
