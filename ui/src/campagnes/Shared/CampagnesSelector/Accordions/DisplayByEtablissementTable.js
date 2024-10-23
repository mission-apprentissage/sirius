import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Pagination } from "@codegouvfr/react-dsfr/Pagination";
import BeatLoader from "react-spinners/BeatLoader";

import useDisplayCampagnesOptions from "../../../../hooks/useDisplayCampagnesOptions";
import { LoaderContainer, TableContainer } from "../../../styles/shared.style";
import CampagnesTable from "../../CampagnesTable/CampagnesTable";
import { StyledAccordion } from "./accordions.style";
import { AccordionLabel, SelectAllCampagnesCheckbox } from "./Components";

const DisplayByEtablissementTable = ({
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

  const uniqueEtablissementFromSearch =
    search && searchedCampagnes.body.length > 0
      ? [...new Set(searchedCampagnes.body.map((campagne) => campagne.formation.etablissementFormateurSiret))]
      : [];

  return campagnesSorted.map(({ etablissementFormateur, campagneIds }) => {
    if (
      uniqueEtablissementFromSearch.length &&
      !uniqueEtablissementFromSearch.includes(etablissementFormateur.etablissementFormateurSiret)
    ) {
      return null;
    }

    const campagnesSelectedCount = campagnesSelectedCountGetter(campagneIds);

    return (
      <StyledAccordion
        key={etablissementFormateur.etablissementFormateurSiret}
        onClick={() => setOpenedAccordion(etablissementFormateur.etablissementFormateurSiret)}
        label={<AccordionLabel etablissementFormateur={etablissementFormateur} count={campagnesSelectedCount} />}
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
              name={`selectAll${etablissementFormateur.etablissementFormateurSiret}`}
              setSelectedCampagneIds={setSelectedCampagneIds}
              searchedCampagnes={searchedCampagnes?.body.filter(
                (searchedCampagne) =>
                  searchedCampagne.formation.etablissementFormateurSiret ===
                  etablissementFormateur.etablissementFormateurSiret
              )}
              search={search}
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
                  defaultPage={page[etablissementFormateur.etablissementFormateurSiret]}
                  getPageLinkProps={(pageNumber) => ({
                    onClick: (event) => {
                      event.preventDefault();
                      setPage((prevValue) => ({
                        ...prevValue,
                        [etablissementFormateur.etablissementFormateurSiret]: pageNumber,
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

export default DisplayByEtablissementTable;
