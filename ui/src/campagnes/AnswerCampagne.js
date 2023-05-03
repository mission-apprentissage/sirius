import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import validator from "@rjsf/validator-ajv8";
import Form from "@rjsf/chakra-ui";
import { Box, Flex, Button, Text, useBreakpoint } from "@chakra-ui/react";
import { useGet } from "../common/hooks/httpHooks";
import { Spinner, useToast } from "@chakra-ui/react";
import { _post, _put } from "../utils/httpClient";
import {
  CustomCheckboxes,
  CustomMultiRange,
  CustomRadios,
  CustomRange,
  CustomText,
  CustomTextareaPrecision,
  CustomUpDown,
  CustomMessageReceived,
} from "../Components/Form/widgets";
import { Stepper } from "../Components/Stepper";
import Hero from "../Components/Form/Hero";
import {
  multiStepQuestionnaireFormatter,
  multiStepQuestionnaireUIFormatter,
  getCategoriesWithEmojis,
  transformErrors,
} from "./utils";

const widgets = {
  CheckboxesWidget: CustomCheckboxes,
  RadioWidget: CustomRadios,
  TextWidget: CustomText,
  TextareaWidget: CustomTextareaPrecision,
  UpDownWidget: CustomUpDown,
  customRangeWidget: CustomRange,
  customMultiRangeWidget: CustomMultiRange,
  customMessageReceived: CustomMessageReceived,
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
  const [startedAnswering, setStartedAnswering] = useState(false);
  const breakpoint = useBreakpoint({ ssr: false });

  const isMobile = breakpoint === "base";

  const isLastCategory = formattedQuestionnnaire.length
    ? currentCategoryIndex === formattedQuestionnnaire.length - 1
    : false;

  const isLastQuestionInCategory = formattedQuestionnnaire.length
    ? currentQuestionIndex === formattedQuestionnnaire[currentCategoryIndex].properties.length - 1
    : false;

  useEffect(() => {
    if (campagne.questionnaire && Object.keys(campagne.questionnaire).length) {
      setFormattedQuestionnnaire(multiStepQuestionnaireFormatter(campagne.questionnaire));
      setCategories(getCategoriesWithEmojis(campagne.questionnaire));
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

  return startedAnswering ? (
    <Flex my="20px" width="80%" m="auto">
      <Box bg="white" p={6} rounded="md" w="100%" boxShadow="md">
        <Stepper
          categories={categories}
          currentCategoryIndex={currentCategoryIndex}
          setCurrentCategoryIndex={setCurrentCategoryIndex}
          setCurrentQuestionIndex={setCurrentQuestionIndex}
          isTemoignageSent={isTemoignageSent}
          currentQuestionIndex={currentQuestionIndex}
        />
        {isTemoignageSent ? (
          <Text fontSize="xl" my="30px" align="center" fontWeight="semibold">
            Merci de votre participation !
          </Text>
        ) : (
          <>
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
  ) : (
    <Hero setStartedAnswering={setStartedAnswering} isMobile={isMobile} categories={categories} />
  );
};

export default AnswerCampagne;
