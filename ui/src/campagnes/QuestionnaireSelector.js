import React, { useState, useEffect } from "react";
import { Select } from "chakra-react-select";
import { useGet } from "../common/hooks/httpHooks";

const QuestionnaireSelector = ({ questionnaireSetter }) => {
  const [questionnaires, loadingQuestionnaires, errorQuestionnaires] =
    useGet(`/api/questionnaires/`);
  const [allQuestionnaires, setAllQuestionnaires] = useState([]);

  useEffect(() => {
    if (questionnaires) {
      setAllQuestionnaires(questionnaires);
    }
  }, [questionnaires]);

  return (
    <Select
      id="questionnaireId"
      name="questionnaireId"
      variant="filled"
      placeholder="Questionnaires"
      isSearchable
      isLoading={loadingQuestionnaires}
      isDisabled={!!errorQuestionnaires}
      options={
        allQuestionnaires.length > 0 &&
        allQuestionnaires.map((questionnaire) => ({
          value: questionnaire._id,
          label: questionnaire.nom,
        }))
      }
      onChange={({ value }) => questionnaireSetter("questionnaireId", value)}
    />
  );
};

export default QuestionnaireSelector;
