import React from "react";
import BeatLoader from "react-spinners/BeatLoader";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Pagination from "@codegouvfr/react-dsfr/Pagination";
import { StyledAccordion } from "./accordions.style";
import { SelectAllCampagnesCheckbox, AccordionLabel } from "./Components";
import CampagnesTable from "../../CampagnesTable/CampagnesTable";
import { LoaderContainer, TableContainer } from "../../../styles/shared.style";
import useDisplayCampagnesOptions from "../../../../hooks/useDisplayCampagnesOptions";

const DisplayByDiplomeTypeTable = ({
  campagnesSorted,
  selectedCampagneIds,
  setSelectedCampagneIds,
  displayMode,
  search,
  campagneTableType,
  searchedCampagnes,
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

  const uniqueDiplomeTypeFromSearch =
    search && searchedCampagnes.body.length > 0
      ? [...new Set(searchedCampagnes.body.map((campagne) => campagne.formation.data.diplome))]
      : [];
  return campagnesSorted.map(({ diplome, campagneIds }) => {
    if (uniqueDiplomeTypeFromSearch.length && !uniqueDiplomeTypeFromSearch.includes(diplome)) {
      return null;
    }

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
        {isSuccessCampagnes && campagnes.pagination.totalItems > 0 && (
          <>
            <SelectAllCampagnesCheckbox
              count={campagnesSelectedCount}
              campagneIds={campagneIds}
              name={`selectAll${diplome}`}
              setSelectedCampagneIds={setSelectedCampagneIds}
            />
            <TableContainer>
              <CampagnesTable
                displayedCampagnes={campagnes.body}
                selectedCampagneIds={selectedCampagneIds}
                setSelectedCampagneIds={setSelectedCampagneIds}
                displayMode={displayMode}
                campagneTableType={campagneTableType}
              />
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
