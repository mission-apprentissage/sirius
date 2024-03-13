import React, { useState, useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";
import { fr } from "@codegouvfr/react-dsfr";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import Button from "@codegouvfr/react-dsfr/Button";
import useFetchCampagnes from "../hooks/useFetchCampagnes";
import { UserContext } from "../context/UserContext";
import { _post } from "../utils/httpClient";
import { useGet } from "../common/hooks/httpHooks";
import {
  ButtonContainer,
  Container,
  ResultsCampagneContainer,
  TestimonialHeader,
} from "./styles/resultsCampagnes.style";
import SortButtons from "./Shared/SortButtons/SortButtons";
import CampagnesTable from "./ResultsCampagnes/CampagnesTable";
import { LoaderContainer, SearchNoResultsContainer } from "./styles/shared.style";
import { USER_ROLES, campagnesDisplayMode, campagnesSortingOptions } from "../constants";
import Statistics from "./Shared/Statistics/Statistics";
import ResultsCampagnesVisualisation from "./ResultsCampagnes/ResultsCampagnesVisualisation";
import DisplayByEtablissementTable from "./ResultsCampagnes/Accordions/DisplayByEtablissementTable";
import { isPlural, sortingKeys } from "./utils";
import DisplayByDiplomeTypeTable from "./ResultsCampagnes/Accordions/DisplayByDiplomeTypeTable";
import { exportMultipleChartsToPdf } from "./pdfExport";

const ResultsCampagnesPage = () => {
  const [displayedCampagnes, setDisplayedCampagnes] = useState([]);
  const [selectedCampagnes, setSelectedCampagnes] = useState([]);
  const [displayMode, setDisplayMode] = useState(campagnesDisplayMode[0].value);
  const [sortingMode, setSortingMode] = useState(campagnesSortingOptions[0].value);
  const [search, setSearch] = useState("");
  const [isOpened, setIsOpened] = useState(false);
  const [temoignages, setTemoignages] = useState([]);
  const [loadingTemoignages, setLoadingTemoignages] = useState(false);
  const [temoignagesError, setTemoignagesError] = useState(false);
  const [pdfExportLoading, setPdfExportLoading] = useState(false);
  const [expandedAccordion, setExpandedAccordion] = useState(null);
  const [neededQuestionnaires, setNeededQuestionnaires] = useState([]);
  const [searchParams] = useSearchParams();
  const [userContext] = useContext(UserContext);
  const [campagnes, loadingCampagnes, errorCampagnes] = useFetchCampagnes();
  const [questionnaires, loadingQuestionnaires, errorQuestionnaires] =
    useGet(`/api/questionnaires/`);

  const paramsCampagneIds = searchParams.has("campagneIds")
    ? searchParams.get("campagneIds").split(",")
    : [];

  useEffect(() => {
    if (displayedCampagnes.length && selectedCampagnes.length) {
      const neededQuestionnaireIds = [
        ...new Set(
          displayedCampagnes
            .filter((campagne) => selectedCampagnes.includes(campagne._id))
            .map((campagne) => campagne.questionnaireId)
        ),
      ];

      const filteredQuestionnaires = questionnaires.filter((questionnaire) =>
        neededQuestionnaireIds.includes(questionnaire._id)
      );

      setNeededQuestionnaires(filteredQuestionnaires);
    }
  }, [selectedCampagnes]);

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
    if (campagnes?.length) {
      setDisplayedCampagnes(campagnes);
      if (userContext.currentUserRole === USER_ROLES.ETABLISSEMENT) {
        if (paramsCampagneIds.length) {
          setSelectedCampagnes(paramsCampagneIds);
        } else {
          setSelectedCampagnes(campagnes.map((campagne) => campagne._id));
        }
      }
    }
  }, [campagnes]);

  useEffect(() => {
    const getTemoignages = async () => {
      setLoadingTemoignages(true);
      try {
        if (selectedCampagnes.length) {
          const result = await _post(
            `/api/temoignages/getbig`,
            selectedCampagnes,
            userContext.token
          );
          setTemoignages(result);
        } else {
          setTemoignages([]);
        }
      } catch (error) {
        setTemoignagesError(true);
      }
      setLoadingTemoignages(false);
    };
    getTemoignages();
  }, [displayedCampagnes]);

  const filteredTemoignagesBySelectedCampagnes = temoignages.filter((temoignage) =>
    selectedCampagnes.includes(temoignage.campagneId)
  );

  const filteredDisplayedCampagnesBySelectedCampagnes = displayedCampagnes.filter((campagne) =>
    selectedCampagnes.includes(campagne._id)
  );

  const AccordionComponentGetter = () => {
    if (displayMode === campagnesDisplayMode[0].value) {
      return (
        <DisplayByDiplomeTypeTable
          displayedCampagnes={displayedCampagnes}
          selectedCampagnes={selectedCampagnes}
          setSelectedCampagnes={setSelectedCampagnes}
          displayMode={displayMode}
        />
      );
    } else if (displayMode === campagnesDisplayMode[1].value) {
      return (
        <DisplayByEtablissementTable
          displayedCampagnes={displayedCampagnes}
          selectedCampagnes={selectedCampagnes}
          setSelectedCampagnes={setSelectedCampagnes}
          displayMode={displayMode}
        />
      );
    } else if (displayMode === campagnesDisplayMode[2].value) {
      return (
        <CampagnesTable
          displayedCampagnes={displayedCampagnes}
          selectedCampagnes={selectedCampagnes}
          setSelectedCampagnes={setSelectedCampagnes}
          displayMode={displayMode}
        />
      );
    }
  };

  const checkboxLabel = (
    <b>
      {selectedCampagnes.length
        ? `${selectedCampagnes.length} campagne${isPlural(
            selectedCampagnes.length
          )} sélectionnée${isPlural(selectedCampagnes.length)}`
        : "Tout sélectionner"}
    </b>
  );

  return (
    <Container>
      <ResultsCampagneContainer>
        <SortButtons
          displayMode={displayMode}
          setDisplayMode={setDisplayMode}
          sortingMode={sortingMode}
          setSortingMode={setSortingMode}
          search={search}
          setSearch={setSearch}
          mode="results"
          organizeLabel="Sélectionner les résultats à afficher"
        />
        {(loadingCampagnes || loadingQuestionnaires) && (
          <LoaderContainer>
            <BeatLoader
              color="var(--background-action-high-blue-france)"
              size={20}
              aria-label="Loading Spinner"
            />
          </LoaderContainer>
        )}
        {(errorCampagnes || errorQuestionnaires) && !campagnes?.length ? (
          <Alert
            title="Une erreur s'est produite dans le chargement des campagnes"
            description="Merci de réessayer ultérieurement"
            severity="error"
          />
        ) : null}
        {displayedCampagnes?.length ? (
          <>
            <Checkbox
              options={[
                {
                  label: checkboxLabel,
                  nativeInputProps: {
                    name: `selectAllCampagnes`,
                    checked: !!selectedCampagnes.length,
                    onChange: (e) => {
                      setSelectedCampagnes(() => {
                        if (e.target.checked) {
                          return campagnes.map((campagne) => campagne._id);
                        } else {
                          return [];
                        }
                      });
                    },
                  },
                },
              ]}
            />
            <div className={fr.cx("fr-accordions-group")}>
              <div style={{ display: isOpened ? "inherit" : "none" }}>
                <AccordionComponentGetter />
              </div>
            </div>
            <ButtonContainer>
              <Button
                priority="secondary"
                iconId={isOpened ? "fr-icon-arrow-up-s-line" : "fr-icon-arrow-down-s-line"}
                onClick={() => setIsOpened((prevValue) => !prevValue)}
              />
            </ButtonContainer>
          </>
        ) : null}
        {!displayedCampagnes?.length && search ? (
          <SearchNoResultsContainer>
            <h3>Aucun résultats pour votre recherche</h3>
            <p onClick={() => setSearch("")}>Réinitialiser ?</p>
          </SearchNoResultsContainer>
        ) : null}
      </ResultsCampagneContainer>
      <Statistics
        campagnes={filteredDisplayedCampagnesBySelectedCampagnes}
        title="Statistiques des campagnes sélectionnées"
      />
      <ResultsCampagneContainer>
        <TestimonialHeader>
          <h1>
            <span className={fr.cx("fr-icon-quote-fill")} aria-hidden={true} />
            Témoignages des campagnes sélectionnées
          </h1>
          <div>
            {/*<Button priority="secondary" iconId="fr-icon-file-download-fill">
              Exporter en XLS
        </Button>*/}
            <Button
              priority="secondary"
              iconId="fr-icon-file-download-fill"
              onClick={() =>
                exportMultipleChartsToPdf(
                  neededQuestionnaires.questionnaire,
                  setExpandedAccordion,
                  setPdfExportLoading
                )
              }
            >
              {pdfExportLoading ? (
                <BeatLoader
                  color="var(--background-action-high-blue-france)"
                  size={10}
                  aria-label="Loading Spinner"
                />
              ) : (
                "Exporter en PDF"
              )}
            </Button>
          </div>
        </TestimonialHeader>
        {loadingTemoignages && (
          <LoaderContainer>
            <BeatLoader
              color="var(--background-action-high-blue-france)"
              size={20}
              aria-label="Loading Spinner"
            />
          </LoaderContainer>
        )}
        {temoignagesError && !temoignages.length && !loadingTemoignages ? (
          <Alert
            title="Une erreur s'est produite dans le chargement des témoignages"
            description="Merci de réessayer ultérieurement"
            severity="error"
          />
        ) : null}
        {!temoignagesError && !temoignages.length && !loadingTemoignages ? (
          <Alert
            title="Vous n'avez pas encore recueilli de témoignages pour les campagnes sélectionnées"
            severity="info"
          />
        ) : null}
        {filteredTemoignagesBySelectedCampagnes.length &&
        neededQuestionnaires.length &&
        !loadingTemoignages ? (
          <ResultsCampagnesVisualisation
            temoignages={filteredTemoignagesBySelectedCampagnes}
            questionnaire={neededQuestionnaires[0].questionnaire}
            questionnaireUI={neededQuestionnaires[0].questionnaireUI}
            expandedAccordion={expandedAccordion}
            setExpandedAccordion={setExpandedAccordion}
          />
        ) : null}
      </ResultsCampagneContainer>
    </Container>
  );
};

export default ResultsCampagnesPage;
