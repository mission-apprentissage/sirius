import React, { useState, useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";
import { fr } from "@codegouvfr/react-dsfr";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import { Tabs } from "@codegouvfr/react-dsfr/Tabs";
import { UserContext } from "../context/UserContext";
import { _post } from "../utils/httpClient";
import { useGet } from "../common/hooks/httpHooks";
import {
  Container,
  ResultsCampagneContainer,
  TestimonialHeader,
} from "./styles/resultsCampagnes.style";
import { LoaderContainer } from "./styles/shared.style";
import { OBSERVER_SCOPES_LABELS } from "../constants";
import Statistics from "./Shared/Statistics/Statistics";
import ResultsCampagnesVisualisation from "./ResultsCampagnes/ResultsCampagnesVisualisation";
import { getStatistics } from "./utils";
import { exportMultipleChartsToPdf } from "./pdfExport";
import ExportResultsCampagnesVisualisation from "./ResultsCampagnes/ExportResultsCampagnesVisualisation";
import ResultsCampagnesSelector from "./ResultsCampagnes/ResultsCampagnesSelector";

const MultipleQuestionnairesTabs = ({ neededQuestionnaires, selectedCampagnes, temoignages }) => {
  const tabs = neededQuestionnaires.map((questionnaire, index) => {
    const filteredCampagnesByQuestionnaireId = selectedCampagnes
      .filter((campagne) => campagne.questionnaireId === questionnaire._id)
      .map((campagne) => campagne._id);

    const filteredTemoignagesBySelectedCampagnesAndQuestionnaireId = temoignages.filter(
      (temoignage) => filteredCampagnesByQuestionnaireId.includes(temoignage.campagneId)
    );

    return {
      label: `Questionnaire version ${index + 1}`,
      content: (
        <ResultsCampagnesVisualisation
          temoignages={filteredTemoignagesBySelectedCampagnesAndQuestionnaireId}
          questionnaire={questionnaire.questionnaire}
          questionnaireUI={questionnaire.questionnaireUI}
        />
      ),
    };
  });

  return <Tabs tabs={tabs} />;
};

const ResultsCampagnesPage = () => {
  const [selectedCampagnes, setSelectedCampagnes] = useState([]);
  const [temoignages, setTemoignages] = useState([]);
  const [loadingTemoignages, setLoadingTemoignages] = useState(false);
  const [temoignagesError, setTemoignagesError] = useState(false);
  const [pdfExportLoading, setPdfExportLoading] = useState(false);
  const [isPdfExporting, setIsPdfExporting] = useState(false);
  const [neededQuestionnaires, setNeededQuestionnaires] = useState([]);
  const [searchParams] = useSearchParams();
  const [userContext] = useContext(UserContext);

  const [questionnaires, loadingQuestionnaires, errorQuestionnaires] =
    useGet(`/api/questionnaires/`);

  const paramsCampagneIds = searchParams.has("campagneIds")
    ? searchParams.get("campagneIds").split(",")
    : [];

  useEffect(() => {
    if (selectedCampagnes.length) {
      const neededQuestionnaireIds = [
        ...new Set(selectedCampagnes.map((campagne) => campagne.questionnaireId)),
      ];

      const filteredQuestionnaires = questionnaires.filter((questionnaire) =>
        neededQuestionnaireIds.includes(questionnaire._id)
      );

      setNeededQuestionnaires(filteredQuestionnaires);
    }
  }, [selectedCampagnes]);

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
  }, [selectedCampagnes]);

  const filteredTemoignagesBySelectedCampagnes = temoignages?.length
    ? temoignages.filter((temoignage) =>
        selectedCampagnes.filter(
          (selectedCampagne) => selectedCampagne._id === temoignage.campagneId
        )
      )
    : [];

  const statistics = getStatistics(selectedCampagnes);

  const shouldDisplayResults =
    filteredTemoignagesBySelectedCampagnes.length &&
    neededQuestionnaires.length === 1 &&
    !loadingTemoignages;

  const shouldDisplayTabbedResults =
    filteredTemoignagesBySelectedCampagnes.length &&
    neededQuestionnaires.length >= 1 &&
    !loadingTemoignages;

  const handlePdfExport = async () => {
    setIsPdfExporting(true);
    setPdfExportLoading(true);
    setTimeout(async () => {
      await exportMultipleChartsToPdf(
        neededQuestionnaires[0].questionnaire,
        selectedCampagnes,
        statistics
      );
      setPdfExportLoading(false);
      setIsPdfExporting(false);
    }, 3000);
  };

  return (
    <Container>
      {userContext?.scope && (
        <p>
          Vous avez accès aux campagne pour <b>{OBSERVER_SCOPES_LABELS[userContext.scope.field]}</b>{" "}
          <b>{userContext.scope.value}</b>.
        </p>
      )}
      <ResultsCampagnesSelector
        selectedCampagnes={selectedCampagnes}
        setSelectedCampagnes={setSelectedCampagnes}
        paramsCampagneIds={paramsCampagneIds}
      />
      <Statistics statistics={statistics} title="Statistiques des campagnes sélectionnées" />
      <ResultsCampagneContainer>
        <TestimonialHeader>
          <h1>
            <span className={fr.cx("fr-icon-quote-fill")} aria-hidden={true} />
            Témoignages des campagnes sélectionnées
          </h1>
          <div>
            <Button
              priority="secondary"
              iconId="fr-icon-file-download-fill"
              onClick={handlePdfExport}
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
        {(loadingTemoignages || loadingQuestionnaires) && (
          <LoaderContainer>
            <BeatLoader
              color="var(--background-action-high-blue-france)"
              size={20}
              aria-label="Loading Spinner"
            />
          </LoaderContainer>
        )}
        {(temoignagesError || errorQuestionnaires) && !temoignages.length && !loadingTemoignages ? (
          <Alert
            title="Une erreur s'est produite dans le chargement des témoignages"
            description="Merci de réessayer ultérieurement"
            severity="error"
          />
        ) : null}
        {shouldDisplayTabbedResults ? (
          <MultipleQuestionnairesTabs
            neededQuestionnaires={neededQuestionnaires}
            selectedCampagnes={selectedCampagnes}
            temoignages={temoignages}
          />
        ) : null}
        {shouldDisplayResults && !isPdfExporting ? (
          <ResultsCampagnesVisualisation
            temoignages={filteredTemoignagesBySelectedCampagnes}
            questionnaire={neededQuestionnaires[0].questionnaire}
            questionnaireUI={neededQuestionnaires[0].questionnaireUI}
          />
        ) : null}
        {shouldDisplayResults && isPdfExporting ? (
          <ExportResultsCampagnesVisualisation
            temoignages={filteredTemoignagesBySelectedCampagnes}
            questionnaire={neededQuestionnaires[0].questionnaire}
            questionnaireUI={neededQuestionnaires[0].questionnaireUI}
          />
        ) : null}
      </ResultsCampagneContainer>
    </Container>
  );
};

export default ResultsCampagnesPage;
