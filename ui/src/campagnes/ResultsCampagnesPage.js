/* eslint-disable no-undef */
import { fr } from "@codegouvfr/react-dsfr";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Tabs } from "@codegouvfr/react-dsfr/Tabs";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";

import { CAMPAGNE_TABLE_TYPES } from "../constants";
import useFetchCampagnesByBatch from "../hooks/useFetchCampagnesByBatch";
import useFetchCampagnesStatistics from "../hooks/useFetchCampagnesStatistics";
import useFetchTemoignagesDatavisualisation from "../hooks/useFetchTemoignagesDatavisualisation";
import useFetchTemoignagesXlsExport from "../hooks/useFetchTemoignagesXlsExport";
import { exportMultipleChartsToPdf } from "./pdfExport";
import ExportResultsCampagnesVisualisation from "./ResultsCampagnes/ExportResultsCampagnesVisualisation";
import ResultsCampagnesVisualisation from "./ResultsCampagnes/ResultsCampagnesVisualisation";
import CampagnesSelector from "./Shared/CampagnesSelector/CampagnesSelector";
import Statistics from "./Shared/Statistics/Statistics";
import { Container, ResultsCampagneContainer, TestimonialHeader } from "./styles/resultsCampagnes.style";
import { LoaderContainer } from "./styles/shared.style";
import { delay, isPlural } from "./utils";

const MultipleQuestionnairesTabs = ({ temoignages, setCurrentDatavisualisationQuestionnaireId }) => {
  const tabs = temoignages.map((questionnaire) => {
    return {
      label: `${questionnaire.questionnaireName} (${
        questionnaire.temoignageCount
      } répondant·e${isPlural(questionnaire.temoignageCount)})`,
      content: <ResultsCampagnesVisualisation temoignages={questionnaire} />,
      id: questionnaire.questionnaireId,
    };
  });

  return <Tabs tabs={tabs} onTabChange={(e) => setCurrentDatavisualisationQuestionnaireId(e.tab.id)} />;
};

