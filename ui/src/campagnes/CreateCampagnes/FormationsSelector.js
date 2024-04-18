import React, { useState, useContext } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { fr } from "@codegouvfr/react-dsfr";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Pagination } from "@codegouvfr/react-dsfr/Pagination";
import SortButtons from "../Shared/SortButtons/SortButtons";
import { LoaderContainer, TableContainer } from "../styles/shared.style";
import { USER_ROLES, campagnesDisplayMode } from "../../constants";
import { UserContext } from "../../context/UserContext";
import useFetchRemoteFormations from "../../hooks/useFetchRemoteFormations";
import DisplayByDiplomeTypeCards from "./Accordions/DisplayByDiplomeTypeCards";
import DisplayByEtablissementCards from "./Accordions/DisplayByEtablissementCards";
import DisplayByAllCards from "./Accordions/DisplayByAllCards";
import useFetchAlreadyExistingFormations from "../../hooks/useFetchAlreadyExistingFormation";
import { isPlural } from "../utils";

const AccordionComponentGetter = ({ displayMode, ...props }) => {
  if (displayMode === campagnesDisplayMode[0].value) {
    return (
      <div className={fr.cx("fr-accordions-group")} style={{ width: "100%" }}>
        <DisplayByDiplomeTypeCards {...props} />
      </div>
    );
  } else if (displayMode === campagnesDisplayMode[1].value) {
    return (
      <div className={fr.cx("fr-accordions-group")} style={{ width: "100%" }}>
        <DisplayByEtablissementCards {...props} />
      </div>
    );
  } else if (displayMode === campagnesDisplayMode[2].value) {
    return <DisplayByAllCards {...props} />;
  }
};

const FormationsSelector = ({ selectedFormations, setSelectedFormations }) => {
  const [displayMode, setDisplayMode] = useState(campagnesDisplayMode[0].value);
  const [search, setSearch] = useState("");
  const [userContext] = useContext(UserContext);
  const [page, setPage] = useState(1);

  const isAdmin = userContext.user?.role === USER_ROLES.ADMIN;
  const userSiret = userContext.user?.etablissements.map((etablissement) => etablissement.siret);

  const formattedUserSiret = userSiret
    .map((siret) => [
      { etablissement_formateur_siret: siret },
      { etablissement_gestionnaire_siret: siret },
    ])
    .flat();

  const baseQuery = {
    published: "true",
    catalogue_published: "true",
    niveau: ["3 (CAP...)", "4 (BAC...)"],
  };

  const selectFields = {
    _id: 1,
    diplome: 1,
    tags: 1,
    duree: 1,
    intitule_long: 1,
    etablissement_formateur_siret: 1,
    etablissement_gestionnaire_siret: 1,
    localite: 1,
    etablissement_formateur_adresse: 1,
    etablissement_formateur_entreprise_raison_sociale: 1,
    etablissement_formateur_enseigne: 1,
  };

  const userSiretQuery = isAdmin ? {} : { $or: formattedUserSiret }; // formattedUserSiret should be an array of objects

  const searchQuery = search
    ? [
        { intitule_long: { $regex: search, $options: "i" } },
        { onisep_intitule: { $regex: search, $options: "i" } },
      ]
    : [];

  const query = {
    $and: [baseQuery, userSiretQuery, ...(searchQuery.length ? [{ $or: searchQuery }] : [])],
  };

  const finalQuery = `query=${JSON.stringify(query)}&select=${JSON.stringify(selectFields)}`;

  const {
    remoteFormations,
    remoteFormationsPagination,
    isSuccess: isSuccessFormations,
    isError: isErrorFormations,
    isLoading: isLoadingFormations,
  } = useFetchRemoteFormations({
    query: finalQuery,
    enabled: !!formattedUserSiret.length || isAdmin,
    page,
    pageSize: 250,
  });

  const allRemoteFormationsIds = remoteFormations?.length
    ? [...new Set(remoteFormations?.map((formation) => formation._id).flat())]
    : [];

  const {
    existingFormationIds,
    isSuccess: isSuccessExistingFormationIds,
    isError: isErrorExistingFormationIds,
    isLoading: isLoadingExistingFormationIds,
  } = useFetchAlreadyExistingFormations({
    campagneIds: allRemoteFormationsIds,
    enabled: !!allRemoteFormationsIds.length || isAdmin,
  });

  const checkboxLabel = (
    <b>
      {selectedFormations.length
        ? `${selectedFormations.length} formation${isPlural(
            selectedFormations.length
          )} sélectionnée${isPlural(selectedFormations.length)}`
        : "Tout sélectionner"}
    </b>
  );

  return (
    <>
      {(isErrorFormations || isErrorExistingFormationIds) && (
        <Alert
          title="Une erreur s'est produite dans le chargement des formations"
          description="Merci de réessayer ultérieurement"
          severity="error"
        />
      )}
      <>
        <SortButtons
          displayMode={displayMode}
          setDisplayMode={setDisplayMode}
          search={search}
          setSearch={setSearch}
          organizeLabel="Organiser mes formations par"
        />
        {(isLoadingFormations || isLoadingExistingFormationIds) && (
          <LoaderContainer>
            <BeatLoader
              color="var(--background-action-high-blue-france)"
              size={20}
              aria-label="Loading Spinner"
            />
          </LoaderContainer>
        )}
        {isSuccessExistingFormationIds && isSuccessFormations && !remoteFormations?.length ? (
          <Alert
            title={`Aucun résultats pour votre recherche « ${search} »`}
            description={
              <Button priority="secondary" onClick={() => setSearch("")}>
                Réinitialiser la recherche
              </Button>
            }
            severity="info"
          />
        ) : null}
        {isSuccessFormations && isSuccessExistingFormationIds && remoteFormations.length ? (
          <>
            <Checkbox
              options={[
                {
                  label: checkboxLabel,
                  nativeInputProps: {
                    name: `selectAll`,
                    checked:
                      selectedFormations.length ===
                      remoteFormations.length - existingFormationIds.length,
                    onChange: (e) => {
                      setSelectedFormations((prevValues) => {
                        if (e.target.checked) {
                          return [
                            ...new Set([
                              ...prevValues,
                              ...remoteFormations.filter(
                                (formation) => !existingFormationIds.includes(formation._id)
                              ),
                            ]),
                          ];
                        } else {
                          return [];
                        }
                      });
                    },
                  },
                },
              ]}
            />
            <TableContainer>
              <AccordionComponentGetter
                displayedFormations={remoteFormations}
                selectedFormations={selectedFormations}
                setSelectedFormations={setSelectedFormations}
                displayMode={displayMode}
                existingFormationIds={existingFormationIds}
              />
              {remoteFormationsPagination.nombre_de_page > 1 && (
                <Pagination
                  count={remoteFormationsPagination.nombre_de_page}
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
          </>
        ) : null}
      </>
    </>
  );
};

export default FormationsSelector;
