import React, { useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import Alert from "@codegouvfr/react-dsfr/Alert";
import { Pagination } from "@codegouvfr/react-dsfr/Pagination";
import CampagnesTable from "../CampagnesTable";
import {
  LoaderContainer,
  SearchNoResultsContainer,
  TableContainer,
} from "../../styles/shared.style";
import useFetchCampagnes from "../../../hooks/useFetchCampagnes";

const DisplayByAllTable = ({
  selectedCampagneIds,
  setSelectedCampagneIds,
  displayMode,
  search,
  setSearch,
}) => {
  const [page, setPage] = useState(1);

  let query = "";

  if (search) {
    query += `&search=${search}`;
  }

  const { campagnes, isSuccess, isError, isLoading } = useFetchCampagnes({
    query,
    key: "all",
    enabled: true,
    page,
  });

  return (
    <>
      {isLoading && (
        <LoaderContainer>
          <BeatLoader
            color="var(--background-action-high-blue-france)"
            size={15}
            aria-label="Loading Spinner"
            loading={isLoading}
          />
        </LoaderContainer>
      )}
      {isError && (
        <Alert
          title="Une erreur s'est produite dans le chargement des campagnes"
          description="Merci de réessayer ultérieurement"
          severity="error"
        />
      )}
      {isSuccess && (
        <TableContainer>
          {campagnes.pagination.totalPages > 1 && (
            <Pagination
              count={campagnes.pagination.totalPages}
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
          {campagnes.pagination.totalItems === 0 && search ? (
            <SearchNoResultsContainer>
              <h3>Aucun résultats pour votre recherche « {search} »</h3>
              <p onClick={() => setSearch("")}>Réinitialiser ?</p>
            </SearchNoResultsContainer>
          ) : (
            <CampagnesTable
              displayedCampagnes={campagnes.body}
              selectedCampagneIds={selectedCampagneIds}
              setSelectedCampagneIds={setSelectedCampagneIds}
              displayMode={displayMode}
            />
          )}
          {campagnes.pagination.totalPages > 1 && (
            <Pagination
              count={campagnes.pagination.totalPages}
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
        </TableContainer>
      )}
    </>
  );
};

export default DisplayByAllTable;
