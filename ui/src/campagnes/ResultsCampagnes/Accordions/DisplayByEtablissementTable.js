import React, { useState } from "react";
import Tooltip from "react-simple-tooltip";
import { fr } from "@codegouvfr/react-dsfr";
import Pagination from "@codegouvfr/react-dsfr/Pagination";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { isPlural } from "../../utils";
import {
  StyledAccordion,
  AccordionLabelByEtablissementContainer,
  ButtonContainer,
} from "./accordions.style";
import {
  LoaderContainer,
  SearchNoResultsContainer,
  TableContainer,
  ToolTipContainer,
} from "../../styles/shared.style";
import CampagnesTable from "../CampagnesTable";
import useFetchCampagnes from "../../../hooks/useFetchCampagnes";
import BeatLoader from "react-spinners/BeatLoader";
import Alert from "@codegouvfr/react-dsfr/Alert";

const DisplayByEtablissementTable = ({
  campagnesSorted,
  selectedCampagneIds,
  setSelectedCampagneIds,
  displayMode,
  search,
  setSearch,
}) => {
  const [page, setPage] = useState(null);
  const [openedAccordion, setOpenedAccordion] = useState(null);

  let query = `etablissementFormateurSiret=${openedAccordion}`;

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
    const elem = campagnesSorted.map((etablissementFormateur) => ({
      [etablissementFormateur.etablissement_formateur_siret]: 1,
    }));
    setPage(elem);
  }

  return campagnesSorted.map(({ etablissementFormateur, campagneIds }) => {
    const campagnesSelectedByEtablissementFormateurCount = selectedCampagneIds.filter(
      (campagneId) => campagneIds.includes(campagneId)
    ).length;

    const checkboxLabel = (
      <b>
        {campagnesSelectedByEtablissementFormateurCount
          ? `${campagnesSelectedByEtablissementFormateurCount} campagne${isPlural(
              campagnesSelectedByEtablissementFormateurCount
            )} sélectionnée${isPlural(campagnesSelectedByEtablissementFormateurCount)}`
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
        key={etablissementFormateur.etablissement_formateur_siret}
        onExpandedChange={(isExpanded) =>
          isExpanded
            ? setOpenedAccordion(etablissementFormateur.etablissement_formateur_siret)
            : setOpenedAccordion(null)
        }
        label={
          <AccordionLabelByEtablissementContainer>
            <div>
              {etablissementFormateur.etablissement_formateur_siret ===
              etablissementFormateur.etablissement_gestionnaire_siret ? (
                <Tooltip
                  background="var(--background-default-grey)"
                  border="var(--border-default-grey)"
                  color="var(--text-default-grey)"
                  placement="right"
                  content={
                    <ToolTipContainer>
                      Cet établissement est gestionnaire et rattaché à votre compte Sirius
                    </ToolTipContainer>
                  }
                >
                  <span className={fr.cx("fr-icon-award-fill")} aria-hidden={true} />
                </Tooltip>
              ) : (
                <Tooltip
                  background="var(--background-default-grey)"
                  border="var(--border-default-grey)"
                  color="var(--text-default-grey)"
                  placement="right"
                  content={
                    <ToolTipContainer>
                      Cet établissement est formateur et dispense des formations pour un
                      établissement gestionnaire
                    </ToolTipContainer>
                  }
                >
                  <span className={fr.cx("fr-icon-award-line")} aria-hidden={true} />
                </Tooltip>
              )}
              <h5>
                {etablissementFormateur.etablissement_formateur_entreprise_raison_sociale ||
                  etablissementFormateur.etablissement_formateur_enseigne}
              </h5>
            </div>
            <p>
              {etablissementFormateur.etablissement_formateur_adresse}{" "}
              {etablissementFormateur.localite}
            </p>
            <p>N° SIRET : {etablissementFormateur.etablissement_formateur_siret}</p>
            <p>
              {campagnesSelectedByEtablissementFormateurCount} campagne
              {isPlural(campagnesSelectedByEtablissementFormateurCount)} sélectionnée
              {isPlural(campagnesSelectedByEtablissementFormateurCount)}
            </p>
          </AccordionLabelByEtablissementContainer>
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
                      name: `selectAll${etablissementFormateur.etablissement_formateur_siret}`,
                      checked:
                        campagnesSelectedByEtablissementFormateurCount === campagneIds.length,
                      onChange: handleSelectAll,
                    },
                  },
                ]}
              />
            </ButtonContainer>
            <TableContainer>
              {campagnes.pagination.totalPages > 1 && (
                <Pagination
                  count={campagnes.pagination.totalPages}
                  defaultPage={page[etablissementFormateur.etablissement_formateur_siret]}
                  getPageLinkProps={(pageNumber) => ({
                    onClick: (event) => {
                      event.preventDefault();
                      setPage((prevValue) => ({
                        ...prevValue,
                        [etablissementFormateur.etablissement_formateur_siret]: pageNumber,
                      }));
                    },
                    key: `pagination-link-${pageNumber}`,
                  })}
                />
              )}
              {campagnes.pagination.totalItems === 0 && search ? (
                <SearchNoResultsContainer>
                  <h3>Aucun résultats dans cet etablissement pour votre recherche « {search} »</h3>
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
                  defaultPage={page[etablissementFormateur.etablissement_formateur_siret]}
                  getPageLinkProps={(pageNumber) => ({
                    onClick: (event) => {
                      event.preventDefault();
                      setPage((prevValue) => ({
                        ...prevValue,
                        [etablissementFormateur.etablissement_formateur_siret]: pageNumber,
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
