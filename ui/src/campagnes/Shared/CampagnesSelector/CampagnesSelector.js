import React, { useState, useEffect, useContext } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { Pagination } from "@codegouvfr/react-dsfr/Pagination";
import Button from "@codegouvfr/react-dsfr/Button";
import { ButtonContainer } from "../../styles/resultsCampagnes.style";
import SortButtons from "../SortButtons/SortButtons";
import { LoaderContainer, HeaderContainer } from "../../styles/shared.style";
import {
  CAMPAGNE_TABLE_TYPES,
  OBSERVER_SCOPES,
  OBSERVER_SCOPES_LABELS,
  USER_ROLES,
} from "../../../constants";
import { isPlural } from "../../utils";
import { UserContext } from "../../../context/UserContext";
import ActionButtons from "../../ManageCampagne/ActionButtons/ActionButtons";
import useFetchCampagnes from "../../../hooks/useFetchCampagnes";
import CampagnesTable from "../CampagnesTable/CampagnesTable";
import { TableContainer } from "../CampagnesTable/campagnesTable.style";

const CampagnesSelector = ({
  selectedCampagneIds,
  setSelectedCampagneIds,
  paramsCampagneIds = [],
  setAllCampagneIds = () => {},
  campagneTableType,
}) => {
  const [search, setSearch] = useState("");
  const [isOpened, setIsOpened] = useState(false);
  const [page, setPage] = useState(1);
  const [userContext] = useContext(UserContext);

  const isManage = campagneTableType === CAMPAGNE_TABLE_TYPES.MANAGE;
  const isResults = campagneTableType === CAMPAGNE_TABLE_TYPES.RESULTS;

  let searchQuery = "";
  if (search) {
    searchQuery += `&search=${search}`;
  }

  const {
    campagnes,
    campagnesPagination,
    isSuccess: isSuccessCampagnes,
    isError: isErrorCampagnes,
    isLoading: isLoadingCampagnes,
  } = useFetchCampagnes({
    query: searchQuery,
    key: search,
    enabled: true,
    page: page,
    pageSize: 50,
  });

  const allCampagneIds = campagnes?.length
    ? [...new Set(campagnes?.map((campagne) => campagne.id).flat())]
    : [];

  useEffect(() => {
    if (isResults && !paramsCampagneIds?.length) {
      setSelectedCampagneIds(allCampagneIds);
    } else if (isManage && isSuccessCampagnes && campagnes?.length) {
      setAllCampagneIds(allCampagneIds);
    }
  }, [campagnes]);

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
          Vous avez accès aux campagnes pour{" "}
          <b>{OBSERVER_SCOPES_LABELS[userContext.user?.scope.field]}</b>{" "}
          {userContext.user?.scope.field !== OBSERVER_SCOPES.SIRETS && (
            <b>{userContext.user?.scope.value}</b>
          )}
        </p>
      )}
      {isLoadingCampagnes && (
        <LoaderContainer>
          <BeatLoader
            color="var(--background-action-high-blue-france)"
            size={20}
            aria-label="Loading Spinner"
          />
        </LoaderContainer>
      )}
      {isErrorCampagnes ? (
        <Alert
          title="Une erreur s'est produite dans le chargement des campagnes"
          description="Merci de réessayer ultérieurement"
          severity="error"
        />
      ) : null}
      {isSuccessCampagnes && !campagnes?.length && (
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
      {isSuccessCampagnes && campagnes?.length ? (
        <>
          <SortButtons
            search={search}
            setSearch={setSearch}
            searchResultCount={campagnesPagination.totalItems}
            setIsOpened={setIsOpened}
            organizeLabel="Organiser mes campagnes par"
            userScope={userContext?.user.scope}
          />
          {isLoadingCampagnes ? (
            <LoaderContainer>
              <BeatLoader
                color="var(--background-action-high-blue-france)"
                size={15}
                aria-label="Loading Spinner"
                loading={isLoadingCampagnes}
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
                          ? selectedCampagneIds.length === campagnes.length
                          : selectedCampagneIds.length === allCampagneIds.length,
                        onChange: (e) => {
                          setSelectedCampagneIds(() => {
                            if (e.target.checked && search) {
                              return campagnes.map((campagne) => campagne.id);
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
              {search && isSuccessCampagnes && campagnesPagination.totalItems === 0 ? (
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
                <TableContainer>
                  <div style={{ display: isOpened || isManage ? "inherit" : "none" }}>
                    <CampagnesTable
                      displayedCampagnes={campagnes}
                      selectedCampagneIds={selectedCampagneIds}
                      setSelectedCampagneIds={setSelectedCampagneIds}
                      campagneTableType={campagneTableType}
                    />
                    {campagnesPagination.totalPages > 1 && (
                      <Pagination
                        count={campagnesPagination.totalPages}
                        defaultPage={page}
                        getPageLinkProps={(pageNumber) => ({
                          onClick: (event) => {
                            event.preventDefault();
                            setPage(pageNumber);
                          },
                          key: `pagination-link-${pageNumber}`,
                        })}
                      />
                    )}
                  </div>
                </TableContainer>
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
