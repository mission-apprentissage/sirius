import React, { useState } from "react";
import { Flex, Spinner, Box } from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { useGet } from "../common/hooks/httpHooks";
import ModerationTable from "./ModerationTable";

const styles = {
  control: (baseStyles) => ({
    ...baseStyles,
    backgroundColor: "purple.600!important",
    color: "white",
  }),
  placeholder: (baseStyles) => ({
    ...baseStyles,
    color: "white",
  }),
  dropdownIndicator: (baseStyles) => ({
    ...baseStyles,
    backgroundColor: "purple.600",
    color: "white",
  }),
  option: (baseStyles) => ({
    "&:hover": {
      backgroundColor: "white",
      color: "purple.600",
    },
    ...baseStyles,
    backgroundColor: "purple.600",
    color: "white",
  }),
  menuList: (baseStyles) => ({
    ...baseStyles,
    backgroundColor: "purple.600",
  }),
};

const Moderation = () => {
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null);
  const [selectedEtablissement, setSelectedEtablissement] = useState(null);
  const [etablissementList, setEtablissementList] = useState([]);
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [formationList, setFormationList] = useState([]);

  const [questionnaires, loadingQuestionnaires, errorQuestionnaires] =
    useGet(`/api/questionnaires/`);

  if (loadingQuestionnaires || errorQuestionnaires) return <Spinner />;

  const questionnaireOptions = questionnaires.map((questionnaire) => ({
    value: questionnaire._id,
    label: questionnaire.nom,
  }));

  return (
    <Flex direction="column" w="100%" m="auto">
      <Flex direction="column" w="100%" m="auto">
        <Flex direction="row" w="80%" m="auto" mt="10">
          <Box mr="30px" minW="33%">
            <Select
              id="questionnaire"
              name="questionnaire"
              variant="filled"
              size="lg"
              placeholder="Template de questionnaire"
              isSearchable
              isLoading={loadingQuestionnaires}
              isDisabled={loadingQuestionnaires || !!errorQuestionnaires}
              chakraStyles={styles}
              options={questionnaireOptions}
              onChange={({ value }) => {
                const questionnaire = questionnaires.find(
                  (etablissement) => etablissement._id === value
                );
                setSelectedQuestionnaire(questionnaire);
              }}
            />
          </Box>
          <Box mr="30px" minW="33%">
            <Select
              id="etablissement"
              name="etablissement"
              variant="filled"
              size="lg"
              placeholder="Établissement"
              isSearchable
              isDisabled={!selectedQuestionnaire || !etablissementList.length}
              chakraStyles={styles}
              options={etablissementList}
              onChange={({ value }) => setSelectedEtablissement(value)}
            />
          </Box>
          <Box mr="30px" minW="33%">
            <Select
              id="formation"
              name="formation"
              variant="filled"
              size="lg"
              placeholder="Formation"
              isSearchable
              isDisabled={!selectedQuestionnaire || !selectedEtablissement || !formationList.length}
              chakraStyles={styles}
              options={formationList}
              onChange={({ value }) => setSelectedFormation(value)}
              value={selectedFormation}
            />
          </Box>
        </Flex>
        {selectedQuestionnaire && (
          <ModerationTable
            questionnaireId={selectedQuestionnaire._id}
            setEtablissementList={setEtablissementList}
            selectedEtablissement={selectedEtablissement}
            setFormationList={setFormationList}
            selectedFormation={selectedFormation}
          />
        )}
      </Flex>
    </Flex>
  );
};

export default Moderation;
