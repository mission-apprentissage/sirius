import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { Pagination } from "@codegouvfr/react-dsfr/Pagination";
import React, { useContext, useEffect, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";

import {
  CAMPAGNE_TABLE_TYPES,
  DIPLOME_TYPE_MATCHER,
  OBSERVER_SCOPES,
  OBSERVER_SCOPES_LABELS,
  USER_ROLES,
} from "../../../constants";
import { UserContext } from "../../../context/UserContext";
import useFetchCampagnes from "../../../hooks/useFetchCampagnes";
import useFetchDiplomesAndEtablissementsFilter from "../../../hooks/useFetchDiplomesAndEtablissementsFilter";
import { etablissementLabelGetterFromFormation } from "../../../utils/etablissement";
import ActionButtons from "../../ManageCampagne/ActionButtons/ActionButtons";
import { ButtonContainer } from "../../styles/resultsCampagnes.style";
import { HeaderContainer, LoaderContainer } from "../../styles/shared.style";
import { isPlural } from "../../utils";
import CampagnesTable from "../CampagnesTable/CampagnesTable";
import { TableContainer } from "../CampagnesTable/campagnesTable.style";
import FilterButtons from "../FilterButtons/FilterButtons";

const CampagnesSelector = ({
  selectedCampagneIds,
  setSelectedCampagneIds,
  paramsCampagneIds = [],
  campagneTableType,
  setAllCampagneIds,
}) => {
  const [search, setSearch] = useState("");
  const [isOpened, setIsOpened] = useState(false);
  const [page, setPage] = useState(1);
  const [userContext] = useContext(UserContext);
  const [selectedEtablissementsSiret, setSelectedEtablissementsSiret] = useState(null);
  const [selectedDiplomesIntitule, setSelectedDiplomesIntitule] = useState(null);

  const isManage = campagneTableType === CAMPAGNE_TABLE_TYPES.MANAGE;
  const isResults = campagneTableType === CAMPAGNE_TABLE_TYPES.RESULTS;

  const {
    campagnes,
    campagnesIds,
    campagnesPagination,
    isSuccess: isSuccessCampagnes,
    isError: isErrorCampagnes,
    isLoading: isLoadingCampagnes,
  } = useFetchCampagnes({
    search: search,
    diplome: selectedDiplomesIntitule,
    siret: selectedEtablissementsSiret,
    key: search,
    enabled: true,
    page: page,
    pageSize: 20,
  });

  const {
    diplomesFilter,
    etablissementsFilter,
    isSuccess: isSuccessDiplomesAndEtablissementsFilter,
  } = useFetchDiplomesAndEtablissementsFilter();

  const currentPageCampagneIds = campagnes?.map((campagne) => campagne.id);

  const hasSelectedAllCampagneFromCurrentPage =
    selectedCampagneIds.length && currentPageCampagneIds?.every((id) => selectedCampagneIds.includes(id));

  const isResultsAndEveryCampagneIsSelected = isResults && selectedCampagneIds.length === campagnesIds?.length;

  useEffect(() => {
    if (isResults && !paramsCampagneIds?.length && campagnesIds?.length) {
      setSelectedCampagneIds(campagnesIds);
    }
    if (isManage) {
      setAllCampagneIds(campagnesIds);
    }
  }, [campagnesIds]);

  const checkboxLabel = (
    <b>
      {(hasSelectedAllCampagneFromCurrentPage && isManage) || isResultsAndEveryCampagneIsSelected
        ? "Désélectionner toutes les campagnes"
        : "Sélectionner toutes les campagnes"}
    </b>
  );

  const checkboxHintText = `${selectedCampagneIds.length}/${
    campagnesIds?.length
  } campagne${isPlural(campagnesIds?.length)} sélectionnée${isPlural(campagnesIds?.length)}`;

  return (
    <>
      {userContext?.user.scope && (
        <p>
          Vous avez accès aux campagnes pour <b>{OBSERVER_SCOPES_LABELS[userContext.user?.scope.field]}</b>{" "}
          {userContext.user?.scope.field !== OBSERVER_SCOPES.SIRETS && <b>{userContext.user?.scope.value}</b>}
        </p>
      )}

      {isErrorCampagnes ? (
        <Alert
          title="Une erreur s'est produite dans le chargement des campagnes"
          description="Merci de réessayer ultérieurement"
          severity="error"
        />
      ) : null}
      {isSuccessDiplomesAndEtablissementsFilter && (
        <FilterButtons
          search={search}
          setSearch={setSearch}
          setIsOpened={setIsOpened}
          selectedEtablissementsSiret={selectedEtablissementsSiret}
          setSelectedEtablissementsSiret={setSelectedEtablissementsSiret}
          selectedDiplomesIntitule={selectedDiplomesIntitule}
          setSelectedDiplomesIntitule={setSelectedDiplomesIntitule}
          etablissementsOptions={etablissementsFilter?.map((etablissement) => ({
            label: etablissementLabelGetterFromFormation(etablissement),
            value: etablissement.etablissementFormateurSiret,
            hintText: `${etablissement.campagnesCount} campagne${isPlural(etablissement.campagnesCount)}`,
          }))}
          diplomesOptions={diplomesFilter?.map((diplome) => ({
            label: DIPLOME_TYPE_MATCHER[diplome.intitule] || diplome.intitule,
            value: diplome.intitule,
            hintText: `${diplome.campagnesCount} campagne${isPlural(diplome.campagnesCount)}`,
          }))}
        />
      )}
      <>
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
                disabled={!campagnesIds?.length}
                options={[
                  {
                    label: checkboxLabel,
                    hintText: checkboxHintText,
                    nativeInputProps: {
                      name: `selectAll`,
                      checked: hasSelectedAllCampagneFromCurrentPage,
                      onChange: () => {
                        if (isResults) {
                          if (hasSelectedAllCampagneFromCurrentPage) {
                            setSelectedCampagneIds([]);
                          } else {
                            setSelectedCampagneIds(campagnesIds);
                          }
                        }
                        if (isManage) {
                          if (hasSelectedAllCampagneFromCurrentPage) {
                            setSelectedCampagneIds((prevValues) => [
                              ...prevValues.filter((id) => !currentPageCampagneIds.includes(id)),
                            ]);
                          } else {
                            setSelectedCampagneIds((prevValues) => [
                              ...new Set([...prevValues, ...currentPageCampagneIds]),
                            ]);
                          }
                        }
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
            ) : isSuccessCampagnes && !campagnes?.length ? (
              <Alert
                title="Aucune campagne trouvée"
                description={
                  userContext?.user.role === USER_ROLES.OBSERVER
                    ? "Votre scope n'est pas encore défini. Vous ne pouvez pas accéder aux campagnes. Merci de contacter un administrateur."
                    : "Aucune campagne n'a été trouvée."
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
                  {campagnesPagination?.totalPages > 1 && (
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
    </>
  );
};

export default CampagnesSelector;
