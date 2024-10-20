import { fr } from "@codegouvfr/react-dsfr";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { useContext, useEffect, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";

import {
  CAMPAGNE_TABLE_TYPES,
  campagneDisplayModeRegionObserver,
  campagnesDisplayMode,
  OBSERVER_SCOPES,
  OBSERVER_SCOPES_LABELS,
  USER_ROLES,
} from "../../../constants";
import { UserContext } from "../../../context/UserContext";
import useFetchCampagnes from "../../../hooks/useFetchCampagnes";
import useFetchCampagnesSorted from "../../../hooks/useFetchCampagnesSorted";
import ActionButtons from "../../ManageCampagne/ActionButtons/ActionButtons";
import { ButtonContainer } from "../../styles/resultsCampagnes.style";
import { HeaderContainer, LoaderContainer } from "../../styles/shared.style";
import { isPlural } from "../../utils";
import SortButtons from "../SortButtons/SortButtons";
import DisplayByAllTable from "./Accordions/DisplayByAllTable";
import DisplayByDepartementTable from "./Accordions/DisplayByDepartement";
import DisplayByDiplomeTypeTable from "./Accordions/DisplayByDiplomeTypeTable";
import DisplayByEtablissementTable from "./Accordions/DisplayByEtablissementTable";

const AccordionComponentGetter = ({
  campagnesSorted,
  selectedCampagneIds,
  setSelectedCampagneIds,
  displayMode,
  search,
  setSearch,
  campagneTableType,
  searchedCampagnes,
}) => {
  if (campagnesSorted?.length && displayMode === campagnesDisplayMode[0].value) {
    return (
      <DisplayByDiplomeTypeTable
        campagnesSorted={campagnesSorted}
        selectedCampagneIds={selectedCampagneIds}
        setSelectedCampagneIds={setSelectedCampagneIds}
        search={search}
        setSearch={setSearch}
        campagneTableType={campagneTableType}
        displayMode={displayMode}
        searchedCampagnes={searchedCampagnes}
      />
    );
  } else if (campagnesSorted?.length && displayMode === campagnesDisplayMode[1].value) {
    return (
      <DisplayByEtablissementTable
        campagnesSorted={campagnesSorted}
        selectedCampagneIds={selectedCampagneIds}
        setSelectedCampagneIds={setSelectedCampagneIds}
        search={search}
        setSearch={setSearch}
        campagneTableType={campagneTableType}
        displayMode={displayMode}
        searchedCampagnes={searchedCampagnes}
      />
    );
  } else if (displayMode === campagnesDisplayMode[2].value) {
    return (
      <DisplayByAllTable
        selectedCampagneIds={selectedCampagneIds}
        setSelectedCampagneIds={setSelectedCampagneIds}
        search={search}
        setSearch={setSearch}
        campagneTableType={campagneTableType}
        displayMode={displayMode}
      />
    );
  } else if (displayMode === campagneDisplayModeRegionObserver[2].value) {
    return (
      <DisplayByDepartementTable
        campagnesSorted={campagnesSorted}
        selectedCampagneIds={selectedCampagneIds}
        setSelectedCampagneIds={setSelectedCampagneIds}
        search={search}
        setSearch={setSearch}
        campagneTableType={campagneTableType}
        displayMode={displayMode}
        searchedCampagnes={searchedCampagnes}
      />
    );
  }
};

const CampagnesSelector = ({
  selectedCampagneIds,
  setSelectedCampagneIds,
  paramsCampagneIds = [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setAllCampagneIds = () => {},
  campagneTableType,
}) => {
  const [displayMode, setDisplayMode] = useState(campagnesDisplayMode[0].value);
  const [search, setSearch] = useState("");
  const [searchPage] = useState(1);
  const [isOpened, setIsOpened] = useState(false);

  const [userContext] = useContext(UserContext);

  const isManage = campagneTableType === CAMPAGNE_TABLE_TYPES.MANAGE;
  const isResults = campagneTableType === CAMPAGNE_TABLE_TYPES.RESULTS;

  const { campagnesSorted, isSuccess, isError, isLoading } = useFetchCampagnesSorted(displayMode);

  let searchQuery = "";
  if (search) {
    searchQuery += `&search=${search}`;
  }

  const {
    campagnes: searchedCampagnes,
    isSuccess: isSuccessSearchedCampagnes,
    isError: isErrorSearchedCampagnes,
    isLoading: isLoadingSearchedCampagnes,
  } = useFetchCampagnes({
    query: searchQuery,
    key: search,
    enabled: !!search,
    page: searchPage,
    pageSize: 1000,
  });

  const allCampagneIds = campagnesSorted?.length
    ? [...new Set(campagnesSorted?.map((campagne) => campagne.campagneIds).flat())]
    : [];

  useEffect(() => {
    if (isResults && !paramsCampagneIds?.length) {
      setSelectedCampagneIds(allCampagneIds);
    } else if (isManage && isSuccess && campagnesSorted?.length) {
      setAllCampagneIds(allCampagneIds);
    }
  }, [campagnesSorted]);

  const checkboxLabel = (
    <b>
      {selectedCampagneIds.length
        ? `${selectedCampagneIds.length} campagne${isPlural(
            selectedCampagneIds.length
          )} sélectionnée${isPlural(selectedCampagneIds.length)}`
        : "Tout sélectionner"}
    </b>
  );

  return (
    <>
      {userContext?.user.scope && (
        <p>
          Vous avez accès aux campagnes pour <b>{OBSERVER_SCOPES_LABELS[userContext.user?.scope.field]}</b>{" "}
          {userContext.user?.scope.field !== OBSERVER_SCOPES.SIRETS && <b>{userContext.user?.scope.value}</b>}
        </p>
      )}
      {isLoading && (
        <LoaderContainer>
          <BeatLoader color="var(--background-action-high-blue-france)" size={20} aria-label="Loading Spinner" />
        </LoaderContainer>
      )}
      {isError ? (
        <Alert
          title="Une erreur s'est produite dans le chargement des tri de campagnes"
          description="Merci de réessayer ultérieurement"
          severity="error"
        />
      ) : null}
      {isSuccess && !campagnesSorted?.length && (
        <Alert
          title="Aucune campagne trouvée"
          description={
            userContext?.user.role === USER_ROLES.OBSERVER
              ? "Votre scope n'est pas encore défini. Vous ne pouvez pas accéder aux campagnes. Merci de contacter un administrateur."
              : "Aucune campagne n'a été trouvée."
          }
          severity="info"
        />
      )}
      {isSuccess && campagnesSorted?.length ? (
        <>
          <SortButtons
            displayMode={displayMode}
            setDisplayMode={setDisplayMode}
            search={search}
            setSearch={setSearch}
            searchResultCount={searchedCampagnes?.pagination?.totalItems}
            setIsOpened={setIsOpened}
            organizeLabel="Organiser mes campagnes par"
            userScope={userContext?.user.scope}
          />
          {isLoadingSearchedCampagnes ? (
            <LoaderContainer>
              <BeatLoader
                color="var(--background-action-high-blue-france)"
                size={15}
                aria-label="Loading Spinner"
                loading={isLoadingSearchedCampagnes}
              />
            </LoaderContainer>
          ) : (
            <>
              <HeaderContainer>
                <Checkbox
                  options={[
                    {
                      label: checkboxLabel,
                      nativeInputProps: {
                        name: `selectAllCampagnes`,
                        checked: search
                          ? selectedCampagneIds.length === searchedCampagnes.body.length
                          : selectedCampagneIds.length === allCampagneIds.length,
                        onChange: (e) => {
                          setSelectedCampagneIds(() => {
                            if (e.target.checked && search) {
                              return searchedCampagnes.body.map((campagne) => campagne.id);
                            } else if (e.target.checked) {
                              return allCampagneIds;
                            }
                            return [];
                          });
                        },
                      },
                    },
                  ]}
                />
                {isManage && (
                  <ActionButtons
                    selectedCampagneIds={selectedCampagneIds}
                    setSelectedCampagneIds={setSelectedCampagneIds}
                  />
                )}
              </HeaderContainer>
              {isErrorSearchedCampagnes && (
                <Alert
                  title="Une erreur s'est produite dans le chargement de le recherche des campagnes"
                  description="Merci de réessayer ultérieurement"
                  severity="error"
                />
              )}
              {search && isSuccessSearchedCampagnes && searchedCampagnes.pagination.totalItems === 0 ? (
                <Alert
                  title={`Aucun résultats pour votre recherche « ${search} »`}
                  description={
                    <Button priority="secondary" onClick={() => setSearch("")}>
                      Réinitialiser la recherche
                    </Button>
                  }
                  severity="info"
                />
              ) : (
                <div className={fr.cx("fr-accordions-group")} style={{ width: "100%" }}>
                  <div style={{ display: isOpened || isManage ? "inherit" : "none" }}>
                    <AccordionComponentGetter
                      campagnesSorted={campagnesSorted}
                      selectedCampagneIds={selectedCampagneIds}
                      setSelectedCampagneIds={setSelectedCampagneIds}
                      displayMode={displayMode}
                      search={search}
                      setSearch={setSearch}
                      campagneTableType={campagneTableType}
                      searchedCampagnes={searchedCampagnes}
                    />
                  </div>
                </div>
              )}
            </>
          )}
          {isResults && (
            <ButtonContainer>
              <Button
                priority="secondary"
                iconId={isOpened ? "fr-icon-arrow-up-s-line" : "fr-icon-arrow-down-s-line"}
                onClick={() => setIsOpened((prevValue) => !prevValue)}
              />
            </ButtonContainer>
          )}
        </>
      ) : null}
    </>
  );
};

export default CampagnesSelector;
