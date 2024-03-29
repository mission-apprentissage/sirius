import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";
import { fr } from "@codegouvfr/react-dsfr";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import useFetchCampagnes from "../hooks/useFetchCampagnes";
import { UserContext } from "../context/UserContext";
import Statistics from "./Shared/Statistics/Statistics";
import DisplayByDiplomeType from "./ManageCampagne/Accordions/DisplayByDiplomeType";
import DisplayByEtablissement from "./ManageCampagne/Accordions/DisplayByEtablissement";
import SortButtons from "./Shared/SortButtons/SortButtons";
import ActionButtons from "./ManageCampagne/ActionButtons/ActionButtons";
import NeedHelp from "../Components/NeedHelp";
import { campagnesDisplayMode, campagnesSortingOptions } from "../constants";
import SupportModal from "./Shared/SupportModal";
import SuccessCreationModal from "./ManageCampagne/SuccessCreationModal";
import { Container, ManageCampagneContainer } from "./styles/manageCampagnes.style";
import { SearchNoResultsContainer, LoaderContainer } from "./styles/shared.style";
import {
  sortingKeys,
  getChampsLibreRate,
  getFinishedCampagnes,
  getMedianDuration,
  getTemoignagesCount,
  getVerbatimsCount,
} from "./utils";
import CampagnesTable from "./Shared/CampagnesTable/CampagnesTable";

const modal = createModal({
  id: "support-modal-loggedIn",
  isOpenedByDefault: false,
});

const successCreationModal = createModal({
  id: "success-creation-modal",
  isOpenedByDefault: true,
});

const ManageCampagnesPage = () => {
  const [selectedCampagnes, setSelectedCampagnes] = useState([]);
  const [displayedCampagnes, setDisplayedCampagnes] = useState([]);
  const [displayMode, setDisplayMode] = useState(campagnesDisplayMode[0].value);
  const [sortingMode, setSortingMode] = useState(campagnesSortingOptions[0].value);
  const [search, setSearch] = useState("");
  const [userContext] = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.successCreation) {
      successCreationModal.open();
      navigate(null, { state: {} });
    }
  }, [location.state]);

  const [campagnes, loadingCampagnes, errorCampagnes] = useFetchCampagnes();

  useEffect(() => {
    if (campagnes?.length) {
      setDisplayedCampagnes(campagnes);
    }
  }, [campagnes]);

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

  useEffect(() => {
    let sortedCampagnes = [...displayedCampagnes];
    if (sortedCampagnes.length > 0) {
      sortedCampagnes.sort((a, b) => {
        return sortingKeys(a, b)[sortingMode]();
      });
    }
    if (JSON.stringify(sortedCampagnes) !== JSON.stringify(displayedCampagnes)) {
      setDisplayedCampagnes(sortedCampagnes);
    }
  }, [sortingMode, displayedCampagnes]);

  const accordionComponentGetter = () => {
    if (displayMode === campagnesDisplayMode[0].value) {
      return (
        <DisplayByDiplomeType
          displayedCampagnes={displayedCampagnes}
          selectedCampagnes={selectedCampagnes}
          setSelectedCampagnes={setSelectedCampagnes}
          userContext={userContext}
        />
      );
    } else if (displayMode === campagnesDisplayMode[1].value) {
      return (
        <DisplayByEtablissement
          displayedCampagnes={displayedCampagnes}
          selectedCampagnes={selectedCampagnes}
          setSelectedCampagnes={setSelectedCampagnes}
          userContext={userContext}
        />
      );
    } else if (displayMode === campagnesDisplayMode[2].value) {
      return (
        <CampagnesTable
          displayedCampagnes={displayedCampagnes}
          selectedCampagnes={selectedCampagnes}
          setSelectedCampagnes={setSelectedCampagnes}
          displayMode={displayMode}
          userContext={userContext}
        />
      );
    }
  };

  const statistics = {
    campagnesCount: campagnes?.length || 0,
    finishedCampagnesCount: campagnes?.length ? getFinishedCampagnes(campagnes).length : 0,
    temoignagesCount: campagnes?.length ? getTemoignagesCount(campagnes) : 0,
    champsLibreRate: campagnes?.length ? getChampsLibreRate(campagnes) : "N/A",
    medianDuration: campagnes?.length ? getMedianDuration(campagnes) : "N/A",
    verbatimsCount: campagnes?.length ? getVerbatimsCount(campagnes) : "0",
  };

  return (
    <>
      <Container>
        <Statistics statistics={statistics} title="Sirius & vous en quelques chiffres" />
        <ManageCampagneContainer>
          <div>
            <h1>
              <span className={fr.cx("fr-icon-settings-5-fill")} aria-hidden={true} />
              Diffuser mes campagnes
            </h1>
            <Button
              priority="secondary"
              iconId="fr-icon-add-line"
              onClick={() => navigate("/campagnes/ajout")}
            >
              Créer des campagnes
            </Button>
          </div>
          <>
            <SortButtons
              displayMode={displayMode}
              setDisplayMode={setDisplayMode}
              sortingMode={sortingMode}
              setSortingMode={setSortingMode}
              search={search}
              setSearch={setSearch}
              organizeLabel="Organiser mes campagnes par"
              mode="manage"
            />
            <ActionButtons
              displayedCampagnes={displayedCampagnes}
              setDisplayedCampagnes={setDisplayedCampagnes}
              selectedCampagnes={selectedCampagnes}
              setSelectedCampagnes={setSelectedCampagnes}
              userContext={userContext}
            />
          </>
          {displayedCampagnes?.length ? (
            <div className={fr.cx("fr-accordions-group")}>{accordionComponentGetter()}</div>
          ) : null}
          {loadingCampagnes && (
            <LoaderContainer>
              <BeatLoader
                color="var(--background-action-high-blue-france)"
                size={20}
                aria-label="Loading Spinner"
              />
            </LoaderContainer>
          )}
          {errorCampagnes && !campagnes?.length ? (
            <Alert
              title="Une erreur s'est produite dans le chargement des campagnes"
              description="Merci de réessayer ultérieurement"
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
            <SearchNoResultsContainer>
              <h3>Aucun résultats pour votre recherche</h3>
              <p onClick={() => setSearch("")}>Réinitialiser ?</p>
            </SearchNoResultsContainer>
          ) : null}
          <p>
            Formations extraites du{" "}
            <Link to="https://catalogue-apprentissage.intercariforef.org/" target="_blank">
              Catalogue des offres de formations en apprentissage
            </Link>{" "}
            du réseau des CARIF OREF. Un problème ?{" "}
            <span onClick={() => modal.open()}>
              <b>
                <u>Dites le nous</u>
              </b>
            </span>
          </p>
        </ManageCampagneContainer>
        <NeedHelp />
      </Container>
      <SupportModal modal={modal} token={userContext.token} />
      <SuccessCreationModal modal={successCreationModal} />
    </>
  );
};

export default ManageCampagnesPage;
