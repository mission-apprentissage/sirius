import React, { useEffect, useState, useContext } from "react";
import { VStack, Spinner, Box, Text, HStack } from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";
import { useGet } from "../common/hooks/httpHooks";
import ModerationTable from "./Moderation/ModerationTable";
import ModerationStatistics from "./Moderation/ModerationStatistics";
import useFetchVerbatims from "../hooks/useFetchVerbatims";
import ModerationEtablissementPicker from "./Moderation/ModerationEtablissementPicker";
import ModerationFormationPicker from "./Moderation/ModerationFormationPicker";
import ModerationQuestionPicker from "./Moderation/ModerationQuestionPicker";
import ModerationFilters from "./Moderation/ModerationFilters";
import ModerationGroupedAction from "./Moderation/ModerationGroupedAction";
import { UserContext } from "../context/UserContext";

const ModerationPage = () => {
  const [questionnaireIds, setQuestionnaireIds] = useState([]);
  const [displayedVerbatims, setDisplayedVerbatims] = useState([]);
  const [etablissements, setEtablissements] = useState([]);
  const [formations, setFormations] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedVerbatims, setSelectedVerbatims] = useState([]);
  const [userContext] = useContext(UserContext);
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedEtablissement = searchParams.get("etablissement");
  const selectedFormation = searchParams.get("formation");
  const selectedQuestion = searchParams.get("question");

  const [questionnaires, loadingQuestionnaires, errorQuestionnaires] =
    useGet(`/api/questionnaires/`);
  const [verbatims, loadingVerbatims, errorVerbatims] = useFetchVerbatims(
    questionnaireIds,
    shouldRefresh
  );

  useEffect(() => {
    if (questionnaires?.length) {
      const questionnaireIds = questionnaires.map((questionnaire) => questionnaire._id);
      setQuestionnaireIds(questionnaireIds);
    }
  }, [questionnaires]);

  useEffect(() => {
    if (verbatims?.length) {
      const orderedVerbatims = verbatims.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);

        return dateB - dateA;
      });
      setDisplayedVerbatims(orderedVerbatims);
    }
  }, [verbatims]);

  useEffect(() => {
    if (verbatims?.length) {
      const etablissements = verbatims.map((verbatim) => ({
        label: verbatim.etablissement,
        value: verbatim.etablissementSiret,
      }));

      const deduplicatedEtablissements = etablissements.filter(
        (etablissement, index, self) =>
          index === self.findIndex((t) => t.value === etablissement.value)
      );

      setEtablissements(deduplicatedEtablissements);
    }
  }, [verbatims]);

  useEffect(() => {
    if (verbatims?.length && selectedEtablissement && selectedEtablissement !== "all") {
      const formationsByFilteredVerbatims = verbatims
        .filter((verbatim) => verbatim.etablissementSiret === selectedEtablissement)
        .map((verbatim) => ({
          label: verbatim.formation,
          value: verbatim.formationId,
        }));

      const deduplicatedFormations = formationsByFilteredVerbatims.filter(
        (formation, index, self) => index === self.findIndex((t) => t.value === formation.value)
      );

      setFormations(deduplicatedFormations);
    }
  }, [selectedEtablissement, verbatims]);

  useEffect(() => {
    if (verbatims?.length) {
      const questionsByFilteredVerbatims = verbatims.map((verbatim) => ({
        label: verbatim.title,
        value: verbatim.key,
      }));

      const deduplicatedQuestions = questionsByFilteredVerbatims.filter(
        (question, index, self) => index === self.findIndex((t) => t.value === question.value)
      );

      setQuestions(deduplicatedQuestions);
    }
  }, [verbatims]);

  useEffect(() => {
    let filteredVerbatims = verbatims;

    if (verbatims) {
      if (selectedEtablissement && selectedEtablissement !== "all") {
        filteredVerbatims = filteredVerbatims.filter(
          (verbatim) => verbatim.etablissementSiret === selectedEtablissement
        );
      }

      if (selectedFormation && selectedFormation !== "all") {
        filteredVerbatims = filteredVerbatims.filter(
          (verbatim) => verbatim.formationId === selectedFormation
        );
      }

      if (selectedQuestion && selectedQuestion !== "all") {
        filteredVerbatims = filteredVerbatims.filter(
          (verbatim) => verbatim.key === selectedQuestion
        );
      }

      setDisplayedVerbatims(filteredVerbatims);
    }
  }, [searchParams, verbatims]);

  useEffect(() => {
    if (shouldRefresh) {
      setShouldRefresh(false);
    }
  }, [shouldRefresh]);

  if (loadingQuestionnaires || errorQuestionnaires || loadingVerbatims || errorVerbatims)
    return <Spinner />;

  const hasSelectedEtablissement = selectedEtablissement && selectedEtablissement !== "all";

  return (
    <VStack my="5" w="100%" alignItems="flex-start">
      <Box w="100%" my="5">
        <Text fontSize="5xl" fontWeight="600" color="brand.blue.700">
          Modération des verbatims
        </Text>
      </Box>
      <ModerationStatistics verbatims={displayedVerbatims} />
      <Box w="100%" my="5">
        <Text fontSize="2xl" fontWeight="600" color="brand.blue.700">
          Filtres{" "}
          <Text
            as="span"
            fontSize="xs"
            color="black"
            fontWeight="300"
            cursor="pointer"
            onClick={() => {
              setSearchParams({
                etablissement: "all",
                formation: "all",
                question: "all",
              });
              setDisplayedVerbatims(verbatims);
            }}
          >
            Réinitialiser
          </Text>
        </Text>
      </Box>
      <HStack w="100%" mt="5" mb="2">
        <Box w={hasSelectedEtablissement ? "33%" : "50%"}>
          <ModerationEtablissementPicker etablissements={etablissements} />
        </Box>
        {hasSelectedEtablissement && (
          <Box w="33%">
            <ModerationFormationPicker formations={formations} />
          </Box>
        )}
        <Box w={hasSelectedEtablissement ? "33%" : "50%"}>
          <ModerationQuestionPicker questions={questions} />
        </Box>
      </HStack>
      <HStack w="100%" mb="2">
        <Box w="max-content">
          <ModerationFilters
            verbatims={verbatims}
            displayedVerbatims={displayedVerbatims}
            setDisplayedVerbatims={setDisplayedVerbatims}
            currentFilters={{ selectedEtablissement, selectedFormation, selectedQuestion }}
          />
        </Box>
        <Box w="max-content" minW="200px">
          <ModerationGroupedAction
            verbatims={displayedVerbatims}
            selectedVerbatims={selectedVerbatims}
            setSelectedVerbatims={setSelectedVerbatims}
            setShouldRefresh={setShouldRefresh}
            userContext={userContext}
          />
        </Box>
      </HStack>
      <Box w="100%" my="5">
        <Text fontSize="2xl" fontWeight="600" color="brand.blue.700">
          Verbatims
        </Text>
      </Box>
      <ModerationTable
        verbatims={displayedVerbatims}
        selectedVerbatims={selectedVerbatims}
        setSelectedVerbatims={setSelectedVerbatims}
        userContext={userContext}
      />
    </VStack>
  );
};

export default ModerationPage;
