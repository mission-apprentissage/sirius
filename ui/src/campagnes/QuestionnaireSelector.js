import React, { useState, useEffect } from "react";
import { Select } from "chakra-react-select";
import { useGet } from "../common/hooks/httpHooks";

const QuestionnaireSelector = ({ questionnaireSetter, questionnaireId = null }) => {
  const [questionnaires, loadingQuestionnaires, errorQuestionnaires] =
    useGet(`/api/questionnaires/`);
  const [allQuestionnaires, setAllQuestionnaires] = useState([]);

  useEffect(() => {
    if (questionnaires) {
      setAllQuestionnaires(questionnaires);
    }
  }, [questionnaires]);

  if (!allQuestionnaires.length) return null;

  return (
    <Select
      id="questionnaireId"
      name="questionnaireId"
      variant="filled"
      placeholder="Questionnaires"
      isSearchable
      isLoading={loadingQuestionnaires}
      isDisabled={!!errorQuestionnaires}
      value={{
        value: questionnaireId,
        label: allQuestionnaires.find((q) => q._id === questionnaireId)?.nom,
      }}
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
