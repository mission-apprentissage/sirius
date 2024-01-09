import React, { useEffect, useState } from "react";
import { VStack, Spinner, Box, Text, HStack } from "@chakra-ui/react";
import { useGet } from "../common/hooks/httpHooks";
import ModerationTable from "./Moderation/ModerationTable";
import ModerationStatistics from "./Moderation/ModerationStatistics";
import useFetchVerbatims from "../hooks/useFetchVerbatims";

const ModerationPage = () => {
  const [questionnaireIds, setQuestionnaireIds] = useState([]);
  const [displayedVerbatims, setDisplayedVerbatims] = useState([]);

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
      setDisplayedVerbatims(verbatims);
    }
  }, [verbatims]);

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
      <HStack w="100%" my="5"></HStack>
      <ModerationTable verbatims={displayedVerbatims} />
    </VStack>
  );
};

export default ModerationPage;
