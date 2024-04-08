import React, { useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import Alert from "@codegouvfr/react-dsfr/Alert";
import { Pagination } from "@codegouvfr/react-dsfr/Pagination";
import CampagnesTable from "../CampagnesTable";
import { LoaderContainer, TableContainer } from "../../styles/shared.style";
import useFetchCampagnes from "../../../hooks/useFetchCampagnes";

const DisplayByAllTable = ({ selectedCampagneIds, setSelectedCampagneIds, displayMode }) => {
  const [page, setPage] = useState(1);

  const { campagnes, isSuccess, isError, isLoading } = useFetchCampagnes({
    query: null,
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
          <CampagnesTable
            displayedCampagnes={campagnes.body}
            selectedCampagneIds={selectedCampagneIds}
            setSelectedCampagneIds={setSelectedCampagneIds}
            displayMode={displayMode}
          />
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
