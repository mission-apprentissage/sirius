import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import validator from "@rjsf/validator-ajv8";
import Form from "@rjsf/chakra-ui";
import { Box, Flex, Button, IconButton, Text } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useGet } from "../common/hooks/httpHooks";
import { Spinner, useToast } from "@chakra-ui/react";
import { _post, _put } from "../utils/httpClient";
import {
  CustomCheckboxes,
  CustomMultiRange,
  CustomRadios,
  CustomRange,
  CustomText,
  CustomTextarea,
  CustomUpDown,
} from "../Components/Form/widgets";
import { Stepper } from "../Components/Stepper";
import {
  multiStepQuestionnaireFormatter,
  multiStepQuestionnaireUIFormatter,
  getCategories,
  transformErrors,
} from "./utils";

const widgets = {
  CheckboxesWidget: CustomCheckboxes,
  RadioWidget: CustomRadios,
  TextWidget: CustomText,
  TextareaWidget: CustomTextarea,
  UpDownWidget: CustomUpDown,
  customRangeWidget: CustomRange,
  customMultiRangeWidget: CustomMultiRange,
};

const AnswerCampagne = () => {
  const { id } = useParams();
  const [campagne, loading] = useGet(`/api/campagnes/${id}`);
  const toast = useToast();
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
