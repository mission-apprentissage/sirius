import React, { useState, useContext, useEffect } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { fr } from "@codegouvfr/react-dsfr";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
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
      <div className={fr.cx("fr-accordions-group")}>
        <DisplayByDiplomeTypeCards {...props} />
      </div>
    );
  } else if (displayMode === campagnesDisplayMode[1].value) {
    return (
      <div className={fr.cx("fr-accordions-group")}>
        <DisplayByEtablissementCards {...props} />
      </div>
    );
  } else if (displayMode === campagnesDisplayMode[2].value) {
    return <DisplayByAllCards {...props} />;
  }
};

const FormationsSelector = ({ selectedFormations, setSelectedFormations }) => {
  const [displayMode, setDisplayMode] = useState(campagnesDisplayMode[0].value);
  const [displayedFormations, setDisplayedFormations] = useState([]);
  const [search, setSearch] = useState("");
  const [userContext] = useContext(UserContext);
  const [page, setPage] = useState(1);

  const isAdmin = userContext.currentUserRole === USER_ROLES.ADMIN;
  const userSiret = userContext.etablissements.map((etablissement) => etablissement.siret);

  const formattedUserSiret = userSiret
    .map((siret) => [
      { etablissement_formateur_siret: siret },
      { etablissement_gestionnaire_siret: siret },
    ])
    .flat();

  const userSiretQuery = isAdmin ? "" : `"$or": ${JSON.stringify(formattedUserSiret)}, `;
  const searchQuery = search ? `&queryAsRegex={"onisep_intitule": "${search}"}` : "";

  const query = `query={${userSiretQuery} "published": "true", "catalogue_published": "true", "niveau":["3 (CAP...)","4 (BAC...)"]}&select={"_id": 1, "diplome": 1, "tags": 1, "duree": 1, "intitule_long": 1, "etablissement_formateur_siret": 1, "etablissement_gestionnaire_siret": 1, "localite": 1, "etablissement_formateur_adresse": 1, "etablissement_formateur_entreprise_raison_sociale": 1, "etablissement_formateur_enseigne": 1}${searchQuery}`;

  const {
    remoteFormations,
    remoteFormationsPagination,
    isSuccess: isSuccessFormations,
    isError: isErrorFormations,
    isLoading: isLoadingFormations,
  } = useFetchRemoteFormations({
    query,
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

  useEffect(() => {
    if (remoteFormations?.length && search === "") {
      setDisplayedFormations(remoteFormations);
    } else {
      const filteredFormations = remoteFormations?.filter((formation) => {
        return (
          formation.intitule_long.toLowerCase().includes(search) ||
          formation.localite.toLowerCase().includes(search) ||
          formation.etablissement_formateur_enseigne.toLowerCase().includes(search) ||
          formation.etablissement_formateur_adresse.toLowerCase().includes(search) ||
          formation.etablissement_formateur_siret.toLowerCase().includes(search) ||
          formation.tags.join("-").toLowerCase().includes(search)
        );
      });
      setDisplayedFormations(filteredFormations);
    }
  }, [search, remoteFormations]);

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
      {(isLoadingFormations || isLoadingExistingFormationIds) && (
        <LoaderContainer>
          <BeatLoader
            color="var(--background-action-high-blue-france)"
            size={20}
            aria-label="Loading Spinner"
          />
        </LoaderContainer>
      )}
      {(isErrorFormations || isErrorExistingFormationIds) && (
        <Alert
          title="Une erreur s'est produite dans le chargement des formations"
          description="Merci de réessayer ultérieurement"
          severity="error"
        />
      )}
      {isSuccessExistingFormationIds && isSuccessFormations && !remoteFormations.length && (
        <Alert
          title="Une erreur s'est produite dans le chargement des formations"
          description="Merci de réessayer ultérieurement"
          severity="error"
        />
      )}
      {isSuccessFormations && isSuccessExistingFormationIds && remoteFormations.length && (
        <>
          <SortButtons
            displayMode={displayMode}
            setDisplayMode={setDisplayMode}
            search={search}
            setSearch={setSearch}
            organizeLabel="Organiser mes formations par"
          />
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
                            ...displayedFormations.filter(
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
              displayedFormations={displayedFormations}
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
      )}
    </>
  );
};

export default FormationsSelector;
