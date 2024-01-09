import React, { useEffect, useState } from "react";
import { VStack, Spinner, Box, Text, HStack } from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";
import { useGet } from "../common/hooks/httpHooks";
import ModerationTable from "./Moderation/ModerationTable";
import ModerationStatistics from "./Moderation/ModerationStatistics";
import useFetchVerbatims from "../hooks/useFetchVerbatims";
import ModerationEtablissementPicker from "./Moderation/ModerationEtablissementPicker";

const ModerationPage = () => {
  const [questionnaireIds, setQuestionnaireIds] = useState([]);
  const [displayedVerbatims, setDisplayedVerbatims] = useState([]);
  const [etablissements, setEtablissements] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const [questionnaires, loadingQuestionnaires, errorQuestionnaires] =
    useGet(`/api/questionnaires/`);

  useEffect(() => {
    if (!loadingQuestionnaires && !errorQuestionnaires && questionnaires?.length) {
      const questionnaireIds = questionnaires.map((questionnaire) => questionnaire._id);
      setQuestionnaireIds(questionnaireIds);
    }
  }, [questionnaires, loadingQuestionnaires, errorQuestionnaires]);

  const [verbatims, loadingVerbatims, errorVerbatims] = useFetchVerbatims(questionnaireIds);

  useEffect(() => {
    if (!loadingVerbatims && !errorVerbatims && verbatims?.length) {
      const etablissements = verbatims.map((verbatim) => ({
        label: verbatim.etablissement,
        value: verbatim.etablissementSiret,
      }));
      const deduplicatedEtablissements = etablissements.filter(
        (etablissement, index, self) =>
          index === self.findIndex((t) => t.value === etablissement.value)
      );

      setDisplayedVerbatims(verbatims);
      setEtablissements(deduplicatedEtablissements);
    }
  }, [verbatims]);

  useEffect(() => {
    const etablissementSiret = searchParams.get("etablissement");
    if (verbatims && etablissementSiret && etablissementSiret !== "all") {
      const filteredVerbatims = verbatims.filter(
        (verbatim) => verbatim.etablissementSiret === etablissementSiret
      );
      setDisplayedVerbatims(filteredVerbatims);
    } else if (verbatims && etablissementSiret === "all") {
      setDisplayedVerbatims(verbatims);
    }
  }, [searchParams, verbatims]);

  if (loadingQuestionnaires || errorQuestionnaires || loadingVerbatims || errorVerbatims)
    return <Spinner />;

  return (
    <VStack my="5" w="100%">
      <Box w="100%" my="5">
        <Text fontSize="5xl" fontWeight="600" color="brand.blue.700">
          Modération des verbatims
        </Text>
      </Box>
      <ModerationStatistics verbatims={displayedVerbatims} />
      <HStack w="100%" my="5">
        <ModerationEtablissementPicker etablissements={etablissements} />
      </HStack>
      <ModerationTable verbatims={displayedVerbatims} />
    </VStack>
  );
};

export default ModerationPage;
