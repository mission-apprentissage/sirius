import React, { useState, useEffect, useContext } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { fr } from "@codegouvfr/react-dsfr";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import Button from "@codegouvfr/react-dsfr/Button";
import { ButtonContainer, ResultsCampagneContainer } from "../styles/resultsCampagnes.style";
import SortButtons from "../Shared/SortButtons/SortButtons";
import DisplayByDiplomeTypeTable from "./Accordions/DisplayByDiplomeTypeTable";
import DisplayByEtablissementTable from "./Accordions/DisplayByEtablissementTable";
import { LoaderContainer } from "../styles/shared.style";
import useFetchCampagnesSorted from "../../hooks/useFetchCampagnesSorted";
import {
  OBSERVER_SCOPES_LABELS,
  campagnesDisplayMode,
  campagnesSortingOptions,
} from "../../constants";
import { isPlural } from "../utils";
import DisplayByAllTable from "./Accordions/DisplayByAllTable";
import { UserContext } from "../../context/UserContext";

const AccordionComponentGetter = ({
  campagnesSorted,
  selectedCampagneIds,
  setSelectedCampagneIds,
  displayMode,
  search,
  setSearch,
}) => {
  if (displayMode === campagnesDisplayMode[0].value) {
    return (
      <DisplayByDiplomeTypeTable
        campagnesSorted={campagnesSorted}
        selectedCampagneIds={selectedCampagneIds}
        setSelectedCampagneIds={setSelectedCampagneIds}
        search={search}
        setSearch={setSearch}
      />
    );
  } else if (displayMode === campagnesDisplayMode[1].value) {
    return (
      <DisplayByEtablissementTable
        campagnesSorted={campagnesSorted}
        selectedCampagneIds={selectedCampagneIds}
        setSelectedCampagneIds={setSelectedCampagneIds}
        search={search}
        setSearch={setSearch}
      />
    );
  } else if (displayMode === campagnesDisplayMode[2].value) {
    return (
      <DisplayByAllTable
        campagnesSorted={campagnesSorted}
        selectedCampagneIds={selectedCampagneIds}
        setSelectedCampagneIds={setSelectedCampagneIds}
        search={search}
        setSearch={setSearch}
      />
    );
  }
};

const ResultsCampagnesSelector = ({
  selectedCampagneIds,
  setSelectedCampagneIds,
  paramsCampagneIds,
}) => {
  const [displayMode, setDisplayMode] = useState(campagnesDisplayMode[0].value);
  const [sortingMode, setSortingMode] = useState(campagnesSortingOptions[0].value);
  const [search, setSearch] = useState("");
  const [isOpened, setIsOpened] = useState(false);
  const [userContext] = useContext(UserContext);

  const { campagnesSorted, isSuccess, isError, isLoading } = useFetchCampagnesSorted(displayMode);

  const totalCampagnesCount = [
    ...new Set(campagnesSorted?.map((campagne) => campagne.campagneIds).flat()),
  ].length;

  useEffect(() => {
    const allCampagneIds = [
      ...new Set(campagnesSorted?.map((campagne) => campagne.campagneIds).flat()),
    ];

    if (campagnesSorted?.length) {
      const filteredCampagnes = allCampagneIds.filter((campagne) =>
        paramsCampagneIds.includes(campagne._id)
      );
      setSelectedCampagneIds(paramsCampagneIds.length ? filteredCampagnes : allCampagneIds);
    }
  }, [campagnesSorted]);

  /*useEffect(() => {
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
*/

  const checkboxLabel = (
    <b>
      {totalCampagnesCount
        ? `${totalCampagnesCount} campagne${isPlural(totalCampagnesCount)} sélectionnée${isPlural(
            totalCampagnesCount
          )}`
        : "Tout sélectionner"}
    </b>
  );

  return (
    <ResultsCampagneContainer>
      {userContext?.scope && (
        <p>
          Vous avez accès aux campagne pour <b>{OBSERVER_SCOPES_LABELS[userContext.scope.field]}</b>{" "}
          <b>{userContext.scope.value}</b>.
        </p>
      )}
      <SortButtons
        displayMode={displayMode}
        setDisplayMode={setDisplayMode}
        sortingMode={sortingMode}
        setSortingMode={setSortingMode}
        search={search}
        setSearch={setSearch}
        setIsOpened={setIsOpened}
        mode="results"
        organizeLabel="Sélectionner les résultats à afficher"
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
      {isError ? (
        <Alert
          title="Une erreur s'est produite dans le chargement des tri de campagnes"
          description="Merci de réessayer ultérieurement"
          severity="error"
        />
      ) : null}
      {isSuccess || displayMode === campagnesDisplayMode[2].value ? (
        <>
          <Checkbox
            options={[
              {
                label: checkboxLabel,
                nativeInputProps: {
                  name: `selectAllCampagnes`,
                  checked: selectedCampagneIds.length === totalCampagnesCount,
                  onChange: (e) => {
                    setSelectedCampagneIds(() => {
                      if (e.target.checked) {
                        return campagnesSorted;
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
                campagnesSorted={campagnesSorted}
                selectedCampagneIds={selectedCampagneIds}
                setSelectedCampagneIds={setSelectedCampagneIds}
                displayMode={displayMode}
                search={search}
                setSearch={setSearch}
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
    </ResultsCampagneContainer>
  );
};

export default ResultsCampagnesSelector;
