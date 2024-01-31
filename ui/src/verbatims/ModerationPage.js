import React, { useEffect, useState, useContext } from "react";
import { VStack, Spinner, Box, Text, HStack } from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";
import ModerationTable from "./Moderation/ModerationTable";
import ModerationStatistics from "./Moderation/ModerationStatistics";
import useFetchVerbatims from "../hooks/useFetchVerbatims";
import ModerationEtablissementPicker from "./Moderation/ModerationEtablissementPicker";
import ModerationFormationPicker from "./Moderation/ModerationFormationPicker";
import ModerationQuestionPicker from "./Moderation/ModerationQuestionPicker";
import ModerationFilters from "./Moderation/ModerationFilters";
import ModerationGroupedAction from "./Moderation/ModerationGroupedAction";
import { UserContext } from "../context/UserContext";
import ModerationPagination from "./Moderation/ModerationPagination";

const PAGE_SIZE = 100;

const ModerationPage = () => {
  const [displayedVerbatims, setDisplayedVerbatims] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedVerbatims, setSelectedVerbatims] = useState([]);
  const [userContext] = useContext(UserContext);
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const [pickedEtablissementFormationIds, setPickedEtablissementFormationIds] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedEtablissement = searchParams.get("etablissement");
  const selectedFormation = searchParams.get("formation");
  const selectedQuestion = searchParams.get("question");
  const page = searchParams.get("page") ? parseInt(searchParams.get("page")) : 1;
  const selectedStatus = searchParams.get("selectedStatus");

  const hasSelectedEtablissement = selectedEtablissement && selectedEtablissement !== "all";
  const hasSelectedFormation = selectedFormation && selectedFormation !== "all";
  const hasSelectedQuestion = selectedQuestion && selectedQuestion !== "all";
  const hasSelectedStatus = selectedStatus && selectedStatus !== "all";

  const etablissementVerbatimsQuery = hasSelectedEtablissement
    ? `?etablissementSiret=${selectedEtablissement}`
    : "";

  const formationVerbatimsQuery = hasSelectedFormation ? `&formationId=${selectedFormation}` : "";

  const questionVerbatimsQuery = hasSelectedQuestion
    ? `${hasSelectedEtablissement ? "&" : "?"}question=${selectedQuestion}`
    : "";

  const statusVerbatimsQuery = hasSelectedStatus
    ? `${
        etablissementVerbatimsQuery || formationVerbatimsQuery || questionVerbatimsQuery ? "&" : "?"
      }selectedStatus=${selectedStatus}`
    : "";

  const paginationQuery =
    hasSelectedEtablissement || hasSelectedQuestion || hasSelectedStatus
      ? `&page=${page}`
      : `?page=${page}`;

  const finalQuery = `${etablissementVerbatimsQuery || ""}${formationVerbatimsQuery || ""}${
    questionVerbatimsQuery || ""
  }${statusVerbatimsQuery || ""}${paginationQuery}`;

  const [verbatims, count, loadingVerbatims, errorVerbatims] = useFetchVerbatims(
    finalQuery,
    shouldRefresh
  );

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
    if (shouldRefresh) {
      setShouldRefresh(false);
    }
  }, [shouldRefresh]);

  if (loadingVerbatims || errorVerbatims) return <Spinner />;

  return (
    <VStack my="5" w="100%" alignItems="flex-start">
      <Box w="100%" my="5">
        <Text fontSize="5xl" fontWeight="600" color="brand.blue.700">
          Modération des verbatims
        </Text>
      </Box>
      <ModerationStatistics count={count} />
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
          <ModerationEtablissementPicker
            setPickedEtablissementFormationIds={setPickedEtablissementFormationIds}
          />
        </Box>
        {hasSelectedEtablissement && (
          <Box w="33%">
            <ModerationFormationPicker
              pickedEtablissementFormationIds={pickedEtablissementFormationIds}
            />
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
      <ModerationPagination page={page} PAGE_SIZE={PAGE_SIZE} totalCount={count.totalCount} />
      <ModerationTable
        verbatims={displayedVerbatims}
        selectedVerbatims={selectedVerbatims}
        setSelectedVerbatims={setSelectedVerbatims}
        userContext={userContext}
      />
      <ModerationPagination page={page} PAGE_SIZE={PAGE_SIZE} totalCount={count.totalCount} />
    </VStack>
  );
};

export default ModerationPage;