const ResultsCampagnesPage = () => {
  const [selectedCampagneIds, setSelectedCampagneIds] = useState([]);
  const [pdfExportLoading, setPdfExportLoading] = useState(false);
  const [xlsExportLoading, setXlsExportLoading] = useState(false);

  const [currentDatavisualisationQuestionnaireId, setCurrentDatavisualisationQuestionnaireId] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const paramsCampagneIds = searchParams.has("campagneIds") ? searchParams.get("campagneIds").split(",") : [];

  const {
    mutate: mutateCampagnesDatavisualisation,
    datavisualisation,
    isSuccess: isSuccessCampagnesDatavisualisation,
    isLoading: isLoadingCampagnesDatavisualisation,
    isError: isErrorCampagnesDatavisualisation,
    isIdle: isIdleCampagnesDatavisualisation,
  } = useFetchTemoignagesDatavisualisation();

  const { mutate: mutateCampagnesStatistics, statistics } = useFetchCampagnesStatistics();

  const {
    mutate: mutateFetchTemoignagesXlsExport,
    temoignagesXlsExport,
    isSuccess: isSuccessFetchTemoignagesXlsExport,
  } = useFetchTemoignagesXlsExport();

  useEffect(() => {
    if (selectedCampagneIds.length) {
      mutateCampagnesDatavisualisation(selectedCampagneIds);
      mutateCampagnesStatistics(selectedCampagneIds);
    }
  }, [selectedCampagneIds]);

  useEffect(() => {
    if (!currentDatavisualisationQuestionnaireId && datavisualisation?.length > 0) {
      setCurrentDatavisualisationQuestionnaireId(datavisualisation[0].questionnaireId);
    }
  }, [datavisualisation]);

  useEffect(() => {
    const downloadFile = async () => {
      const url = window.URL.createObjectURL(temoignagesXlsExport);
      const a = document.createElement("a");
      a.href = url;
      a.download = "sirius_export_reponses_brut.xlsx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      setXlsExportLoading(false);
    };

    if (isSuccessFetchTemoignagesXlsExport) {
      downloadFile();
    }
  }, [isSuccessFetchTemoignagesXlsExport]);

  const { campagnes, isLoading: isLoadingCampagnesBatch } = useFetchCampagnesByBatch({
    campagneIds: selectedCampagneIds,
    enabled: selectedCampagneIds?.length > 0 && statistics && datavisualisation?.length,
  });

  useEffect(() => {
    if (paramsCampagneIds?.length && !selectedCampagneIds.length) {
      setSelectedCampagneIds(paramsCampagneIds);
      setSearchParams({});
    }
  }, [paramsCampagneIds]);

  const shouldDisplayResults = isSuccessCampagnesDatavisualisation && datavisualisation.length === 1;

  const shouldDisplayTabbedResults = isSuccessCampagnesDatavisualisation && datavisualisation.length > 1;

  const handlePdfExport = async () => {
    setPdfExportLoading(true);
    await delay(1000);

    const currentQuestionnaireCategories = datavisualisation?.find(
      (questionnaire) => questionnaire.questionnaireId === currentDatavisualisationQuestionnaireId
    ).categories;

    const selectedCampagnes = campagnes.filter((campagne) => selectedCampagneIds.includes(campagne.id));

    const filteredCampagnesByQuestionnaireId = selectedCampagnes.filter(
      (campagne) => campagne.questionnaireId === currentDatavisualisationQuestionnaireId
    );

    await exportMultipleChartsToPdf(currentQuestionnaireCategories, filteredCampagnesByQuestionnaireId, statistics);
    setPdfExportLoading(false);
  };

  const hasNoTemoignages =
    (!datavisualisation?.length &&
      !isErrorCampagnesDatavisualisation &&
      !isLoadingCampagnesDatavisualisation &&
      !isIdleCampagnesDatavisualisation) ||
    !selectedCampagneIds.length;

  const emptyStatistics = {
    campagnesCount: 0,
    finishedCampagnesCount: 0,
    temoignagesCount: 0,
    verbatimsCount: 0,
  };

  return (
    <Container>
      <ResultsCampagneContainer>
        <h1>
          <span className={fr.cx("fr-icon-settings-5-fill")} aria-hidden={true} />
          Sélectionner les campagnes à visualiser
        </h1>
        <CampagnesSelector
          selectedCampagneIds={selectedCampagneIds}
          setSelectedCampagneIds={setSelectedCampagneIds}
          paramsCampagneIds={paramsCampagneIds}
          campagneTableType={CAMPAGNE_TABLE_TYPES.RESULTS}
        />
      </ResultsCampagneContainer>
      <Statistics statistics={statistics || emptyStatistics} title="Statistiques des campagnes sélectionnées" />
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
              disabled={
                pdfExportLoading ||
                xlsExportLoading ||
                isLoadingCampagnesBatch ||
                isLoadingCampagnesDatavisualisation ||
                !selectedCampagneIds.length ||
                hasNoTemoignages
              }
            >
              {pdfExportLoading ? (
                <BeatLoader color="var(--background-action-high-blue-france)" size={10} aria-label="Loading Spinner" />
              ) : (
                "Exporter en PDF"
              )}
            </Button>
            <Button
              priority="secondary"
              iconId="fr-icon-file-download-fill"
              onClick={() => {
                setXlsExportLoading(true);
                mutateFetchTemoignagesXlsExport(selectedCampagneIds);
              }}
              disabled={
                pdfExportLoading ||
                xlsExportLoading ||
                isLoadingCampagnesBatch ||
                isLoadingCampagnesDatavisualisation ||
                !selectedCampagneIds.length ||
                hasNoTemoignages
              }
            >
              {xlsExportLoading ? (
                <BeatLoader color="var(--background-action-high-blue-france)" size={10} aria-label="Loading Spinner" />
              ) : (
                "Exporter en XLS"
              )}
            </Button>
          </div>
        </TestimonialHeader>
        {isLoadingCampagnesDatavisualisation && (
          <LoaderContainer>
            <BeatLoader color="var(--background-action-high-blue-france)" size={20} aria-label="Loading Spinner" />
          </LoaderContainer>
        )}
        {isErrorCampagnesDatavisualisation ? (
          <Alert
            title="Une erreur s'est produite dans le chargement des témoignages"
            description="Merci de réessayer ultérieurement"
            severity="error"
          />
        ) : null}
        {hasNoTemoignages && (
          <Alert
            title="Aucun témoignage n'est disponible pour les campagnes sélectionnées"
            description="Merci de sélectionner d'autres campagnes"
            severity="info"
          />
        )}
        {shouldDisplayTabbedResults && !pdfExportLoading ? (
          <MultipleQuestionnairesTabs
            temoignages={datavisualisation}
            setCurrentDatavisualisationQuestionnaireId={setCurrentDatavisualisationQuestionnaireId}
          />
        ) : null}
        {shouldDisplayResults && !pdfExportLoading && !hasNoTemoignages ? (
          <ResultsCampagnesVisualisation temoignages={datavisualisation[0]} />
        ) : null}
        {pdfExportLoading ? (
          <ExportResultsCampagnesVisualisation
            temoignages={datavisualisation.find(
              (questionnaire) => questionnaire.questionnaireId === currentDatavisualisationQuestionnaireId
            )}
          />
        ) : null}
      </ResultsCampagneContainer>
    </Container>
  );
};

export default ResultsCampagnesPage;
