import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fr } from "@codegouvfr/react-dsfr";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import useFetchRemoteFormations from "../hooks/useFetchRemoteFormations";
import useFetchCampagnes from "../hooks/useFetchCampagnes";
import { UserContext } from "../context/UserContext";
import { EtablissementsContext } from "../context/EtablissementsContext";
import Statistics from "./ManageCampagne/Statistics/Statistics";
import DisplayByDiplomeType from "./ManageCampagne/Accordions/DisplayByDiplomeType";
import DisplayByEtablissement from "./ManageCampagne/Accordions/DisplayByEtablissement";
import SortButtons from "./ManageCampagne/SortButtons/SortButtons";
import ActionButtons from "./ManageCampagne/ActionButtons/ActionButtons";
import NeedHelp from "../Components/NeedHelp";
import { campagnesDisplayMode, campagnesSortingOptions } from "../constants";
import { Container, ManageCampagneContainer } from "./styles/manageCampagnes.style";

const ManageCampagnesPage = () => {
  const [selectedCampagnes, setSelectedCampagnes] = useState([]);
  const [displayedCampagnes, setDisplayedCampagnes] = useState([]);
  const [displayMode, setDisplayMode] = useState(campagnesDisplayMode[0].value);
  const [sortingMode, setSortingMode] = useState(campagnesSortingOptions[0].value);
  const [search, setSearch] = useState("");
  const [userContext] = useContext(UserContext);
  const [etablissementsContext] = useContext(EtablissementsContext);
  const [shouldRefreshData, setShouldRefreshData] = useState(false);
  const navigate = useNavigate();

  const campagneQuery = etablissementsContext.siret
    ? `?siret=${etablissementsContext.siret}`
    : null;

  const [campagnes, loadingCampagnes, errorCampagnes] = useFetchCampagnes(
    campagneQuery,
    shouldRefreshData
  );

  const [formations] = useFetchRemoteFormations(etablissementsContext.siret);

  useEffect(() => {
    if (campagnes?.length) {
      setDisplayedCampagnes(campagnes);
    }
  }, [campagnes]);

  useEffect(() => {
    if (shouldRefreshData) {
      setShouldRefreshData(false);
    }
  }, [shouldRefreshData]);

  useEffect(() => {
    if (campagnes?.length && search === "") {
      setDisplayedCampagnes(campagnes);
    } else {
      const filteredCampagnes = displayedCampagnes.filter((campagne) => {
        return (
          campagne.formation.data.intitule_long.toLowerCase().includes(search) ||
          campagne.formation.data.localite.toLowerCase().includes(search) ||
          campagne.formation.data.tags.join("-").toLowerCase().includes(search) ||
          campagne.nomCampagne.toLowerCase().includes(search)
        );
      });
      setDisplayedCampagnes(filteredCampagnes);
    }
  }, [search]);

  const accordionComponentGetter = () => {
    if (displayMode === campagnesDisplayMode[0].value) {
      return (
        <DisplayByDiplomeType
          displayedCampagnes={displayedCampagnes}
          formations={formations}
          selectedCampagnes={selectedCampagnes}
          setSelectedCampagnes={setSelectedCampagnes}
          setShouldRefreshData={setShouldRefreshData}
          userContext={userContext}
        />
      );
    } else if (displayMode === campagnesDisplayMode[1].value) {
      return (
        <DisplayByEtablissement
          displayedCampagnes={displayedCampagnes}
          formations={formations}
          selectedCampagnes={selectedCampagnes}
          setSelectedCampagnes={setSelectedCampagnes}
          setShouldRefreshData={setShouldRefreshData}
          userContext={userContext}
        />
      );
    }
  };

  return (
    <Container>
      <Statistics campagnes={campagnes || []} />
      <ManageCampagneContainer>
        <h1>
          <span className={fr.cx("fr-icon-settings-5-fill")} aria-hidden={true} />
          Gérez vos campagnes
        </h1>
        <p>
          Formations extraites du{" "}
          <Link to="https://catalogue-apprentissage.intercariforef.org/" target="_blank">
            Catalogue des offres de formations en apprentissage
          </Link>{" "}
          du réseau des CARIF OREF.
        </p>
        {displayedCampagnes?.length || search ? (
          <>
            <SortButtons
              displayedCampagnes={displayedCampagnes}
              setDisplayedCampagnes={setDisplayedCampagnes}
              displayMode={displayMode}
              setDisplayMode={setDisplayMode}
              sortingMode={sortingMode}
              setSortingMode={setSortingMode}
              search={search}
              setSearch={setSearch}
            />
            <ActionButtons
              displayedCampagnes={displayedCampagnes}
              setDisplayedCampagnes={setDisplayedCampagnes}
              selectedCampagnes={selectedCampagnes}
              setSelectedCampagnes={setSelectedCampagnes}
              userContext={userContext}
            />
          </>
        ) : null}
        {displayedCampagnes?.length ? (
          <div className={fr.cx("fr-accordions-group")}>{accordionComponentGetter()}</div>
        ) : null}
        {errorCampagnes ? (
          <Alert
            title="Une erreur s'est produite dans le chargement des campagnes."
            description="Merci de réessayer ultérieurement."
            severity="error"
          />
        ) : null}
        {!campagnes?.length && !loadingCampagnes && !errorCampagnes ? (
          <>
            <Button iconId="fr-icon-add-line" onClick={() => navigate("/campagnes/ajout")}>
              Créer votre première campagne
            </Button>
          </>
        ) : null}
        {!displayedCampagnes?.length && search ? (
          <>
            <h3>Aucun résultats pour votre recherche</h3>
          </>
        ) : null}
      </ManageCampagneContainer>
      <NeedHelp />
    </Container>
  );
};

export default ManageCampagnesPage;
