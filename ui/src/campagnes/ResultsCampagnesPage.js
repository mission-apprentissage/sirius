import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";
import { fr } from "@codegouvfr/react-dsfr";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import { Tabs } from "@codegouvfr/react-dsfr/Tabs";
import {
  Container,
  ResultsCampagneContainer,
  TestimonialHeader,
} from "./styles/resultsCampagnes.style";
import { LoaderContainer } from "./styles/shared.style";
import Statistics from "./Shared/Statistics/Statistics";
import ResultsCampagnesVisualisation from "./ResultsCampagnes/ResultsCampagnesVisualisation";
import { exportMultipleChartsToPdf } from "./pdfExport";
import ExportResultsCampagnesVisualisation from "./ResultsCampagnes/ExportResultsCampagnesVisualisation";
import CampagnesSelector from "./Shared/CampagnesSelector/CampagnesSelector";
import useFetchTemoignagesDatavisualisation from "../hooks/useFetchTemoignagesDatavisualisation";
import useFetchCampagnesStatistics from "../hooks/useFetchCampagnesStatistics";
import useFetchCampagnesByBatch from "../hooks/useFetchCampagnesByBatch";
import { CAMPAGNE_TABLE_TYPES } from "../constants";
import { delay, isPlural } from "./utils";

const MultipleQuestionnairesTabs = ({
  temoignages,
  setCurrentDatavisualisationQuestionnaireId,
}) => {
  const tabs = temoignages.map((questionnaire, index) => {
    return {
      label: `Questionnaire version ${index + 1} (${
        questionnaire.temoignageCount
      } répondant·e${isPlural(questionnaire.temoignageCount)})`,
      content: <ResultsCampagnesVisualisation temoignages={questionnaire} />,
      id: questionnaire.questionnaireId,
    };
  });

  return (
    <Tabs tabs={tabs} onTabChange={(e) => setCurrentDatavisualisationQuestionnaireId(e.tab.id)} />
  );
};

const ResultsCampagnesPage = () => {
  const [selectedCampagneIds, setSelectedCampagneIds] = useState([]);
  const [pdfExportLoading, setPdfExportLoading] = useState(false);
  const [currentDatavisualisationQuestionnaireId, setCurrentDatavisualisationQuestionnaireId] =
    useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const paramsCampagneIds = searchParams.has("campagneIds")
    ? searchParams.get("campagneIds").split(",")
    : [];

  const {
    mutate: mutateCampagnesDatavisualisation,
    datavisualisation,
    isSuccess: isSuccessCampagnesDatavisualisation,
    isLoading: isLoadingCampagnesDatavisualisation,
    isError: isErrorCampagnesDatavisualisation,
    isIdle: isIdleCampagnesDatavisualisation,
  } = useFetchTemoignagesDatavisualisation();

  const { mutate: mutateCampagnesStatistics, statistics } = useFetchCampagnesStatistics();
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

  const shouldDisplayResults =
    isSuccessCampagnesDatavisualisation && datavisualisation.length === 1;

  const shouldDisplayTabbedResults =
    isSuccessCampagnesDatavisualisation && datavisualisation.length > 1;

  const handlePdfExport = async () => {
    setPdfExportLoading(true);
    await delay(1000);

    const currentQuestionnaireCategories = datavisualisation?.find(
      (questionnaire) => questionnaire.questionnaireId === currentDatavisualisationQuestionnaireId
    ).categories;

    const selectedCampagnes = campagnes.filter((campagne) =>
      selectedCampagneIds.includes(campagne._id)
    );

    const filteredCampagnesByQuestionnaireId = selectedCampagnes.filter(
      (campagne) => campagne.questionnaireId === currentDatavisualisationQuestionnaireId
    );

    await exportMultipleChartsToPdf(
      currentQuestionnaireCategories,
      filteredCampagnesByQuestionnaireId,
      statistics
    );
    setPdfExportLoading(false);
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
              disabled={pdfExportLoading || isLoadingCampagnesBatch || !selectedCampagneIds.length}
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
        {isLoadingCampagnesDatavisualisation && (
          <LoaderContainer>
            <BeatLoader
              color="var(--background-action-high-blue-france)"
              size={20}
              aria-label="Loading Spinner"
            />
          </LoaderContainer>
        )}
        {isErrorCampagnesDatavisualisation ? (
          <Alert
            title="Une erreur s'est produite dans le chargement des témoignages"
            description="Merci de réessayer ultérieurement"
            severity="error"
          />
        ) : null}
        {!datavisualisation &&
          !isErrorCampagnesDatavisualisation &&
          !isLoadingCampagnesDatavisualisation &&
          isIdleCampagnesDatavisualisation && (
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
        {shouldDisplayResults && !pdfExportLoading ? (
          <ResultsCampagnesVisualisation temoignages={datavisualisation[0]} />
        ) : null}
        {pdfExportLoading ? (
          <ExportResultsCampagnesVisualisation
            temoignages={datavisualisation.find(
              (questionnaire) =>
                questionnaire.questionnaireId === currentDatavisualisationQuestionnaireId
            )}
          />
        ) : null}
      </ResultsCampagneContainer>
    </Container>
  );
};

export default ResultsCampagnesPage;
