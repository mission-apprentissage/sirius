import React, { useEffect, useState } from "react";
import { VStack, Spinner, Box, Text, HStack } from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";
import { useGet } from "../common/hooks/httpHooks";
import ModerationTable from "./Moderation/ModerationTable";
import ModerationStatistics from "./Moderation/ModerationStatistics";
import useFetchVerbatims from "../hooks/useFetchVerbatims";
import ModerationEtablissementPicker from "./Moderation/ModerationEtablissementPicker";
import ModerationFormationPicker from "./Moderation/ModerationFormationPicker";

const ModerationPage = () => {
  const [questionnaireIds, setQuestionnaireIds] = useState([]);
  const [displayedVerbatims, setDisplayedVerbatims] = useState([]);
  const [etablissements, setEtablissements] = useState([]);
  const [formations, setFormations] = useState([]);
  const [searchParams] = useSearchParams();

  const selectedEtablissement = searchParams.get("etablissement");
  const selectedFormation = searchParams.get("formation");

  const [questionnaires, loadingQuestionnaires, errorQuestionnaires] =
    useGet(`/api/questionnaires/`);
  const [verbatims, loadingVerbatims, errorVerbatims] = useFetchVerbatims(questionnaireIds);

  useEffect(() => {
    if (questionnaires?.length) {
      const questionnaireIds = questionnaires.map((questionnaire) => questionnaire._id);
      setQuestionnaireIds(questionnaireIds);
    }
  }, [questionnaires]);

  useEffect(() => {
    if (verbatims?.length) {
      setDisplayedVerbatims(verbatims);
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

      setDisplayedVerbatims(filteredVerbatims);
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
        {selectedEtablissement && selectedEtablissement !== "all" && (
          <ModerationFormationPicker formations={formations} />
        )}
      </HStack>
      <ModerationTable verbatims={displayedVerbatims} />
    </VStack>
  );
};

export default ModerationPage;
