import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Pagination } from "@codegouvfr/react-dsfr/Pagination";
import BeatLoader from "react-spinners/BeatLoader";

import useDisplayCampagnesOptions from "../../../../hooks/useDisplayCampagnesOptions";
import { REGIONS } from "../../../../regions";
import { LoaderContainer, TableContainer } from "../../../styles/shared.style";
import CampagnesTable from "../../CampagnesTable/CampagnesTable";
import { StyledAccordion } from "./accordions.style";
import { AccordionLabel, SelectAllCampagnesCheckbox } from "./Components";

const DisplayByDepartementTable = ({
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

  const uniqueDepartementFromSearch =
    search && searchedCampagnes.body.length > 0
      ? [...new Set(searchedCampagnes.body.map((campagne) => campagne.formation.numDepartement))]
      : [];

  const allDepartements = REGIONS.flatMap((region) => region.departements);

  return campagnesSorted.map(({ departement, campagneIds }) => {
    if (uniqueDepartementFromSearch.length && !uniqueDepartementFromSearch.includes(departement)) {
      return null;
    }
    const departementLabel = allDepartements.find((dep) => dep.code === departement).nom;
    const campagnesSelectedCount = campagnesSelectedCountGetter(campagneIds);

    return (
      <StyledAccordion
        key={departement}
        onClick={() => setOpenedAccordion(departement)}
        label={<AccordionLabel departement={departementLabel} count={campagnesSelectedCount} />}
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
              name={`selectAll${departement}`}
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
                  defaultPage={page[departement]}
                  getPageLinkProps={(pageNumber) => ({
                    onClick: (event) => {
                      event.preventDefault();
                      setPage((prevValue) => ({
                        ...prevValue,
                        [departement]: pageNumber,
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

export default DisplayByDepartementTable;
