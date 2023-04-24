import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import validator from "@rjsf/validator-ajv8";
import Form from "@rjsf/chakra-ui";
import { Box, Flex, Button, IconButton, Text } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useGet } from "../common/hooks/httpHooks";
import { Spinner, useToast } from "@chakra-ui/react";
import { _post, _put } from "../utils/httpClient";
import CustomCheckboxes from "../Components/Form/CustomCheckboxes";
import CustomRadios from "../Components/Form/CustomRadios";
import CustomText from "../Components/Form/CustomText";
import CustomTextarea from "../Components/Form/CustomTextarea";
import { Stepper } from "../Components/Stepper";
import { UserContext } from "../context/UserContext";

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
    const nestedProperties = Object.entries(questionnaire.properties[key].properties).map(
      (property) => {
        const [nestedKey, nestedValue] = property;
        return {
          type: "object",
          properties: {
            [nestedKey]: {
              ...nestedValue,
            },
          },
          dependencies: {
            [nestedKey]: questionnaire.properties[key].dependencies[nestedKey],
          },
          required:
            questionnaire.properties[key].required.indexOf(nestedKey) !== -1 ? [nestedKey] : [],
        };
      }
    );
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
    const [, value] = category;
    return value;
  });

  return categories;
};

const transformErrors = (errors) => {
  return errors.map((error) => {
    switch (error.name) {
      case "required":
        error.message = "Ce champ est obligatoire";
        break;
      case "pattern":
        error.message = "Ce champ n'est pas au bon format";
        break;
      case "enum":
        error.message = "Ce champ est invalide";
        break;
      case "minItems":
        error.message = "Vous devez sélectionner au moins une réponse";
        break;
      default:
        error.message = "Erreur de validation";
        break;
    }
    return error;
  });
};

const getCategories = (questionnaire) => {
  return Object.entries(questionnaire.properties).map((property) => {
    const [, content] = property;
    return content.title;
  });
};

const AnswerCampagne = () => {
  const { id } = useParams();
  const [campagne, loading] = useGet(`/api/campagnes/${id}`);
  const toast = useToast();
  const [userContext] = useContext(UserContext);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [formattedQuestionnnaire, setFormattedQuestionnnaire] = useState([]);
  const [formattedQuestionnnaireUI, setFormattedQuestionnnaireUI] = useState([]);
  const [answers, setAnswers] = useState({});
  const [categories, setCategories] = useState([]);
  const [isTemoignageSent, setIsTemoignageSent] = useState(false);
  const [temoignageId, setTemoignageId] = useState(null);

  const isLastCategory = formattedQuestionnnaire.length
    ? currentCategoryIndex === formattedQuestionnnaire.length - 1
    : false;

  const isLastQuestionInCategory = formattedQuestionnnaire.length
    ? currentQuestionIndex === formattedQuestionnnaire[currentCategoryIndex].properties.length - 1
    : false;

  useEffect(() => {
    if (campagne.questionnaire && Object.keys(campagne.questionnaire).length) {
      setFormattedQuestionnnaire(multiStepQuestionnaireFormatter(campagne.questionnaire));
      setCategories(getCategories(campagne.questionnaire));
    }
    if (campagne.questionnaireUI) {
      setFormattedQuestionnnaireUI(multiStepQuestionnaireUIFormatter(campagne.questionnaireUI));
    }
  }, [campagne]);

  const onSubmitHandler = async (formData, isLastQuestion) => {
    if (!temoignageId) {
      const result = await _post(`/api/temoignages/`, {
        reponses: { ...answers, ...formData },
        campagneId: id,
      });
      if (result._id) {
        setTemoignageId(result._id);
      } else {
        toast({
          title: "Une erreur est survenue",
          description: "Merci de réessayer",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } else {
      const result = await _put(`/api/temoignages/${temoignageId}`, {
        reponses: { ...answers, ...formData },
      });
      if (!result.acknowledged) {
        toast({
          title: "Une erreur est survenue",
          description: "Merci de réessayer",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }

    if (isLastQuestion) {
      setIsTemoignageSent(true);
      return;
    } else if (isLastQuestionInCategory) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
      setCurrentQuestionIndex(0);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
    setAnswers({ ...answers, ...formData });
  };

  if (loading || !formattedQuestionnnaire.length) return <Spinner size="xl" />;

  return (
    <Stepper
      categories={categories}
      currentCategoryIndex={currentCategoryIndex}
      setCurrentCategoryIndex={setCurrentCategoryIndex}
      isTemoignageSent={isTemoignageSent}
    >
      <Flex my="20px">
        <Box bg="white" p={6} rounded="md" w="100%" boxShadow="md">
          {isTemoignageSent ? (
            <Text fontSize="xl" my="30px" align="center" fontWeight="semibold">
              Merci de votre participation !
            </Text>
          ) : (
            <>
              {currentQuestionIndex !== 0 && (
                <Box w="100%" display="flex" alignContent="flex-start" mb="40px">
                  <IconButton
                    aria-label="Revenir à la question précédente"
                    variant="outline"
                    colorScheme="purple"
                    icon={<ArrowBackIcon />}
                    onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                  />
                </Box>
              )}
              <Form
                schema={
                  formattedQuestionnnaire[currentCategoryIndex].properties[currentQuestionIndex]
                }
                uiSchema={formattedQuestionnnaireUI[currentCategoryIndex]}
                validator={validator}
                widgets={widgets}
                onSubmit={(values) =>
                  onSubmitHandler(values.formData, isLastCategory && isLastQuestionInCategory)
                }
                onError={(error) => console.log({ error })}
                noHtml5Validate
                templates={{ ErrorListTemplate: () => null }}
                transformErrors={transformErrors}
                formData={answers}
              >
                <Button
                  borderRadius="md"
                  type="submit"
                  variant="solid"
                  colorScheme="purple"
                  width="full"
                  mt="25px"
                >
                  Suivant
                </Button>
              </Form>
            </>
          )}
        </Box>
      </Flex>
    </Stepper>
  );
};

export default AnswerCampagne;
