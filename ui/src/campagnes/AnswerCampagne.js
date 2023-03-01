import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import validator from "@rjsf/validator-ajv8";
import Form from "@rjsf/chakra-ui";
import { useGet } from "../common/hooks/httpHooks";
import { Spinner, useToast } from "@chakra-ui/react";
import { _post } from "../utils/httpClient";
import CustomCheckboxes from "../Components/Form/CustomCheckboxes";
import CustomRadios from "../Components/Form/CustomRadios";
import CustomText from "../Components/Form/CustomText";
import CustomTextarea from "../Components/Form/CustomTextarea";

const widgets = {
  CheckboxesWidget: CustomCheckboxes,
  RadioWidget: CustomRadios,
  TextWidget: CustomText,
  TextareaWidget: CustomTextarea,
};

const multiStepQuestionnaireFormatter = (questionnaire) => {
  return Object.entries(questionnaire.properties).map((property) => {
    const [key] = property;

    // format questions for each categories
    const nestedProperties = Object.entries(questionnaire.properties[key].properties).map((property) => {
      const [nestedKey, nestedValue] = property;
      return {
        type: "object",
        properties: {
          [nestedKey]: {
            ...nestedValue,
          },
        },
        dependencies: {
          [nestedKey]: questionnaire.properties.Cfa.dependencies[nestedKey],
        },
        required: questionnaire.properties.Cfa.required.indexOf(nestedKey) !== -1 ? [nestedKey] : [],
      };
    });
    // format category and returns them with formatted questions
    return {
      type: "object",
      properties: [...nestedProperties],
      dependencies:
        Object.entries(questionnaire.dependencies).indexOf(key) !== -1
          ? {
              [key]: [questionnaire.dependencies[key]],
            }
          : {},
      required: questionnaire.required.indexOf(key) !== -1 ? [key] : [],
    };
  });
};

const multiStepQuestionnaireUIFormatter = (questionnaireUI) => {
  const categories = Object.entries(questionnaireUI).map((category) => {
    const [key, value] = category;
    return value;
  });

  return categories;
};

const AnswerCampagne = () => {
  const { id } = useParams();
  const history = useHistory();
  const [campagne, loading] = useGet(`/api/campagnes/${id}`);
  const toast = useToast();
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [formattedQuestionnnaire, setFormattedQuestionnnaire] = useState([]);
  const [formattedQuestionnnaireUI, setFormattedQuestionnnaireUI] = useState([]);
  const [answers, setAnswers] = useState({});

  const isLastCategory = formattedQuestionnnaire.length
    ? currentCategoryIndex === formattedQuestionnnaire.length - 1
    : false;
  const isLastQuestionInCategory = formattedQuestionnnaire.length
    ? currentQuestionIndex === formattedQuestionnnaire[currentCategoryIndex].properties.length - 1
    : false;

  useEffect(() => {
    if (campagne.questionnaire) {
      setFormattedQuestionnnaire(multiStepQuestionnaireFormatter(campagne.questionnaire));
    }
    if (campagne.questionnaireUI) {
      setFormattedQuestionnnaireUI(multiStepQuestionnaireUIFormatter(campagne.questionnaireUI));
    }
  }, [campagne]);

  const nextQuestionHandler = (formData) => {
    if (isLastQuestionInCategory) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
      setCurrentQuestionIndex(0);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
    setAnswers({ ...answers, ...formData });
  };

  const onSubmitHandler = async (formData) => {
    const result = await _post(`/api/temoignages/`, { reponses: { ...answers, ...formData }, campagneId: id });
    if (result._id) {
      history.push(`/temoignages/succes`);
    } else {
      toast({
        title: "Une erreur est survenue",
        description: "Merci de réessayer",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) return <Spinner size="xl" />;

  return (
    <Form
      schema={formattedQuestionnnaire[currentCategoryIndex].properties[currentQuestionIndex]}
      uiSchema={formattedQuestionnnaireUI[currentCategoryIndex]}
      validator={validator}
      widgets={widgets}
      onSubmit={(values) =>
        isLastCategory && isLastQuestionInCategory
          ? onSubmitHandler(values.formData)
          : nextQuestionHandler(values.formData)
      }
      onError={() => console.log("errors")}
    />
  );
};

export default AnswerCampagne;
