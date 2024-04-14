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
import useFetchCampagnesDatavisualisation from "../hooks/useFetchCampagnesDatavisualisation";
import useFetchCampagnesStatistics from "../hooks/useFetchCampagnesStatistics";
import useFetchCampagnesByBatch from "../hooks/useFetchCampagnesByBatch";

const MultipleQuestionnairesTabs = ({
  temoignages,
  setCurrentDatavisualisationQuestionnaireId,
}) => {
  const tabs = temoignages.map((questionnaire, index) => {
    return {
      label: `Questionnaire version ${index + 1}`,
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
  const [searchParams] = useSearchParams();

  const { campagnes, isLoading } = useFetchCampagnesByBatch({
    campagneIds: selectedCampagneIds,
  });

  const paramsCampagneIds = searchParams.has("campagneIds")
    ? searchParams.get("campagneIds").split(",")
    : [];

  const {
    mutate: mutateCampagnesDatavisualisation,
    datavisualisation,
    isSuccess: isSuccessCampagnesDatavisualisation,
    isLoading: isLoadingCampagnesDatavisualisation,
    isError: isErrorCampagnesDatavisualisation,
  } = useFetchCampagnesDatavisualisation();

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

  useEffect(() => {
    if (paramsCampagneIds?.length && !selectedCampagneIds.length) {
      setSelectedCampagneIds(paramsCampagneIds);
    }
  }, [paramsCampagneIds]);

  const shouldDisplayResults =
    isSuccessCampagnesDatavisualisation && datavisualisation.length === 1;

  const shouldDisplayTabbedResults =
    isSuccessCampagnesDatavisualisation && datavisualisation.length > 1;

  const handlePdfExport = async () => {
    setPdfExportLoading(true);

    const currentQuestionnaireCategories = datavisualisation?.find(
      (questionnaire) => questionnaire.questionnaireId === currentDatavisualisationQuestionnaireId
    ).categories;

    const filteredCampagnesByQuestionnaireId = campagnes.filter(
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
          campagneTableType="RESULTS"
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
            >
              {pdfExportLoading || isLoading ? (
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
