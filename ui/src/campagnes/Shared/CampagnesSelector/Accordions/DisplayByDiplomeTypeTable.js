import React, { useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Pagination from "@codegouvfr/react-dsfr/Pagination";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { isPlural } from "../../../utils";
import {
  StyledAccordion,
  AccordionLabelByDiplomeTypeContainer,
  ButtonContainer,
} from "./accordions.style";
import CampagnesTable from "../../CampagnesTable/CampagnesTable";
import { DIPLOME_TYPE_MATCHER } from "../../../../constants";
import {
  LoaderContainer,
  SearchNoResultsContainer,
  TableContainer,
} from "../../../styles/shared.style";
import useFetchCampagnes from "../../../../hooks/useFetchCampagnes";

const DisplayByDiplomeTypeTable = ({
  campagnesSorted,
  selectedCampagneIds,
  setSelectedCampagneIds,
  displayMode,
  search,
  setSearch,
  campagneTableType,
}) => {
  const [page, setPage] = useState(null);
  const [openedAccordion, setOpenedAccordion] = useState(null);

  let query = `diplome=${openedAccordion}`;

  if (search) {
    query += `&search=${search}`;
  }

  const { campagnes, isSuccess, isError, isLoading } = useFetchCampagnes({
    query,
    key: openedAccordion,
    enabled: !!openedAccordion,
    page: page && page[openedAccordion] ? page[openedAccordion] : 1,
  });

  if (!page) {
    const elem = campagnesSorted.map((diplome) => ({ [diplome.diplome]: 1 }));
    setPage(elem);
  }

  return campagnesSorted.map(({ diplome, campagneIds }) => {
    const campagnesSelectedByDiplomeTypeCount = selectedCampagneIds.filter((campagneId) =>
      campagneIds.includes(campagneId)
    ).length;

    const checkboxLabel = (
      <b>
        {campagnesSelectedByDiplomeTypeCount
          ? `${campagnesSelectedByDiplomeTypeCount} campagne${isPlural(
              campagnesSelectedByDiplomeTypeCount
            )} sélectionnée${isPlural(campagnesSelectedByDiplomeTypeCount)}`
          : "Tout sélectionner"}
      </b>
    );

    const handleSelectAll = (e) => {
      setSelectedCampagneIds((prevValues) => {
        if (e.target.checked) {
          return [...new Set([...prevValues, ...campagneIds])];
        } else {
          return prevValues.filter((selectedCampagne) => !campagneIds.includes(selectedCampagne));
        }
      });
    };

    return (
      <StyledAccordion
        key={diplome}
        onExpandedChange={(isExpanded) =>
          isExpanded ? setOpenedAccordion(diplome) : setOpenedAccordion(null)
        }
        label={
          <AccordionLabelByDiplomeTypeContainer>
            <h5>{DIPLOME_TYPE_MATCHER[diplome] || diplome}</h5>
            <p>
              {campagnesSelectedByDiplomeTypeCount} campagne
              {isPlural(campagnesSelectedByDiplomeTypeCount)} sélectionnée
              {isPlural(campagnesSelectedByDiplomeTypeCount)}
            </p>
          </AccordionLabelByDiplomeTypeContainer>
        }
      >
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
          <>
            <ButtonContainer>
              <Checkbox
                options={[
                  {
                    label: checkboxLabel,
                    nativeInputProps: {
                      name: `selectAll${diplome}`,
                      checked: campagnesSelectedByDiplomeTypeCount === campagneIds.length,
                      onChange: handleSelectAll,
                    },
                  },
                ]}
              />
            </ButtonContainer>
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
