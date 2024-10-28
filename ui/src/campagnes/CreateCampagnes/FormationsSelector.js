import { fr } from "@codegouvfr/react-dsfr";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { Pagination } from "@codegouvfr/react-dsfr/Pagination";
import { useContext, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";

import { DIPLOME_TYPE_MATCHER, USER_ROLES } from "../../constants";
import { UserContext } from "../../context/UserContext";
import useFetchCampagnes from "../../hooks/useFetchCampagnes";
import useFetchRemoteFormations from "../../hooks/useFetchRemoteFormations";
import { remoteEtablissementLabelGetterFromFormation } from "../../utils/etablissement";
import SortButtons from "../Shared/SortButtons/SortButtons";
import { LoaderContainer, SelectAllFormationContainer, TableContainer } from "../styles/shared.style";
import { isPlural } from "../utils";
import Cards from "./Cards";

const REMOTE_FORMATION_BASE_QUERY = {
  published: "true",
  catalogue_published: "true",
  niveau: ["3 (CAP...)", "4 (BAC...)"],
};

const REMOTE_FORMATION_FIELDS = {
  _id: 1,
  diplome: 1,
  tags: 1,
  duree: 1,
  intitule_long: 1,
  etablissement_formateur_siret: 1,
  etablissement_gestionnaire_siret: 1,
  etablissement_formateur_adresse: 1,
  etablissement_formateur_entreprise_raison_sociale: 1,
  etablissement_formateur_enseigne: 1,
  lieu_formation_adresse_computed: 1,
  lieu_formation_adresse: 1,
  localite: 1,
  code_postal: 1,
};

const buildSiretQuery = (isAdmin, userSiret) => {
  const formattedUserSiret = userSiret
    .map((siret) => [{ etablissement_formateur_siret: siret }, { etablissement_gestionnaire_siret: siret }])
    .flat();
  return isAdmin ? {} : { $or: formattedUserSiret };
};

const buildSearchQuery = (searchTerm) => {
  return searchTerm
    ? [
        { intitule_long: { $regex: searchTerm, $options: "i" } },
        { onisep_intitule: { $regex: searchTerm, $options: "i" } },
      ]
    : [];
};

const buildDiplomeQuery = (selectedDiplomesIntitule) => {
  return selectedDiplomesIntitule ? { $or: [{ diplome: selectedDiplomesIntitule }] } : [];
};

const FormationsSelector = ({ selectedFormations, setSelectedFormations }) => {
  const [search, setSearch] = useState("");
  const [selectedEtablissementsSiret, setSelectedEtablissementsSiret] = useState(null);
  const [selectedDiplomesIntitule, setSelectedDiplomesIntitule] = useState(null);
  const [diplomesOptions, setDiplomesOptions] = useState([]);
  const [etablissementsOptions, setEtablissementsOptions] = useState([]);
  const [userContext] = useContext(UserContext);
  const [page, setPage] = useState(1);

  const isAdmin = userContext.user?.role === USER_ROLES.ADMIN;
  const userSiret = userContext.user?.etablissements?.map((etablissement) => etablissement.siret) || [];

  const query = {
    $and: [
      REMOTE_FORMATION_BASE_QUERY,
      buildSiretQuery(isAdmin, selectedEtablissementsSiret?.length ? selectedEtablissementsSiret : userSiret),
      {
        ...(selectedDiplomesIntitule?.length && {
          ...buildDiplomeQuery(selectedDiplomesIntitule),
        }),
      },
      ...buildSearchQuery(search),
    ],
  };

  const stringifiedQuery = `query=${JSON.stringify(query)}&select=${JSON.stringify(REMOTE_FORMATION_FIELDS)}`;

  const {
    remoteFormations,
    remoteFormationsPagination,
    isSuccess: isSuccessFormations,
    isError: isErrorFormations,
    isLoading: isLoadingFormations,
  } = useFetchRemoteFormations({
    query: stringifiedQuery,
    enabled: !!userSiret.length || isAdmin,
    page,
    pageSize: 100,
  });

  const {
    campagnes: campagnes,
    isSuccess: isSuccessCampagnes,
    isError: isErrorCampagnes,
    isLoading: isLoadingCampagnes,
  } = useFetchCampagnes({
    key: search,
    enabled: !!remoteFormations?.length,
    pageSize: 1000,
  });

  const checkboxLabel = (
    <b>
      {selectedFormations.length === remoteFormations?.length
        ? "Désélectionner toutes les formations"
        : "Sélectionner toutes les formations"}
    </b>
  );

  if (
    remoteFormationsPagination?.nombre_de_page < 2 &&
    remoteFormations?.length &&
    !etablissementsOptions.length &&
    !diplomesOptions.length
  ) {
    const etablissements = remoteFormations
      ?.map((formation) => {
        const uniqueFormations = remoteFormations.filter(
          (remoteFormation) => remoteFormation.etablissement_formateur_siret === formation.etablissement_formateur_siret
        );

        return {
          value: formation.etablissement_formateur_siret,
          label: remoteEtablissementLabelGetterFromFormation(formation),
          hintText: `${uniqueFormations.length} formation${isPlural(uniqueFormations.length)}`,
        };
      })
      .filter((formation, index, self) => index === self.findIndex((t) => t.value === formation.value));

    const diplome = remoteFormations
      ?.map((formation) => {
        const uniqueFormations = remoteFormations.filter(
          (remoteFormation) => remoteFormation.diplome === formation.diplome
        );

        return {
          value: formation.diplome,
          label: DIPLOME_TYPE_MATCHER[formation.diplome] || formation.diplome,
          hintText: `${uniqueFormations.length} formation${isPlural(uniqueFormations.length)}`,
        };
      })
      .filter((formation, index, self) => index === self.findIndex((t) => t.value === formation.value));

    setEtablissementsOptions(etablissements);
    setDiplomesOptions(diplome);
  }

  return (
    <>
      {(isErrorFormations || isErrorCampagnes) && (
        <Alert
          title="Une erreur s'est produite dans le chargement des formations"
          description="Merci de réessayer ultérieurement"
          severity="error"
        />
      )}
      <>
        {isSuccessFormations && (
          <>
            <SortButtons
              search={search}
              setSearch={setSearch}
              selectedEtablissementsSiret={selectedEtablissementsSiret}
              setSelectedEtablissementsSiret={setSelectedEtablissementsSiret}
              selectedDiplomesIntitule={selectedDiplomesIntitule}
              setSelectedDiplomesIntitule={setSelectedDiplomesIntitule}
              etablissementsOptions={etablissementsOptions}
              diplomesOptions={diplomesOptions}
              showSelect={!!remoteFormationsPagination?.nombre_de_page < 2}
            />
            <SelectAllFormationContainer>
              <Checkbox
                disabled={!remoteFormations?.length}
                options={[
                  {
                    label: checkboxLabel,
                    hintText: remoteFormationsPagination?.total
                      ? `${selectedFormations.length}/${
                          remoteFormationsPagination?.total
                        } formation${isPlural(selectedFormations.length)} sélectionnée${isPlural(
                          selectedFormations.length
                        )}`
                      : "",
                    nativeInputProps: {
                      name: `selectAll`,
                      checked: selectedFormations?.length === remoteFormations?.length,
                      onChange: () => {
                        if (selectedFormations.length === remoteFormations.length) {
                          setSelectedFormations([]);
                        } else {
                          setSelectedFormations(remoteFormations);
                        }
                      },
                    },
                  },
                ]}
              />
            </SelectAllFormationContainer>
          </>
        )}
        {isSuccessCampagnes && isSuccessFormations && search && !remoteFormations?.length ? (
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
        {isLoadingFormations || isLoadingCampagnes ? (
          <LoaderContainer>
            <BeatLoader color="var(--background-action-high-blue-france)" size={20} aria-label="Loading Spinner" />
          </LoaderContainer>
        ) : (
          <TableContainer>
            <Cards
              displayedFormations={remoteFormations}
              selectedFormations={selectedFormations}
              setSelectedFormations={setSelectedFormations}
              campagnes={campagnes || []}
            />
            {remoteFormationsPagination?.nombre_de_page > 1 && (
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
        )}
      </>
    </>
  );
};

export default FormationsSelector;
