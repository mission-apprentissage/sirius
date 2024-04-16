import React from "react";
import BeatLoader from "react-spinners/BeatLoader";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Pagination from "@codegouvfr/react-dsfr/Pagination";
import { StyledAccordion } from "./accordions.style";
import { SelectAllCampagnesCheckbox, AccordionLabel } from "./Components";
import CampagnesTable from "../../CampagnesTable/CampagnesTable";
import {
  LoaderContainer,
  SearchNoResultsContainer,
  TableContainer,
} from "../../../styles/shared.style";
import useDisplayCampagnesOptions from "../../../../hooks/useDisplayCampagnesOptions";

const DisplayByDiplomeTypeTable = ({
  campagnesSorted,
  selectedCampagneIds,
  setSelectedCampagneIds,
  displayMode,
  search,
  setSearch,
  campagneTableType,
}) => {
  const {
    page,
    setPage,
    setOpenedAccordion,
    campagnes,
    isSuccessCampagnes,
    isErrorCampagnes,
    isLoadingCampagnes,
    campagnesSelectedCountGetter,
  } = useDisplayCampagnesOptions({
    search,
    campagnesSorted,
    displayMode,
    selectedCampagneIds,
    setSelectedCampagneIds,
  });

  return campagnesSorted.map(({ diplome, campagneIds }) => {
    const campagnesSelectedCount = campagnesSelectedCountGetter(campagneIds);

    return (
      <StyledAccordion
        key={diplome}
        onExpandedChange={(isExpanded) =>
          isExpanded ? setOpenedAccordion(diplome) : setOpenedAccordion(null)
        }
        label={<AccordionLabel diplome={diplome} count={campagnesSelectedCount} />}
      >
        {isLoadingCampagnes && (
          <LoaderContainer>
            <BeatLoader
              color="var(--background-action-high-blue-france)"
              size={15}
              aria-label="Loading Spinner"
              loading={isLoadingCampagnes}
            />
          </LoaderContainer>
        )}
        {isErrorCampagnes && (
          <Alert
            title="Une erreur s'est produite dans le chargement des campagnes"
            description="Merci de réessayer ultérieurement"
            severity="error"
          />
        )}
        {isSuccessCampagnes && (
          <>
            <SelectAllCampagnesCheckbox
              count={campagnesSelectedCount}
              campagneIds={campagneIds}
              name={`selectAll${diplome}`}
              setSelectedCampagneIds={setSelectedCampagneIds}
            />
            <TableContainer>
              {campagnes.pagination.totalItems === 0 && search ? (
                <SearchNoResultsContainer>
                  <h3>
                    Aucun résultats dans ce niveau de diplome pour votre recherche « {search} »
                  </h3>
                  <p onClick={() => setSearch("")}>Réinitialiser ?</p>
                </SearchNoResultsContainer>
              ) : (
                <CampagnesTable
                  displayedCampagnes={campagnes.body}
                  selectedCampagneIds={selectedCampagneIds}
                  setSelectedCampagneIds={setSelectedCampagneIds}
                  displayMode={displayMode}
                  campagneTableType={campagneTableType}
                />
              )}
              {campagnes.pagination.totalPages > 1 && (
                <Pagination
                  count={campagnes.pagination.totalPages}
                  defaultPage={page[diplome]}
                  getPageLinkProps={(pageNumber) => ({
                    onClick: (event) => {
                      event.preventDefault();
                      setPage((prevValue) => ({
                        ...prevValue,
                        [diplome]: pageNumber,
                      }));
                    },
                    key: `pagination-link-${pageNumber}`,
                  })}
                />
              )}
            </TableContainer>
          </>
        )}
      </StyledAccordion>
    );
  });
};

export default DisplayByDiplomeTypeTable;
